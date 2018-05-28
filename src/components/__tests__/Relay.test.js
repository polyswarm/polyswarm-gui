import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Relay from '../Relay';
import HttpRelay from '../Relay/http';

const mockDeposit = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve());
});

const mockWithdraw = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve());
});

jest.mock('../Relay/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      deposit: mockDeposit,
      withdraw: mockWithdraw
    };
  });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.setMock('react-transition-group', require('../__mocks__/react-transition-group'));
  HttpRelay.mockClear();
  HttpRelay.mockImplementation(() => {
    return {
      deposit: mockDeposit,
      withdraw: mockWithdraw
    };
  });
});

it('renders without crashing', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = render(<Relay
    address={0}
    walletList={walletList}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onNectarChanged when AnimatedInput is changed', () => {
  const onNectarChanged = jest.spyOn(Relay.prototype, 'onNectarChanged');
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '1'}});

  expect(onNectarChanged).toHaveBeenCalledWith('1');
});

it('disables the button when nectar is negative', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '-1'}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('disables the button when nectar is greater than the source balance', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '2'}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('enables the Go button when nectar meets length requirements in AnimatedInput', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '1'}});

  expect(wrapper.find('.Button').props().disabled).toBeFalsy();
});

it('disables the Go button when nectar length is 0', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: ''}});

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('calls setstate with the nectar when nectar modified', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);

  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '1'}});

  expect(setState).toHaveBeenCalledWith({nectar: '1', nectar_error: null});
});

it('calls setstate with the nectar & error true when nectar is 0 or lower', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  setState.mockClear();
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '0'}});

  expect(setState).toHaveBeenCalledWith({nectar: '0', nectar_error: 'Must enter a value above 0'});
});

it('calls setState with error when nectar is greater than the main chain balance on withdrawal', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.setState({selected: 1});
  setState.mockClear();
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '1.1'}});

  expect(setState).toHaveBeenCalledWith({nectar: '1.1',
    nectar_error: 'Must enter a value below the source chain\'s balance: 1'});
});

it('calls setState with error when nectar is greater than the main chain balance on deposit', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  setState.mockClear();
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '1.1'}});

  expect(setState).toHaveBeenCalledWith({nectar: '1.1',
    nectar_error: 'Must enter a value below the source chain\'s balance: 1'});
});

it('opens the modal when button is clicked', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.find('.AnimatedInput').find('input').simulate('change', {target: {value: '1'}});
  wrapper.find('.Button').simulate('click');

  expect(wrapper.find('.ModalPassword')).toHaveLength(1);
});

it('calls transfer when onWalletChange handler is called and didUnlock is true', () => {
  const transfer = jest.spyOn(Relay.prototype, 'transfer');
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  wrapper.setState({nectar: '1'});
  instance.onWalletChangeHandler(true);

  expect(transfer).toHaveBeenCalledTimes(1);
});

it('calls onWalletChange when onWalletChange handler is called and didUnlock is true', () => {
  const onWalletChange = jest.fn();
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    onWalletChange={onWalletChange}
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: '1'});
  const instance = wrapper.instance();
  instance.onWalletChangeHandler(true);

  expect(onWalletChange).toHaveBeenCalledTimes(1);
});

it('calls http.deposit when deposit selected', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: '1'});
  const instance = wrapper.instance();
  instance.onWalletChangeHandler(true);

  expect(mockDeposit).toHaveBeenCalledTimes(1);
});

it('calls http.withdraw when withdraw selected', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: '1', selected: 1});
  const instance = wrapper.instance();
  instance.onWalletChangeHandler(true);

  expect(mockWithdraw).toHaveBeenCalledTimes(1);
});

it('calls onError if deposit fails', (done) => {
  const mockBadDeposit = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error = {
        status: 401,
      };
      reject(error);
    });
  });
  HttpRelay.mockImplementation(() => {
    return {
      deposit: mockBadDeposit,
      withdraw: mockWithdraw
    };
  });
  const onError = jest.fn();
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    onError={onError}
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: '1'});
  const instance = wrapper.instance();
  instance.onWalletChangeHandler(true)
    .then(() => {
      try {
        expect(onError).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('calls onError if withdrawal fails', (done) => {
  const mockBadWithdraw = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error = {
        status: 401,
      };
      reject(error);
    });
  });
  HttpRelay.mockImplementation(() => {
    return {
      deposit: mockDeposit,
      withdraw: mockBadWithdraw
    };
  });
  const onError = jest.fn();
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    onError={onError}
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: '1', selected: 1});
  const instance = wrapper.instance();
  instance.onWalletChangeHandler(true)
    .then(() => {
      try {
        expect(onError).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('updates the after field balances when nectar amount entered', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: .5});

  expect(wrapper.find('.ChainInfo').last().find('.StatContent').first().text()).toEqual('0.5 NCT');
  expect(wrapper.find('.ChainInfo').last().find('.StatContent').last().text()).toEqual('1.5 NCT');
});

it('Changes the balances when selected index is changed', () => {
  const walletList= [{address: 'asdf', nct: '1', eth: '0'}];
  const wrapper = mount(<Relay
    address={0}
    walletList={walletList}/>);
  wrapper.setState({nectar: .5, selected: 1});

  expect(wrapper.find('.ChainInfo').last().find('.StatContent').first().text()).toEqual('1.5 NCT');
  expect(wrapper.find('.ChainInfo').last().find('.StatContent').last().text()).toEqual('0.5 NCT');
});