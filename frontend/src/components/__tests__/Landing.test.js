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
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: 'a'}});

  expect(onNectarChanged).toHaveBeenCalledWith('a', false);
});

it('disables the Go button when 0 < length < requirements in NectarField ', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: 'a'}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('enables the Go button when nectar meets length requirements in NectarField', () => {
  const wrapper = mount(<Landing />);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '012345678912345'}});

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

  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '012345678912345'}});

  expect(setState).toHaveBeenCalledWith({nectar: '012345678912345', error: false});
});

it('calls setstate with the nectar & error true when nectar modified with invalid value', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);

  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '012345912345'}});

  expect(setState).toHaveBeenCalledWith({nectar: '012345912345', error: true});
});

it('sets hide to true when button is clicked', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing />);
  wrapper.setState({nectar: '0123456789123456'});
  setState.mockClear();
  wrapper.find('button').simulate('click');

  expect(setState).toHaveBeenCalledWith({hide: true});
});

it('should call onSetNectar when transition finishes', () => {
  const onSetNectar = jest.fn();
  const wrapper = mount(<Landing onSetNectar={onSetNectar} />);
  wrapper.setState({nectar: '0123456789123456'});

  const instance = wrapper.find('CSSTransition').first().instance();
  instance.onExited();

  expect(onSetNectar).toHaveBeenCalledWith('0123456789123456');
});