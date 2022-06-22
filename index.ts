import { createWebSocketStream, WebSocketServer } from 'ws';
import httpServer from './src/http_server';
import handleCommand from './src/commands/handleCommand';

const HTTP_PORT = 3000;

process.stdout.write(`Start static http server on http://localhost:${HTTP_PORT}!\n`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  const wsStream = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });
  handleCommand(wsStream);
});

process.on('SIGINT', () => {
  process.stdout.write('Closing websocket...\n');
  wss.close();
  process.exit(0);
});
