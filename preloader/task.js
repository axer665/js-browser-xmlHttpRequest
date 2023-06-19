const docItems = document.querySelector("#items");
const loader = document.getElementById("loader")
const xhr = new XMLHttpRequest();

const localStorage = window.localStorage;

// получаем данные из local storage
const content = localStorage.getItem("cyrrency"); 

// сохраняем данные из хранилища для дальнейшего использования
let currencyInStorage = content !== null ? JSON.parse(content) : {
    requestDate: null,
    Valute: {}
};

// добавление DOM-элемента валюты на страницу 
const addItemDOM = (item) => {
    const docItem = document.createElement("div");
    docItem.className = "item";
    const itemCode = document.createElement("div");
    itemCode.className = "item__code";
    itemCode.textContent = item.CharCode;
    const itemValue = document.createElement("div");
    itemValue.className = "item__value";
    itemValue.textContent = item.Value;
    const itemCurrency = document.createElement("div");
    itemCurrency.className = "item__currency";
    itemCurrency.textContent = item.Name;
    docItem.appendChild(itemCode)
    docItem.appendChild(itemValue)
    docItem.appendChild(itemCurrency);
    docItems.appendChild(docItem);
}

// деактивация лоадера
const removeLoader = () => {
    if (loader.classList.contains("loader_active")) {
        loader.classList.remove("loader_active");
    }
} 

// получение списка валют
const requestCurrencies = () => {
    xhr.addEventListener('load', () => {
        if (xhr.readyState === xhr.DONE) {
            let data = JSON.parse(xhr.response);
            let items = data.response.Valute;
            
            // в объекте хранилища устанавливаем дату  получения данных
            currencyInStorage.requestDate = new Date(); 
            
            // пройдемся по валютам, которые получили в ответе на запрос
            for (const [key, item] of Object.entries(items)) {
                // в обхект хранилища помещаем текущий элемент валюты 
                currencyInStorage.Valute[item.CharCode] = item;
                // добьавляем валюту в DOM
                addItemDOM(item);
            };

            // убираем loader
            removeLoader();
            // записываем объект хранилища в local storage
            localStorage.setItem("cyrrency", JSON.stringify(currencyInStorage));
        }       
    })

    xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/slow-get-courses');
    xhr.send();
}

// если в нашем объекте хранилища установлена дата 
// получения данных - высчитываем, сколько времени прошло с этой даты и,
// при необходимости - обновляем данные
if (currencyInStorage.requestDate !== null) {
    let requestDate = new Date(currencyInStorage.requestDate);
    let seconds = Math.floor((new Date() - requestDate)  / 1000);
    let hours = Math.floor(seconds / 3600) % 24;
    let minutes = Math.floor(seconds / 60) % 60;
    let days = Math.floor(seconds / 86400);

    // Если прошло меньше 5 минут - считаем, что данные актуальны 
    if (days <= 0 && hours <= 0 && minutes <= 5) {
        // берем данные из local storage (в нашем объекте хранилища они уже в json)
        let items = currencyInStorage.Valute;
        for (const [key, item] of Object.entries(items)) {
            addItemDOM(item)
        };
        removeLoader();
    } else { 
        // отправляем запрос на получение курсов валют
        requestCurrencies();
    }
} else {
    requestCurrencies();
}

xhr.onerror = function() { // происходит, только когда запрос совсем не получилось выполнить
    removeLoader();
    docItems.textContent = "Не удалось получить список курсов валют";
    alert(`Ошибка соединения`);
};