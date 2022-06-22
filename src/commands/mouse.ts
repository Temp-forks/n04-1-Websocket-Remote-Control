import robot from 'robotjs';
import WebSocket from 'ws';

class Mouse {
  ws!: WebSocket;

  type!: string;

  handle = (ws: WebSocket, type: string, value: string[]) => {
    this.ws = ws;
    this.type = type;
    const number = parseInt(value[0], 10);
    switch (this.type) {
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
    const command = `mouse_${this.type}${value}`;
    this.ws.send(command);
  };
}

export default new Mouse();
