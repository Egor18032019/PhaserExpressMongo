const mongoose = require('mongoose')
//Mongoose - это средство моделирование объектов базы данных MongoDB, предназначенное для асинхронной работы
const bcrypt = require('bcrypt'); //bcrypt - вспомогательная библиотека для хеширования паролей.

const Schema = mongoose.Schema;
/*
создали новый обьект => 
, который позволяет нам определять поля, 
которые должна иметь наша модель,
и в каждом из этих полей мы можем указать их тип.
mongoose.Schema предоставляет нам встроенное приведение типов и проверку
*/
 
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    highScore: {
        type: Number,
        default: 0
    }
});

/*
 функция(hook) будет вызываться перед сохранением документа в MongoDB.
 Когда срабатывает эта ловушка(hook), мы получаем ссылку на текущий документ, который будет сохранен, 
*/
UserSchema.pre('save', async function (next) {
    const user = this;
    // а затем мы используем bcrypt-хеширование пароля этого пользователя. 
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
    // В конце мы вызываем функцию обратного вызова, которая передается в качестве аргумента нашему хуку.
});

UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    // проверка от bcrypt на  правильности ввода пароля пользователя при попытке входа в систему
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);
// Наконец, мы создали нашу модель путем вызова функции mongoose.model 
//и передали этому методу два аргумента: имя нашей модели и схему, которая будет использоваться для модели

module.exports = UserModel;