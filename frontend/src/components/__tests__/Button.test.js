import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Button from '../Button';

it('renders without crashing', () => {
  const wrapper = render(<Button />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls the onClick function passed as a property when clicked', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<Button onClick={onClickHandler} />);

  wrapper.simulate('click');

  expect(onClickHandler).toHaveBeenCalled();
});

it('propogates disabled to actualy button element', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<Button disabled onClick={onClickHandler} />);

  expect(wrapper.find('button').props().disabled).toBeTruthy();
});

it('sets the class as flat when flat property added', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<Button flat onClick={onClickHandler} />);

  expect(wrapper.find('button').hasClass('flat')).toBeTruthy();
});

it('sets the class as cancel when cancel is added', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<Button cancel onClick={onClickHandler} />);

  expect(wrapper.find('button').hasClass('cancel')).toBeTruthy();
});

it('sets the flat-cancel class when both cancel and flat are added', () => {
  const onClickHandler = jest.fn();
  const wrapper = mount(<Button flat cancel onClick={onClickHandler} />);

  expect(wrapper.find('button').hasClass('flat-cancel')).toBeTruthy();
});
