import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Dropdown from '../Dropdown';

it('renders without crashing', () => {
  const wrapper = render(<Dropdown />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows children when hovered', () => {
  const wrapper = mount(
  <Dropdown>
    <p>Child</p>
  </Dropdown>
  );

  wrapper.simulate('mouseEnter');
  
  expect(wrapper.find('p')).toHaveLength(1);
  expect(wrapper.find('p').text()).toEqual('Child');
});