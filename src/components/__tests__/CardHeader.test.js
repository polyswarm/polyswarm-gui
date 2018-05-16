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

it('does not show subhead when no subhead added', () =>{
  const wrapper = mount(
    <CardHeader title='asdf'/>
  );

  expect(wrapper.find('.CardSubHeader')).toHaveLength(0);
});

it('shows subhead when added', () => {
  const wrapper = mount(
    <CardHeader title='asdf' subhead='subhead'/>
  );

  expect(wrapper.find('.CardSubHeader')).toHaveLength(1);
  expect(wrapper.find('.CardSubHeader').text()).toEqual('subhead');
});

it('applies updated class when updated prop is set', () => {
  const wrapper = mount(
    <CardHeader title='asdf' update/>
  );

  expect(wrapper.find('.CardHeader').hasClass('update')).toBeTruthy();
});

