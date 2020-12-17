export const generateSKU = () => {
  return (
    '#' +
    Array(9)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(36))
      .join('')
      .toString()
      .toUpperCase()
  );
};
