let index = 0;
let questions = [];
let answers = [];

const form = document.getElementById('form');
const next = document.getElementById('next');

document.addEventListener('DOMContentLoaded', () => {
    createQuestion();
})

document.addEventListener('submit', (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    handleSubmit();
});

next.addEventListener('click', evt => {
    evt.preventDefault();
    evt.stopPropagation();

    createQuestion();
})

function random() {
    return Math.round(Math.random() * 10);
}

function randomOperator() {
    let num = random();
    return num % 2 == 0 ? '+' : '-';
}

function createQuestion() {
    console.log('createQuestion');
    const firstValue = random();
    const secondValue = random();
    const operator = randomOperator();

    let question = firstValue + ' ' + operator + ' ' + secondValue + ' = ';
    if (index > 0) {
        const input = document.getElementById('answer');
        answers.push(input.value);
        input.value = '';
        questions
    }
    questions.push(question);
    index = index + 1;

    const el = document.getElementById('question');
    el.innerText = question;
}

async function handleSubmit() {
    if (document.getElementById('answer').value.length > 0) {
        createQuestion();
    }

    let result = await fetch('/answer', {
        method: 'POST', body: JSON.stringify({
            questions,
            answers
        })
    });

    result = JSON.parse(await result.text());

    const header = document.getElementById('header');
    header.innerText = 'Quiz results'; 
    
    const quizResult = document.getElementById('result');
    quizResult.innerHTML = '';

    const text = document.createElement('h2');
    console.log(result);
    text.innerText = 'Right answers ' + result.correct + ' out ' + result.questions;
    quizResult.appendChild(text);

    for (let index in answers) {
        let str = +index + 1 + '. ' + questions[index] + answers[index];
        let answer = document.createElement('span');
        answer.innerText = str;
        quizResult.appendChild(answer);
    }

    form.remove();
}