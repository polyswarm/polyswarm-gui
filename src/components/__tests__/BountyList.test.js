import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyList from '../BountyList';

const wallet = {homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1'};
const address = 'author';

it('renders without crashing', () => {
  const wrapper = render(<BountyList
    address={address}
    wallet={wallet} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows all bounties passed as cards', () => {
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.Card')).toHaveLength(2);
  expect(wrapper.find('.CardHeader-Title').first().text()).toBe('asdf (ACTIVE)');
  expect(wrapper.find('.CardHeader-Title').last().text()).toBe('fdsa (ACTIVE)');
});

it('selects the bounty when the card is clicked', () => {
  const onBountySelected = jest.spyOn(BountyList.prototype, 'onBountySelected');
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);
  wrapper.find('.Card').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('calls prop onBountySelected when the card is clicked', () => {
  const onBountySelected = jest.fn();
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties} onBountySelected={onBountySelected}/>);
  wrapper.find('.Card').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('selects the bounty when view on the card is clicked', () => {
  const onBountySelected = jest.spyOn(BountyList.prototype, 'onBountySelected');
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);
  wrapper.find('.Dropdown-Choices').first().find('p').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('calls prop onBountySelected when view on the card is clicked', () => {
  const onBountySelected = jest.fn();
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties} onBountySelected={onBountySelected}/>);
  wrapper.find('.CardHeader').find('.Dropdown-Choices').first().find('p').first().simulate('click');

  expect(onBountySelected).toHaveBeenCalledWith(0);
});

it('calls method onBountyRemoved when remove on the card is clicked', () => {
  const onBountyRemoved = jest.spyOn(BountyList.prototype, 'onBountyRemoved');
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);
  wrapper.find('.CardHeader').find('.Dropdown-Choices').first().find('p').last().simulate('click');

  expect(onBountyRemoved).toHaveBeenCalledWith(0);
});

it('calls prop onBountyRemoved when remove on the card is clicked', () => {
  const onBountyRemoved = jest.fn();
  const bounties = [
    {guid: 'asdf', type:'bounty'},
    {guid: 'fdsa', type:'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties} onBountyRemoved={onBountyRemoved}/>);
  wrapper.find('.CardHeader').find('.Dropdown-Choices').first().find('p').last().simulate('click');

  expect(onBountyRemoved).toHaveBeenCalledWith(0);
});

it('puts a subheader on the CardHeader when amount is valid', () => {
  const bounties = [
    {guid: 'asdf', amount: '123', type: 'bounty'}
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Sub')).toHaveLength(1);
  expect(wrapper.find('.CardHeader-Sub').text()).toEqual('123 Nectar (NCT)');
});

it('adds 3 statrows per bounty', () => {
  const bounties = [
    {guid: 'asdf',
      amount: '123',
      assertions: [],
      author: 'author',
      artifacts: [{'name':'file'}],
      type: 'bounty'
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardContent').find('.StatRow')).toHaveLength(3);
});

it('displays a StatRow with author on a bounty card', () => {
  const bounties = [
    {guid: 'asdf',
      amount: '123',
      assertions: [],
      author: 'author',
      artifacts: [{'name':'file'}],
      type: 'bounty'
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').first().find('.StatContent').text()).toEqual('author');
});

it('displays a StatRow with the number of assertions', () => {
  const bounties = [
    {guid: 'asdf',
      amount: '123',
      assertions: [],
      author: 'author',
      artifacts: [{'name':'file'}],
      type: 'bounty'
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(1, 2).find('.StatContent').text()).toEqual('0');
});

it('displays a StatRow with the name of the file in the bounty', () => {
  const bounties = [
    {guid: 'asdf',
      amount: '123',
      assertions: [],
      author: 'author',
      artifacts: [{'name':'file'}],
      type: 'bounty'
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);
  
  expect(wrapper.find('.StatRow').slice(2, 3).find('.StatContent').text()).toEqual('file');
});

it('displays a StatRow with a csv of files in the bounty', () => {
  const bounties = [{
    guid: 'asdf',
    amount: '123',
    assertions: [],
    author: 'author',
    artifacts: [{'name':'file'},{'name':'other'}],
    type: 'bounty'
  }];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(2, 3).find('.StatContent').text()).toEqual('file, other');
});

it('adds 5 statrows per offer', () => {
  const bounties = [
    {
      guid: 'asdf',
      messages: [],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardContent').find('.StatRow')).toHaveLength(5);
});

it('adds (ACTIVE) to Card headers when neither expired for resolved', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: false,
      expired: false,
      type: 'bounty',
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Title').text()).toEqual('asdf (ACTIVE)');
});

it('adds (CLOSED) when a bounty is resolved', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: true,
      expired: false,
      type: 'bounty',
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Title').text()).toEqual('asdf (CLOSED)');
});

it('adds (CLOSED) when a bounty is resolved, even if expired', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: true,
      expired: true,
      type: 'bounty',
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Title').text()).toEqual('asdf (CLOSED)');
});

it('adds (EXPIRED) when a bounty has passed it\'s expiration block', () => {
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: false,
      expired: true,
      type: 'bounty',
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Title').text()).toEqual('asdf (EXPIRED)');
});

it('adds update to CardHeaders where bounty.updated is true', () => {
  const bounties = [
    {
      updated: true,
      amount: 123,
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: false,
      expired: true,
      type: 'bounty',
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader').hasClass('update')).toBeTruthy();
});

it('calls renderBounty when a bounty is in bounty list', () => {
  const renderBounty = jest.spyOn(BountyList.prototype, 'renderBounty');
  const bounties = [
    {
      guid: 'asdf',
      assertions: [],
      author: 'author',
      resolved: false,
      expired: true,
      type: 'bounty',
      artifacts: [{'name':'file'}, {'name':'other'}],
    }
  ];
  mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(renderBounty).toHaveBeenCalledTimes(1);
});

it('adds (ACTIVE) to Card headers when neither expired for resolved', () => {
  const bounties = [
    {
      expired: true,
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Title').text()).toEqual('asdf (ACTIVE)');
});

it('adds (CLOSED) when a offer is closed', () => {
  const bounties = [
    {
      closed: true,
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Title').text()).toEqual('asdf (CLOSED)');
});

it('adds update to CardHeaders where offer.updated is true', () => {
  const bounties = [
    {
      updated: true,
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader').hasClass('update')).toBeTruthy();
});

it('adds the initial max value for the offer channel as the subheader', () => {
  const bounties = [
    {
      initial: '100',
      updated: true,
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.CardHeader-Sub').text()).toEqual('100 Nectar (NCT)');
});

it('puts the addr and current balances in the header when walletlist and address specified', () => {

  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    address={address}/>);

  expect(wrapper.find('.Header-Address').text()).toEqual('author1 NCT 1 ETH');
});

it('displays a StatRow with author', () => {
  const bounties = [
    {
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').first().find('.StatContent').text()).toEqual('author');
});

it('displays a StatRow with expert', () => {
  const bounties = [
    {
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(1, 2).find('.StatContent').text()).toEqual('expert');
});

it('displays a StatRow with the amount of the most recent payment', () => {
  const bounties = [
    {
      guid: 'asdf',
      messages: [{type: 'payment', amount: '1000'}, {type: 'payment', amount: '100'}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(2, 3).find('.StatContent').text()).toEqual('1000 Nectar (NCT)');
});

it('displays a StatRow with the number of messages', () => {
  const bounties = [
    {
      guid: 'asdf',
      messages: [{type: 'request', artifacts: [{name: 'file'}, {name: 'other'}]}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(3, 4).find('.StatContent').text()).toEqual('1');
});

it('displays a StatRow with a csv of files in the offer request', () => {
  const bounties = [
    {
      guid: 'asdf',
      messages: [{type: 'request', artifacts: [{name: 'file'}, {name: 'other'}]}],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  const wrapper = mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(wrapper.find('.StatRow').slice(4, 5).find('.StatContent').text()).toEqual('file, other');
});

it('calls renderOffer when an offer is in bounty list', () => {
  const renderOffer = jest.spyOn(BountyList.prototype, 'renderOffer');
  const bounties = [
    {
      guid: 'asdf',
      messages: [],
      author: 'author',
      expert: 'expert',
      resolved: false,
      expired: true,
      type: 'offer',
    }
  ];
  renderOffer.mockClear();
  mount(<BountyList
    address={address}
    wallet={wallet}
    bounties={bounties}/>);

  expect(renderOffer).toHaveBeenCalledTimes(1);
});