import { fromEvent, Subject } from "rxjs";
import { takeUntil, map, filter } from "rxjs/operators";
import WORDS_LIST from './../assets/json/word_list.json';


const getRandomWord = () => {
    // Generador de palabras aleatorías

    return WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)].toLowerCase();
}

// CONFIGURACION
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
let rightWord = getRandomWord();

const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById('message-text');

const onKeyDown$ = fromEvent(document, 'keydown').pipe(map((event) => event.key));
const userWinOrLoose$ = new Subject();


console.log(`Right word: ${rightWord}`);

// OBSERVABLES
const insertLetter$ = onKeyDown$.pipe(
    filter((pressKey) => pressKey.length === 1 && pressKey.match(/[a-z]/i))
)

const checkWord$ = onKeyDown$.pipe(
    filter((pressKey) => pressKey === 'Enter' && letterIndex === 5 && letterRowIndex <= 5)
)

const deleteWord$ = onKeyDown$.pipe(
    filter((pressKey) => pressKey === "Backspace" && letterIndex !== 0)
)

// OBSERVADORES

const insertLetter  = {
    next: (pressKey) => {
        // Insertar una nueva letra en la casilla correspondiente de la fila 

        let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
        letterBox.textContent = pressKey;
        letterBox.classList.add("filled-letter");
        letterIndex++;

        userAnswer.push(pressKey);
    }
}

const deleteLetter = {
    next: () => {
        // Eliminar la ultima letra ingresada en el fila

        letterIndex--;

        let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
        letterBox.textContent = "";
        letterBox.classList.remove("filled-letter");

        userAnswer.pop();
    }
}

const checkWord = {
    next: () => {
        // Verificar si la palabra ingresada es la correcta
        
        if (userAnswer.length !== 5) {

            messageText.textContent = "¡Te faltan algunas letras!";
            return;
        }

        userAnswer.map(( word, i) => {

            let letterColor = ""; 
            let letterBox = Array.from(letterRows)[letterRowIndex].children[i];
            let letterPosition = rightWord.indexOf(word);

            if(letterPosition === -1){
                // Letra no presente en la palabra correcta

                letterColor = 'letter--grey';

            }else{

                if(rightWord[i] === word){
                    //Letra en la posición correcta de la palabra

                    letterColor = 'letter--green';
                }else{
                    // Letra presente en la palabra pero no es la posición correcta

                    letterColor = 'letter--yellow';
                }
            }

            //Añade el estilo correspondiente a cada letra
            letterBox.classList.add(letterColor);
        });


        if (userAnswer.join("") === rightWord) {

            messageText.textContent = `😊 ¡Sí! La palabra ${rightWord.toUpperCase()} es la correcta`;
            userWinOrLoose$.next();
        } else {

            letterIndex = 0;
            letterRowIndex++;
            userAnswer = [];

            if (letterRowIndex === 6) {

                messageText.textContent = `😔 Perdiste. La palabra correcta era: "${rightWord.toUpperCase()}"`;
                userWinOrLoose$.next();
            }
        }
    }
}

// SUSCRIPCIONES

insertLetter$
.pipe(
    takeUntil(userWinOrLoose$)
)
.subscribe(insertLetter);

deleteWord$
.pipe(
    takeUntil(userWinOrLoose$)
)
.subscribe(deleteLetter);

checkWord$
.pipe(
    takeUntil(userWinOrLoose$)
)
.subscribe(checkWord);

userWinOrLoose$
.subscribe(() => {

    let letterRowsWinned = Array.from(letterRows)[letterRowIndex];
    
    for (let i = 0; i < 5; i++) {

        letterRowsWinned.children[i].classList.add("letter-green");
    }
});

