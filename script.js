let wordListWithTranslations = new Map([
    ["strawberry", "딸기"],
    ["would you like", "드릴까요"],
    ["wow", "와"],
    ["happy birthday", "생일 축하해요"],
    ["cute", "귀여운"],
    ["necklace", "목걸이"],
    ["watch", "시계"],
    ["gift", "선물"],
    ["fifteen", "열다섯"],
    ["younger sister", "여동생"],
    ["today", "오늘"],
    ["birthday", "생일"],
    ["bread", "빵"],
    ["bubble tea", "버블티"],
    ["with", "이랑"],
    ["sweet", "단"],
    ["tteokbokki", "떡볶이"],
    ["rice", "밥"],
    ["this", "이것"],
    ["ramyeon", "라면"],
    ["galbitang", "갈비탕"],
    ["boss", "사장님"],
    ["spicy", "매운"],
    ["How about", "어때요"],
    ["food", "음식"],
    ["hungry", "배고파요"],
    ["is", "은"],
    ["cat", "고양이"],
    ["grey", "회색"],
    ["five", "다섯"],
    ["Meow", "야옹"],
    ["nineteen", "열아홉"],
    ["friend", "친구"],
    ["thirty", "서른"],
    ["no", "아니요"],
    ["USA", "미국"],
    ["Korea", "한국"],
    ["person", "사람"],
    ["China", "중국"],
    ["Nice to meet you", "반가워요"],
    ["yes", "네"],
    ["teacher", "선생님"],
    ["doctor", "의사"],
    ["company employee", "회사원"],
    ["is", "는"],
    ["Bora", "보라"],
    ["Minjun", "민준"],
    ["Mr", "씨"],
    ["I", "저"],
    ["expensive", "비싼"],
    ["camera", "카메라"],
    ["pen", "볼펜"],
    ["heavy", "무겁다"],
    ["white", "하얀색"],
    ["book", "책"],
    ["wallet", "지갑"],
    ["bag", "가방"],
    ["is", "이에요"],
    ["new", "새"],
    ["cell phone", "핸드폰"],
    ["hot", "뜨거운"],
    ["stew", "찌개"],
    ["meat", "고기"],
    ["delicious", "맛있는"],
    ["dumpling", "만두"],
    ["japchae", "잡채"],
    ["my", "제"],
    ["tofu", "두부"],
    ["kimchi", "김치"],
    ["thank you", "감사합니다"],
    ["cake", "케이크"],
    ["bingsu", "빙수"],
    ["please", "주세요"],
    ["and", "랑"],
    ["juice", "주스"],
    ["I", "나"],
    ["hello", "안녕하세요"],
    ["coffee", "커피"],
    ["tea", "차"]
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


let currentWordDisplay = "";
let currentWordTranslation = "";

let totalMistakes = 0;
let totalSkips = 0;
let totalCorrect = 0;

let skipOnClose = false;
let reverseTranslation = false;

function openOptionsModal() {
    document.getElementById('optionsModal').style.display = 'flex';
}

function closeOptionsModal() {
    document.getElementById('optionsModal').style.display = 'none';
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

function openStatisticsModal() {
    updateStatistics()
    document.getElementById('statisticsModal').style.display = 'flex';
}

function closeStatisticsModal() {
    document.getElementById('statisticsModal').style.display = 'none';
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

function revealTranslation() {
    revealText = document.getElementById('revealText');

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

function onInputChange() {
    const inputText = this.value.toLowerCase();
    const translationInput = document.getElementById('translationInput');
    if(!isInputCorrect(inputText)) {
        translationInput.style.borderColor = 'red';
        totalMistakes++;
        return;
    }
    translationInput.style.borderColor = '#333';

    if (inputText.length !== currentWordTranslation.length) { return; }

    translatedSuccessfully();

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


function updateWord(wordMap) {
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
    reverseTranslation = false;
}

function main() {
    resetToggles();
    const wordMap = getRandomWordWithTranslation();
    updateWord(wordMap);
}
main();