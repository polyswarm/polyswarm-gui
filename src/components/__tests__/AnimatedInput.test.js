import React from 'react';
import {render, shallow, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import AnimatedInput from '../AnimatedInput';

it('renders without crashing', () => {
  const wrapper = render(<AnimatedInput />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onchange when instance onChange is called', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AnimatedInput type='number' onChange={onChange}/>);
  const instance = wrapper.instance();

  instance.onChange({target:{value: 'change'}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('change');
});

it('calls onchange when value changed', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AnimatedInput type='number' onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: 'change'}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('change');
});

it('calls onChange with valid:true when value is over 0 ', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AnimatedInput type='number' onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: .0000000000000001}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(.0000000000000001,);
});

it('calls onchange with valid:false when empty', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AnimatedInput type='number' onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: ''}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('');
});

it('calls onchange with valid:false value is 0', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AnimatedInput type='number' onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: 0}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(0);
});

it('calls onchange with valid:false value is less than 0', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AnimatedInput type='number' onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: -1}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(-1);
});

it('adds error class when error is set in props', () => {
  const wrapper = shallow(<AnimatedInput error='error'/>);
  
expect(wrapper.find('.AnimatedInput-Error')).toHaveLength(1);
});

it('shows the error test that is set', () => {
  const wrapper = mount(<AnimatedInput type='number' error='error'/>);
  
  expect(wrapper.find('p').text()).toEqual('error');
});

it('sets the type when put in prop', () => {
  const wrapper = mount(<AnimatedInput type='number'/>);

  expect(wrapper.find('input').props().type).toEqual('number');
});

it('sets the id on the input with type_id', () => {
  const wrapper = mount(<AnimatedInput input_id='i'/>);

  expect(wrapper.find('input').props().id).toEqual('i')
});
