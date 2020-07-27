import { blockSize, width, height } from './variables';

export function drawBackground (ctx) {
  // Draw white background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  // Draw grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ccc';

  // for (let i = 1; i <= 10; i++) {
  //   const x = (blockSize + 1) * i + 0.5;
  //   ctx.moveTo(x, 0);
  //   ctx.lineTo(x, height);
  //   ctx.stroke();
  // }

  // for (let i = 1; i <= 20; i++) {
  //   const y = (blockSize + 1) * i + 0.5;
  //   ctx.moveTo(0, y);
  //   ctx.lineTo(width, y);
  //   ctx.stroke();
  // }
}

export function drawStaple (ctx, blockStaple) {
  blockStaple.forEach((row, i) => {
    row.forEach((block, j) => {
      if (block !== null) {
        drawSquare(ctx, j, i, block);
      }
    })
  });
}

export function drawGameOver (ctx) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(10, (height / 2) - 25, width - 20, 50);
  ctx.fillStyle = '#f9e';
  ctx.font = 'bold 48px arial';
  ctx.fillText('Game Over', 15, (height / 2) + 15);
}

export function drawSquare(ctx, row, column, color = '#f9e') {
  ctx.fillStyle = color;

  const x1 = (blockSize + 1) * (row) //+ (row === 0 ? 0.5 : 1.5);
  const y1 = (blockSize + 1) * (column)// + (column === 0 ? 0.5 : 1.5);

  ctx.fillRect(x1, y1, blockSize - (row === 0 ? 0 : 1), blockSize - (column === 0 ? 0 : 1));
}

export function drawShape (ctx, blocks, color = '#f9e') {
  blocks.forEach(block => {
    drawSquare(ctx, block.x, block.y, color);
  });
}