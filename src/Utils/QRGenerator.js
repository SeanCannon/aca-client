
// ACNL data layout.
//
// QR codes are blocks of 540 bytes each, providing this data in sequence:
//
// 0x 00 - 0x 29 ( 42) = Pattern Title
// 0x 2A - 0x 2B (  2) = User ID
// 0x 2C - 0x 3F ( 20) = User Name
// 0x 40 - 0x 41 (  2) = Town ID
// 0x 42 - 0x 55 ( 20) = Town Name
// 0x 56 - 0x 57 (  2) = Unknown A (values are usually random - changing seems to have no effect)
// 0x 58 - 0x 66 ( 15) = Color code indexes
// 0x 67         (  1) = Unknown B (value is usually random - changing seems to have no effect)
// 0x 68         (  1) = Unknown C (seems to always be 0x0A or 0x00)
// 0x 69         (  1) = Pattern type (see below)
// 0x 6A - 0x 6B (  2) = Unknown D (seems to always be 0x0000)
// 0x 6C - 0x26B (512) = Pattern Data 1 (mandatory)
// 0x26C - 0x46B (512) = Pattern Data 2 (optional)
// 0x46C - 0x66B (512) = Pattern Data 3 (optional)
// 0x66C - 0x86B (512) = Pattern Data 4 (optional)
// 0x86C - 0x86F (  4) = Zero padding (optional)
//
// Pattern types:
// 0x00 = Fullsleeve dress (pro)
// 0x01 = Halfsleeve dress (pro)
// 0x02 = Sleeveless dress (pro)
// 0x03 = Fullsleeve shirt (pro)
// 0x04 = Halfsleeve shirt (pro)
// 0x05 = Sleeveless shirt (pro)
// 0x06 = Hat with horns
// 0x07 = Hat
// 0x08 = Standee (pro)
// 0x09 = Plain pattern (easel)


// For QR generation
import { QRCodeEncoder, QRCodeDecoderErrorCorrectionLevel } from '@zxing/library';

async function generateQR(blob) {
  const bytes = new ArrayBuffer(620);
  const dataBytes = new Uint8Array(bytes, 0, 620);
  const dataView = new DataView(bytes, 0, 620);

  const utf16Encode = (offset, len, str) => {
    for (let i = 0; i < len / 2; i++) {
      if (i >= str.length) {
        dataView.setUint16(offset + i * 2, 0, true);
      } else {
        dataView.setUint16(offset + i * 2, str.charCodeAt(i), true);
      }
    }
  };

  // Title
  utf16Encode(0, 40, 'Unknow');
  // Creator
  utf16Encode(0x2C, 18, 'Unknow');
  dataView.setUint16(0x2A, 0, true);
  // Town
  utf16Encode(0x42, 18, 'Unknow');
  dataView.setUint16(0x40, 0, true);
  // Unknow A
  dataView.setUint16(0x56, 0x3119, true);
  // Palette
  for (let i = 0; i < 15; i++) {
    dataBytes[0x58 + i] = 0x10 * i + 0xF;
  }
  // Unknow B
  dataBytes[0x67] = 0xCC;
  // Unkbow C
  dataBytes[0x68] = 0x0A;
  // Pattern Type
  dataBytes[0x69] = 9;
  // Unknow D
  dataView.setUint16(0x6A, 0x0000, true);

  const offset = 0x6C;
  let pos = 0;
  const blobDataBytes = new Uint8Array(blob);
  for (let i = offset; i < bytes.byteLength; i++) {
    dataBytes[i] = blobDataBytes[pos];
    // eslint-disable-next-line no-plusplus
    pos++;
  }

  dataBytes[0x42 + 18] = 0;
  dataBytes[0x42 + 19] = 0;
  // End creator with valid gender and zero pad
  if (dataBytes[0x2C + 18] > 1) { dataBytes[0x2C + 18] = 0; }
  dataBytes[0x2C + 19] = 0;
  // End title with wide-zero
  dataBytes[40] = 0;
  dataBytes[41] = 0;

  const qrCanvas = document.createElement('canvas');
  const width = 240;
  const height = 270;

  qrCanvas.width = width;
  qrCanvas.height = height;
  // Ensure blitted images are not smoothed ( = keep pixel look!)
  const ctx = qrCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const code = QRCodeEncoder.encode(new Uint8Array(bytes, 0, 620), QRCodeDecoderErrorCorrectionLevel.M, null);

  // Calculate sizes for various bits
  const spc = 8;
  let sQR = 0;
  if (code.getMatrix().getWidth() * 2 > sQR) {
    sQR = code.getMatrix().getWidth() * 2;
  }
  // Draws the passed QRCode with top left corner on the x/y location.
  // We access the encoder directly and use a custom drawing implementation, because going through a SVG is blergh.
  const qrToCanvas = (QR, x, y) => {
    const pixelSize = 2;
    const input = QR.getMatrix();
    const qrSize = input.getWidth();// We assume width==height. It should be...
    // Draw white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - spc, y - spc, qrSize * pixelSize + 2 * spc, qrSize * pixelSize + 2 * spc);
    // Draw all black blocks (BG is already white, after all!)
    ctx.fillStyle = '#000000';
    for (let inputY = 0; inputY < qrSize; inputY++) {
      for (let inputX = 0; inputX < qrSize; inputX++) {
        if (input.get(inputX, inputY) === 1) {
          ctx.fillRect(x + inputX * pixelSize, y + inputY * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };


  // Write QR code to canvas
  const QRx = Math.round(width / 2);// center x for QR codes
  const QRy = Math.round(height / 2);// center y for QR codes
  qrToCanvas(code, QRx - sQR / 2, QRy - sQR / 2);
  return qrCanvas.toDataURL('image/png');
}

export {
  generateQR
};
