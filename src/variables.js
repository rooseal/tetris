export const baseSpeed = 16;

export const blockSize = 30;

export const width = 309;
export const height = width * 2;

export const keyBindings = {
  moveLeft: 37,
  moveRight: 39,
  moveDown: 40,
  rotate: 38
}

export const getPoints = (level, lines) => {
  switch (lines) {
    case 1:
      return 40 * (level + 1);
    case 2:
      return 100 * (level + 1);
    case 3:
      return 300 * (level + 1);
    case 4:
      return 1200 * (level + 1);
  }
}

export const calculateGravityTimer = (level) => {
  if (level <= 8) {
    return 48 - (5 * level);
  }

  if (level === 9) {
    return 6;
  }

  if (level > 9 && level < 13) {
    return 5;
  }

  if (level >= 13 && level < 16) {
    return 4;
  }

  if (level >= 16 && level < 19) {
    return 3;
  }

  if (level >= 19 && level < 29) {
    return 2;
  }

  if (level >= 29) {
    return 1;
  }
}