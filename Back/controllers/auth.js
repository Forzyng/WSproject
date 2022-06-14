let crypto = require('crypto')
const Config = require('../config')
const tokenKey = Config.key.privateKey
//
const bcrypt = require("bcrypt");
const saltRounds = 16;
//
const users = require('../models/user')
const Token = require("../models/token");
const sendEmail = require("../helpers/emailSend/email");


exports.middlewareAuth = async function (req, response, next) {
    // console.log(req.headers.authorization)
    if (req.headers.authorization) {
        // console.log('Get Token')
        // console.log(req.headers.authorization)
        let tokenParts = req.headers.authorization
            .split('.')
        //.split('.')
        let signature = crypto
            .createHmac('SHA256', tokenKey)
            .update(`${tokenParts[0]}.${tokenParts[1]}`)
            .digest('base64')

        // console.log('in Auth')
        // console.log(JSON.parse(
        //     Buffer.from(tokenParts[1], 'base64').toString(
        //         'utf8'
        //     )))
        // console.log(tokenParts[0])
        // console.log(tokenParts[1])
        // console.log('Signature:')
        // console.log(signature)
        // console.log(tokenParts[2])

        if (signature === tokenParts[2]) {
            let id = JSON.parse(
                Buffer.from(tokenParts[1], 'base64').toString(
                    'utf8'
                )
            )
            console.log('Searching')
            const user = await users.findOne({_id: id});
            req.user = user
        }


        return next()
    }
    // req.user = {name: 'Guest'}
    // console.log('Next')
    return next()
}
//todo НЕ ТЯГАТЬ ЮЗЕРАЙДИ + checking
exports.updateUserPrivacyById = async function (request, response) {
    console.log(request.user)
    const user = request.user
    if(!request.user) {
        return response.status(401)
            .json({ message: 'Not authorized' })
    }

    const id = user._id
    const password = user.password
    const email = user.email

    if(email.length < 5 )
        return response.status(403).json({ message: 'email must be more than 5 symbols' })
    if(password.length < 5 )
        return response.status(403).json({ message: 'password must be more than 5 symbols' })


try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    users.findOneAndUpdate(
        { _id: id },
        {$set:{updated_at: Date.now(), email: email, password: hashedPassword}},
        {new: true},
        function (err, useru) {
            if (err){
                console.log(err)
                return response.status(500).json({code: 500, message: 'There was an error updating the post', error: err})
            }
            else{
                console.log("Updated User : ", useru);
                response.status(200).json({code: 200, message: 'User updated', updatedUser: useru})
            }
        });
}
catch(err) {
    console.error(err.message)
    return response.status(500).json({ message: 'Bcrypt Error' })
}
}


exports.deleteUserById = async function (request, response) {
    console.log(request.user)
    const user = request.user
    if(!request.user) {
        return response.status(401)
            .json({ message: 'Not authorized' })
    }

    const id = user.id

    users.findOneAndDelete({ id: id }, function (err, user) {
        if (err){
            console.log(err)
            return response.status(500).json({code: 500, message: 'There was an error deleting the user', error: err})
        }
        else{
            console.log("Deleted user : ", user);
            response.status(200).json({code: 200, message: 'Post deleted', deletedPost: user})
        }
    });


}

exports.authByLogin = async function (req, res){
    console.log('authByLogin')


    const email = req.body.email
    const password = req.body.password

    console.log('checkData')
    if(email.length < 5 )
        return res.status(403).json({ message: 'email must be more than 5 symbols' })
    if(password.length < 5 )
        return res.status(403).json({ message: 'password must be more than 5 symbols' })

    console.log('findOne')
    const user = await users.findOne( {$or: [{email: email}, {login: email}]});

   // const userExists = await users.exists({ $or: [{email: email}, {login: email}] });
    //if (userExists) console.log("User exists");

    if(!user)
    {
        return res.status(403).json({message: 'Invalid username or password'})
    }
    console.log(user)
    console.log('IsVerify?')
    if(!user.isVerify)
    {
        return res.status(401).json({message: 'Email is not confirmed'})
    }
    console.log('Bcrypt comparing')

    try {
        if(! await bcrypt.compare(password, user.password))
        {
            return res.status(403).json({message: 'Invalid password or username'});
        }
    }
    catch (err)
    {
        return res.status(403).json({message: 'Unexpected error'});
    }




console.log('compared')

    user.password = null // Обнулим пароль

    let head = Buffer.from(
        JSON.stringify({alg: 'HS256', typ: 'jwt'})
    ).toString('base64')
    // todo: Может не всего пользователя
    let body = Buffer.from(JSON.stringify(user._id)).toString(
        'base64'
    )
    let signature = crypto
        .createHmac('SHA256', tokenKey)
        .update(`${head}.${body}`)
        .digest('base64')

    user._id = null
    // console.log('head body:')
    // console.log(`${head}.${body}`)
    // console.log('Get User:')
    // console.log(user)
    // console.log('Send Token:')
    // console.log(`${head}.${body}.${signature}`)
    return res.status(200).json({
        user: user,
        token: `${head}.${body}.${signature}`,
    })

    //return res.status(400).json({message: 'Bad request'})
    //return res.status(403).json({ message: 'Invalid password or username' })
}

exports.tryCreateUser = async function (req, res ){
    console.log('tryCreateUser')
    const email = req.body.email
    const login = req.body.login
    const password = req.body.password
    //const email = 'fozzynice@gmail.com'
     //const login = 'Login'
    // const password = '123'
    if(email.length < 5 )
        return res.status(403).json({ message: 'email must be more than 5 symbols' })
    if(password.length < 5 )
        return res.status(403).json({ message: 'password must be more than 5 symbols' })
    if(login.length < 3 )
        return res.status(403).json({ message: 'login must be more than 5 symbols' })


    const userEmail = await users.findOne( {email: email})

    if(userEmail){
        return res.status(403).json({message: 'User with this email Exist'})
    }

    console.log('Email is able')
   const userLogin = await users.findOne( {login: login})

    if(userLogin){
        return res.status(403).json({message: 'User with this login Exist'})
    }

    console.log('Login is able')
    const newUser = new users()
    newUser.login = login
    newUser.email = email
    try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(hashedPassword)
    newUser.password = hashedPassword

            console.log(newUser)


            let curuser = await new users({
                login: newUser.login,
                email: newUser.email,
                password: newUser.password
            }).save();

            //newUser.save( async function (err) {
            //    if (err) {
            //         console.error(err)
            //        return err
            //     }



                console.log('TOKEN')
                let token = await new Token({
                    userId: curuser._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                console.log(token)
                const message = `${Config.sender.base_url}/user/verify/${curuser.id}/${token.token}`;
                await sendEmail(curuser.email, "Verify Email", message, 'emailConfirmation');
                res.status(201).json(newUser)
                //res.send("An Email sent to your account please verify");
            } catch (error) {
                res.status(400).send("An error occurred while sending email");
            }
            // Store hash in your password DB.



   // return res.status(400).json({message: 'Bad request'})
}



