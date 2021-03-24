const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const tokenList = {};

const router = express.Router();
// груптруем здесь все роутеры

router.get('/status', (req, res, next) => {
  res.status(200);
  res.json({
    'status': 'ok'
  });
});

router.post('/signup',
  passport.authenticate('signup', {
    session: false
  }),
  async (req, res, next) => {
    res.status(200).json({
      message: 'signup successful'
    });
  });

router.post('/login',
  async (req, res, next) => {
    passport.authenticate('login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An Error occured');
            return next(error);
          }
          req.login(user, {
            session: false
          }, async (error) => {
            if (error) return next(error);
            const body = {
              _id: user._id,
              email: user.email
            };

            const token = jwt.sign({
              user: body
            }, 'top_secret', {
              expiresIn: 300
            });
            const refreshToken = jwt.sign({
              user: body
            }, 'top_secret_refresh', {
              expiresIn: 86400
            });

            // сохраняем токены в cookie
            res.cookie('jwt', token);
            res.cookie('refreshJwt', refreshToken);
            // Примечание: в этом руководстве мы храним эти токены в памяти, но на практике вы лучше хранить эти данные в постоянном хранилище определенного типа.

            // сохраняем токены в памяти
            tokenList[refreshToken] = {
              token,
              refreshToken,
              email: user.email,
              _id: user._id
            };

            //отправляем токены обратно пользователю
            return res.status(200).json({
              token,
              refreshToken
            });
          });
        } catch (error) {
          return next(error);
        }
      })(req, res, next);
      /*В функции обратного вызова мы сначала проверяем, была ли какая-то ошибка или объект user не был возвращен из промежуточного программного обеспечения passport. Если эта проверка верна, мы создаем новую ошибку и передаем ее следующему промежуточному программному обеспечению.
      Если эта проверка ложна, мы вызываем метод login, который предоставляется в объекте req. Этот метод добавляется паспортом автоматически. Когда мы вызываем этот метод, мы передаем объект user, объект options и функцию обратного вызова в качестве аргументов.
      В функции обратного вызова мы создаем два веб-токена JSON с помощью библиотеки jsonwebtoken. Для JWT мы включаем идентификатор и адрес электронной почты пользователя в данные JWT, и мы устанавливаем срок действия основного токена в пять минут, а срок действия refreshToken - через один день.
      Затем мы сохранили оба этих токена в объекте ответа, вызвав метод cookie, и сохранили эти токены в памяти, чтобы мы могли ссылаться на них позже при обновлении токена.  */
  });

router.post('/logout', (req, res) => {
  if (req.cookies) {
    const refreshToken = req.cookies['refreshJwt'];

    if (refreshToken in tokenList) delete tokenList[refreshToken]
    res.clearCookie('refreshJwt');
    res.clearCookie('jwt');
  }
  res.status(200).json({
    message: 'logged out'
  });
});

router.post('/token', (req, res) => {
  const {
    email,
    refreshToken
  } = req.body;

  if ((refreshToken in tokenList) && (tokenList[refreshToken].email === email)) {
    const body = {
      email,
      _id: tokenList[refreshToken]._id
    };
    const token = jwt.sign({
      user: body
    }, 'top_secret', {
      expiresIn: 300
    });

    // обновляем jwt
    res.cookie('jwt', token);
    tokenList[refreshToken].token = token;

    res.status(200).json({
      token
    });
  } 
  else {
    res.status(401).json({
      message: 'Unauthorized'
    });
  }
});


module.exports = router;