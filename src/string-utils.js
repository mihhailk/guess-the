import levenshtein from 'js-levenshtein';

export const maskedInput = (item) => {
  return item.split(" ").map((word) => {
    return word.replace(/./gi, '_ ');
  }).join("\xa0\xa0\xa0");
};

export const areSimilar = (one, other) => {
  return levenshtein(prepareString(one), prepareString(other)) < 2;
};

const prepareString = (value) => {
  return value ? value.trim().toUpperCase().replace("Ё", "Е") : '';
};
