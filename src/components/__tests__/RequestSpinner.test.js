import React from 'react';
import {shallow, mount} from 'enzyme';
import {shallowToJson, mountToJson} from 'enzyme-to-json';
import RequestSpinner from '../RequestSpinner';

it('Should render without error', () => {
  const wrapper = shallow(<RequestSpinner/>);
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('shows the icon when there are requests', () => {
  const request = [
    {title: 'demo', id: 'test'}
  ];
  const wrapper = mount(<RequestSpinner requests={request}/>);

  expect(wrapper.find('.RequestSpinner-Icon')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});
