export function setRange(max = 100, min = 1, step = 1) {
  return {type: 'range', min: min, max: max, step: step};
}

