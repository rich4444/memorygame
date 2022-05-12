const clicksDisplay = document.getElementsByClassName("clicks")[0];
const timeDisplay = document.getElementsByClassName("time")[0];
const bestScore = document.getElementById("bestScore");
const bestTime = document.getElementById("bestTime");
const difficulty = document.getElementById("difficulty");
const gridContainer = document.getElementsByClassName("gridContainer")[0];

let cardElement = [];
let possibleCards = [];
let clicks = 0;
let restartSetUp = false;
let selectedCards = [];
let matched = 0;
let currentClicks = 0;
let currentTime = 0;


//Load and launch last difficulty selected
if(localStorage.getItem("difficulty")){
    ChangeDifficulty(localStorage.getItem("difficulty"));
    difficulty.value = localStorage.getItem("difficulty");
} else {
    ChangeDifficulty(difficulty.value);
}
//-------------------------------------------------------

difficulty.addEventListener("change", () =>{
    ChangeDifficulty(difficulty.value);
    localStorage.setItem("difficulty", difficulty.value);
});

function ChangeDifficulty (value){
    switch(value){
        case "easy":
            Easy();
            break;
        case "normal":
            Normal();
            break;
        case "hard":
            Hard();
            break;
    }
}

function Easy (){
    if(localStorage.getItem('eScore')){
        bestScore.innerHTML = localStorage.getItem('eScore');
    }else{
        bestScore.innerHTML = "0";
        localStorage.setItem("eScore", "0");
    }
    if(localStorage.getItem('eTime')){
        bestTime.innerHTML = localStorage.getItem('eTime');
    }else{
        bestTime.innerHTML = "0";
        localStorage.setItem("eTime", "0");
    }
    
    while( gridContainer.hasChildNodes() ){
        gridContainer.removeChild(gridContainer.lastChild);
    }
    gridContainer.style.gridTemplateAreas  = `"card card card"`;
    let c = 6;
    for(let i = 0; i < c; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add("card");
        gridContainer.appendChild(newDiv);
    }
    possibleCards = ["card1", "card1", "card2", "card2", "card3", "card3"];
    cardElement = document.querySelectorAll(".card");
    StartCards();
}

function Hard (){
    if(localStorage.getItem('hScore')){
        bestScore.innerHTML = localStorage.getItem('hScore');
    }else{
        bestScore.innerHTML = "0";
        localStorage.setItem("hScore", "0");
    }
    if(localStorage.getItem('hTime')){
        bestTime.innerHTML = localStorage.getItem('hTime');
    }else{
        bestTime.innerHTML = "0";
        localStorage.setItem("hTime", "0");
    }

    while( gridContainer.hasChildNodes() ){
        gridContainer.removeChild(gridContainer.lastChild);
    }
    gridContainer.style.gridTemplateAreas  = `"card card card card card"`;
    let c = 20;
    for(let i = 0; i < c; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add("card");
        gridContainer.appendChild(newDiv);
    }
    possibleCards = ["card1", "card1", "card2", "card2", "card3", "card3", "card4", "card4", "card5", "card5", "card6", "card6", "card7", "card7", "card8", "card8", "card9", "card9", "card0", "card0"];
    cardElement = document.querySelectorAll(".card");
    StartCards();
}

function Normal (){    
    if(localStorage.getItem('nScore')){
        bestScore.innerHTML = localStorage.getItem('nScore');
    }else{
        bestScore.innerHTML = "0";
        localStorage.setItem("nScore", "0");
    }
    if(localStorage.getItem('nTime')){
        bestTime.innerHTML = localStorage.getItem('nTime');
    }else{
        bestTime.innerHTML = "0";
        localStorage.setItem("nTime", "0");
    }

    while( gridContainer.hasChildNodes() ){
        gridContainer.removeChild(gridContainer.lastChild);
    }
    gridContainer.style.gridTemplateAreas  = `"card card card card"`;
    let c = 12;
    for(let i = 0; i < c; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add("card");
        gridContainer.appendChild(newDiv);
    }
    possibleCards = ["card1", "card1", "card2", "card2", "card3", "card3", "card4", "card4", "card5", "card5", "card6", "card6"];
    cardElement = document.querySelectorAll(".card");
    StartCards();
}

function canClick () {
    if(clicks >= 2){ 
        return false;
    } else {
        clicks++;        
        if(restartSetUp == false && clicks >= 2){
            setTimeout(Restart, 1000); 
            document.body.style.cursor = "wait";
            cardElement.forEach(card => {
                card.style.cursor = "wait";
            })
            restartSetUp = true;
        }   
        return true;
    }
};

function Restart (){
    document.body.style.cursor = "";
    cardElement.forEach(card => {
        card.style.cursor = "";
    })
    clicks = 0;
    restartSetUp = false;
    selectedCards.forEach(card => {        
        let cardNumber = card.classList[1][0]+card.classList[1][4];
        card.classList.toggle(cardNumber);
    });
    selectedCards = [];
}

function StartCards (){
    cardElement.forEach(card => {
        AssignCard(card);
        card.addEventListener("click", () => {
            CardClicked(card);
        });    
        card.addEventListener("transitionend", () => {
            FlipCard(card);
        });
    });
}

function FlipCard (card){
    if(card.classList.contains("flipUp")){
        card.classList.remove("flipUp");
        card.classList.add("flipDown");
        let cardNumber = card.classList[1][0]+card.classList[1][4];
        card.classList.toggle(cardNumber);
        selectedCards.push(card);
        if(selectedCards.length > 1){
            if(selectedCards[0].classList[1] == selectedCards[1].classList[1]){
                selectedCards = [];
                matched++;
                }
            }
        } else{
            if(matched >= cardElement.length/2){
                WonGame();
            }
        }
    }

function CardClicked (card) {
    if(card == selectedCards[0] || card == selectedCards[1]) return;
    if(!canClick()) return;
    card.classList.add("flipUp");
    if(currentClicks == 0){
        const incrementInterval = setInterval(() => UpdateTime(), 1000);
    }
    currentClicks++;
    clicksDisplay.innerHTML = `Clicks: ${currentClicks}`;
}

function UpdateTime (){
    currentTime++;
    timeDisplay.innerHTML = `Time: ${currentTime}`;
}

function AssignCard (card){
    let r = Math.floor(Math.random() * possibleCards.length);
    card.classList.add(possibleCards[r]);
    possibleCards.splice(r, 1);
}

function WonGame (){
    let message = "";
    if(currentClicks < localStorage.getItem(difficulty.value[0]+"Score") || localStorage.getItem(difficulty.value[0]+"Score") == 0){
        localStorage.setItem(difficulty.value[0]+"Score", currentClicks);
        message += "\nNEW TIME RECORD";
    }
    if(currentTime < localStorage.getItem(difficulty.value[0]+"Time") || localStorage.getItem(difficulty.value[0]+"Time") == 0){
        localStorage.setItem(difficulty.value[0]+"Time", currentTime);        
        message += "\nNEW CLICKS RECORD";
    }
    alert(`You won!\nYou made ${currentClicks} clicks, and your time was ${currentTime} seconds!${message}\nPlay Again`); 
    location.reload();
}