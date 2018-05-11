import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Card from '../Card';

it('renders without crashing', () => {
  const wrapper = render(<Card />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the children passed', () => {
  const wrapper = render(
    <Card>
      <p>Child</p>
    </Card>
  );

  expect(wrapper.find('p').text()).toBe('Child');

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows multpe children when passed', () => {
  const wrapper = render(
    <Card>
      <p>Child</p>
      <p>Second</p>
    </Card>
  );

  expect(wrapper.find('p')).toHaveLength(2);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

