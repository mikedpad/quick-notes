function clamp(min, max, value) {
  const newValue = Math.min(max, Math.max(min, value));
  // console.log(`Value: ${value} ... Min/Max: ${min}/${max} ... New Value: ${newValue}`);

  return newValue;
}

export default clamp;
