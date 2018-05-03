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

it('calls setstate with the address when address modified', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);

  wrapper.find('.AddressField').find('input').simulate('change', {target: {value: '012345678912345'}});

  expect(setState).toHaveBeenCalledWith({address: '012345678912345', error: false});
});

it('calls setstate with the address & error true when address modified with invalid value', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);

  wrapper.find('.AddressField').find('input').simulate('change', {target: {value: '012345912345'}});

  expect(setState).toHaveBeenCalledWith({address: '012345912345', error: true});
});

it('sets hide to true when button is clicked', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);
  wrapper.setState({address: '0123456789123456'});
  setState.mockClear();
  wrapper.find('button').simulate('click');

  expect(setState).toHaveBeenCalledWith({hide: true});
});

it('should call onSetAddress when transition finishes', () => {
  const onSetAddress = jest.fn();
  const wrapper = mount(<Landing onSetAddress={onSetAddress} />);
  wrapper.setState({address: '0123456789123456'});

  const instance = wrapper.find('CSSTransition').first().instance();
  instance.onExited();

  expect(onSetAddress).toHaveBeenCalledWith('0123456789123456');
});