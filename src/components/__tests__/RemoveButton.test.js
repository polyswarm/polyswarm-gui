import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import RemoveButton from '../RemoveButton';

it('renders without crashing', () => {
  const wrapper = render(<RemoveButton />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls the onClick function passed as a property when clicked', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<RemoveButton onClick={onClickHandler} />);

  wrapper.simulate('click');

  expect(onClickHandler).toHaveBeenCalled();
});

it('propogates disabled to actualy button element', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<RemoveButton disabled onClick={onClickHandler} />);

  expect(wrapper.find('button').props().disabled).toBeTruthy();
});
