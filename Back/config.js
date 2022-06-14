module.exports = {
    key: {
        privateKey: '37LvDSm4XvjYOh9Y',
        tokenExpiry: 1 * 30 * 1000 * 60, //1 hour
        algorithm: 'aes-256-cbc'
    },
    sender: {
        email: 'forzyng@ukr.net',
        ukrNet_pswd:  'yABzgDhdT6BDwPCV',
        connect: 'smtp.ukr.net',
        port: 465,
        secure: true,
        base_url: 'http://localhost:3000',
        BASE_URL_TO: 'http://localhost:8080'
    },
    mongoose: {
        connectionString: 'mongodb+srv://forzyng:879qweRTY@cluster0.8qvpb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    }
};