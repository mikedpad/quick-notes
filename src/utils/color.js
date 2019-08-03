/* eslint-disable no-bitwise */
const randomColor = () => `#${((Math.random() * 0xffffff) << 0).toString(16)}`;

export { randomColor };
