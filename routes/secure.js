const express = require('express');

const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');


const router = express.Router();



router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
    const {
        email,
        score
    } = req.body;

    await UserModel.updateOne({
        email
    }, {
        highScore: score
    });
    res.status(200).json({
        status: 'ok, добавили'
    });
}));



router.get('/scores', asyncMiddleware(async (req, res, next) => {

    const users = await UserModel.find({}, 'name highScore -_id').sort({
        highScore: -1
    }).limit(10);
    /*
        Первый аргумент - объект, который используется для ограничения записей, которые возвращаются из базы данных. Если оставить его как пустой объект, то будут возвращены все записи из базы данных.
        Второй аргумент - это строка, которая позволяет нам контролировать, какие поля мы хотим вернуть в возвращаемых нам результатах. Этот аргумент является необязательным, и если он не указан, будут возвращены все поля. По умолчанию поле _id всегда возвращается, поэтому, чтобы исключить его, нам нужно использовать аргумент -_id.
        -1 результаты будут отсортированы в порядке убывания.
        limit, чтобы ограничить вывод не более 10 записями.
    */
     res.status(200).json(users);

}));


module.exports = router;