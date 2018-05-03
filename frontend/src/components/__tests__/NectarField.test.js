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

it('calls onChange with valid:true when length over 14 characters', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: '012345678912345'}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('012345678912345', true);
});

it('calls onchange with valid:true when length is 0', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<NectarField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: ''}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('', true);
});

it('sets error to true when set nectar is too short', () => {
  const setState = jest.spyOn(NectarField.prototype, 'setState');
  const wrapper = shallow(<NectarField />);
  setState.mockClear();
  
  wrapper.find('input').simulate('change', {target: {value: 'change'}});

  expect(setState).toHaveBeenCalledWith({error: true});
});

it('sets error to false when set nectar is long enough', () => {
  const setState = jest.spyOn(NectarField.prototype, 'setState');
  const wrapper = shallow(<NectarField />);
  setState.mockClear();
  
  wrapper.find('input').simulate('change', {target: {value: '012345678901234'}});

  expect(setState).toHaveBeenCalledWith({error: false});
});