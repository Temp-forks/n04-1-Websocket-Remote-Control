import robot from 'robotjs';
import * as stream from 'stream';

class Draw {
  wsStream!: stream.Duplex;

  action!: string;

  handle = (wsStream: stream.Duplex, action: string, value: string[]): void => {
    try {
      this.wsStream = wsStream;
      this.action = action;
      switch (this.action) {
        case 'circle': {
          this.circle(+[value]);
          break;
        }
        case 'rectangle': {
          const [width, length] = value;
          this.rectangle(+width, +length);
          break;
        }
        case 'square': {
          this.square(+[value]);
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

  circle = (radius: number) => {
    let { x, y } = robot.getMousePos();
    robot.mouseClick('left', true);
    robot.mouseToggle('down');
    const x0 = x + radius;
    const y0 = y;
    for (let i = x; i <= x0 + radius; i += 0.2) {
      x = i;
      y = this.calculateY(x, x0, y0, radius, -1);
      robot.dragMouse(x, y);
    }
    for (let i = x; i >= x0 - radius; i -= 0.2) {
      x = i;
      y = this.calculateY(x, x0, y0, radius, 1);
      robot.dragMouse(x, y);
    }
    robot.mouseToggle('up');
    this.send();
  };

  rectangle = (widht: number, length: number) => {
    let { x, y } = robot.getMousePos();
    robot.mouseClick('left', true);
    robot.mouseToggle('down');
    x += widht;
    robot.moveMouseSmooth(x, y);
    y += length;
    robot.moveMouseSmooth(x - 2, y);
    x -= widht + 2;
    robot.moveMouseSmooth(x, y - 2);
    y -= length + 2;
    robot.moveMouseSmooth(x + 2, y + 1);
    robot.mouseToggle('up');
    this.send();
  };

  square = (length: number) => {
    let { x, y } = robot.getMousePos();
    robot.mouseClick('left', true);
    robot.mouseToggle('down');
    x += length;
    robot.moveMouseSmooth(x, y);
    y += length;
    robot.moveMouseSmooth(x - 2, y);
    x -= length + 2;
    robot.moveMouseSmooth(x, y - 2);
    y -= length + 2;
    robot.moveMouseSmooth(x + 2, y);
    robot.mouseToggle('up');
    this.send();
  };

  send = (value: string = ''): void => {
    const command = `draw_${this.action}\0${value}`;
    this.wsStream.write(command, 'utf-8');
    process.stdout.write(`Done: ${command}\n`);
  };

  calculateY = (x: number, x0: number, y0: number, r: number, direction: number): number => {
    const c = -(r ** 2 - x ** 2 + 2 * x * x0 - x0 ** 2 - y0 ** 2);
    const d = Math.sqrt(y0 ** 2 - c);
    return y0 + d * direction;
  };
}

export default new Draw();
