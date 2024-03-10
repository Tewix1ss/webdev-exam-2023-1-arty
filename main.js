
function createTable() {
    fetch("http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=3998032f-4281-4dc1-a312-42ff9d880281")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let marshruts = data;
            let table1 = document.querySelector("#table1");
            let out = "";
            let rowsPerPage = 10;
            let currentPage = 1;

            function renderTable() {
                let start = (currentPage - 1) * rowsPerPage;
                let end = start + rowsPerPage;
                let paginatedData = marshruts.slice(start, end);
                out = "";
                for (let marshrut of paginatedData) {
                    out += `
                        <tr>
                            <td>${marshrut.name}</td>
                            <td>${marshrut.description}</td>
                            <td>${marshrut.mainObject}</td>
                            <td><a id='${marshrut.id}' class="btn btn-primary" onClick="showGuids(this.id); addMarshrutName(this.id); listLanguages(this.id);">Выбрать</a></td>
                        </tr>`;
                }
                table1.innerHTML = out;
                let pagination = document.querySelector("#pagination");
                pagination.innerHTML = "";
                let totalPages = Math.ceil(marshruts.length / rowsPerPage);
                for (let i = 1; i <= totalPages; i++) {
                    let li = document.createElement("li");
                    let button = document.createElement("button");
                    button.classList.add('btn');
                    button.classList.add('btn-primary');
                    button.textContent = i;
                    button.onclick = function() {
                        currentPage = i;
                        renderTable();
                    };
                    li.appendChild(button);
                    pagination.appendChild(li);
                }
            }
            renderTable();
            })

        .catch(error => alert('Ошибка подключения к серверу'));
        
    }
 
function addMarshrutName(clicked_id){
    let marshrutAddId = clicked_id;
    let secretMarshrutPlace = document.getElementById('marshrutIdData');
    secretMarshrutPlace.innerHTML = marshrutAddId;
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
    .then(function(response){
        return response.json();
    })
    .then(function(marshruts){
        let addNameMarshrut = document.querySelector("#addNameMarshrut");
        for(let marshrut of marshruts){
            if (marshrut.id == marshrutAddId){
                let out = 'Доступные гиды по маршруту "' + marshrut.name + `" 
                                </div>
                                <div>
                                
                                <label>Опыт работы</label>
                                <input class="bg-warning-subtle widthGuid" maxlength="2">
                                <input class="bg-warning-subtle widthGuid" maxlength="2">`;
                addNameMarshrut.innerHTML = out;
            }
        }
    })
}
//показать гидов с маршрута
function showGuids(clicked_id) {
    let marshrutId = clicked_id;
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${marshrutId}/guides?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
    .then(function(response){
        return response.json();
    })
    .then(function(guids){
        let table2 = document.querySelector("#gidsTable");
        let out = `
        <table class="table w-100 text-center table-info">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ФИО</th>
                            <th>Языки</th>
                            <th>Опыт работы</th>
                            <th>Стоимость услуг в час</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody id="table2">`;
        for(let guid of guids){
            out += `
                                <td><img src="images/ikonka.png" alt="logo"></td>
                                <td>${guid.name}</td>
                                <td>${guid.language}</td>
                                <td>${guid.workExperience}</td>
                                <td>${guid.pricePerHour}</td>
                                <td><a id='${guid.id}' class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick="createApplication(this.id); tourTime(); price(this.id);">Выбрать</a></td>
                            </tbody>
                        `;
        }
        out += `</table>`
        table2.innerHTML = out;
    })
    .catch(error => alert('Ошибка подключения к серверу'));
}
function listLanguages(clicked_id){
    let marshrutId = clicked_id;
    let languagePlace = document.querySelector('#placeGuidProperties')
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${marshrutId}/guides?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
    .then(function(response){
        return response.json();
    })
    .then(function(guids){
        let out1 = `<select id="languageSelect">
                            <option value="Язык экскурсии" class="bg-warning-subtle" selected>Язык экскурсии</option>
                        `;
        languagePlace.innerHTML = out1;  
        let languageSelectPlace = document.querySelector('#languageSelect');
        let out3 = `</select>`;
        for (let guid of guids){
            let out2 = `<option class="bg-warning-subtle" value="${guid.language}">${guid.language}</option>`
            languageSelectPlace.innerHTML += out2;
        }
        languagePlace.innerHTML += out3;
        filterLanguages(marshrutId)
    })
}
function filterLanguages(marshrutId){
    let idForTable = marshrutId;
    let languageSelectPlace = document.querySelector('#languageSelect');
    languageSelectPlace.addEventListener('change', function(){
        let language = languageSelectPlace.value;
        if (language != 'Язык экскурсии'){
            fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${idForTable}/guides?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
            .then(function(response){
                return response.json();
            })
            .then(function(guids){
                let table2 = document.querySelector("#gidsTable");
                table2.innerHTML = '';
                table2.innerHTML = `
                    <table class="table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ФИО</th>
                            <th>Языки</th>
                            <th>Опыт работы</th>
                            <th>Стоимость услуг в час</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody id="table2Body"></tbody>`;
                for (let guid of guids){
                    guidForLanguage = document.getElementById('table2Body')
                    if (guid.language == language) {
                        guidForLanguage.innerHTML += `
                                                    <td><img src="images/ikonka.png" alt="logo"></td>
                                                    <td>${guid.name}</td>
                                                    <td>${guid.language}</td>
                                                    <td>${guid.workExperience}</td>
                                                    <td>${guid.pricePerHour}</td>
                                                    <td><a id='${guid.id}' data-bs-toggle="modal" class="btn btn-primary" data-bs-target="#exampleModal" onClick="createApplication(this.id); tourTime(); price(this.id);">Выбрать</a></td>
                                                
                `;
                table2.innerHTML += `</table>`;
                }
                }
                
            })
    } else {
        showGuids(idForTable);
    }
})}
function createApplication(clicked_id) {
    let guidId = clicked_id;
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/${guidId}?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
    .then(function(response){
        return response.json();
    })
    .then(function(guid){
        let guid_name = document.querySelector("#guid_name");
        let outGuid = "";
        outGuid = `
                <p>${guid.name}</p>
        `;
        guid_name.innerHTML = outGuid;
        let secretIdPlace = document.querySelector("#guidIdData");
        let inputSecret = `${guid.id}`;
        secretIdPlace.innerHTML = inputSecret;
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
    .then(function(response){
        return response.json();
    })
    .then(function(marshruts){
        let marshrut_name = document.querySelector("#marshrut_name");
        let outMarshrut = '';
        for(let marshrut of marshruts){
            if (marshrut.id === guid.route_id) {
                outMarshrut += `
                    <p>${marshrut.name}</p>
            `;}}
        marshrut_name.innerHTML = outMarshrut;
    })
})
}
function price(clicked_id){
    let guidId = clicked_id;
    let price = Number(1);
    let timePriceOver = timePrice();
    let totalCost = document.getElementById('totalCost');
    let weekDay = document.getElementById('weekDay');
    let countPeople = document.getElementById('countPeople');
    let hours = document.getElementById('hourCount');
    let option1 = document.querySelector('#option1');
    let option2 = document.querySelector('#option2');
    let eventArray = [weekDay, hours, countPeople, timeAppointment, option1, option2];
    let priceWithOptions;
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/${guidId}?api_key=3998032f-4281-4dc1-a312-42ff9d880281`)
    .then(function(response){
        return response.json();
    })
    .then(function(guid){
        let peoplePrice = numberPeople(); 
        let pricePerHour = guid.pricePerHour;
        price = pricePerHour;
        checkWeekDay();
        let hourCount = Number(hours.value);
        let op1 = checkedOption1();
        let op2 = checkedOption2();
        price = pricePerHour * hourCount * weekPrice + peoplePrice + timePriceOver;
        priceWithOptions = price + op1 + price * op2;
        totalCost.innerHTML = Math.floor(priceWithOptions);
        eventArray.forEach(function(event) {
            event.addEventListener('change', function(){ 
                hourCount = Number(hours.value);
                checkWeekDay();
                peoplePrice = numberPeople();
                let timePriceOver = timePrice();
                op1 = checkedOption1();
                op2 = checkedOption2();
                price = (pricePerHour * hourCount * weekPrice + peoplePrice + timePriceOver);
                priceWithOptions = price + op1 + price * op2;
                totalCost.innerHTML = Math.floor(priceWithOptions);
                function dataForPost(priceWithOptions) {
                    console.log(priceWithOptions);
                  }
        })})
    })
}
function tourTime() {
    let timeInput = document.getElementById("timeAppointment");
    let warningTime = document.querySelector("#warningTime")
    timeInput.onchange = () => {
        warningTime.innerHTML = '';
            if (timeInput.value < timeInput.min || timeInput.value > timeInput.max) {
                timeInput.value = "09:00";
                out = 'Время работы компании с 9:00 до 23:00';
                warningTime.innerHTML = out;
            }
    }
    }
function timePrice(){
    let timePriceOver = 0;
    const timeInput = document.getElementById("timeAppointment");
    let warningTimePrice = document.querySelector("#warningTimePrice")
    warningTimePrice.innerHTML = '';
    if (timeInput.value >= "09:00" && timeInput.value <= "12:00") {
        timePriceOver = 400;
        out = 'Стоимость тура с 9:00 до 12:00 увеличивается на 400 рублей.';
        warningTimePrice.innerHTML = out;
    } else if (timeInput.value >= "20:00" && timeInput.value <= "23:00") {
        timePriceOver = 1000;
        out = 'Стоимость тура с 20:00 до 23:00 увеличивается на 1000 рублей.';
        warningTimePrice.innerHTML = out;
    }
    return timePriceOver;
}
function checkedOption1(){
    let option1 = document.querySelector('#option1');
    let peopleNumber = countPeople.value;
    let option1Price = 0;
    if (option1.checked) {
        option1Price = 1000 * peopleNumber;
    } else {
        option1Price = 0;
    }
    return option1Price;
}
function checkedOption2(){
    let option2 = document.querySelector('#option2');
    let peopleNumber = countPeople.value;
    let option2Price = 0;
    
    if (option2.checked && peopleNumber >= 1 && peopleNumber <= 10) {
        if (1 <= peopleNumber && peopleNumber <= 5) {
            option2Price = 0.15;
        } else if (6 <= peopleNumber && peopleNumber <= 10) {
            option2Price = 0.25;
        }
    } else {
        option2Price = 0;
    }
    return option2Price;
}

const holidays = ["1-1", "1-2","1-3","1-4","1-5","1-6","1-7","1-8","2-23","3-8","5-1","5-9","6-12","11-4"];
function checkWeekDay(){
    warningAboutWeek = document.getElementById('warningData');
    dayOfWeek = new Date(weekDay.value);
    let isThisDayOff = dayOfWeek.getDay();
    let holiday = (dayOfWeek.getMonth() + 1) + '-' + dayOfWeek.getDate();
    if (isThisDayOff === 6 || isThisDayOff === 0) {
        weekPrice = Number(1.5);
        out = 'В выходные дни стоимость тура повышается на 50%';
        warningAboutWeek.innerHTML = out;
    } else if (holidays.includes(holiday)){
        weekPrice = Number(1.5);
        out = 'В праздничные дни стоимость тура повышается на 50%';
        warningAboutWeek.innerHTML = out;
    } 
    else {
        weekPrice = Number(1);
        warningAboutWeek.innerHTML = '';
    }
    return weekPrice;
}
function numberPeople() {
    let peopleNumber = countPeople.value;
    if (1 <= peopleNumber && peopleNumber < 5){
        peoplePrice = Number(0);
    }else if (5 <= peopleNumber && peopleNumber < 10) {
        peoplePrice = Number(1000);
    }else {
        peoplePrice = Number(1500);
    }
    return peoplePrice;
}
function sendApplication() {
    let dateForPost = document.getElementById('weekDay').value;
    let hoursForData = Number(document.getElementById('hourCount').value);
    let guidIdForData = Number(document.getElementById('guidIdData').textContent);
    let optionFirstData = Number(document.getElementById('option1').checked);
    let optionSecondData = Number(document.getElementById('option2').checked);
    let personsData = Number(document.getElementById('countPeople').value);
    let priceData = Math.floor(document.getElementById('totalCost').textContent);
    let routeIdData = Number(document.getElementById('marshrutIdData').textContent);
    let timeData = document.getElementById('timeAppointment').value + ':00';
    const data = {
        "date": dateForPost,
        "duration": hoursForData,
        "guide_id": guidIdForData,
        "id": 1,
        "optionFirst": optionFirstData,
        "optionSecond": optionSecondData,
        "persons": personsData,
        "price": priceData,
        "route_id": routeIdData,
        "student_id": 18, 
        "time": timeData
    }
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    fetch("http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=3998032f-4281-4dc1-a312-42ff9d880281", {
        method: "POST", 
        body: formData
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Ошибка:', error));
}

createTable();