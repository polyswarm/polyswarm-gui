import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountySummary from '../BountySummary';

it('renders without crashing', () => {
  const bounty = {assertions: []};
  const wrapper = render(<BountySummary bounty={bounty}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows yes if resolved under the second statrow', () => {
  const bounty = {
    amount: 10,
    resolved: true,
    expired: false,
    assertions: [],
    artifacts: [],
    uri: '',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(1).text()).toEqual('Yes');
});

it('shows no if resolved under the second statrow', () => {
  const bounty = {
    amount: 10,
    resolved: false,
    expired: false,
    assertions: [],
    artifacts: [],
    uri: '',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(1).text()).toEqual('No');
});

it('shows yes if expired', () => {
  const bounty = {
    amount: 10,
    resolved: false,
    expired: true,
    assertions: [],
    artifacts: [],
    uri: '',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(2).text()).toEqual('Yes');
});

it('shows no if not expired', () => {
  const bounty = {
    amount: 10,
    resolved: false,
    expired: false,
    assertions: [],
    artifacts: [],
    uri: '',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(2).text()).toEqual('No');
});

it('shows number of assertions', () => {
  const bounty = {
    amount: 10,
    resolved: false,
    expired: false,
    assertions: [{}, {}, {}, {}],
    artifacts: [],
    uri: '',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(4).text()).toEqual('4');
});

it('shows the ipfs dir of the bounty', () =>{
  const bounty = {
    amount: 10,
    resolved: false,
    expired: false,
    assertions: [],
    artifacts: [],
    uri: 'directory',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(5).text()).toEqual('directory');
});

it('collapses all of the verdicts down to a single verdict', () => {
  const bounty = {
    amount: 10,
    resolved: true,
    expired: false,
    assertions: [{verdicts: [true, false]}],
    artifacts: [
      {name: 'file'},

    ],
    uri: 'directory',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(6).text()).toEqual('Malicious');
});

it('collapses all of the verdicts down to a single verdict', () => {
  const bounty = {
    amount: 10,
    resolved: true,
    expired: false,
    assertions: [{verdicts: [false, false]}],
    artifacts: [
      {name: 'file'},

    ],
    uri: 'directory',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(6).text()).toEqual('Safe');
});

it('lists all the files with verdicts if resolved', () => {
  const bounty = {
    amount: 10,
    resolved: true,
    expired: false,
    assertions: [{verdicts: [false, false]}, {verdicts: [true, true]}],
    artifacts: [
      {name: 'file'},
      {name: 'demo'},

    ],
    uri: 'directory',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(6).text()).toEqual('Malicious');
  expect(wrapper.find('.StatContent').at(7).text()).toEqual('Malicious');
});

it('lists all the files with verdicts if expired', () => {
  const bounty = {
    amount: 10,
    resolved: false,
    expired: true,
    assertions: [{verdicts: [false, false]}, {verdicts: [true, true]}],
    artifacts: [
      {name: 'file'},
      {name: 'demo'},

    ],
    uri: 'directory',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(6).text()).toEqual('Malicious');
  expect(wrapper.find('.StatContent').at(7).text()).toEqual('Malicious');
});

it('lists pending if not resolved or expired', () => {
  const bounty = {
    amount: 10,
    resolved: false,
    expired: false,
    assertions: [{verdicts: [false, false]}, {verdicts: [true, true]}],
    artifacts: [
      {name: 'file'},
      {name: 'demo'},

    ],
    uri: 'directory',
  };
  const wrapper = mount(<BountySummary bounty={bounty}/>);

  expect(wrapper.find('.StatContent').at(6).text()).toEqual('Pending…');
  expect(wrapper.find('.StatContent').at(7).text()).toEqual('Pending…');
});