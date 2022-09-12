import net from 'net';

const logOut = (...args) => console.log('[server]', ...args);

export const serve = (host, port) => {
  const server = net.createServer((socket) => {
    logOut('Connected');
    socket.on('data', (data) => {
      const dataStr = data.toString();
      logOut('Got data:', dataStr);
      const lines = dataStr.split('/n');
      const startLine = lines[0];
      const [method, path] = startLine.split(' ');
      if (method == 'GET' && path == '/') {
        const body = `<html>
        <main>
        <h1>Welcome to my site</h1>
        </main>
        </html>`;
        const getRequest = `HTTP/1.1 200 Ok
Content-Length: ${body.length}
Content-Type: text/html; charset=UTF-8

${body}`;
        socket.write(getRequest);
      } else if (method == 'GET' && path == '/posts') {
        const json = `[
    {
        "id": "1",
        "name": "Joe",
        "type": "human"
    },
    {
        "id": "2",
        "name": "Fuzzy",
        "type": "cat"
    },
    {
        "id": 3,
        "name": "Bee-borp",
        "type": "!@#%"
    }
]`;
        const getJSON = `HTTP/1.1 200 Ok
Content-Length: ${json.length}
Content-Type: application/json

${json}`;
        socket.write(getJSON);
      } else if (method == 'POST' && path == '/mail') {
      }
    });
  });
  server.listen(port, host, () => {
    logOut('Server is up');
  });
};
