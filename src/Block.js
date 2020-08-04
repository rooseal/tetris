let previousType;

export class Shape {
  constructor (variations, color, type) {
    this.x = 0;
    this.y = -2;
    this.variations = variations;
    this.currentShape = 0;
    this.type = type;
    this.color = color || '#f9e';
  }

  moveLeft () {
    this.x--;
  }

  moveRight () {
    this.x++;
  }

  moveDown () {
    this.y++;
  }

  getNextRotation () {
    return (this.currentShape + 1) % this.variations.length;
  }

  getPreviousRotation () {
    return (this.currentShape + 3) % this.variations.length;
  }

  rotate (isClockwise = true) {
    this.currentShape = isClockwise ? this.getNextRotation() : this.getPreviousRotation();
  }

  // The param here represents a delta
  // You can pass a delta for movement and rotation to check where the blocks
  // will end up next for a given action
  getBlocks ({ x = 0, y = 0, rotate = false } = {}) {
    return this.variations[rotate ? this.getNextRotation() : this.currentShape].map(block => {
      return {x: block.x + this.x + x, y: block.y + this.y + y};
    });
  }

  getBaseBlocks () {
    return this.variations[0];
  }
}

export function ShapeO () {
  return new Shape(
    [
      [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
    ],
    '#f4A460',
    'o'
  );
}

export function ShapeI () {
  return new Shape(
    [
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
      [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
      [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
    ],
    '#48d1cc',
    'i'
  );
}

export function ShapeJ () {
  return new Shape(
    [
      [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
      [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }],
    ],
    '#4169e1',
    'j'
  );
}

export function ShapeL () {
  return new Shape(
    [
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 0 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 0 }],
    ],
    '#ffbc00',
    'l'
  );
}

export function ShapeS () {
  return new Shape(
    [
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
      [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
      [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    ],
    '#32cd32',
    's'
  );
}

export function ShapeZ () {
  return new Shape(
    [
      [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
      [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
    ],
    '#dc143c',
    'z'
  );
}

export function ShapeT () {
  return new Shape(
    [
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }],
      [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
      [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    ],
    '#940dd3',
    't'
  );
}

export const shapes = [
  ShapeO,
  ShapeI,
  ShapeJ,
  ShapeL,
  ShapeS,
  ShapeZ,
  ShapeT
];

export function getRandomShape () {
  // Randomize the starting parameters for the new block
  let randomBlockIndex;

  do {
    randomBlockIndex = Math.floor(Math.random() * (shapes.length - 0) + 0);
  } while(randomBlockIndex === previousType);
  // const randomX = Math.floor(Math.random() * (7 - 1) + 1);
  // const randomRotations = Math.floor(Math.random() * (5 - 0) + 0);

  previousType = randomBlockIndex;

  // Construct the block with the random parameters
  const newShape = shapes[randomBlockIndex]();

  for(let i = 0; i < 2; i++) {
    newShape.moveRight();
  }

  // for(let i = 0; i < randomRotations; i++) {
  //   newShape.rotate();
  // }

  // Return the new random constructed block
  return newShape;
}
