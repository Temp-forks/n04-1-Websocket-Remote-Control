import * as stream from 'stream';
import draw from './draw';
import mouse from './mouse';
import screen from './screen';

class HandleCommand {
  wsStream!: stream.Duplex;

  handle = (wsStream: stream.Duplex): void => {
    this.wsStream = wsStream;
    this.wsStream.on('data', (data) => {
      const [command, type, ...value] = data.toString().split('_').join(' ').split(' ');
      switch (command) {
        case 'draw': {
          draw.handle(this.wsStream, type, value);
          break;
        }
        case 'mouse': {
          mouse.handle(this.wsStream, type, value);
          break;
        }
        case 'prnt': {
          screen.handle(this.wsStream);
          break;
        }
        default: {
          break;
        }
      }
    });
  };
}

export default new HandleCommand().handle;
