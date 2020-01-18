import React from 'react';
import {mount, shallow} from 'enzyme';
import mockData from './mock-si.json';
import App from './App';
import {Input, Label} from 'reactstrap';

describe('author and creations', () => {
  it('renders author name correctly', () => {
    const mockRandomQuestion = jest.fn(() => {
      return mockData[0];
    });
    App.prototype.randomQuestion = mockRandomQuestion;

    const component = mount(<App data={mockData}/>);

    expect(mockRandomQuestion).toHaveBeenCalled();
    expect(component.contains(<Label for={'answer'}>Philip K. Dick</Label>)).toBe(true);
  });

  it('renders correct number of creations', () => {
    const mockRandomQuestion = jest.fn(() => {
      return mockData[1];
    });
    App.prototype.randomQuestion = mockRandomQuestion;

    const app = mount(<App data={mockData}/>);

    expect(mockRandomQuestion).toHaveBeenCalled();
    expect(app.find(Input).length).toEqual(3);
  });
});

describe('page flow', () => {
  it('shows notification if everything answered correctly', () => {
    const mockRandomQuestion = jest.fn(() => {
      return mockData[0];
    });
    App.prototype.randomQuestion = mockRandomQuestion;

    const app = mount(<App data={mockData}/>);
    expect(mockRandomQuestion).toHaveBeenCalled();

    app.find(Input).at(0).simulate('change', {
      target: {name: 'si-answer-0', value: 'Do Androids Dream of Electric Sheep?'}
    });
    app.find(Input).at(1).simulate('change', {
      target: {name: 'si-answer-1', value: 'The Man in the High Castle'}
    });

    app.find('Button[type="submit"]').simulate('click');

    expect(Object.keys(app.state().answers).length).toEqual(2);
    expect(app.state().answers['si-answer-0']).toEqual('Do Androids Dream of Electric Sheep?');
    expect(app.state().answers['si-answer-1']).toEqual('The Man in the High Castle');
    expect(app.find('ListGroupItem').length).toEqual(2);
    expect(app.find('ListGroupItem').at(0).text()).toEqual('Всё правильно');
    expect(app.find('ListGroupItem').at(1).text()).toEqual('K as Kindred');
  });

  it('shows notification if some answered correctly', () => {
    const mockRandomQuestion = jest.fn(() => {
      return mockData[0];
    });
    App.prototype.randomQuestion = mockRandomQuestion;

    const app = mount(<App data={mockData}/>);
    expect(mockRandomQuestion).toHaveBeenCalled();

    app.find(Input).at(0).simulate('change', {
      target: {name: 'si-answer-0', value: 'Do Androids Dream of Electric Sheep?'}
    });

    app.find('Button[type="submit"]').simulate('click');

    expect(Object.keys(app.state().answers).length).toEqual(1);
    expect(app.state().answers['si-answer-0']).toEqual('Do Androids Dream of Electric Sheep?');
    expect(app.find('h2').text()).toEqual('Все правильные ответы:');
    expect(app.find('ListGroupItem').length).toEqual(4);
    expect(app.find('ListGroupItem').at(0).text()).toEqual('Do Androids Dream of Electric Sheep?');
    expect(app.find('ListGroupItem').at(1).text()).toEqual('The Man in the High Castle');
    expect(app.find('ListGroupItem').at(3).text()).toEqual('K as Kindred');
  });

  it('shows notification on final page', () => {
    const mockRandomQuestion = jest.fn();
    mockRandomQuestion
      .mockImplementationOnce(() => mockData[0])
      .mockImplementationOnce(() => mockData[1])
      .mockImplementationOnce(() => mockData[2]);
    App.prototype.randomQuestion = mockRandomQuestion;

    const component = mount(<App data={mockData}/>);
    component.find('Button#next').simulate('click');
    component.find('Button#next').simulate('click');
    component.find('Button#next').simulate('click');

    expect(component.find('h2').text()).toEqual('Игра окончена');
  });
});
