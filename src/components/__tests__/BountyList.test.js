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
  expect(wrapper.find('CardHeader').first().text()).toBe('asdf');
  expect(wrapper.find('CardHeader').last().text()).toBe('fdsa');
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