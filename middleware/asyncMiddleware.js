const asyncMiddleware = fn =>

    (req, res, next) => {

        Promise.resolve(fn(req, res, next))

            .catch(next);

    };
/*
принимает другую функцию в качестве аргумента и заключает ее в промис.
В данном случае у нас эта передаваемая функция в промис является обработчиком маршрута.
Если есть ошибка, она будет здесь перехвачена и передана следующему промежуточному программному обеспечению.
 */


module.exports = asyncMiddleware;
/*
для виндовс надо так отправлять запросы
curl -X POST http://localhost:3000/signup -H "Content-Type:application/json" -d "{\"email\" : \"test3@test.com\", \"password\" : \"123\",  \"name\": \"test3\" }"
curl -X POST http://localhost:3000/login  -H "Content-Type:application/json" -d "{\"email\" : \"test5@test.com\", \"password\" : \"1234\"}"
curl -X POST http://localhost:3000/submit-score  -H "Content-Type:application/json" -d "{\"email\" : \"test4@test.com\", \"score\" : \"100\"}"
*/
