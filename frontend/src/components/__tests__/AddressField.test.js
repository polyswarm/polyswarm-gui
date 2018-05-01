import React from 'react';
import {render, shallow} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import AddressField from '../AddressField';

it('renders without crashing', () => {
  const wrapper = render(<AddressField />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onchange when instance onChange is called', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AddressField onChange={onChange}/>);
  const instance = wrapper.instance();

  instance.onChange({target:{value: 'change'}});

  expect(onChange).toHaveBeenCalledWith('change');
});

it('calls onchange when address changed', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<AddressField onChange={onChange}/>);
  
  wrapper.find('input').simulate('change', {target: {value: 'change'}});

  expect(onChange).toHaveBeenCalledWith('change');
});