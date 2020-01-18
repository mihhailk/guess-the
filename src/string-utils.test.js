import {areSimilar} from './string-utils';

describe('string utils', () => {
  it('string are similar if they are equal', () => {
    expect(areSimilar('Всадник без головы', 'Всадник без головы')).toBeTruthy();
  });

  it('string are similar if their difference is 1 symbol', () => {
    expect(areSimilar('Всадник без головы', 'Всадник бес головы')).toBeTruthy();
  });

  it('string are similar if they have same content in different case', () => {
    expect(areSimilar('Всадник без головы', 'ВСАДНИК БЕЗ ГОЛОВЫ')).toBeTruthy();
  });

  it('string are similar if they have trimmed content or not', () => {
    expect(areSimilar('Всадник без головы', ' Всадник без головы ')).toBeTruthy();
  });

  it('string are similar disregarding if they have Ё or Е', () => {
    expect(areSimilar('Всадник без головы', 'Всадник бёз головы')).toBeTruthy();
  });

  it('string are not similar if their difference is more than 1 symbol', () => {
    expect(areSimilar('Всадник без головы', 'Всадник, бес головы')).toBeFalsy();
  });
});
