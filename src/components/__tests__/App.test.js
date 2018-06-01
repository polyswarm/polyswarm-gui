import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import LocalStorage from '../__mocks__/localstorage';
import App from '../App';
import HttpApp from '../App/http';

const mockUnlockWallet = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(true);
  });
});

const mockGetWallets = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve(['asdf', 'demo']);
  });
});

const mockGetBounty = jest.fn().mockImplementation(bounty => {
  return new Promise(resolve => {
    resolve({
      amount: '62500000000000000',
      author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
      expiration: 4563,
      guid: bounty.guid,
      resolved: false,
      uri: 'QmTcKufUeYYdT4YYAZsv25FNdeJ9q2NyCKLW3CeN4H69fw',
      verdicts: [false],
      updated: false,
      assertions: [
        {
          author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
          bid: '.7',
          verdicts: [true],
          metadata: 'malware'
        }
      ]
    });
  });
});

const mockGetEth = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve('1000000000000000000'));
});

const mockGetNct = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve('1000000000000000000'));
});

const mockListenForAssertions = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve();
  });
});

jest.mock('../App/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      getBounty: mockGetBounty,
      getWallets: mockGetWallets,
      getUnlockedWallet: mockUnlockWallet,
      getEth: mockGetEth,
      getNct: mockGetNct,
      listenForAssertions: mockListenForAssertions
    };
  });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.setMock(
    'react-transition-group',
    require('../__mocks__/react-transition-group')
  );
  HttpApp.mockClear();
  HttpApp.mockImplementation(() => {
    return {
      getBounty: mockGetBounty,
      getWallets: mockGetWallets,
      getUnlockedWallet: mockUnlockWallet,
      getEth: mockGetEth,
      getNct: mockGetNct,
      listenForAssertions: mockListenForAssertions
    };
  });
});

it('renders without crashing', () => {
  const wrapper = render(<App />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows empty bounty list when no bounties found', () => {
  const wrapper = mount(<App />);
  wrapper.setState({ first: false });
  expect(wrapper.find('.BountyList')).toHaveLength(1);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls setState with createBounty:true when onCreateBounty is called', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const bounties = [{ guid: 'asdf' }];
  const active = 0;
  wrapper.setState({ first: false, bounties: bounties, active: active });
  const setState = jest.spyOn(App.prototype, 'setState');

  instance.onCreateBounty();

  expect(setState).toHaveBeenCalledWith({ active: -1, createBounty: true });
});

it('shows create bounty when createBounty is true.', () => {
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = 0;

  wrapper.setState({
    first: false,
    createBounty: true,
    bounties: bounties,
    active: active
  });

  expect(wrapper.find('.BountyCreate')).toHaveLength(1);
});

it('calls setState with createOffer:true when onCreateOffer is called', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const bounties = [{ guid: 'asdf' }];
  const active = 0;
  wrapper.setState({ first: false, bounties: bounties, active: active });
  const setState = jest.spyOn(App.prototype, 'setState');

  instance.onCreateOffer();

  expect(setState).toHaveBeenCalledWith({ active: -1, createOffer: true });
});

it('shows create offer when createOffer is true.', () => {
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = 0;

  wrapper.setState({
    first: false,
    createOffer: true,
    bounties: bounties,
    active: active
  });

  expect(wrapper.find('.OfferCreate')).toHaveLength(1);
});

it('calls setState with relay:true when onOpenRelay is called', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const bounties = [{ guid: 'asdf' }];
  const active = 0;
  wrapper.setState({ first: false, bounties: bounties, active: active });
  const setState = jest.spyOn(App.prototype, 'setState');

  instance.onOpenRelay();

  expect(setState).toHaveBeenCalledWith({ active: -1, relay: true });
});

it('shows relay when relay is true.', () => {
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = 0;

  wrapper.setState({
    first: false,
    relay: true,
    bounties: bounties,
    active: active,
    address: 'author',
    wallet: { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' }
  });

  expect(wrapper.find('.Relay')).toHaveLength(1);
});

it('calls onOpenRelay when dropdown button is clicked.', () => {
  const onOpenRelay = jest.spyOn(App.prototype, 'onOpenRelay');
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = -1;
  wrapper.setState({
    first: false,
    relay: false,
    createBounty: false,
    createOffer: false,
    bounties: bounties,
    active: active,
    address: 'author',
    wallet: { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' }
  });

  wrapper
    .find('.Header')
    .find('.Dropdown-Icon')
    .simulate('mouseEnter');
  wrapper
    .find('.Header')
    .find('.Dropdown')
    .find('p')
    .first()
    .simulate('click');

  expect(onOpenRelay).toHaveBeenCalledTimes(1);
});

it('open modal on second dropdown click', () => {
  const onRequestWalletChange = jest.spyOn(
    App.prototype,
    'onRequestWalletChange'
  );
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = -1;
  wrapper.setState({
    first: false,
    relay: false,
    createBounty: false,
    createOffer: false,
    bounties: bounties,
    active: active,
    address: 'author',
    wallet: { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' }
  });

  wrapper
    .find('.Header')
    .find('.Dropdown-Icon')
    .simulate('mouseEnter');
  wrapper
    .find('.Header')
    .find('.Dropdown')
    .find('p')
    .slice(1, 2)
    .simulate('click');

  expect(onRequestWalletChange).toHaveBeenCalledTimes(1);
});

it('calls onCreateBounty when header button is clicked.', () => {
  const onCreateBounty = jest.spyOn(App.prototype, 'onCreateBounty');
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = -1;
  wrapper.setState({ first: false, bounties: bounties, active: active });

  wrapper
    .find('.Header')
    .find('.Button')
    .slice(0, 1)
    .simulate('click');

  expect(onCreateBounty).toHaveBeenCalledTimes(1);
});

it('calls onCreateOffer when header button is clicked.', () => {
  const onCreateOffer = jest.spyOn(App.prototype, 'onCreateOffer');
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = -1;
  wrapper.setState({
    first: false,
    relay: false,
    createBounty: false,
    createOffer: false,
    bounties: bounties,
    active: active,
    address: 'author',
    wallet: { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' }
  });

  wrapper
    .find('.Header')
    .find('.Button')
    .slice(1, 2)
    .simulate('click');

  expect(onCreateOffer).toHaveBeenCalledTimes(1);
});

it('shows BountyInfo when at least one bounty & active selects it', () => {
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf', type: 'bounty' }];
  const active = 0;
  wrapper.setState({ first: false, bounties: bounties, active: active });
  expect(wrapper.find('.Bounty-Info')).toHaveLength(1);
});

it('shows OfferInfo when at least one offer & active selects it', () => {
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf', type: 'offer', author: 'asdf' }];
  const active = 0;
  wrapper.setState({
    first: false,
    relay: false,
    createBounty: false,
    createOffer: false,
    bounties: bounties,
    active: active,
    address: 'author',
    wallet: { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' }
  });

  expect(wrapper.find('.Offer-Info')).toHaveLength(1);
});

it('shows BountyList when at least one bounty & active is negative', () => {
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }];
  const active = -1;
  wrapper.setState({ first: false, bounties: bounties, active: active });

  expect(wrapper.find('.BountyList')).toHaveLength(1);
});

it('shows welcome screen on first load', () => {
  const wrapper = mount(<App />);
  expect(wrapper.find('.Welcome')).toHaveLength(1);
});

it('stores seen true when welcome closed', () => {
  const wrapper = mount(<App />);
  wrapper
    .find('.Welcome')
    .find('button')
    .simulate('click');
  expect(JSON.parse(localStorage.getItem('seen'))).toBeTruthy();
});

it('calls select when card is clicked', () => {
  const select = jest.spyOn(App.prototype, 'onSelectBounty');
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = -1;
  wrapper.setState({ first: false, bounties: bounties, active: active });

  wrapper
    .find('.Card')
    .first()
    .simulate('click');

  expect(select).toHaveBeenCalledTimes(1);
  expect(select).toHaveBeenCalledWith(0);
});

it('calls select when card menu view button is clicked', () => {
  const select = jest.spyOn(App.prototype, 'onSelectBounty');
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = -1;
  wrapper.setState({ first: false, bounties: bounties, active: active });

  wrapper
    .find('.CardHeader')
    .find('.Dropdown-Choices')
    .first()
    .find('p')
    .first()
    .simulate('click');

  expect(select).toHaveBeenCalledTimes(1);
  expect(select).toHaveBeenCalledWith(0);
});

it('updates the state when onSelectBounty called', () => {
  const wrapper = shallow(<App />);
  const bounties = [
    { guid: 'asdf', updated: true },
    { guid: 'demo', updated: true }
  ];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });

  const setState = jest.spyOn(App.prototype, 'setState');
  const instance = wrapper.instance();
  instance.onSelectBounty(1);

  expect(setState).toHaveBeenCalledWith({
    active: 1,
    bounties: [
      {
        guid: 'asdf',
        updated: true
      },
      {
        guid: 'demo',
        updated: false
      }
    ]
  });
});

it('sets updated to false on bounty when onSelectBounty clicked', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [
    { guid: 'asdf', updated: true },
    { guid: 'demo', updated: true }
  ];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(0);

  expect(setState).toHaveBeenCalledWith({
    active: 0,
    bounties: [
      { guid: 'asdf', updated: false },
      { guid: 'demo', updated: true }
    ]
  });
});

it('does not update the state when onSelectBounty called with negative', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with null', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does not update the state when onSelectBounty called with out of bounds', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onSelectBounty(1000);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('calls remove when a card delete is clicked', () => {
  const remove = jest.spyOn(App.prototype, 'onRemoveBounty');
  const wrapper = mount(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = -1;
  wrapper.setState({ first: false, bounties: bounties, active: active });

  wrapper
    .find('.CardHeader')
    .find('.Dropdown-Choices')
    .first()
    .find('p')
    .last()
    .simulate('click');

  expect(remove).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith(0);
});

it('updates the state when onRemoveBounty called', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = -1;
  wrapper.setState({ first: false, bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onRemoveBounty(1);

  expect(setState).toHaveBeenCalledWith({
    active: -1,
    bounties: [{ guid: 'asdf' }]
  });
});

it('removes the value at the index passed in onRemoveBounty', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = -1;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();
  const instance = wrapper.instance();
  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({
    active: -1,
    bounties: [{ guid: 'demo' }]
  });
});

it("doesn't remove anything if onRemoveBounty called with negative", () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();
  const instance = wrapper.instance();

  instance.onRemoveBounty(-1);

  expect(setState).toHaveBeenCalledTimes(0);
});

it("doesn't remove anything if onRemoveBounty called with null", () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onRemoveBounty(null);

  expect(setState).toHaveBeenCalledTimes(0);
});

it("doesn't remove anything if onRemoveBounty called with out of bounds", () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const bounties = [{ guid: 'asdf' }, { guid: 'demo' }];
  const active = 0;
  wrapper.setState({ bounties: bounties, active: active });
  setState.mockClear();

  const instance = wrapper.instance();
  instance.onRemoveBounty(2);

  expect(setState).toHaveBeenCalledTimes(0);
});

it('calls setState during onAddBounty', done => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  setState.mockClear();

  const promise = instance.onAddBounty({ guid: 'asdf' });
  promise.then(() => {
    try {
      expect(setState.mock.calls[1][0]).toEqual({
        bounties: [
          {
            amount: '62500000000000000',
            author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
            expiration: 4563,
            guid: 'asdf',
            resolved: false,
            uri: 'QmTcKufUeYYdT4YYAZsv25FNdeJ9q2NyCKLW3CeN4H69fw',
            verdicts: [false],
            updated: true,
            assertions: [
              {
                author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
                bid: '.7',
                verdicts: [true],
                metadata: 'malware'
              }
            ]
          }
        ]
      });
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls setState during onAddBounty with existing values', done => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  setState.mockClear();

  const promise = instance.onAddBounty({ guid: 'existing' }).then(() => {
    return instance.onAddBounty({ guid: 'asdf' });
  });

  promise.then(() => {
    try {
      expect(mockGetBounty).toHaveBeenCalledTimes(2);
      expect(setState.mock.calls[4][0]).toEqual({
        bounties: [
          {
            amount: '62500000000000000',
            author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
            expiration: 4563,
            guid: 'existing',
            resolved: false,
            uri: 'QmTcKufUeYYdT4YYAZsv25FNdeJ9q2NyCKLW3CeN4H69fw',
            verdicts: [false],
            updated: true,
            assertions: [
              {
                author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
                bid: '.7',
                verdicts: [true],
                metadata: 'malware'
              }
            ]
          },
          {
            amount: '62500000000000000',
            author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
            expiration: 4563,
            guid: 'asdf',
            resolved: false,
            uri: 'QmTcKufUeYYdT4YYAZsv25FNdeJ9q2NyCKLW3CeN4H69fw',
            verdicts: [false],
            updated: true,
            assertions: [
              {
                author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
                bid: '.7',
                verdicts: [true],
                metadata: 'malware'
              }
            ]
          }
        ]
      });
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls storeBounties after onAddBounty', done => {
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState();

  const promise = instance.onAddBounty({ guid: 'asdf' });

  promise.then(() => {
    try {
      expect(storeBounties.mock.calls[0][0]).toEqual([
        {
          amount: '62500000000000000',
          author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
          expiration: 4563,
          guid: 'asdf',
          resolved: false,
          uri: 'QmTcKufUeYYdT4YYAZsv25FNdeJ9q2NyCKLW3CeN4H69fw',
          verdicts: [false],
          updated: true,
          assertions: [
            {
              author: '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
              bid: '.7',
              verdicts: [true],
              metadata: 'malware'
            }
          ]
        }
      ]);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls addRequest when onAddBounty is called', done => {
  const addRequest = jest.spyOn(App.prototype, 'addRequest');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  addRequest.mockClear();

  const promise = instance.onAddBounty({ guid: 'asdf' });

  promise.then(() => {
    try {
      expect(addRequest).toHaveBeenCalledTimes(1);
      expect(addRequest).toHaveBeenCalledWith('Getting Bounty', 'asdf');
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls removeRequest when onAddBounty finishes', done => {
  const removeRequest = jest.spyOn(App.prototype, 'removeRequest');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  removeRequest.mockClear();

  const promise = instance.onAddBounty({ guid: 'asdf' });

  promise.then(() => {
    try {
      expect(removeRequest).toHaveBeenCalledTimes(1);
      expect(removeRequest).toHaveBeenCalledWith('Getting Bounty', 'asdf');
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls addRequest when getData is called', done => {
  const addRequest = jest.spyOn(App.prototype, 'addRequest');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  addRequest.mockClear();

  const promise = instance.getData();

  promise.then(() => {
    try {
      expect(addRequest).toHaveBeenCalledTimes(1);
      expect(addRequest.mock.calls[0][0]).toEqual('Refreshing');
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls removeRequest when getData finishes', done => {
  const removeRequest = jest.spyOn(App.prototype, 'removeRequest');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  removeRequest.mockClear();

  const promise = instance.getData();

  promise.then(() => {
    try {
      expect(removeRequest).toHaveBeenCalledTimes(1);
      expect(removeRequest.mock.calls[0][0]).toEqual('Refreshing');
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it("doesn't call increments when getWallets is called", done => {
  const addRequest = jest.spyOn(App.prototype, 'addRequest');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  addRequest.mockClear();

  const promise = instance.getWallet();

  promise.then(() => {
    try {
      expect(addRequest).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it("doesn't call decrement when getWallets finishes", done => {
  const removeRequest = jest.spyOn(App.prototype, 'removeRequest');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  removeRequest.mockClear();

  const promise = instance.getWallet();

  promise.then(() => {
    try {
      expect(removeRequest).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('does nothing when remove request called with no existing request', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  setState.mockClear();

  instance.removeRequest('asdf', 'notHere');

  expect(setState).toHaveBeenCalledTimes(0);
});

it('does nothing when remove request called with id not in the requests', done => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  wrapper.setState(
    { requestsInProgress: [{ title: 'demo', id: 'demo' }] },
    () => {
      setState.mockClear();
      //act
      instance.removeRequest('asdf', 'notHere');

      //assert
      try {
        expect(setState).toHaveBeenCalledTimes(0);
        done();
      } catch (error) {
        done.fail(error);
      }
    }
  );
});

it('removes the requests when it is the only existing request', done => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  wrapper.setState(
    { requestsInProgress: [{ title: 'demo', id: 'demo' }] },
    () => {
      setState.mockClear();

      //act
      instance.removeRequest('demo', 'demo');

      //assert
      try {
        expect(setState).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledWith({ requestsInProgress: [] });
        done();
      } catch (error) {
        done.fail(error);
      }
    }
  );
});

it('removes the requests from the list of existing requests', done => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  const requests = [
    { title: 'demo', id: 'demo' },
    { title: 'asdf', id: 'asdf' }
  ];
  wrapper.setState({ requestsInProgress: requests }, () => {
    setState.mockClear();

    //act
    instance.removeRequest('demo', 'demo');

    //assert
    try {
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith({
        requestsInProgress: [{ title: 'asdf', id: 'asdf' }]
      });
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('removes the requests from the last index of existing requests', done => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  const requests = [
    { title: 'demo', id: 'demo' },
    { title: 'asdf', id: 'asdf' }
  ];
  wrapper.setState({ requestsInProgress: requests }, () => {
    setState.mockClear();

    //act
    instance.removeRequest('asdf', 'asdf');

    //assert
    try {
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith({
        requestsInProgress: [{ title: 'demo', id: 'demo' }]
      });
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('sets state with added request when addRequest called', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  setState.mockClear();

  instance.addRequest('asdf', 'asdf');

  expect(setState).toHaveBeenCalledWith({
    requestsInProgress: [{ title: 'asdf', id: 'asdf' }]
  });
});

it('adds request to existing request when addRequest called', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />, { disableLifecycleMethods: true });
  const instance = wrapper.instance();
  instance.addRequest('asdf', 'asdf');
  setState.mockClear();

  instance.addRequest('fdsa', 'fdsa');

  expect(setState).toHaveBeenCalledWith({
    requestsInProgress: [
      { title: 'asdf', id: 'asdf' },
      { title: 'fdsa', id: 'fdsa' }
    ]
  });
});

it('calls setState during onRemoveBounty', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  wrapper.setState({
    bounties: [
      {
        guid: 'existing',
        update: false,
        author: '',
        amount: '',
        artifactURI: '',
        expirationBlock: '',
        resolved: '',
        verdicts: ''
      }
    ]
  });
  setState.mockClear();

  instance.onRemoveBounty(0);

  expect(setState).toHaveBeenCalledWith({ active: -1, bounties: [] });
});

it('calls storeBounties after onRemoveBounty', () => {
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  wrapper.setState({
    bounties: [
      {
        guid: 'existing',
        update: false,
        author: '',
        amount: '',
        artifactURI: '',
        expirationBlock: '',
        resolved: '',
        verdicts: ''
      }
    ]
  });
  storeBounties.mockClear();

  instance.onRemoveBounty(0);

  expect(storeBounties).toHaveBeenCalledWith([]);
});

it("doesn't call storeBounties when setState called with identical set of bounties", done => {
  const mockEmptyBounty = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve();
    });
  });
  HttpApp.mockImplementation(() => {
    return {
      getBounty: mockEmptyBounty,
      getWallets: mockGetWallets,
      getUnlockedWallet: mockUnlockWallet,
      getEth: mockGetEth,
      getNct: mockGetNct,
      listenForAssertions: mockListenForAssertions
    };
  });
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
  const bounties = [
    {
      guid: 'existing',
      update: false,
      author: '',
      amount: '',
      artifactURI: '',
      expirationBlock: '',
      resolved: '',
      verdicts: ''
    }
  ];
  localStorage.setItem('bounties', JSON.stringify(bounties));
  const wrapper = shallow(<App />);
  storeBounties.mockClear();

  wrapper.setState({ bounties: bounties }, () => {
    try {
      expect(storeBounties).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls storeBounties when setState called with different set of bounties', done => {
  const mockEmptyBounty = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve();
    });
  });
  HttpApp.mockImplementation(() => {
    return {
      getBounty: mockEmptyBounty,
      getWallets: mockGetWallets,
      getUnlockedWallet: mockUnlockWallet,
      getEth: mockGetEth,
      getNct: mockGetNct,
      listenForAssertions: mockListenForAssertions
    };
  });
  const storeBounties = jest.spyOn(App.prototype, 'storeBounties');
  const bounties = [
    {
      guid: 'existing',
      update: false,
      author: '',
      amount: '',
      artifactURI: '',
      expirationBlock: '',
      resolved: '',
      verdicts: ''
    }
  ];
  localStorage.setItem('bounties', JSON.stringify(bounties));
  const wrapper = mount(<App />);
  storeBounties.mockClear();
  bounties.push({
    guid: 'demo',
    update: false,
    author: '',
    amount: '',
    artifactURI: '',
    expirationBlock: '',
    resolved: '',
    verdicts: ''
  });
  wrapper.setState({ bounties: bounties }, () => {
    try {
      expect(storeBounties).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('stores bounties into localstore when storeBounties is called', () => {
  const setItem = jest.spyOn(LocalStorage.prototype, 'setItem');
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const bounties = [
    {
      guid: 'existing',
      update: false,
      author: '',
      amount: '',
      artifactURI: '',
      expirationBlock: '',
      resolved: '',
      verdicts: ''
    }
  ];

  instance.storeBounties(bounties);

  expect(setItem).toHaveBeenCalledTimes(2);
  expect(setItem.mock.calls[1]).toEqual(['bounties', JSON.stringify(bounties)]);
});

it('reads bounties from localStorage and puts into state on startup', () => {
  const bounties = JSON.stringify([
    {
      guid: 'existing',
      update: false,
      author: 'asdf',
      amount: 'asdf',
      artifactURI: 'asdf',
      expirationBlock: 'asdf',
      resolved: 'asdf',
      verdicts: 'asdf'
    }
  ]);
  localStorage.setItem('bounties', bounties);

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  expect(instance.state.bounties).toEqual(JSON.parse(bounties));
});

it('reads seen from localStorage and puts it into state as first on startup', () => {
  localStorage.setItem('seen', JSON.stringify(true));
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  expect(instance.state.first).toBeFalsy();
});

it('sets the error message when onPostError is called', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  setState.mockClear();

  instance.onPostError('error');

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState.mock.calls[0][0].errorMessage).toEqual('error');
});

it('shows a Snackbar when there is an error', done => {
  const wrapper = mount(<App />);

  wrapper.setState(
    { first: false, create: false, errorMessage: 'error' },
    () => {
      try {
        expect(wrapper.find('.Snackbar')).toHaveLength(1);
        expect(
          wrapper
            .find('.Snackbar')
            .find('p')
            .text()
        ).toEqual('error');
        done();
      } catch (error) {
        done.fail(error);
      }
    }
  );
});

it('sets state with active -1 and createBounty, createOffer and relay false when onBackPressed called', () => {
  const setState = jest.spyOn(App.prototype, 'setState');
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  setState.mockClear();
  instance.onBackPressed();

  expect(setState).toHaveBeenCalledWith({
    active: -1,
    createBounty: false,
    createOffer: false,
    relay: false
  });
});
