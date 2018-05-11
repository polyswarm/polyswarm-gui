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
    {name: 'asdf'},
    {name: 'fdsa'}
  ];
  const wrapper = render(<BountyList bounties={bounties}/>);

  expect(wrapper.find('Card')).toHaveLength(2);
  expect(wrapper.find('Card').first().text()).toBe('asdf');
  expect(wrapper.find('Card').last().text()).toBe('fdsa');
});

it('selects the bounty when the BountyList is clicked', () => {
  const onSelectBounty = jest.spyOn(BountyList.prototype, 'onSelectBounty');
  const bounties = [
    {name: 'asdf'},
    {name: 'fdsa'}
  ];
  const wrapper = render(<BountyList bounties={bounties} onSelectBounty={onSelectBounty}/>);
  wrapper.find('BountyList').first().simulate('click');

  expect(onSelectBounty).toHaveBeenCalled(0);
});

it('calls prop onSelectBounty when BountyList is clicked', () => {
  const onSelectBounty = jest.fn();
  const bounties = [
    {name: 'asdf'},
    {name: 'fdsa'}
  ];
  const wrapper = render(<BountyList bounties={bounties} onSelectBounty={onSelectBounty}/>);
  wrapper.find('BountyList').first().simulate('click');

  expect(onSelectBounty).toHaveBeenCalled(0);
});