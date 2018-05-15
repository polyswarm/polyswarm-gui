import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import CardHeader from '../CardHeader';

it('renders without crashing', () => {
  const wrapper = render(<CardHeader />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the title when passed', () => {
  const wrapper = mount(
    <CardHeader title='asdf'/>
  );

  expect(wrapper.text()).toEqual('asdf');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

