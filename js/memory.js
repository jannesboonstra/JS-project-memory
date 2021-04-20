"use strict";
//welkom header
const welcomeHeader = document.getElementById('headerWelcome');

//wanneer pagina geload is, wordt er om een naam gevraagd als die nog niet bekend is
window.addEventListener('load', startUp);

//hier wordt de keuze gemaakt voor het speelveld
const playfield = document.getElementById('playfield');
playfield.addEventListener('change', onSelectFieldSize);

//Het veld waarop de kaarten komen te liggen
const myField = document.getElementById('field');
//de scoretellers
const scoreP = document.getElementById('try');
const scoreG = document.getElementById('found');
const scoreT = document.getElementById('tijd');
//De kaarten die verwijderd zijn
const verwijderd = document.getElementsByClassName('removedCard');

//instantiatie van de variabelen nodig voor de functie onSelectFieldSize
let boardClass = '';
let myCardArray = '';
let newCardArray = "";
////instantiatie van de variabelen nodig voor de functie evaluateMatch()
let openCard = '';
//instantie van de variabelen voor de score;
let timer;
let poging = 0;
let gevonden = 0;
let tijd = 0;
let highscore4 = {};
let highscore5 = {};
let highscore6 = {};
//score van 0 wordt op het bord gezet
scoreP.innerHTML = poging;
scoreG.innerHTML = gevonden;
scoreT.innerHTML = tijd;

//class card wordt gemaakt
class Card {
    constructor(cardObject) {
        this.card1 = cardObject.card1;
        this.card2 = cardObject.card2;
        this.set = cardObject.set;
        this.sound = cardObject.sound;
    }
}

//De kaarten die op het veld komen te liggen
fetch("js/cards.json")
    .then(response => response.json())
    .then(data => {
        myCardArray = data.map(card => new Card(card));
    });  

//functie die de keuze voor het speelveld verwerkt
function onSelectFieldSize(){
    //kaarten worden eerst geschud zodat er elke keer andere kaarten komen te liggen
    shuffle(myCardArray);
    //de keuze die bepaalt welke class de kaart meegegeven wordt en het aantalkaarten in de array selecteerd
    switch(playfield.value){
        case '4':
            boardClass = 'board4';
            newCardArray = myCardArray.slice(0,8);
            //tijd begint te lopen
            //interval voor de scoreteller tijd
            stopTijd();
            startTijd();
            break;
        case '5':
            boardClass = 'board5';
            newCardArray = myCardArray.slice(0,12);
            //tijd begint te lopen
            stopTijd();
            startTijd();
            timer;
            break;
        case '6':
            boardClass = 'board6';
            newCardArray = myCardArray.slice(0,18);
            //tijd begint te lopen
            stopTijd();
            startTijd();
            timer;
            break;
    }
    //het veld wordt gevuld met kaarten na de keuze van het speelveld
    populateField();

}

//de Fisher Yates shuffle functie welke de kaarten schud
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {

    i = Math.floor(Math.random() * m--);
    
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    }   
        return array;
}

//declaratie voor de for loop
let i;
//de functie met de for loop om het veld met plaatjes te vullen
//de functie was in een eerdere opdracht al gemaakt, maar dit had ook gekunt met een foreach loop
function populateField(){
    //scores worden gereset
    poging = 0;
    gevonden = 0;
    scoreP.innerHTML = poging;
    scoreG.innerHTML = gevonden;
    //het veld wordt eerst geruimd zodat er ruimte gemaakt wordt voor de nieuwe keus
    myField.innerHTML = "";
    //de kaarten worden verdubbeld
    let myCardSetdbl = newCardArray.concat(newCardArray);
    //de kaarten worden geschud
    let myCardSet = shuffle(myCardSetdbl);

    //wanneer iemand op een plaatje klikt, roept deze een functie op om het geklikte plaatje naar de console te loggen
    myField.addEventListener('click', onClickCard);
    //de kaarten worden gemaakt en op het veld gelegd
    for(i = 0; i < myCardSet.length; i++){
        let newTile = document.createElement('div');
        let newCard = document.createElement('img');
        let imageURL = `img/${myCardSet[i].card1}.jpg`;
        let cardcover = document.createElement('img');
        let coverURL = `img/cover.png`;
        cardcover.setAttribute('src', coverURL);
        cardcover.setAttribute('class', 'covered');
        cardcover.setAttribute('name', myCardSet[i].card1);
        newCard.setAttribute('src', imageURL);
        newCard.setAttribute('name', myCardSet[i].card1);
        newTile.setAttribute('class', boardClass);
        newTile.appendChild(newCard);
        newTile.appendChild(cardcover);
        myField.appendChild(newTile);

    }
}
//de functie om het geklikte plaatje te tonen
function onClickCard(e){
    const login = e.target.getAttribute('name');
    const classNameCheck = e.target.className === 'covered';
    
    if (classNameCheck){
        e.target.className = 'uncovered';
        //console.log(e.target.parentNode.firstChild.getAttribute('name'));
    }
    //functie om kaarten te vergelijken
    evaluateMatch(login);
}

//functie om naam en highscore op te vragen en indien de naam er niet is, de naam in te vullen
function startUp(){
    const naamBekend = localStorage.getItem('naamUser');
    const highscore4 = [localStorage.getItem('highscoreT4'), localStorage.getItem('highscoreP4')];
    const highscore5 = [localStorage.getItem('highscoreT5'), localStorage.getItem('highscoreP5')];
    const highscore6 = [localStorage.getItem('highscoreT6'), localStorage.getItem('highscoreP6')];
    let scores4;
    let scores5;
    let scores6;

    if(highscore4[0] == null){
        scores4 = 'u heeft nog geen poging gedaan'
    } else {
        scores4 = `${highscore4[1]} pogingen binnen ${highscore4[0]} seconden.`;
    }
    if(highscore5[0] == null){
        scores5 = 'u heeft nog geen poging gedaan'
    } else {
        scores5 = `${highscore5[1]} pogingen binnen ${highscore5[0]} seconden.`;
    }
    if(highscore6[0] == null){
        scores6 = 'u heeft nog geen poging gedaan'
    } else {
        scores6 = `${highscore6[1]} pogingen binnen ${highscore6[0]} seconden.`;
    }
    
    if(naamBekend){
        welcomeHeader.innerHTML = 'Welkom ' + naamBekend;
        alert(`Welkom ${naamBekend}, uw scores zijn: \n
        op het 4 x 4 bord: ${scores4};
        op het 5 x 5 bord: ${scores5};
        op het 6 x 6 bord: ${scores6};
        `);
        welcomeHeader.innerHTML = 'Welkom ' + naamBekend;
    } else {
        const naam = prompt('Wat is uw naam?');
        localStorage.setItem('naamUser', naam);
        welcomeHeader.innerHTML = 'Welkom ' + naamBekend; 
    }
}

//functie om de kaarten te vergelijken
function evaluateMatch(nameCard) {
    //hier is ligt er maar 1 kaart op het veld
    if(openCard == ''){

        openCard = nameCard;

    //dit gebeurt er als er twee dezelfde kaarten zijn gevonden    
    } else if (openCard == nameCard){

        const setClassBack = document.querySelectorAll(`[name="${nameCard}"]`);
        const geluid = document.getElementById('geluid');
        //het geluid wordt door deze functie aan de kaart gekoppeld
        setSound(nameCard, geluid);
        //het geluid wordt afgespeeld
        geluid.play();
        //de kaarten worden tijdelijk niet meer klikbaar gemaakt
        myField.removeEventListener('click', onClickCard);
        //deze functie wordt actief na 1 seconde en verwijdert de kaart van het veld en maakt het veld weer speelbaar
        //poging score en gevonden score gaat omhoog
        poging++;
        gevonden++;
        scoreP.innerHTML = poging;
        scoreG.innerHTML = gevonden;

        setTimeout(function() {
            setClassBack.forEach(selected => selected.style.display = 'none');
            myField.addEventListener('click', onClickCard)
        }, 1000);
        //functie om te kijken of het veld leeg is
        checkWin()
        //de variabelen worden leeg gemaakt
        openCard = '';
        nameCard = '';

    //dit gebeurt er als de twee kaarten niet hetzelfde zijn    
    } else {
        const setClassBack = document.querySelectorAll('.uncovered');
         //de kaarten worden tijdelijk niet meer klikbaar gemaakt
        myField.removeEventListener('click', onClickCard);
        //poging score gaat omhoog
        poging++;
        scoreP.innerHTML = poging;
        //deze functie wordt actief na 1 seconde en draait de kaart weer om en maakt het veld weer speelbaar
        setTimeout(function() {
            setClassBack.forEach(selected => selected.className = 'covered');
            myField.addEventListener('click', onClickCard)
        }, 1000);
        //de variabel wordt weer leeg gemaakt
        openCard = '';
    }
}
//de functie die het geluid zet
function setSound(geluidje, bron){
    bron.src = `snd/${geluidje}.wav`;
}

//start tijd
function startTijd(){
    timer = setInterval(function(){ tijd++; scoreT.innerHTML = tijd;},1000);
}
//stop tijd
function stopTijd(){
    clearTimeout(timer);
    tijd = 0;
    scoreT.innerHTML = tijd;
}
//functie om te kijken of het veld leeg is gespeeld
function checkWin(){
    if(gevonden == 8 && playfield.value == 4){
        gewonnen(4);
    } 
    if(gevonden == 12 && playfield.value == 5){
        gewonnen(5);
    }
    if(gevonden== 18 && playfield.value == 6){
        gewonnen(6);
    }
}
//functie wanneer het veld leeg is gespeeld
function gewonnen(num){
    const naam = localStorage.getItem('naamUser');
    const highscoreT = localStorage.getItem(`highscoreT${num}`);
    const highscoreP = localStorage.getItem(`highscoreP${num}`);
    if(!highscoreP){
        setScore(num, naam);
    } else if (highscoreP == poging && highscoreT > tijd){
        setScore(num, naam);
    } else if(highscoreP > poging){
        setScore(num, naam);
    } else {
        alert(`Helaas ${naam}, u heeft uw highscore nog niet verbeterd. \n
        Probeer het nog eens!`)
        populateField();
        stopTijd();
        startTijd();
    }
}
//zet de nieuwe highscore en vul het veld opnieuw
function setScore(num, naam){
    localStorage.setItem(`highscoreT${num}`, tijd);
    localStorage.setItem(`highscoreP${num}`, poging);
    alert(`Goed gedaan ${naam}! U heeft een nieuwe highscore op het ${num} x ${num} veld! \n
    Uw score is: ${poging} pogingen binnen ${tijd} seconden \n
    Probeer uw nieuwe highscore te verbeteren!`);
    populateField();
    stopTijd();
    startTijd();
    
}

