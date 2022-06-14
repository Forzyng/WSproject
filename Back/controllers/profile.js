const fs = require('fs');
const path = require('path');
const users = require('../models/user');

exports.updateUser = async function (request, response) {
    console.log('Update Avatar')
    console.log(request.user)
    if(!request.user) {
        console.log('No User')
        return response.status(403)
            .json({ message: 'Not authorized' })
    }

    const id = request.user._id
    const avatar = request.body.avatar
    const description = request.body.description
    const fullname = request.body.fullname

    if (/\d/.test(fullname.value)) {
        return response.status(403).json({ message: 'Bad full name' })
    }

    if(avatar.length < 1 )
        return response.status(403).json({ message: 'email must be more than 5 symbols' })


    let upFile = avatar
    console.log(upFile)

    let fromFile = path.join(__dirname, '../public/uploads/', upFile)
    let toFile = path.join(__dirname, '../public/store/avatars/', upFile)

    fs.rename(fromFile,toFile, async function (err) {
        if (err) {
            console.log(err)
            return response.status(422)
                .json(err)
        }


        try {
            await users.findOneAndUpdate(
                { _id: id },
                {$set:{updated_at: Date.now(), avatar: upFile, description: description, fullname: fullname}});
            return response.status(201).json({avatarUrl: upFile})
        } catch (e) {
            return response.status(422).json(e)
        }
    })
}
