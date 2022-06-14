const users = require("../models/user");
const Token = require("../models/token");

exports.confirmEmail = async function (req, res) {
    try {
        const user = await users.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            userId: req.params.id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        //await users.updateOne({ _id: user._id, isVerify: true });
        console.log('Verifying user')
        await users.findOneAndUpdate(
            { _id: user._id },
            {$set:{updated_at: Date.now(), isVerify: true}},
            {new: true});

        console.log('Removing Token');
        console.log(token._id)
        await Token.findByIdAndRemove(token._id);
        return res.redirect('http://localhost:8080/login');
        //res.send("email verified successfully");
    } catch (error) {
        console.log(error)
        return res.redirect('http://localhost:8080/error');
        //res.status(400).send("An error occurred while sending email");
    }

    //return res.redirect('http://localhost:3001/login');
}