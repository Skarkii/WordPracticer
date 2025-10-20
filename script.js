let wordListWithTranslations = new Map([
    ]);

function getRandomWordWithTranslation() {
    let randomWord = currentWordDisplay;
    let randomTranslation = currentWordTranslation;
    while (currentWordDisplay === randomWord) {
        const wordList = Array.from(wordListWithTranslations.keys());
        const randomIndex = Math.floor(Math.random() * wordList.length);
        randomWord = wordList[randomIndex];
        randomTranslation = wordListWithTranslations.get(randomWord);
    }
    return { word: randomWord.toLowerCase(), translation: randomTranslation.toLowerCase() };
}


let currentLanguage = "";
let currentWordDisplay = "";
let currentWordTranslation = "";

let totalMistakes = 0;
let totalSkips = 0;
let totalReveals = 0;
let totalCorrect = 0;

let skipOnClose = false;
let reverseTranslation = false;
let spellingWarnings = true;



const Modals = {
    Words: 'wordsModal',
    Options: 'optionsModal',
    About: 'aboutModal',
    Statistics: 'statisticsModal'
}

function openModal(modal) {
    if(Modals[modal] === 'statisticsModal') {
        updateStatistics()
    }
    document.getElementById(Modals[modal]).style.display = 'flex';
}

function closeModal(modal) {
    document.getElementById(Modals[modal]).style.display = 'none';
    if(skipOnClose) {
        skipWord(false);
        skipOnClose = false;
    }
}

function updateStatistics() {
    const totalMistakesDisplay = document.getElementById('mistakesCount');
    totalMistakesDisplay.textContent = `Mistakes: ${totalMistakes}`;
    const totalSkipsDisplay = document.getElementById('skipsCount');
    totalSkipsDisplay.textContent = `Skips: ${totalSkips}`;
    const totalCorrectDisplay = document.getElementById('correctAnswersCount');
    totalCorrectDisplay.textContent = `Correct: ${totalCorrect}`;
}


function isInputCorrect(input) {
    for (let i = 0; i < input.length; i++) {
        // console.log(input[i] + " - " + currentWordTranslation[i])
        if (input[i] !== currentWordTranslation[i]) {
            return false;
        }
    }
    return true;
}

let revealedThisRound = false;
function addReveal(){
    revealedThisRound = true;
    totalReveals++;
    document.getElementById('revealCount').textContent = `Reveals: ${totalReveals}`;
}

function revealTranslation() {
    if(!revealedThisRound && currentWordTranslation.length !== 0) {
        addReveal()
    }
    let revealText = document.getElementById('revealText');

    if(revealText.textContent.length !== 0) {
        revealText.textContent = "";
    } else {
        revealText.textContent = currentWordTranslation;
    }
}

function onReverseTranslationToggle() {
    console.log("Reverse translation toggled: " + this.checked);
    reverseTranslation = this.checked;
    skipOnClose = true;
}
document.getElementById('reverseTranslationToggle').addEventListener('change', onReverseTranslationToggle);

function onSpellingWarningsToggle(){
    spellingWarnings = this.checked;
    if(spellingWarnings === false) {
        const translationInput = document.getElementById('translationInput');
        translationInput.style.borderColor = '#333';
    }
}
document.getElementById('spellingWarningsToggle').addEventListener('change', onSpellingWarningsToggle);

function onInputChange() {
    const inputText = this.value.toLowerCase();
    const translationInput = document.getElementById('translationInput');
    if(!isInputCorrect(inputText)) {
        if(spellingWarnings){
            translationInput.style.borderColor = 'red';
        }
        totalMistakes++;
        return;
    }
    translationInput.style.borderColor = '#333';

    if (inputText.length !== currentWordTranslation.length) { return; }

    translatedSuccessfully().then();

}

let wordsMissed = new Map();

function skipWord(countAsSkip = true) {
    const translationInput = document.getElementById('translationInput');
    let wordMissedCount = wordsMissed.get(currentWordDisplay) | 0;
    wordsMissed.set(currentWordDisplay, wordMissedCount + 1);
    translationInput.style.borderColor = '#333';
    translationInput.disabled = false;
    translationInput.focus();
    translationInput.value = "";
    if(countAsSkip) {
        totalSkips++;
    }
    updateWord(getRandomWordWithTranslation());
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const translatedSuccessfully = async () => {
    const translationInput = document.getElementById('translationInput');
    translationInput.style.borderColor = 'green';
    translationInput.disabled = true;
    totalCorrect++;

    await delay(1000);
    translationInput.style.borderColor = '#333';
    translationInput.disabled = false;
    translationInput.focus();

    const wordMap = getRandomWordWithTranslation();
    updateWord(wordMap);
    translationInput.value = "";
}

document.getElementById('translationInput').addEventListener('input', onInputChange);

function updateLanguageTitle(languageName) {
    currentLanguage = languageName;
    document.getElementById('currentLanguage').textContent = currentLanguage;
}

function applyLanguageFromData(data){
    wordListWithTranslations.clear()
    const rows = data.split('\n').filter(row => row.trim() !== '');

    rows.forEach((str, i) => {
        if (i === 0) {
            updateLanguageTitle(str)
            return
        }
        if (i === 1) {
            //Not sure if I want this Yet.
            return
        }
        let words = str.split(':')
        wordListWithTranslations.set(words[0], words[1]);
    });
    skipOnClose = true;
}

document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        applyLanguageFromData(reader.result)
    };
    reader.readAsText(file);
});

function loadExistingLanguage(languageName) {
    const url = '/WordPracticer/languages/' + languageName + ".wp";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            applyLanguageFromData(data)
        })
        .catch(error => {
            console.error('Error loading file:', error);
        });

}

function updateWord(wordMap) {
    revealedThisRound = false;

    currentWordDisplay = wordMap.word;
    currentWordTranslation = wordMap.translation;
    if (reverseTranslation) {
        currentWordDisplay = wordMap.translation;
        currentWordTranslation = wordMap.word;
    }
    console.log("Word: " + currentWordDisplay + " - Translation: " + currentWordTranslation + "")
    document.getElementById('displayText').textContent = currentWordDisplay.charAt(0).toUpperCase() + currentWordDisplay.slice(1);

    document.getElementById('revealText').textContent = "";
}

function resetToggles() {
    document.getElementById('reverseTranslationToggle').checked = false;
    document.getElementById('spellingWarningsToggle').checked = true;
    reverseTranslation = false;
    spellingWarnings = true;
}

function main() {
    resetToggles();
    const wordMap = getRandomWordWithTranslation();
    updateWord(wordMap);
}
main();