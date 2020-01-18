import React from 'react';
import {mount, shallow} from 'enzyme';
import {GameOver} from './GameOver';

describe('GameOver', () => {
  it('shows header', () => {
    const component = shallow(<GameOver onRestart={jest.fn()}/>);

    expect(component.find('h2').text()).toEqual("Игра окончена");
  });

  it('shows button', () => {
    const onRestart = jest.fn();

    const component = mount(<GameOver onRestart={onRestart}/>);

    const restartButton = component.find('Button');
    expect(restartButton.text()).toEqual("Начать заново");
    expect(restartButton.props().onClick).toEqual(onRestart);
  });
});
