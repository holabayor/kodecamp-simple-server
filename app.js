import http from 'node:http';
import fs from 'node:fs';
import { authenticate } from './auth.js';

const PORT = 8900;
const DATABASE = './memories.json';

// Create the database file if it does not exist
// and inittialise it with an empty array
if (!fs.existsSync(DATABASE)) {
  fs.writeFileSync(DATABASE, JSON.stringify([]));
}

const requestHandler = (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', () => {
    if (request.url === '/memories') {
      authenticate(request, response, () => {
        const memories = JSON.parse(fs.readFileSync(DATABASE));
        switch (request.method) {
          case 'GET':
            response.end(
              JSON.stringify({
                success: true,
                message: 'Memories retrieval successful',
                memories,
              })
            );
            break;

          case 'POST':
            const data = JSON.parse(body);
            if (data && data.content) {
              const newMemory = {
                id: memories.length + 1,
                content: data.content,
              };
              memories.push(newMemory);
              response.end(
                JSON.stringify({
                  success: true,
                  message: 'Memory added successfully',
                  memory: newMemory,
                })
              );
            } else {
              response.end(
                JSON.stringify({
                  success: false,
                  message: 'Content is required',
                })
              );
            }
            break;

          default:
            response.statusCode = 405;
            response.end(
              JSON.stringify({ success: false, message: 'Method not allowed' })
            );
        }
      });
    } else {
      response.statusCode = 404;
      response.end(
        JSON.stringify({
          success: false,
          message: `${request.method} ${request.url} not found`,
        })
      );
    }
  });
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost${PORT}`);
});
