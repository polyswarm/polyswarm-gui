import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Welcome from '../Welcome';

it('renders without crashing', () => {
  const wrapper = render(<Welcome />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should call onClick when button is clicked', () => {
  const onClick = jest.fn();
  const wrapper = mount(<Welcome onClick={onClick} />);

  wrapper.find('button').simulate('click');

  expect(onClick).toHaveBeenCalledTimes(1);
});
