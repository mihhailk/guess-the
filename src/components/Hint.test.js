import React from 'react';
import {mount} from 'enzyme';
import {Hint} from './Hint';

describe('Hint', () => {
  it('shows clickable button', () => {
    const component = mount(<Hint answersToBeMasked={['one', 'another']}/>);

    const button = component.find('Button');

    expect(button.props().color).toEqual('secondary');
    expect(button.props().size).toEqual('sm');
    expect(button.props().title).toEqual('Подскажи');
    expect(button.text()).toEqual(' ? ');
    expect(component.state().showHint).toBeFalsy();
    expect(component.find('ListGroupItem').length).toBe(0);
  });

  it('shows hints when button is clicked', () => {
    const component = mount(<Hint answersToBeMasked={['one', 'another']}/>);

    component.find('Button').simulate('click');

    expect(component.state().showHint).toBeTruthy();
    const rows = component.find('ListGroupItem');
    expect(rows.length).toBe(2);
    expect(rows.at(0).text()).toBe('_ _ _ ');
    expect(rows.at(1).text()).toBe('_ _ _ _ _ _ _ ');
  });
});
