const validOptions = ['languageLoadMethod', 'languageFile', 'languageUrl', 'reverseTranslation', 'spellingWarnings', 'textToSpeech', 'hideText',]
let programOptions = {
    languageLoadMethod: "",
    languageFile: "",
    languageUrl: "",

    reverseTranslation: false,
    spellingWarnings: true,
    textToSpeech: false,
    hideText: false,
}

function saveOptions() {
    localStorage.setItem('programOptions', JSON.stringify(programOptions));
}

function updateOption(key, value){
    if(validOptions.includes(key)){
        programOptions[key] = value;
        saveOptions();
    }
    else {
        console.log("Invalid option: " + key);
    }
}

function loadOptions() {
    const savedOptions = JSON.parse(localStorage.getItem('programOptions')) || programOptions;
    programOptions = savedOptions;

    if(savedOptions.languageLoadMethod === "ExistingLanguage") {
        loadExistingLanguage(savedOptions.languageFile)
    } else if(savedOptions.languageLoadMethod === "LocalFile") {
        console.log("Local file is not yet implemented for reloading the page")
        const wordMap = getRandomWordWithTranslation();
        updateWord(wordMap);
    }
    else if(savedOptions.languageLoadMethod === "customUrl") {
        loadLanguageFromUrl(savedOptions.languageFile)
    } else {
        const wordMap = getRandomWordWithTranslation();
        updateWord(wordMap);
    }

    setReverseTranslation(savedOptions.reverseTranslation);
    setSpellingWarnings(savedOptions.spellingWarnings);
    setHideText(savedOptions.hideText);
    setTextToSpeech(savedOptions.textToSpeech);

}

let wordListWithTranslations = new Map([
    ]);

function getRandomWordWithTranslation() {
    let size = wordListWithTranslations.size;
    if(size === 0) {
        console.log("No words loaded")
        return { word: "No words loaded, press 'Words' to select.", translation: "No words loaded" };
    }
    const wordList = Array.from(wordListWithTranslations.keys());

    let randomWord = currentWordDisplay;
    while (randomWord === currentWordDisplay) {
        const randomIndex = Math.floor(Math.random() * size);
        randomWord = wordList[randomIndex];
    }
    const randomTranslation = wordListWithTranslations.get(randomWord) ?? '';

    return { word: randomWord.toLowerCase(), translation: randomTranslation.toLowerCase() };

}


let currentLanguage = "";
let languageCodes = "";
let currentWordDisplay = "";
let currentWordTranslation = "";

let totalMistakes = 0;
let totalSkips = 0;
let totalReveals = 0;
let totalCorrect = 0;

let skipOnClose = false;
let reverseTranslation = false;
let spellingWarnings = true;
let textToSpeech = false;
let hideText = false;



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
    // Prevent background scroll while modal is open
    document.body.classList.add('modal-open');
}

function closeModal(modal) {
    document.getElementById(Modals[modal]).style.display = 'none';
    // Re-enable background scroll
    document.body.classList.remove('modal-open');
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
        if(hideText) {
            revealText.textContent = currentWordDisplay + " - " + currentWordTranslation;
        } else {
            revealText.textContent = currentWordTranslation;
        }
    }
}

function setTextToSpeech(value, toggle=false){
    if (toggle) {
        value = !textToSpeech;
        updateOption('textToSpeech', value);
    }
    textToSpeech = value;
    document.getElementById('textToSpeechToggle').checked = value;

    if(textToSpeech) {
        document.getElementById('audioButton').style.display = "block";
        document.getElementById('hideTextToggle').disabled = false;
        if(hideText) {
            document.getElementById('displayText').style.display = "none";
        }
    } else {
        document.getElementById('audioButton').style.display = "none";
        document.getElementById('hideTextToggle').disabled = true;

        if(hideText) {
            document.getElementById('displayText').style.display = "block";
        }
    }

}

function setHideText(value, toggle=false) {
    if (toggle) {
        value = !hideText;
        updateOption('hideText', value);
    }
    hideText = value;
    document.getElementById('hideTextToggle').checked = value;

    if(hideText) {
        document.getElementById('displayText').style.display = "none";
    } else {
        document.getElementById('displayText').style.display = "block";
    }
}

function setReverseTranslation(value, toggle=false) {
    if (toggle) {
        value = !reverseTranslation;
        updateOption('reverseTranslation', value);
        skipOnClose = true;
    }
    reverseTranslation = value;
    document.getElementById('reverseTranslationToggle').checked = value;

}

function setSpellingWarnings(value, toggle=false) {
    if (toggle) {
        value = !spellingWarnings;
        updateOption('spellingWarnings', value);
    }
    spellingWarnings = value;
    document.getElementById('spellingWarningsToggle').checked = value;

    if(spellingWarnings === false) {
        const translationInput = document.getElementById('translationInput');
        translationInput.style.borderColor = '#333';
    }
}

document.getElementById('reverseTranslationToggle').addEventListener('change', setReverseTranslation.bind(null, true));
document.getElementById('spellingWarningsToggle').addEventListener('change', setSpellingWarnings.bind(null, true));
document.getElementById('textToSpeechToggle').addEventListener('change', setTextToSpeech.bind(null, true));
document.getElementById('hideTextToggle').addEventListener('change', setHideText.bind(null, true));

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
    translationInput.readOnly = false;
    translationInput.focus();
    translationInput.value = "";
    if(countAsSkip) {
        totalSkips++;
    }
    updateWord(getRandomWordWithTranslation());
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const isMobileDevice = () => /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);

const translatedSuccessfully = async () => {
    const translationInput = document.getElementById('translationInput');
    translationInput.style.borderColor = 'green';

    if (isMobileDevice()) {
        translationInput.readOnly = true;
    } else {
        translationInput.disabled = true;
    }
    totalCorrect++;

    await delay(1000);
    translationInput.style.borderColor = '#333';

    if (isMobileDevice()) {
        translationInput.readOnly = false;
    } else {
        translationInput.disabled = false;
    }
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
            languageCodes = str.split(":");
            return
        }
        let words = str.split(':')
        const trimEdges = (s) => (s ?? '').replace(/^[\s\b]+|[\s\b]+$/g, '');
        wordListWithTranslations.set(trimEdges(words[0]), trimEdges(words[1]));
    });

    const wordMap = getRandomWordWithTranslation();
    updateWord(wordMap);
    // skipOnClose = true;
}

function loadLanguageFromUrl(url) {
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

document.getElementById('fileInput').addEventListener('change', function() {
    updateOption('languageLoadMethod', 'LocalFile')
    updateOption('languageFile', '')
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        applyLanguageFromData(reader.result)
    };
    reader.readAsText(file);
});

function loadLanguageFromUrlInput(){
    const url = document.getElementById('languageUrlInput').value;
    updateOption('languageLoadMethod', 'customUrl')
    updateOption('languageFile', url)
    loadLanguageFromUrl(url)
}

function loadExistingLanguage(languageName) {
    updateOption('languageLoadMethod', 'ExistingLanguage')
    updateOption('languageFile', languageName)
    const url = '/WordPracticer/languages/' + languageName + ".wp";
    loadLanguageFromUrl(url)
}

function playCurrentWord() {
    const message = new SpeechSynthesisUtterance(currentWordDisplay);
    if(reverseTranslation) {
        message.lang = languageCodes[1];
    } else {
        message.lang = languageCodes[0];
    }
    window.speechSynthesis.speak(message)
}

function updateWord(wordMap) {
    revealedThisRound = false;

    currentWordDisplay = wordMap.word;
    currentWordTranslation = wordMap.translation;
    if (reverseTranslation) {
        currentWordDisplay = wordMap.translation;
        currentWordTranslation = wordMap.word;
    }
    document.getElementById('displayText').textContent = currentWordDisplay.charAt(0).toUpperCase() + currentWordDisplay.slice(1);

    document.getElementById('revealText').textContent = "";

    if(textToSpeech) {
        playCurrentWord();
    }
}

function main() {
    loadOptions();
}
main();