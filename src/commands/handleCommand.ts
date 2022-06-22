import { WebSocket } from 'ws';
import draw from './draw';
import mouse from './mouse';
import screen from './screen';

class HandleCommand {
  handle = (ws: WebSocket, data: string): void => {
    const [command, type, ...value] = data
      .toString()
      .split('_')
      .join(' ')
      .split(' ');
    switch (command) {
      case 'draw': {
        draw.handle(ws, type, value);
        break;
      }
      case 'mouse': {
        mouse.handle(ws, type, value);
        break;
      }
      case 'prnt': {
        screen.handle(ws);
        break;
      }
      default: {
        break;
      }
    }
  };
}

export default new HandleCommand().handle;
