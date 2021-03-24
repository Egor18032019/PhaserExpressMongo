const passport = require('passport');
// Для аутентификации мы будем использовать библиотеку passport.js 
const localStrategy = require('passport-local').Strategy;
// Стратегия passport-local позволяет нам аутентифицироваться с помощью имени пользователя и пароля на нашем сервере
const JWTstrategy = require('passport-jwt').Strategy;
//Стратегия passport-jwt позволяет нам аутентифицироваться с помощью веб-токена JSON.


const UserModel = require('../models/userModel');



// обработка регистрации пользователя
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //мы устанавливаем поле passReqToCallback в true, таким образом объект запроса req будет передан функции обратного вызова.
}, async (req, email, password, done) => {
    console.log(req.body)
    try {
        const {
            name
        } = req.body;

        const user = await UserModel.create({
            email,
            password,
            name
        });

        return done(null, user);

    } catch (error) {

        done(error);

    }

}));

// обработка входа пользователя

passport.use('login', new localStrategy({

    usernameField: 'email',

    passwordField: 'password'

}, async (email, password, done) => {
    try {
    // мы использовали метод findOne модели UserModel для запроса в базе данных
        const user = await UserModel.findOne({
            email
        });

        if (!user) {
            return done(null, false, {
                message: 'User not found'
            });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {

            return done(null, false, {
                message: 'Wrong Password'
            });

        }

        return done(null, user, {
            message: 'Logged in Successfully'
        });

    } catch (error) {

        return done(error);

    }

}));



// проверка валидности токена

passport.use(new JWTstrategy(
    {
        secretOrKey: 'top_secret',
        // secretOrKey` используется для подписи создаваемого JWT. В этом руководстве мы использовали секретный заполнитель, но лучше извлечь его из переменных среды или использовать какой-либо другой безопасный метод.
        jwtFromRequest: function (req) {
            //jwtFromRequest - это функция, которая используется для получения jwt от объекта запроса. В этом руководстве мы будем помещать jwt в файл cookie, поэтому в функции мы извлекаем jwt токен из файла cookie объекта запроса, если он существует, в противном случае мы возвращаемся null.
            let token = null;
            if (req && req.cookies) token = req.cookies['jwt'];
            return token;
        }
    },
    async (token, done) => {
        try {

            return done(null, token.user);

        } catch (error) {

            done(error);

        }

    }));