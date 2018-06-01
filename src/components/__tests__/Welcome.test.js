import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Welcome from '../Welcome';
import App from '../App';

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

it('should close when button is clicked', () => {
  const wrapper = mount(<App />);
  wrapper.setState({ first: true });

  expect(wrapper.find('.Welcome')).toHaveLength(1);

  wrapper
    .find('.Welcome')
    .find('button')
    .simulate('click');

  expect(wrapper.find('.Welcome')).toHaveLength(0);
});
