import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import OfferInfo from '../OfferInfo';

const offer = {
  ambassador: 'ambassador',
  expert: 'expert',
  initial: '100',
  balance: '100',
  closed: false,
  messages: [
    {
      guid: 'asdf',
      type: 'assertion',
      artifacts: [{ name: 'Malicious', hash: 'asdf' }],
      verdicts: [true],
      sequence: 3
    },
    {
      guid: 'fdsa',
      type: 'assertion',
      artifacts: [{ name: 'Benign', hash: 'fdsa' }],
      verdicts: [false],
      sequence: 2
    },
    {
      guid: 'blah',
      type: 'request',
      artifacts: [{ name: 'Benign', hash: 'fdsa' }],
      sequence: 1
    },
    {
      guid: 'halb',
      type: 'request',
      artifacts: [{ name: 'Malicious', hash: 'asdf' }],
      sequence: 0
    }
  ]
};

const wallet = { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' };
const address = 'ambassador';

it('renders without crashing', () => {
  const wrapper = render(
    <OfferInfo wallet={wallet} address={address} offer={offer} />
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows OfferPay on pay click', () => {
  const wrapper = mount(
    <OfferInfo wallet={wallet} address={address} offer={offer} />
  );
  wrapper
    .find('.Header')
    .find('.Button')
    .first()
    .simulate('click');

  expect(wrapper.find('.OfferPay')).toHaveLength(1);
});

it('shows OfferRequest on request click', () => {
  const wrapper = mount(
    <OfferInfo wallet={wallet} address={address} offer={offer} />
  );
  wrapper
    .find('.Header')
    .find('.Button')
    .last()
    .simulate('click');

  expect(wrapper.find('.OfferRequest')).toHaveLength(1);
});
