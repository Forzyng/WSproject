const nodemailer = require("nodemailer");
const Config = require('../../config')
var handlebars = require('handlebars');
var fs = require('fs');


const sendEmail = async (email, subject, URL, template) => {
    try {
        const transporter = nodemailer.createTransport({
            host: Config.sender.connect,
            port: Config.sender.port,
            secure: Config.sender.secure,
            auth: {
                user: Config.sender.email,
                pass: Config.sender.ukrNet_pswd,
            },
        });

        fs.readFile(__dirname + '/templates/' + template + '.html', {encoding: 'utf-8'}, async function (err, html) {
            if (err) {
                console.log(err);
            } else {

                let Confirm_Url = "URL_CONFIRMATION";
                let Help_Url = "HELP_URL";
                let Home_Url = "HOME_URL";
                let Privacy_Url = "PRIVACY_URL";

                let result = html.replace(Confirm_Url, URL);
                result = result.replace(Help_Url, Config.sender.BASE_URL_TO + '/about');
                result = result.replace(Home_Url, Config.sender.BASE_URL_TO + '/');
                result = result.replace(Privacy_Url, Config.sender.BASE_URL_TO + '/about');
                //let email = Config.sender.email
                await transporter.sendMail({
                    from: 'Triangle team <forzyng@ukr.net>',
                    to: email,
                    subject: subject,
                    text: URL,
                    html: result,
                });
            }
        })


        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;