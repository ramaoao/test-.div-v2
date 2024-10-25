const questionContainer = document.querySelector('.test__questions-answers');
const progressBar = document.querySelector('.test__progress-bar-container');
const progressFill = document.querySelector('.test__progress-fill')
const resultPoints = document.querySelector('.result__points');
const resultCorrect = document.querySelector('.result__correct');
const restartButton = document.querySelector('.result__restart');
const questionNumber = document.querySelector('.test__progress-question-number');
const testContent = document.querySelector('.test__content');
const testTitle = document.querySelector('.test__title');
let optionButtons;

let activeQuestionIdx = 0;
let numPoints = 0;
let answerCollection = [];

const testData = [
    {
        question: 'Что такое операционная система?',
        options: [
            'Это просто программа на компьютере, как и другие - Word или Chrome',
            'Это показатель того, какой процессор используется на компьютере. Например, 32-битный или 64-битный',
            'Это набор взаимосвязанных программ, осуществляющих управление компьютером и взаимодействие с пользователем',
            'Нет такого понятия, есть понятие "файловая система"'
        ],
        correct: 'Это набор взаимосвязанных программ, осуществляющих управление компьютером и взаимодействие с пользователем',
    },
    {
        question: 'Является ли Android операционной системой?',
        options: [
            'Да, это такая же ОС, как и другие, просто для мобильных девайсов',
            'Нет, операционные системы бывают только для ПК',
            'Нет, Android это программа, которая ставится на операционную систему девайса. ОС на разных девайсах разные',
            'Это домашняя страничка в настройках вашего браузера'
        ],
        correct: 'Да, это такая же ОС, как и другие, просто для мобильных девайсов',
    },
    {
        question: 'Что такое процессор компьютера?',
        options: [
            'Это блок, внутри которого находится дисковод и много разъемов для монитора, клавиатуры и компьютерной мышки',
            'Это общее название всех комплектующих компьютера',
            'Это элемент компьютера, с помощью которого обрабатывается информация, находящаяся как в собственной памяти, так и в памяти других устройств',
            'Это суммарный показатель вычислительной мощности компьютера, например 2,7 ГГц'],
        correct: 'Это элемент компьютера, с помощью которого обрабатывается информация, находящаяся как в собственной памяти, так и в памяти других устройств',
    },
    {
        question: 'Какие бывают разрядности у современных процессоров?',
        options: [
            '32 и 64 бита', 
            '12 и 32 бита', 
            '15 и 32 бита', 
            '86 и 64 бита'],
        correct: '32 и 64 бита',
    },
    {
        question: 'Какой тип процессора чаще всего используют мобильные девайсы?',
        options: [
            'iOS использует Intel, остальные используют AMD',
            'Чаще всего используют Intel',
            'Чаще всего используют AMD',
            'Чаще всего используют ARM'
        ],
        correct: 'Чаще всего используют ARM',
    },
    {
        question: 'Для чего компьютеру нужна RAM?',
        options: [
            'Для быстрого доступа к данным',
            'Для долгосрочного хранения данных',
            'Для правильной фрагментации памяти',
            'Для дефрагментации данных'
        ],
        correct: 'Для быстрого доступа к данным',
    },
    {
        question: 'Чем отличается HDD от SSD?',
        options: [
            'HDD - это твердотельный накопитель без подвижных частей. Более дешевый, чем SSD. HDD работает быстрее',
            'HDD - это твердотельный накопитель без подвижных частей. Более дорогой, чем SSD. HDD работает быстрее',
            'SSD - это твердотельный накопитель без подвижных частей. Более дешевый, чем HDD. SSD работает быстрее',
            'SSD - это твердотельный накопитель без подвижных частей. Более дорогой, чем HDD. SSD работает быстрее'
        ],
        correct: 'SSD - это твердотельный накопитель без подвижных частей. Более дорогой, чем HDD. SSD работает быстрее',
    },
    {
        question: 'Как отличаются между собой USB?',
        options: [
            'Бывают только USB 2.0 и 3.2',
            'Бывают только micro-USB и mini-USB',
            'USB отличаются по пропускной способности (micro-USB, mini-USB, lightning и т.д.) и форме (USB 2.0, USB 3.2).',
            'USB отличаются по форме (micro-USB, mini-USB, lightning и т.д.) и пропускной способности (USB 2.0, USB 3.2)'
        ],
        correct: 'USB отличаются по форме (micro-USB, mini-USB, lightning и т.д.) и пропускной способности (USB 2.0, USB 3.2)',
    },
    {
        question: 'Какой файловой системы не существует?',
        options: [
            'Fat', 
            'NTFS', 
            'APFS', 
            'BolSFS'
        ],
        correct: 'BolSFS',
    },
]

const shuffledQuestions = testData.sort(() => Math.random() - 0.5);

function displayQuestion() {
    const currentQuestion = shuffledQuestions[activeQuestionIdx];
    currentQuestion.options.sort(() => Math.random() - 0.5);
    
    questionContainer.innerHTML = 
    `<p class="test__question">${currentQuestion.question}</p>
        <ul class="test__options-list">
            ${currentQuestion.options.map(options => `
                <li class="test__options-item">
                    <div class="test__circle"></div>
                    <button class="test__option-button">${options}</button>
                </li>
            `).join('')}
        </ul>
    `;

    optionButtons = document.querySelectorAll('.test__option-button');
    optionButtons.forEach(button => {
        button.addEventListener('click', checkingAnswers);
    });

    const circlesClick = document.querySelectorAll('.test__circle');
    circlesClick.forEach(circle => {
        circle.addEventListener('click', (event) => {
            const button = event.target.nextElementSibling;
            checkingAnswers({target: button});
        });
    });

    updateProgress();
}

function updateProgress() {
    const progressPercent = (activeQuestionIdx / (testData.length - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;

    if(activeQuestionIdx === 0) {
        questionNumber.style.opacity = '0';
    }
    else {
        questionNumber.style.opacity = '1';
        questionNumber.style.left = `${progressPercent}%`;
        questionNumber.innerText = activeQuestionIdx + 1;
    }

    if(activeQuestionIdx === testData.length - 1) {
        questionNumber.style.opacity = '0';
    }
}

function checkingAnswers(event) {
    const clickedOption = event.target;
    const selectedAnswer = clickedOption.innerText;
    const correctAnswers = testData[activeQuestionIdx].correct;
    optionButtons = document.querySelectorAll('.test__option-button');

    const selectedCircle = clickedOption.previousElementSibling;
    selectedCircle.classList.add('selected');

    answerCollection.push({
        question: testData[activeQuestionIdx].question,
        selected: selectedAnswer,
        isCorrect: selectedAnswer === correctAnswers
    });

    optionButtons.forEach(button => {
        button.removeEventListener('click', checkingAnswers);
    });

    activeQuestionIdx++
    
    if(activeQuestionIdx < testData.length) {
        setTimeout(displayQuestion, 1000);
    }
    else {
        setTimeout(() => {
            progressFill.style.width = '100%';
            displayResults();
         }, 1000);
    }
}

function displayResults() {
    questionContainer.classList.add('hidden');
    progressBar.classList.add('hidden');
    testContent.classList.add('hidden');
    testTitle.classList.add('hidden');
    restartButton.classList.remove('hidden');
    
    resultMessage = '';
    if (numPoints === testData.length) {
        resultMessage = '<p class="result__title">Поздравляем!</p><br><p class="result__answer">Вы правильно ответили на все вопросы.<br>Вы действительно отлично разбираетесь в IT.</p>';
    }
    else if (numPoints > testData.length / 2) {
        resultMessage = `<p class="result__title">Хороший результат!</p><br><p class="result__answer">Вы ответили правильно на ${numPoints} вопрос(ов).<br>Так держать!</p>`;
    }
    else if (numPoints > 0) {
        resultMessage = `<p class="result__title">Плохо!</p><br><p class="result__answer">Вы ответили правильно на ${numPoints} вопрос(ов).<br>Вам нужно подучить теорию.</p>`;
    }
    else {
        resultMessage = '<p class="result__title">Упс :(</p><br><p class="result__answer">Вы неправильно ответили на все вопросы.<br>Нужно подучить теорию.</p>';
    }
    resultPoints.innerHTML = resultMessage

    resultCorrect.innerHTML = answerCollection.map(answer => `
        <div class="result__box ${answer.isCorrect ? 'correct' : 'incorrect'}">
            <p class="result__question">${answer.question}</p>
            <p class="result__selected">${answer.selected}</p>
        </div>
    `).join('');
}

restartButton.addEventListener('click', () => {
    questionContainer.classList.remove('hidden');
    progressBar.classList.remove('hidden');
    testContent.classList.remove('hidden');
    testTitle.classList.remove('hidden');
    restartButton.classList.add('hidden');
    resultCorrect.classList.add('hidden');
    questionNumber.style.left = '0';
    resultPoints.innerHTML = '';
    resultCorrect.innerHTML = '';
    answerCollection = [];
    activeQuestionIdx = 0;
    numPoints = 0;

    displayQuestion();
});

displayQuestion();