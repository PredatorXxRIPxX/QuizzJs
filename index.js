const url = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';
const content = document.getElementById('content');
const userInput = document.getElementById('userInput');

async function getData(myurl) {
    try {
        const response = await fetch(myurl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

function getRandomRank() {
    const medaille = ['🥇', '🥉', '🥈'];
    return medaille[Math.floor(Math.random() * 3)];
}

function createQuestionElement(rank, question, correct_answer) {
    let dom = `<div class="questions">
        <div class="noti" onclick="toggleAnswerDisplay(event)">
            <p>${rank}</p>
        </div>
        <div class="detail">
            <p>${question}</p>
            <p class='hide'>${correct_answer}</p>
        </div>
    </div>`;
    return dom;
}

function displayQuestions(data) {
    const questions = data.results.map(element => {
        element['Rank'] = getRandomRank();
        return element;
    });

    const domElements = questions.map(curr =>
        createQuestionElement(curr.Rank, curr.question, curr.correct_answer)
    );

    return domElements;
}

function toggleAnswerDisplay(event) {
    const parent = event.target.parentNode.parentNode;
    let answer = parent.querySelector('.hide');
    parent.style.height = '50px';

    setTimeout(() => {
        if (answer) {
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        }
    }, 1000);
}

userInput.addEventListener('input', () => {
    let text = userInput.value.trim().toLowerCase();
    let myArrayData = dataCollection.results;
    let result = myArrayData.filter(
        element =>
            element.question.toLowerCase().includes(text) ||
            element.Rank.toLowerCase() === text
    ).map(element => createQuestionElement(element.Rank, element.question, element.correct_answer));

    content.innerHTML = result.join('');
});

let dataCollection;

window.addEventListener('load', async () => {
    try {
        dataCollection = await getData(url);
        const domElements = displayQuestions(dataCollection);
        content.innerHTML = domElements.join('');
    } catch (error) {
        console.error(error);
    }
})