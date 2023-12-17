const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    
    if (req.url.includes('answer')) {

        const chunks = [];
        let data;
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            data = JSON.parse(Buffer.concat(chunks).toString());
            if (data == undefined) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No data\n');
            } else {
                let result = calculate(data.questions, data.answers);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify(result));
            }
        });

    } else if (req.url.match(/.css/)) {
        
        let css = path.join(__dirname, req.url);
        fs.readFile(css, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });

    } else if (req.url.match(/.js/)) {
        const url = req.url.split('/');
        const file = url[url.length - 1]; 
        let js = path.join(__dirname, "public", file);

        fs.readFile(js, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.end(data);
            }
        });
    } else if (req.url.includes("Quiz")) { 
        const url = req.url.split('/');
        const file = url[url.length - 1];
        fs.readFile(`pages/${file}.html`, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.setHeader('Content-Type', "text/html");
                res.end(data);
            }
        })

    } else {

        fs.readFile('pages/index.html', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.setHeader('Content-Type', "text/html");
                res.end(data);
            }
        });

    }
});

function calculate(questions, answers,) {
    let quizResult = {questions: 0, correct: 0};
    for (let index in answers) {
        let values = questions[index].split(' ');
        let firstValue = values[0];
        let secondValue = values[2];
        let operator = values[1];
        let result;
        switch (operator) {
            case '+':
                result = parseFloat(firstValue) + parseFloat(secondValue);
                break;
            case '-':
                result = parseFloat(firstValue) - parseFloat(secondValue);
                break;
            default:
                result = null;
                break;
        }
        if (result == answers[index]) {
            quizResult.correct += 1;
        }
        quizResult.questions += 1;
    }
    return quizResult;
}

server.listen(3000, () => {
    console.log('listening on PORT 3000');
});