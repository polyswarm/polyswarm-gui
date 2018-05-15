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
  expect(wrapper.find('Card').first().text()).toBe('asdf');
  expect(wrapper.find('Card').last().text()).toBe('fdsa');
});

it('selects the bounty when the card is clicked', () => {
  const onBountySelected = jest.spyOn(BountyList.prototype, 'onBountySelected');
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties}/>);
  wrapper.find('Card').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('calls prop onSelectBounty when card is clicked', () => {
  const onBountySelected = jest.fn();
  const bounties = [
    {guid: 'asdf'},
    {guid: 'fdsa'}
  ];
  const wrapper = mount(<BountyList bounties={bounties} onBountySelected={onBountySelected}/>);
  wrapper.find('Card').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});