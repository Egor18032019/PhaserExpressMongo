// компонент "авторизация пользователя"
'use strict';
const mainBlock = document.querySelector('main');
const loginForm = mainBlock.querySelector('.login__form');
const loginFormSubmit = loginForm.querySelector(".login__submit")
const emailFormSubmit = loginForm.querySelector(".email__input")
const passwordFormSubmit = loginForm.querySelector(".password__input")


const onSetupFormSubmit = function (evt) {
    evt.preventDefault();

    var data = {
        email: emailFormSubmit.value,
        password: passwordFormSubmit.value
    }
    console.log(data)
    loginFormSubmit.textContent = 'Попытка отправки...';
    loginFormSubmit.disabled = true;
    request('http://localhost:3000/login', 'POST', data)
    self.location = "scores.html"

};


const request = (url, method = 'GET', data = null) => {
    const XHR = new XMLHttpRequest();
    XHR.open(method, url);
    XHR.responseType = 'json';
    XHR.timeout = 101;
    XHR.setRequestHeader('Content-Type', 'application/json');
    XHR.send(JSON.stringify(data))
    // Define what happens on successful data submission
    XHR.addEventListener('load', function (event) {
        alert('Yeah! Data sent and response loaded.');
    });

    // Define what happens in case of error
    XHR.addEventListener('error', function (event) {
        alert('Oops! Something went wrong.');
    });
}

loginForm.addEventListener('submit', onSetupFormSubmit);