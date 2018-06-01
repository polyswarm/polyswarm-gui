import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import OfferInfo from '../OfferInfo';

const offer = {
  author: 'author',
  expert: 'expert',
  remaining: '100',
  closed: false,
  messages: [
    {
      guid: 'asdf',
      type: 'assertion',
      artifacts: [{ name: 'Malicious', hash: 'asdf' }],
      verdicts: [true]
    },
    {
      guid: 'fdsa',
      type: 'assertion',
      artifacts: [{ name: 'Benign', hash: 'fdsa' }],
      verdicts: [false]
    },
    {
      guid: 'blah',
      type: 'request',
      artifacts: [{ name: 'Benign', hash: 'fdsa' }]
    },
    {
      guid: 'halb',
      type: 'request',
      artifacts: [{ name: 'Malicious', hash: 'asdf' }]
    }
  ]
};

const wallet = { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' };
const address = 'author';

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

it('calls prop onAddMessage when addMessage is called', () => {
  const onAddMessage = jest.fn();
  const wrapper = mount(
    <OfferInfo
      wallet={wallet}
      address={address}
      offer={offer}
      onAddMessage={onAddMessage}
    />
  );
  const instance = wrapper.instance();

  instance.addMessage({});

  expect(onAddMessage).toHaveBeenCalledTimes(1);
});
