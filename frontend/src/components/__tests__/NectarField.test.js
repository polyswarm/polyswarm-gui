import React from 'react';
import {render, shallow} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import NectarField from '../NectarField';

it('renders without crashing', () => {
  const wrapper = render(<NectarField />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onchange when instance onChange is called', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  const instance = wrapper.instance();

  instance.onChange({target:{value: 'change'}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('change', false);
});

it('calls onchange when nectar changed', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: 'change'}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('change', false);
});

it('calls onChange with valid:true when value is over 0 ', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: .0000000000000001}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(.0000000000000001, true);
});

it('calls onchange with valid:false when empty', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: ''}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('', false);
});

it('calls onchange with valid:false value is 0', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: 0}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(0, false);
});

it('calls onchange with valid:false value is less than 0', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: -1}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(-1, false);
});

it('sets error to true when set nectar is 0', () => {
  const setState = jest.spyOn(NectarField.prototype, 'setState');
  const wrapper = shallow(<NectarField />);
  setState.mockClear();
  
  wrapper.find('input').simulate('change', {target: {value: 0}});

  expect(setState).toHaveBeenCalledWith({error: true});
});

it('sets error to true when set nectar is less than 0', () => {
  const setState = jest.spyOn(NectarField.prototype, 'setState');
  const wrapper = shallow(<NectarField />);
  setState.mockClear();
  
  wrapper.find('input').simulate('change', {target: {value: -1}});

  expect(setState).toHaveBeenCalledWith({error: true});
});

it('sets error to false when set nectar is greater than 0', () => {
  const setState = jest.spyOn(NectarField.prototype, 'setState');
  const wrapper = shallow(<NectarField />);
  setState.mockClear();
  
  wrapper.find('input').simulate('change', {target: {value: '1'}});

  expect(setState).toHaveBeenCalledWith({error: false});
});