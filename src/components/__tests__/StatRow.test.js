import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import StatRow from '../StatRow';

it('renders without crashing', () => {
  const wrapper = render(<StatRow />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the title when passed', () => {
  const wrapper = mount(
    <StatRow title='asdf'/>
  );

  expect(wrapper.find('.StatTitle').text()).toEqual('asdf');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the content when passed', () => {
  const wrapper = mount(
    <StatRow title='asdf' content='content'/>
  );

  expect(wrapper.find('.StatContent').text()).toEqual('content');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

