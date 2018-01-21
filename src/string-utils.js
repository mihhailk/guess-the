export const maskedInput = (item) => {
  return item.split(" ").map((word) => {
    return word.replace(/./gi, '_ ');
  }).join("\xa0\xa0\xa0");
};

export const prepareString = (value) => {
  return value ? value.trim().toUpperCase().replace("Ё", "Е") : '';
};
