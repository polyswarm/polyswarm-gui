import React from 'react';
import {render, shallow, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Landing from '../Landing';

const chain = {name:'asdf', balance: 1};

it('renders without crashing', () => {
  const wrapper = render(<Landing homechain={chain} sidechain={chain}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onNectarChanged when NectarField is changed', () => {
  const onNectarChanged = jest.spyOn(Landing.prototype, 'onNectarChanged');
  const wrapper = mount(<Landing homechain={chain} sidechain={chain}/>);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '1'}});

  expect(onNectarChanged).toHaveBeenCalledWith('1', true);
});

it('disables the button when nectar is negative', () => {
  const wrapper = mount(<Landing homechain={chain} sidechain={chain}/>);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '-1'}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('enables the Go button when nectar meets length requirements in NectarField', () => {
  const wrapper = mount(<Landing homechain={chain} sidechain={chain}/>);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '1'}});

  expect(wrapper.find('.Button').props().disabled).toBeFalsy();
});

it('disables the Go button when nectar length is 0', () => {
  const wrapper = mount(<Landing homechain={chain} sidechain={chain}/>);
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: ''}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('calls setstate with the nectar when nectar modified', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing homechain={chain} sidechain={chain}/>);

  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '1'}});

  expect(setState).toHaveBeenCalledWith({nectar: '1', error: false});
});

it('calls setstate with the nectar & error true when nectar modified with invalid value', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing homechain={chain} sidechain={chain}/>);
  setState.mockClear();
  wrapper.find('.NectarField').find('input').simulate('change', {target: {value: '0'}});

  expect(setState).toHaveBeenCalledWith({nectar: '0', error: true});
});

it('calls onTransfer button is clicked', () => {
  const onTransfer = jest.fn();
  const wrapper = mount(<Landing homechain={chain} sidechain={chain} onTransfer={onTransfer} />);
  wrapper.setState({nectar: '0123456789123456'});
  wrapper.find('button').simulate('click');

  expect(onTransfer).toHaveBeenCalledWith('0123456789123456', 0);
});

it('updates the after field balances when nectar amount entered', () => {
  const wrapper = mount(<Landing homechain={chain} sidechain={chain} />);
  wrapper.setState({nectar: .5});

  expect(wrapper.find('.ChainInfo').last().find('li').first().text()).toEqual('asdf: 0.5');
  expect(wrapper.find('.ChainInfo').last().find('li').last().text()).toEqual('asdf: 1.5');
});

it('Changes the balances when selected index is changed', () => {
  const wrapper = mount(<Landing homechain={chain} sidechain={chain} />);
  wrapper.setState({nectar: .5, selected: 1});

  expect(wrapper.find('.ChainInfo').last().find('li').first().text()).toEqual('asdf: 1.5');
  expect(wrapper.find('.ChainInfo').last().find('li').last().text()).toEqual('asdf: 0.5');
});

it('Disbales the button when error set to true', () => {
  const wrapper = mount(<Landing homechain={chain} sidechain={chain} />);
  wrapper.setState({error: true});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('Disables the button when nectar is greater than the homechain balance in deposit', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing homechain={chain} sidechain={chain} />);
  wrapper.setState({selected: 0});
  const instance = wrapper.instance();
  setState.mockClear();

  instance.onNectarChanged(2, true);

  expect(setState).toHaveBeenCalledWith({nectar: 2, error: true});
});

it('Disables the button when nectar is greater than the sidechain balance in withdrawal', () => {
  const setState = jest.spyOn(Landing.prototype, 'setState');
  const wrapper = mount(<Landing homechain={chain} sidechain={chain} />);
  wrapper.setState({selected: 1});
  const instance = wrapper.instance();

  instance.onNectarChanged(2, true);

  expect(setState).toHaveBeenCalledWith({nectar: 2, error: true});
});