const http = require('http')

const server = http.createServer((request, response) => {
    switch (request.url){
        case '/home': {
            const start = new Date()
            while(new Date() - start < 3000){
                console.log(new Date() - start)
            }
            const data = 'best free online course'
            response.write(data)
            response.end()
            break;
        }
        default: {
            response.write('404 not found')
            response.end()
        }
    }
})

server.listen(3003)