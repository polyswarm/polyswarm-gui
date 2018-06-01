import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import ChainInfo from '../ChainInfo';

it('renders without crashing', () => {
  const wrapper = render(<ChainInfo balance={0} transfer={0} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('displays the name of the networks', () => {
  const wrapper = render(<ChainInfo homeName={'home'} sideName={'side'} />);

  expect(
    wrapper
      .find('.StatTitle')
      .first()
      .text()
  ).toEqual('home');
  expect(
    wrapper
      .find('.StatTitle')
      .last()
      .text()
  ).toEqual('side');
});

it('displays the current balances', () => {
  const wrapper = render(
    <ChainInfo
      homeName={'home'}
      homeBalance={1}
      sideName={'side'}
      sideBalance={2}
    />
  );

  expect(
    wrapper
      .find('.StatContent')
      .first()
      .text()
  ).toEqual('1 NCT');
  expect(
    wrapper
      .find('.StatContent')
      .last()
      .text()
  ).toEqual('2 NCT');
});

it('displays the title', () => {
  const wrapper = render(<ChainInfo title={'Title'} />);

  expect(wrapper.find('h3').text()).toEqual('Title');
});
