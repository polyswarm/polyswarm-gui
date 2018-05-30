import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferSummary from '../OfferSummary';

const offer = {
  author: 'author',
  expert: 'expert',
  balance: '100',
  closed: false,
  messages: [
    {
      type: 'assertion',
      artifacts: [{name: 'Malicious', hash: 'asdf'}],
      verdicts: [true],
    },
    {
      type: 'assertion',
      artifacts: [{name: 'Benign', hash: 'fdsa'}],
      verdicts: [false],
    },
    {
      type: 'request',
      artifacts: [{name: 'Benign', hash: 'fdsa'}],
    },
    {
      type: 'request',
      artifacts: [{name: 'Malicious', hash: 'asdf'}],
    },
  ]
};

const closed = {
  author: 'author',
  expert: 'expert',
  balance: '100',
  closed: true,
  messages: []
};

it('renders without crashing', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('displays the author in the first StatRow', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);
  
  expect(wrapper.find('.StatContent').slice(0,1).text()).toEqual('author');
});

it('displays the expert in the second StatRow', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);

  expect(wrapper.find('.StatContent').slice(1, 2).text()).toEqual('expert');
});

it('displays the remaining balance in the third StatRow', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);

  expect(wrapper.find('.StatContent').slice(2, 3).text()).toEqual('100 Nectar (NCT)');
});

it('display no when closed in fourth StatRow', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);

  expect(wrapper.find('.StatContent').slice(3, 4).text()).toEqual('No');
});

it('display yes when closed in fourth StatRow', () => {
  const wrapper = render(<OfferSummary offer={closed}/>);

  expect(wrapper.find('.StatContent').slice(3, 4).text()).toEqual('Yes');
});

it('displays the number of messages as the fifth StatRow', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);

  expect(wrapper.find('.StatContent').slice(4, 5).text()).toEqual('4');
});

it('displays each file as a separate StatRow', () => {
  const wrapper = render(<OfferSummary offer={offer}/>);

  expect(wrapper.find('.StatTitle').slice(5, 6).text()).toEqual('Benign');
  expect(wrapper.find('.StatContent').slice(5, 6).text()).toEqual('Safe');
  expect(wrapper.find('.StatTitle').slice(6, 7).text()).toEqual('Malicious');
  expect(wrapper.find('.StatContent').slice(6, 7).text()).toEqual('Malicious');
});