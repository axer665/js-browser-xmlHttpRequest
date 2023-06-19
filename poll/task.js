const pollTitle = document.getElementById("poll__title");
const pollAnswer = document.getElementById("poll__answers");

const xhr = new XMLHttpRequest();

request("GET", "https://students.netoservices.ru/nestjs-backend/poll", requestList);

function request(method, url, callback, headers={}, params={}) {
    xhr.onload = () => {
        callback();
    };

    xhr.open(method, url);
    let requestParams = "";
    if (Object.keys(headers).length > 0) {
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader( key, value );
        }
    }

    if (Object.keys(params).length > 0) {
        let count = 0;
        for (const [key, value] of Object.entries(params)) {
            requestParams += `${key}=${value}`;
            count++;
            if (count != Object.keys(params).length) {
                requestParams += "&";
            }
        }
    }
    
    xhr.send(requestParams);
}

// Получение опроса (вариатов ответа)
function requestList() {
    if (xhr.readyState === xhr.DONE) {
        // жуткая махинация по получению первого символа строки.
        // код ответа - число. Приводим его к строке, чтобы получить 1 символ. И снова приводим к числу.
        switch(Number(String(xhr.status).substring(0, 1))){ 
            case 2:
                let response = JSON.parse(xhr.response);
                let data = response.data;

                pollTitle.textContent = data.title;

                data.answers.forEach((answer, key) => {
                    const button = document.createElement("button");
                    button.className = "poll__answer";
                    button.textContent = answer;
                    button.addEventListener("click", () => {
                        alert("Спасибо, ваш голос засчитан!");
                        const headers = {
                            'Content-type' : 'application/x-www-form-urlencoded'
                        }
                        const params = {
                            vote : response.id,
                            answer: key
                        }
                        request("POST", "https://students.netoservices.ru/nestjs-backend/poll", requestResult, headers, params);
                    });
                    pollAnswer.appendChild(button);
                });
            break;
            case 4 :
                alert('Ресурс не найден');
                break;
            case 5 :
                alert('Сервер вернул ошибку');
                break;
        }
    }       
}

// получение результатов опроса
function requestResult() {
    if (xhr.readyState === xhr.DONE) {
        switch(Number(String(xhr.status).substring(0, 1))){ 
            case 2:
                const data = JSON.parse(xhr.response);

                let sum = 0;
                // чтобы высчитать процент посчитаем сумму всех оценок
                data.stat.forEach(item => {
                    sum += item.votes
                })
                
                pollAnswer.textContent = "";

                data.stat.forEach(item => {
                    const answer = document.createElement("div");
                    answer.className = "block__answer";
                    const answerName = document.createElement("span");
                    answerName.textContent = item.answer + ": ";
                    const votes = document.createElement("span");
                    votes.textContent = item.votes + " / ";
                    const percent = document.createElement("span");
                    percent.textContent = (item.votes * 100 / sum).toFixed(2) + "%";
                    answer.appendChild(answerName);
                    answer.appendChild(votes);
                    answer.appendChild(percent);
                    pollAnswer.appendChild(answer);
                });
            break;
            case 4 :
                alert('Ресурс не найден');
                break;
            case 5 :
                alert('Сервер вернул ошибку');
                break;
        }
    }
}

xhr.onerror = function() { 
    pollAnswer.textContent = "Не удалось получить данные опроса";
    alert(`Ошибка соединения`);
};