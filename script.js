// Get country data from JSON
fetch('./land.json')
.then(landObjArray => landObjArray.json())
.then(landObjArray => {
    // Get city data from JSON
    fetch('./stad.json')
    .then(stadObjArray => stadObjArray.json())
    .then(stadObjArray => {
        // Creat view
        createView(landObjArray,stadObjArray);
    });// Inner .then ends
});// Outer .then ends

// Function create view
function createView(landObjArray,stadObjArray) {
    var cityId;
    console.log(landObjArray);
    landObjArray.forEach(land => {
        // Create country nav element
        let countryNavElement = document.createElement('div');
        countryNavElement.setAttribute('id',`country-${land.id}`);
        countryNavElement.setAttribute('tabindex',`0`);
        countryNavElement.classList.add('country-nav', 'nav', 'btn');
        countryNavElement.innerText = land.countryname;
        countryNavElement.click();
        // Insert country nav element into DOM
        document.getElementById('countries').insertAdjacentElement('beforeend',countryNavElement);

        // Set initial state of display
        let display = document.getElementById('display');
            display.innerHTML = '';
            display.innerHTML = '<h2>Klicka på ett land!</h2>';

        countryNavClicked();
        // Event Country nav clicked
        function countryNavClicked() {
            countryNavElement.addEventListener('click',(e) => {
                let display = document.getElementById('display');
                display.innerHTML = '';
                display.innerHTML = '<h2>Klicka på en stad!</h2>';
                let countryIdRaw = e.target.id;
                let countryID = countryIdRaw.slice(8,9);
                let filteredCities = stadObjArray.filter(stad => stad.countryid == countryID);// Filter JSON city by country
                console.log(filteredCities);
                let print = '';
                filteredCities.forEach(city => {
                    print += `<div tabindex="0" class="city-nav nav btn" id="city-${filteredCities.indexOf(city)}">${city.stadname}</div>`; // Create city nav element
                })
                document.getElementById('cities').innerHTML = '';
                // Show city nav
                document.getElementById('cities').innerHTML = print;
                // Create active state
                let countryEl = document.getElementsByClassName('country-nav');
                for(let i = 0; i < countryEl.length; i++){
                    if(countryEl[i].classList.contains('active')){
                        countryEl[i].classList.remove('active');
                    }
                }
                e.target.classList.add('active');
            });
        }// countryNavClicked() ends

        cityNavClicked();
        // Event City nav clicked
        function cityNavClicked() {
            let cityNavElement = document.getElementById('cities');
            cityNavElement.addEventListener('click',(e) => {
                cityId = e.target.id;// Get city id
                console.log(cityId);
                let cityEl = document.getElementsByClassName('city-nav');
                for(let i = 0; i < cityEl.length; i++){
                    if(cityEl[i].classList.contains('active')){ // Toggle active class
                        cityEl[i].classList.remove('active');
                    }
                }
                e.target.id !=='cities' ? e.target.classList.add('active'):null; // Include only child elements
                // Display info
                displayCityInfo(stadObjArray, cityId, landObjArray);
            });
        }// cityNavClicked() ends
        
    }); // landObjArray.forEach() ends 

} // createView() ends

// Display city info function
function displayCityInfo(stadObjArray, cityId, landObjArray) {
    let city = document.getElementById(`${cityId}`);
    stadObjArray.filter(stad => {
        if(stad.stadname === city.innerText){
            let land = landObjArray.filter(item => item.id === stad.countryid)
            let display = document.getElementById('display');
            display.innerHTML = '';
            display.innerHTML = `<h2> ${stad.stadname} är en stad i ${land[0].countryname} och  har en befolknings mängd på ${stad.population} människor.</h2>`
        }
    });
} // displayCityInfo() ends

// Delete btn clicked
let populationArray = [];
let visitedCities = [];
let deleteBtn = document.getElementById('delete-btn');
let display = document.getElementById('display');
deleteBtn.addEventListener('click', (e) => {
    visitedCities = ['']; // Delete visitede cities array 
    populationArray = [0];
    localStorage.clear();
    display.innerHTML = `<h3>Inga besökta städer sparade!</h3>`;
    visitedCities = [];
    console.log(visitedCities);
    document.getElementById('visited-count'). innerText = '(0)';
});

// Visited btn clicked
let visitedBtn = document.getElementById('visited-btn');
visitedCities = [];
visitedBtn.addEventListener('click', (e) =>{
    let display = document.getElementById('display');
    let displayedText = display.innerText;
    if(displayedText.length > 20) { // Extract the city name
        let displayedTextArray = displayedText.split(/\s/);// Make an array of the displayed text seperated by space
        console.log(displayedTextArray[0]);
        console.log(displayedTextArray.indexOf('på'));// Index of the element before population
        let populationIndex = displayedTextArray.indexOf('på') + 1;
        console.log(populationIndex);
        // Create visited city and population array
        if(!visitedCities.includes(displayedTextArray[0])) { 
            if(!displayedTextArray[0].includes('Inga') && !displayedTextArray[0].includes('Dina')){
                visitedCities.push(displayedTextArray[0]);
                localStorage.setItem('visitedCities',visitedCities);
                populationArray.push(parseInt(displayedTextArray[populationIndex]));
                localStorage.setItem('populationArray',populationArray);
                console.log(visitedCities);
                console.log(populationArray);
                document.getElementById('visited-count'). innerText = `(${localStorage.getItem('visitedCities').split(/,/).length})`;
            }
        }
    }
});

// Display visited cities
let showVisitedCitiesBtn = document.getElementById('show-visited-cities');
showVisitedCitiesBtn.addEventListener('click', displayVisitedView);
function displayVisitedView() {
    // Remove active class from city nav
    let cityNav = document.querySelectorAll('.city-nav');
    cityNav.forEach(city => {
        city.classList.remove('active');
    })
    // Calculate total population
    let display = document.getElementById('display');
    let totPop = 0;
    for(let i = 0; i < populationArray.length; i++){
        totPop += populationArray[i];
        localStorage.setItem('totPop',totPop);
        console.log(totPop);
    }
    // Populate display depending upon localstorage
    if(localStorage.getItem('visitedCities')){
        let print = '<h3>Dina besökta städer är:</h3><ul>';
        // If localstorage empty
        if(!localStorage.getItem('visitedCities')){
            visitedCities.forEach(city => {
                print += `<li>${city}</li>`
            });
        }else {
            // Format Local storage
            let localPre =  localStorage.getItem('visitedCities');
            let localArr = localPre.split(/,/);
            console.log(localPre);
            console.log(localArr);
            localArr.forEach(city => {
                print += `<li>${city}</li>`
            });
        }
        // Display calculated total population
        if(localStorage.getItem('visitedCities')){
            print += `</ul><h3>Totalt potetiellt träffade personer: ${localStorage.getItem('totPop')}`;
        }else {
            print += `</ul><h3>Totalt potetiellt träffade personer: ${totPop}`;
        }
        console.log(print);
        display.innerHTML = '';
        if(visitedCities.length > 0 || !localStorage.getItem('visitedCities')){
            display.innerHTML = print;
        }else if (localStorage.getItem('visitedCities')){
            display.innerHTML = print;
        };
    }else{ // If no cities are saved in localstorage
        let print = '<h3>Dina besökta städer är: 0</h3>';
        display.innerHTML = print;
    }
}