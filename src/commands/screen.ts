import robot from 'robotjs';
import Jimp from 'jimp';
import * as stream from 'stream';

class Screen {
  wsStream!: stream.Duplex;

  handle(wsStream: stream.Duplex) {
    this.wsStream = wsStream;
    const { x, y } = robot.getMousePos();
    const imageSize = 200;
    const img = robot.screen.capture(x - imageSize / 2, y - imageSize / 2, imageSize, imageSize);

    for (let i = 0; i < img.image.length; i += 1) {
      if (i % 4 === 0) {
        [img.image[i], img.image[i + 2]] = [img.image[i + 2], img.image[i]]; // bgr -> rgb color
      }
    }

    const image = new Jimp({
      data: img.image,
      width: img.width,
      height: img.height,
    });
    image.getBase64(Jimp.MIME_PNG, (error: Error | null, imgString: string) => {
      wsStream.write(`prnt_scrn ${imgString.split(',')[1]}\0`, 'utf-8');
    });
  }
}

export default new Screen();
