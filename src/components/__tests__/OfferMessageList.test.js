import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import OfferMessageList from '../OfferMessageList';

const offer = {
  author: 'author',
  expert: 'expert',
  balance: '100',
  closed: false,
  messages: [
    {
      guid: 'asdf',
      type: 'payment',
      amount: '500000000000000000',
      sequence: 5
    },
    {
      guid: 'fdsa',
      type: 'payment',
      amount: '62500000000000000',
      sequence: 4
    },
    {
      guid: 'assertion',
      type: 'assertion',
      artifacts: [{ name: 'Malicious', hash: 'asdf' }],
      verdicts: [true],
      metadata: 'Worm',
      sequence: 3
    },
    {
      guid: 'other_assertion',
      type: 'assertion',
      artifacts: [
        { name: 'Benign', hash: 'fdsa' },
        { name: 'Malicious', hash: 'asdf' }
      ],
      verdicts: [false, true],
      metadata: '',
      sequence: 2
    },
    {
      guid: 'request',
      type: 'request',
      artifacts: [
        { name: 'Malicious', hash: 'asdf' },
        { name: 'Benign', hash: 'fdsa' }
      ],
      sequence: 1
    },
    {
      guid: 'other_request',
      type: 'request',
      artifacts: [{ name: 'Malicious', hash: 'asdf' }],
      sequence: 0
    }
  ]
};

const walletList = [
  { address: 'author', nct: '1', eth: '1' },
  { address: 'demo', nct: '1', eth: '1' },
  { address: 'omed', nct: '1', eth: '1' }
];

it('renders without crashing', () => {
  const wrapper = render(
    <OfferMessageList offer={offer} walletList={walletList} />
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('displays all messages as a separate card', () => {
  const wrapper = render(
    <OfferMessageList offer={offer} walletList={walletList} />
  );

  expect(wrapper.find('.Card')).toHaveLength(6);
});

it('displays a payment as just the Pay header and the amount', () => {
  const wrapper = render(
    <OfferMessageList offer={offer} walletList={walletList} />
  );

  const pay = wrapper.find('.Card').slice(0, 1);

  expect(pay.find('.CardHeader-Title').text()).toEqual(
    'Payment0.5 Nectar (NCT)'
  );
  expect(pay.find('.CardHeader-Sub').text()).toEqual('0.5 Nectar (NCT)');
});

it('displays the assertion as the metadata, and assertion per file', () => {
  const wrapper = render(
    <OfferMessageList offer={offer} walletList={walletList} />
  );

  const assertion = wrapper.find('.Card').slice(2, 3);

  expect(assertion.find('.CardHeader-Title').text()).toEqual('Assertion');
  expect(assertion.find('.StatRow')).toHaveLength(2);
  expect(
    assertion
      .find('.StatRow')
      .slice(1, 2)
      .find('.StatTitle')
      .text()
  ).toEqual('Malicious');
  expect(
    assertion
      .find('.StatRow')
      .slice(1, 2)
      .find('.StatContent')
      .text()
  ).toEqual('Malicious');
});

it('displays a request as a list of files', () => {
  const wrapper = render(
    <OfferMessageList offer={offer} walletList={walletList} />
  );

  const request = wrapper.find('.Card').slice(4, 5);

  expect(request.find('.CardHeader-Title').text()).toEqual('Request');
  expect(request.find('.StatRow')).toHaveLength(1);
  expect(
    request
      .find('.StatRow')
      .find('.StatTitle')
      .text()
  ).toEqual('Files:');
  expect(
    request
      .find('.StatRow')
      .find('.StatContent')
      .text()
  ).toEqual('Malicious, Benign');
});
[];
