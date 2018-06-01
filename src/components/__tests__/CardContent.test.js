import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import CardContent from '../CardContent';

it('renders without crashing', () => {
  const wrapper = render(<CardContent />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the children passed', () => {
  const wrapper = render(
    <CardContent>
      <p>Child</p>
    </CardContent>
  );

  expect(wrapper.find('p').text()).toBe('Child');

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows multiple children when passed', () => {
  const wrapper = mount(
    <CardContent>
      <p>Child</p>
      <p>Second</p>
    </CardContent>
  );

  expect(wrapper.find('p')).toHaveLength(2);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
