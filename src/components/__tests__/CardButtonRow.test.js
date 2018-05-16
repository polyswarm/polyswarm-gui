import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import CardButtonRow from '../CardButtonRow';
import Button from '../Button';

it('renders without crashing', () => {
  const wrapper = render(<CardButtonRow />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the children passed', () => {
  const wrapper = render(
    <CardButtonRow>
      <Button>Child</Button>
    </CardButtonRow>
  );

  expect(wrapper.find('button').text()).toBe('Child');

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows multiple children when passed', () => {
  const wrapper = mount(
    <CardButtonRow>
      <Button>Child</Button>
      <Button>Second</Button>
    </CardButtonRow>
  );

  expect(wrapper.find('button')).toHaveLength(2);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

