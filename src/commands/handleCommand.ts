import * as stream from 'stream';
import draw from './draw';
import mouse from './mouse';
import screen from './screen';

class HandleCommand {
  wsStream!: stream.Duplex;

  handle = (wsStream: stream.Duplex): void => {
    this.wsStream = wsStream;
    this.wsStream.on('data', (data) => {
      process.stdout.write(`Recieved: ${data}\n`);
      const [command, action, ...value] = data.toString().split('_').join(' ').split(' ');
      switch (command) {
        case 'draw': {
          draw.handle(this.wsStream, action, value);
          break;
        }
        case 'mouse': {
          mouse.handle(this.wsStream, action, value);
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
