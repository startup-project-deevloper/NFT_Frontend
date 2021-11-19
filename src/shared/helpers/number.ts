export const roundFloat = (value: number, precision: number) => parseFloat(value.toFixed(precision));

export const getCorrectNumber = (value: number, precision?: number) => {
  let _value: any = value
  if (precision)
    _value = _value.toFixed(precision)
  return _value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};