// Читаем параметры в нашем файле .env 
// и делаем эти значения доступными как переменные среды
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Mongoose - это средство моделирование объектов базы данных MongoDB, предназначенное для асинхронной работы
const cookieParser = require('cookie-parser');
const passport = require('passport');
/**
 * './routes/main.js'
 */
const routes = require('./routes/main');
/**
 * './routes/secure.js'
 */
const secureRoutes = require('./routes/secure');

// установка mongo-соединения

const uri = process.env.MONGO_CONNECTION_URL; // переменнас среда из .env
// вызываем новое соединение и передаем два аргумента(подключение и параметры подключения)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
/* 
    useNewUrlParser - флаг, который указывает использовать новый URL, т.к. старый парсер уже сильно устарел. По умолчанию этот флаг установлен в false.
    useCreateIndex- флаг использования сборки индекса createIndex(), а не устаревший драйвер MongoDB ensureIndex(). По умолчанию этот флаг установлен в false.
    useUnifiedTopology - флаг использования нового механизма топологии. По умолчанию этот флаг установлен в false.
*/
// обработка ошибок
mongoose.connection.on('error', (error) => {
  // показывем
  console.log(error);
  // выходим
  process.exit(1);
});

mongoose.connection.on('connected', function () {

  console.log('connected to mongo');
});

// Создаем экземпляр приложения express
const app = express();

// Обновляем настройки express
app.use(bodyParser.urlencoded({
  extended: false
})); // разбираем application/x-www-form-urlencoded
app.use(bodyParser.json()); // разбираем application/json

app.use(cookieParser());
// подключаем passport-аутентификации  
const auth = require('./auth/auth')
app.use(express.static(__dirname + '')); //?? убрать?
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


//сначало он смотрит в первом есть ли это потом во втором и дальше
// Главный маршрут
app.use('/', routes);
// // другие маршруты
// app.use('/', secureRoutes);
app.use('/', passport.authenticate('jwt', {
  session: false
}), secureRoutes);   

// Отлавливаем все остальные маршруты
app.use("/",
  (req, res, next) => {
    console.log(req.body, "app.js stroke 71")
    res.status(404);
    res.json({
      message: '404 - Not Found(совсем нет)'
    });
  }
);

// Обработка ошибок
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err
  });
});

// Начинаем прослушивать сервер на выбранном порту
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});