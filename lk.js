// создание таблицы с заявками
function lkTable() {
    fetch("http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=3998032f-4281-4dc1-a312-42ff9d880281")
        .then(function(response) {
            return response.json();
        })
        .then(function(applications) {
            let tablelk = document.querySelector("#tablelk");
            let out = "";
            for(let application of applications){
                let marshrutId = application.route_id;

                fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
                .then(function(response){
                    return response.json();
                })
                .then(function(marshruts){
                    
                    for (let marshrut of marshruts){
                        if (marshrut.id == marshrutId){
                            let needId = application.id;
                            out += `<tr>
                                        <td>${needId}</td>
                                        <td>${marshrut.name}</td>
                                        <td>${application.date}</td>
                                        <td>${application.price}</td>
                                        <td>
                                            <a id ="${needId}" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="viewApplicationModal(this.id)"><img src="images/viewApplication.jpg"></a> 
                                            <a onclick="changeApplicationModal()"><img src="images/changeApplication.jpg"></a>   
                                            <a data-id="${needId}" id="deleteButton" data-bs-toggle="modal" data-bs-target="#exampleModal2" ><img src="images/deleteAplication.png"></a>
                                        </td>
                                    </tr>`;
                        }
                    }
                    tablelk.innerHTML = out;
                })
    }})}
// Просмотр заявки
function viewApplicationModal(clicked_id){
    let applicationId = clicked_id;
    fetch("http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=3998032f-4281-4dc1-a312-42ff9d880281")
        .then(function(response) {
            return response.json();
        })
        .then(function(applications) {
            for(let application of applications){
                let headerView = document.getElementById('numberApplication');
                headerView.innerHTML = 'Заявка номер ' + applicationId;
                let nameMarshrutPlace = document.getElementById('marshrutNameView');
                let nameGuidPlace = document.getElementById('guidNameView');
                let dataPlace = document.getElementById('dataJS');
                let timePlace = document.getElementById('timeJS');
                let durationPlace = document.getElementById('durationJS');
                let countPeoplePlace = document.getElementById('quantityJS');
                let option1Status = document.getElementById('option1Status');
                let option2Status = document.getElementById('option2Status');
                let pricePlace = document.getElementById('totalCostView');
                let differencePlace = document.getElementById('differenceJS');
                let marshrutId = application.route_id;
                let difference = 0;
                if (applicationId == application.id){
                    dataPlace.innerHTML = application.date;
                    timePlace.innerHTML = application.time;
                    durationPlace.innerHTML = application.duration;
                    countPeoplePlace.innerHTML = application.persons;
                    if (application.optionFirst){
                        option1Status.innerHTML = 'Выбрано';
                        difference += Number(application.price) - Number(application.price)/1.3;
                    } else{
                        option1Status.innerHTML = 'Не выбрано';
                    }
                    if (application.optionSecond){
                        option2Status.innerHTML = 'Выбрано';
                        difference += Number(application.price) - Number(application.price)/1.3;
                    } else{
                        option2Status.innerHTML = 'Не выбрано';
                    }
                    pricePlace.innerHTML = application.price;
                    differencePlace.innerHTML = Math.floor(difference);
                    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(marshruts){
                        for (let marshrut of marshruts){
                            if (marshrut.id == marshrutId){
                                nameMarshrutPlace.innerHTML = marshrut.name;
                    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${marshrutId}/guides?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(guids){
                        for (let guid of guids){
                            if (application.guide_id == guid.id){
                                nameGuidPlace.innerHTML = guid.name;
                            }
                            }
                        })
                        
                    }}})}
}})}
// удаление заявки 
function deleteApplicationModal(){
    deleteButton = document.getElementById('deleteButton');
    idApplication = deleteButton.getAttribute('data-id');
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${idApplication}?api_key=3998032f-4281-4dc1-a312-42ff9d880281`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => alert('Такой записи не найдено. Возможно, Вы её уже удалили, обновите страницу'));
}
// запуск функции создания таблицы при загрузке страницы
window.onload = function () {
    lkTable();
    let agreeBtn = document.getElementById('agree');
    agreeBtn.addEventListener('click', function() {
        setTimeout(lkTable, 500);
    })
}