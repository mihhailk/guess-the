import React from 'react';
import {shallow} from 'enzyme';
import mockData from './mock-si.json';
import App from './App';
import {PageHeader} from './components/PageHeader';
import {Badge, Input, Label, Navbar, NavbarBrand} from 'reactstrap';

function appComponent() {
  return shallow(<App data={mockData}/>);
}

describe('headers', () => {
  it('renders header on first page', () => {
    expect(appComponent().contains(<PageHeader totalNumberOfAnswers={0}
                                               totalNumberOfCorrectAnswers={0}
                                               numberOfAuthorsLeft={mockData.length}/>)).toBe(true);
  });

  it('renders header on next page', () => {
    App.prototype.randomQuestion = jest.fn(() => {
      return mockData[0];
    });
    const component = appComponent();
    component.find('#next').simulate('click');
    expect(component.state().totalNumberOfCorrectAnswers).toEqual(0);
    expect(component.state().totalNumberOfAnswers).toEqual(2);
    expect(component.contains(<PageHeader totalNumberOfAnswers={2}
                                          totalNumberOfCorrectAnswers={0}
                                          numberOfAuthorsLeft={mockData.length - 1}/>)).toBe(true);
  });
});

describe('author and creations', () => {
  it('renders author name correctly', () => {
    App.prototype.randomQuestion = jest.fn(() => {
      return mockData[0];
    });
    const component = appComponent();
    expect(component.contains(<Label for={'answer'}>Philip K. Dick</Label>)).toBe(true);
  });

  it('renders correct number of creations', () => {
    App.prototype.randomQuestion = jest.fn(() => {
      return mockData[1];
    });
    expect(appComponent().find(Input).length).toEqual(3);
  });
});

describe('page flow', () => {
  it('shows notification on final page', () => {
    const mockRandomQuestion = jest.fn();
    mockRandomQuestion
      .mockImplementationOnce(() => mockData[0])
      .mockImplementationOnce(() => mockData[1])
      .mockImplementationOnce(() => mockData[2]);
    App.prototype.randomQuestion = mockRandomQuestion;

    const component = appComponent();
    component.find('#next').simulate('click');
    component.find('#next').simulate('click');
    component.find('#next').simulate('click');
    expect(component.contains(<h2>Игра окончена</h2>)).toBe(true);
  });
});
