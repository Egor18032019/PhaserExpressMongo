// компонент "получение данных с сервера"
const onSetupScore = (url = "/scores", method = 'GET') => {
    const XHR = new XMLHttpRequest();
    XHR.open(method, url, false);
    XHR.send()
    console.log(XHR.response)
    if (XHR.status != 200) {
        // обработать ошибку
        alert(XHR.status + ': ' + XHR.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        alert(XHR.responseText); // responseText -- текст ответа.
    }
    return XHR.response
}


let paramValue = onSetupScore()
document.getElementById("score__table").innerHTML = paramValue;