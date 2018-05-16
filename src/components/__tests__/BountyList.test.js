import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyList from '../BountyList';

it('renders without crashing', () => {
  const wrapper = render(<BountyList />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows all bounties passed as cards', () => {
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('Card')).toHaveLength(2);
  expect(wrapper.find('CardHeader').first().text()).toBe('asdf (ACTIVE)');
  expect(wrapper.find('CardHeader').last().text()).toBe('fdsa (ACTIVE)');
});

it('selects the bounty when view on the card is clicked', () => {
  const onBountySelected = jest.spyOn(BountyList.prototype, 'onBountySelected');
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);
  wrapper.find('Card').first().find('Button').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('calls prop onBountySelected when view on the card is clicked', () => {
  const onBountySelected = jest.fn();
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties} onBountySelected={onBountySelected}/>);
  wrapper.find('Card').first().find('Button').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('calls method onBountyRemoved when remove on the card is clicked', () => {
  const onBountyRemoved = jest.spyOn(BountyList.prototype, 'onBountyRemoved');
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);
  wrapper.find('Card').first().find('Button').last().simulate('click');

  expect(onBountyRemoved).toHaveBeenCalledWith(0);
});

it('calls prop onBountyRemoved when remove on the card is clicked', () => {
  const onBountyRemoved = jest.fn();
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties} onBountyRemoved={onBountyRemoved}/>);
  wrapper.find('Card').first().find('Button').last().simulate('click');

  expect(onBountyRemoved).toHaveBeenCalledWith(0);
});

it('puts a subheader on the CardHeader when amount is valid', () => {
  const bounties = [
    {guid: 'asdf', amount: '123'}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.CardSubHeader')).toHaveLength(1);
  expect(wrapper.find('.CardSubHeader').text()).toEqual('123 Nectar (NCT)');
});

it('adds 3 statrows per bounty', () => {
  const bounties = [
    {guid: 'asdf', amount: '123', assertions: [], author: 'author', artifacts: [{'name':'file'}]}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.StatRow')).toHaveLength(3);
});

it('displays a StatRow with author on a bounty card', () => {
  const bounties = [
    {guid: 'asdf', amount: '123', assertions: [], author: 'author', artifacts: [{'name':'file'}]}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.StatRow').first().find('.StatContent').text()).toEqual('author');
});

it('displays a StatRow with the number of assertions', () => {
  const bounties = [
    {guid: 'asdf', amount: '123', assertions: [], author: 'author', artifacts: [{'name':'file'}]}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(1, 2).find('.StatContent').text()).toEqual('0');
});

it('displays a StatRow with the name of the file in the bounty', () => {
  const bounties = [
    {guid: 'asdf', amount: '123', assertions: [], author: 'author', artifacts: [{'name':'file'}]}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(2, 3).find('.StatContent').text()).toEqual('file');
});

it('displays a StatRow with a csv of files in the bounty', () => {
  const bounties = [
    {guid: 'asdf', amount: '123', assertions: [], author: 'author', artifacts: [{'name':'file'}, {'name':'other'}]}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(2, 3).find('.StatContent').text()).toEqual('file, other');
});

it('adds (ACTIVE) to Card headers when neither expired for resolved', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: false,
      expired: false,
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.CardHeader').text()).toEqual('asdf (ACTIVE)');
});

it('adds (CLOSED) when a bounty is resolved', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: true,
      expired: false,
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.CardHeader').text()).toEqual('asdf (CLOSED)');
});

it('adds (CLOSED) when a bounty is resolved, even if expired', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: true,
      expired: true,
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.CardHeader').text()).toEqual('asdf (CLOSED)');
});

it('adds (EXPIRED) when a bounty has passed it\'s expiration block', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: false,
      expired: true,
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);

  expect(wrapper.find('.CardHeader').text()).toEqual('asdf (EXPIRED)');
});