import robot from 'robotjs';
import * as stream from 'stream';

class Mouse {
  wsStream!: stream.Duplex;

  action!: string;

  handle = (ws: stream.Duplex, action: string, value: string[]) => {
    try {
      this.wsStream = ws;
      this.action = action;
      const number = parseInt(value[0], 10);
      switch (this.action) {
        case 'up': {
          this.up(number);
          break;
        }
        case 'right': {
          this.right(number);
          break;
        }
        case 'down': {
          this.down(number);
          break;
        }
        case 'left': {
          this.left(number);
          break;
        }
        case 'position': {
          this.position();
          break;
        }
        default: {
          break;
        }
      }
    } catch {
      process.stdout.write('ERROR\n');
    }
  };

  up = (value: number): void => {
    const { x, y } = robot.getMousePos();
    robot.moveMouse(x, y - value);
    this.send();
  };

  right = (value: number): void => {
    const { x, y } = robot.getMousePos();
    robot.moveMouse(x + value, y);
    this.send();
  };

  down = (value: number): void => {
    const { x, y } = robot.getMousePos();
    robot.moveMouse(x, y + value);
    this.send();
  };

  left = (value: number): void => {
    const { x, y } = robot.getMousePos();
    robot.moveMouse(x - value, y);
    this.send();
  };

  position = (): void => {
    const { x, y } = robot.getMousePos();
    const value = ` ${x},${y}`;
    this.send(value);
  };

  send = (value: string = ''): void => {
    const command = `mouse_${this.action}${value}\0`;
    this.wsStream.write(command, 'utf-8');
    process.stdout.write(`Done: ${command}\n`);
  };
}

export default new Mouse();
