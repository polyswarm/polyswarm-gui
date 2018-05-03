import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ChainInfo from '../ChainInfo';

it('renders without crashing', () => {
  const wrapper = render(<ChainInfo balance={0} transfer={0}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('computes and display the balance after the transaction', () => {
  const wrapper = render(<ChainInfo balance={12} transfer={1} sender/>);
  
  expect(wrapper.find('p').last().text()).toEqual('Balance after Transfer: 11');
});

it('adds to the balance when not sender', () => {
  const wrapper = render(<ChainInfo balance={12} transfer={1}/>);
  
  expect(wrapper.find('p').last().text()).toEqual('Balance after Transfer: 13');
});

it('displays the name of the network', () => {
  const wrapper = render(<ChainInfo name={'main'} balance={12} transfer={0}/>);
  
  expect(wrapper.find('h2').text()).toEqual('main');
});

it('displays the current balance', () => {
  const wrapper = render(<ChainInfo balance={12} transfer={0}/>);
  
  expect(wrapper.find('p').first().text()).toEqual('Current Balance: 12');
});