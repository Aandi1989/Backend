const http = require('http');
const fs = require('fs');

let requestCount = 0;

const server = http.createServer((request, response) => {
    if (request.url === '/favicon.ico') {
        // Обслуживание иконки
        fs.readFile('favicon.ico', (err, data) => {
            if (err) {
                response.writeHead(404);
                response.end();
                return;
            }

            response.writeHead(200, {'Content-Type': 'image/x-icon'});
            response.end(data);
        });
        return;
    }

    requestCount++;

    switch (request.url) {
        case '/students':
            response.write('STUDENTS');
            break;
        case '/courses':
            response.write('FRONT + BACK');
            break;
        default:
            response.write('404 not found');
    }

    response.write('Hello world!' + requestCount);
    response.end();
});

server.listen(3003);
