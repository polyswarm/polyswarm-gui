import React from 'react';
import {render, shallow, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Landing from '../Landing';

it('renders without crashing', () => {
  const wrapper = render(<Landing />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onAddressChanged when AddressField is changed', () => {
  const onAddressChanged = jest.spyOn(Landing.prototype, 'onAddressChanged');
  const wrapper = mount(<Landing />);
  wrapper.find('.AddressField').find('input').simulate('change', {target: {value: 'a'}});

  expect(onAddressChanged).toHaveBeenCalledWith('a', false);
});

it('disables the Go button when 0 < length < requirements in AddressField ', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.AddressField').find('input').simulate('change', {target: {value: 'a'}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('enables the Go button when address meets length requirements in AddressField', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.AddressField').find('input').simulate('change', {target: {value: '012345678912345'}});

  expect(wrapper.find('.Button').props().disabled).toBeFalsy();
});

it('disables the Go button when address length is 0', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.AddressField').find('input').simulate('change', {target: {value: ''}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});