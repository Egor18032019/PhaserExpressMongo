const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();
// груптруем здесь все роутеры

router.get('/status', (req, res, next) => {
  res.status(200);
  res.json({
    'status': 'ok'
  });
});

router.post('/signup', asyncMiddleware(
  async (req, res, next) => {
    const {
      name,
      email,
      password
    } = req.body;

    await UserModel.create({
      email,
      password,
      name
    });

    res.status(200).json({
      'status': 'ok'
    });
  }));

router.post('/login', asyncMiddleware(
  async (req, res, next) => {
    const {
      email,
      password
    } = req.body;
    // мы использовали метод findOne модели UserModel для запроса в базе данных
    const user = await UserModel.findOne({
      email
    });

    if (!user) {
      res.status(401).json({
        'message': 'unauthenticated *Ненашли такого'
      });
      return;
    }

    const validate = await user.isValidPassword(password); //совпадает ли пароль указанный в теле запроса с тем, что хранится в базе данных.
   
    if (!validate) {
      res.status(401).json({
        'message': 'unauthenticated *неверный пароль'
      });
      return;
    }

    res.status(200).json({
      'status': 'ok'
    });
  }));

router.post('/logout', (req, res, next) => {
  res.status(200);
  res.json({
    'status': 'ok'
  });

});

router.post('/token', (req, res, next) => {
  res.status(200);
  res.json({
    'status': 'ok'
  });
});


module.exports = router;