export const toFixedDigits = (value: number | string, digits: number = 5) => {
  const factor = 10 ** digits;
  const numValue = typeof value === "string" ? Number(value) : value;

  return parseFloat((Math.round(numValue * factor) / factor).toFixed(digits));
};
