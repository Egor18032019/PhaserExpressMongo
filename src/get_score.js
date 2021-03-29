// компонент "получение данных с сервера"
import {
    request
} from "../utils/utils.js"

const url = "/scores"

const liFill = (arr = []) => {
    console.log(arr)
    if (arr.length === 0) {
        return "Авторизуйтесь пожалуйста"
    } else {
        const foo = arr.map(
            (place) => {
                return (
                    `<li>${JSON.stringify(place).replace(/[{}"]/g,"")}</li>`);
            })
        console.log(foo.join(''))
        return foo.join('')
    }

}

request(url).then((data) => {

    document.getElementById("score__table").innerHTML = liFill(data);
});