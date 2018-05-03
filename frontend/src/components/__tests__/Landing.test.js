import React from 'react';
import {render, shallow, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Landing from '../Landing';

it('renders without crashing', () => {
  const wrapper = render(<Landing />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onNectarChanged when NectarField is changed', () => {
  const onNectarChanged = jest.spyOn(Landing.prototype, 'onNectarChanged');
  const wrapper = mount(<Landing />);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '1'}});

  expect(onNectarChanged).toHaveBeenCalledWith('1', true);
});

it('disables the button when nectar is negative', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '-1'}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('enables the Go button when nectar meets length requirements in NectarField', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '1'}});

  expect(wrapper.find('.Button').props().disabled).toBeFalsy();
});

it('disables the Go button when nectar length is 0', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: ''}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('calls setstate with the nectar when nectar modified', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);

  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '1'}});

  expect(setState).toHaveBeenCalledWith({nectar: '1', error: false});
});

it('calls setstate with the nectar & error true when nectar modified with invalid value', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);
  setState.mockClear();
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '0'}});

  expect(setState).toHaveBeenCalledWith({nectar: '0', error: true});
});

it('calls onTransfer button is clicked', () => {
  const onTransfer = jest.fn();
  const wrapper = mount(<Landing onTransfer={onTransfer} />);
  wrapper.setState({nectar: '0123456789123456'});
  wrapper.find('button').simulate('click');

  expect(onTransfer).toHaveBeenCalledWith('0123456789123456', 0);
});

it('calls select when ChainInfo clicked', () => {
  const select = jest.spyOn(Landing.prototype, 'select');
  const wrapper = mount(<Landing />);
  
  wrapper.find('.ChainInfo').last().simulate('click');

  expect(select).toHaveBeenCalledWith(1);
});


it('changes selected when ChainInfo selected', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);
  setState.mockClear();
  wrapper.find('.ChainInfo').last().simulate('click');

  expect(setState).toHaveBeenCalledWith({selected: 1});
});