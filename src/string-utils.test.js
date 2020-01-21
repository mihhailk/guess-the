import {areSimilar} from './string-utils';

describe('string utils', () => {
  it('strings are similar if they are equal', () => {
    expect(areSimilar('Всадник без головы', 'Всадник без головы')).toBeTruthy();
  });

  it('strings are similar if their difference is 1 symbol', () => {
    expect(areSimilar('Всадник без головы', 'Всадник бес головы')).toBeTruthy();
  });

  it('strings are similar if they have same content in different case', () => {
    expect(areSimilar('Всадник без головы', 'ВСАДНИК БЕЗ ГОЛОВЫ')).toBeTruthy();
  });

  it('strings are similar if they have trimmed content or not', () => {
    expect(areSimilar('Всадник без головы', ' Всадник без головы ')).toBeTruthy();
  });

  it('strings are similar disregarding if they have Ё or Е', () => {
    expect(areSimilar('Всадник без головы', 'Всадник бёз головы')).toBeTruthy();
  });

  it('strings are not similar if their difference is more than 1 symbol', () => {
    expect(areSimilar('Всадник без головы', 'Всадник, бес головы')).toBeFalsy();
  });

  it('strings containing 1 symbol are not similar if their difference is 1 symbol', () => {
    expect(areSimilar('V', 'A')).toBeFalsy();
  });
});
