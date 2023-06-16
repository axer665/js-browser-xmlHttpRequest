const form = document.getElementById("form");
const progress = document.getElementById( 'progress' );

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
        let complete = event.loaded / event.total;
        progress.value = complete;
    });

    xhr.upload.onload = () => {
        alert('Данные полностью загружены на сервер!');
    }

    xhr.upload.onerror = () => {
        alert('Произошла ошибка при загрузке данных на сервер!');
    }

    xhr.open("POST", "https://students.netoservices.ru/nestjs-backend/upload");
    const formData = new FormData(document.getElementById("form"));
    xhr.send(formData);
});