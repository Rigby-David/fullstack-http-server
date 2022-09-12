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
        socket.write(`HTTP/1.1 200 Ok
Content-Length: ${body.length}
Content-Type: text/html; charset=UTF-8

${body}`);
      } else if (method == 'GET' && path == '/posts') {
        socket.write(data.toString().toUpperCase());
      }
    });
  });
  server.listen(port, host, () => {
    logOut('Server is up');
  });
};
