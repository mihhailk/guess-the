import React from 'react';
import {mount} from 'enzyme';
import {PageHeader} from './PageHeader';
import {Badge, NavbarBrand} from 'reactstrap';

describe('PageHeader', () => {
  it('renders game statistics', () => {
    const app = mount(<PageHeader numberOfAuthorsLeft={9} totalNumberOfAnswers={8} totalNumberOfCorrectAnswers={7}/>);

    const badges = app.find(Badge);
    expect(badges.at(0).text()).toEqual("Осталось авторов: 9");
    expect(badges.at(1).text()).toEqual("Всего: 8");
    expect(badges.at(2).text()).toEqual("Верных: 7");
  });

  it('do not render game statistics when no authors left', () => {
    const app = mount(<PageHeader numberOfAuthorsLeft={-1} totalNumberOfAnswers={8} totalNumberOfCorrectAnswers={7}/>);

    const badges = app.find(Badge);
    expect(badges.length).toEqual(0);
  });

  it('renders navigation bar brand', () => {
    const app = mount(<PageHeader numberOfAuthorsLeft={6} totalNumberOfAnswers={5} totalNumberOfCorrectAnswers={4}/>);

    expect(app.find(NavbarBrand).text()).toEqual("Это свояк");
  });
});
