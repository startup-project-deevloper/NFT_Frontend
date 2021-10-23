export const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

export const limitOfDecimals = (number: number) => {
  if (countDecimals(number) > 5) return number.toFixed(2);
  return number;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const toDecimalFormat = (currency, decimalPlace = 8) =>
  Intl.NumberFormat("en-US", { style: "decimal", maximumFractionDigits: decimalPlace }).format(currency);

export const parsePrice = (price: string): string => {
  let priceList = price.split(" ");

  if (priceList.length === 1) {
    return `${parseFloat(priceList[0])}`;
  } else if (priceList.length > 1) {
    if (isNaN(parseFloat(priceList[0]))) {
      return `${priceList[0]} ${parseFloat(priceList[1])}`;
    } else {
      return `${parseFloat(priceList[0])} ${priceList[1]}`;
    }
  }

  return price;
};

export function getUnixEpochTimeStamp(value) {
  return Math.floor(value.getTime() / 1000);
}

export const sanitizeIfIpfsUrl = url => {
  if (!url) {
    return null;
  }
  if (url.includes("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
};

export const roundFloat = (value: number, precision: number) => parseFloat(value.toFixed(precision));

export const typeUnitValue = (value: any, precision: number) => {
    let num_str = value.toString()
    let int_str = num_str.split('.')[0]
    let direction = true
    if (int_str[0] == '-') {
        direction = false
        int_str = int_str.split('-')[1]
    }
    if (int_str.length > 6) {
        return `${direction ? '' : '-'}${int_str.substring(0, int_str.length - 6)},${int_str.substring(int_str.length - 6, int_str.length - 6 - 3)}M`
    } else if (int_str.length > 5) {
        return `${direction ? '' : '-'}${int_str.substring(0, int_str.length - 3)},${int_str.substring(int_str.length - 3, int_str.length)}K`
    } else if (int_str.length >= 4) {
        return `${direction ? '' : '-'}${int_str.substring(0, int_str.length - 3)},${int_str.substring(int_str.length - 3, int_str.length)}`
    } else {
        return roundFloat(Number(value), precision)
    }
}