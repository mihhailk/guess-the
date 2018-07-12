import React from 'react';
import {mount, shallow} from 'enzyme';
import mockData from './mock-si.json';
import App from './App';
import {PageHeader} from './components/PageHeader';
import {Input, Label} from 'reactstrap';

describe('headers', () => {
  it('renders header on first page', () => {
    const app = shallow(<App data={mockData}/>);

    const pageHeader = app.find(PageHeader);
    expect(pageHeader.props().totalNumberOfAnswers).toEqual(0);
    expect(pageHeader.props().totalNumberOfCorrectAnswers).toEqual(0);
    expect(pageHeader.props().numberOfAuthorsLeft).toEqual(mockData.length);
  });

  it('renders header on next page', () => {
    const mockRandomQuestion = jest.fn(() => {
      return mockData[0];
    });
    App.prototype.randomQuestion = mockRandomQuestion;

    const app = mount(<App data={mockData}/>);

    app.find('Button#next').simulate('click');
    expect(mockRandomQuestion).toHaveBeenCalled();
    expect(app.state().totalNumberOfCorrectAnswers).toEqual(0);
    expect(app.state().totalNumberOfAnswers).toEqual(2);
    const pageHeader = app.find(PageHeader);
    expect(pageHeader.props().totalNumberOfAnswers).toEqual(2);
    expect(pageHeader.props().totalNumberOfCorrectAnswers).toEqual(0);
    expect(pageHeader.props().numberOfAuthorsLeft).toEqual(mockData.length - 1);
    ;
  });
});

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
