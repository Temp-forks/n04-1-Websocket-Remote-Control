import { createWebSocketStream, WebSocketServer } from 'ws';
import httpServer from './src/http_server';
import handleCommand from './src/commands/handleCommand';

const HTTP_PORT = 3000;

const WS_PORT = 8080;

process.stdout.write(`Start static http server on http://localhost:${HTTP_PORT}!\n`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  process.stdout.write(`Websocket is ran on port ${WS_PORT}\n`);
  const wsStream = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });
  handleCommand(wsStream);
  ws.on('close', () => {
    process.stdout.write('Websocket closed. \n');
  });
  process.on('SIGINT', () => {
    process.stdout.write('Closing websocket server...\n');
    ws.close();
    wss.close();
    process.exit(0);
  });
});
