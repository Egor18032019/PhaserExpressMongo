// компонент "отпправка счета на сервер"

import {
    get_cookie
} from "../utils/utils.js"

const onSetupFormSubmit = function (score) {
    console.log(score)
    let email = get_cookie("email")
    console.log(email)
    let data = {
        email: email,
        score: score
    }
    request('/submit-score', 'POST', data)
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

export default onSetupFormSubmit;