const pollTitle = document.getElementById("poll__title");
const pollAnswer = document.getElementById("poll__answers");

// запрос на получение опросника
const xhr = new XMLHttpRequest();

// запрос на получение статистики по опроснику
const xhrPost = new XMLHttpRequest();

xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === xhr.DONE) {
        let response = JSON.parse(xhr.response);
        let data = response.data;
        pollTitle.textContent = data.title;

        data.answers.forEach((answer, key) => {
            const button = document.createElement("button");
            button.className = "poll__answer";
            button.textContent = answer;
            button.addEventListener("click", () => {
                alert("Спасибо, ваш голос засчитан!");
                
                // отправляем запрос на получение результатов опросника (и отправляем свой ответ)
                xhrPost.open( 'POST', 'https://students.netoservices.ru/nestjs-backend/poll' );
                xhrPost.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
                xhrPost.send( 'vote='+response.id+'&answer='+key );
            });
            pollAnswer.appendChild(button);
        });
    }       
});

xhrPost.addEventListener('readystatechange', () => {
    if (xhrPost.readyState === xhrPost.DONE) {
        const data = JSON.parse(xhrPost.response);

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
        })
    }
});

// оправляем запрос на получение опросника
xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/poll');
xhr.send();

