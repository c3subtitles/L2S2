if (!Number) {
  global.Number = {
    isInteger(value) {
      return typeof value === 'number' && 
      isFinite(value) &&
      Math.floor(value) === value;
    },
    parseInt,
  };
}
