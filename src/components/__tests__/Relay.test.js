import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
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
  jest.setMock(
    'react-transition-group',
    require('../__mocks__/react-transition-group')
  );
  HttpRelay.mockClear();
  HttpRelay.mockImplementation(() => {
    return {
      deposit: mockDeposit,
      withdraw: mockWithdraw
    };
  });
});

const wallet = { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' };
const address = 'author';

it('renders without crashing', () => {
  const wrapper = render(<Relay address={address} wallet={wallet} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls onNectarChanged when AnimatedInput is changed', () => {
  const onNectarChanged = jest.spyOn(Relay.prototype, 'onNectarChanged');

  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '1' } });

  expect(onNectarChanged).toHaveBeenCalledWith('1');
});

it('disables the button when nectar is negative', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '-1' } });

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('disables the button when nectar is greater than the source balance', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '2' } });

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('enables the Go button when nectar meets length requirements in AnimatedInput', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '1' } });

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('disables the Go button when nectar length is 0', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '' } });

  expect(wrapper.find('.Button').props().disabled).toBeTruthy();
});

it('calls setstate with the nectar when nectar modified', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');

  const wrapper = mount(<Relay address={address} wallet={wallet} />);

  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '1' } });

  expect(setState).toHaveBeenCalledWith({
    nectar: '1',
    nectar_error:
      'This feature is disabled until the PolySwarm Sidechain goes live very soon.'
  });
});

it('calls setstate with the nectar & error true when nectar is 0 or lower', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');

  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  setState.mockClear();
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '0' } });

  expect(setState).toHaveBeenCalledWith({
    nectar: '0',
    nectar_error:
      'This feature is disabled until the PolySwarm Sidechain goes live very soon.'
  });
});

it('calls setState with error when nectar is greater than the main chain balance on withdrawal', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');

  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper.setState({ selected: 1 });
  setState.mockClear();
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '1.1' } });

  expect(setState).toHaveBeenCalledWith({
    nectar: '1.1',
    nectar_error:
      'This feature is disabled until the PolySwarm Sidechain goes live very soon.'
  });
});

it('calls setState with error when nectar is greater than the main chain balance on deposit', () => {
  const setState = jest.spyOn(Relay.prototype, 'setState');

  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  setState.mockClear();
  wrapper
    .find('.AnimatedInput')
    .find('input')
    .simulate('change', { target: { value: '1.1' } });

  expect(setState).toHaveBeenCalledWith({
    nectar: '1.1',
    nectar_error:
      'This feature is disabled until the PolySwarm Sidechain goes live very soon.'
  });
});

it('calls transfer when button is clicked', () => {
  const transfer = jest.spyOn(Relay.prototype, 'transfer');

  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper.setState({ nectar: '1' });
  wrapper.find('.Button').simulate('click');

  expect(transfer).toHaveBeenCalledTimes(0);
});

it('calls http.deposit when deposit selected', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper.setState({ nectar: '1' });

  wrapper.find('.Button').simulate('click');

  expect(mockDeposit).toHaveBeenCalledTimes(0);
});

it('calls http.withdraw when withdraw selected', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper.setState({ nectar: '1', selected: 1 });

  wrapper.find('.Button').simulate('click');

  expect(mockWithdraw).toHaveBeenCalledTimes(0);
});

it('calls onError if deposit fails', done => {
  const mockBadDeposit = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error = {
        status: 401
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

  const wrapper = mount(
    <Relay onError={onError} address={address} wallet={wallet} />
  );
  wrapper.setState({ nectar: '1' });
  const instance = wrapper.instance();
  instance.transfer(true).then(() => {
    try {
      expect(onError).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls onError if withdrawal fails', done => {
  const mockBadWithdraw = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error = {
        status: 401
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

  const wrapper = mount(
    <Relay onError={onError} address={address} wallet={wallet} />
  );
  wrapper.setState({ nectar: '1', selected: 1 });
  const instance = wrapper.instance();
  instance.transfer(true).then(() => {
    try {
      expect(onError).toHaveBeenCalledTimes(0);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('updates the after field balances when nectar amount entered', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper.setState({ nectar: 0.5 });

  expect(
    wrapper
      .find('.ChainInfo')
      .last()
      .find('.StatContent')
      .first()
      .text()
  ).toEqual('0.5 NCT');
  expect(
    wrapper
      .find('.ChainInfo')
      .last()
      .find('.StatContent')
      .last()
      .text()
  ).toEqual('1.5 NCT');
});

it('Changes the balances when selected index is changed', () => {
  const wrapper = mount(<Relay address={address} wallet={wallet} />);
  wrapper.setState({ nectar: 0.5, selected: 1 });

  expect(
    wrapper
      .find('.ChainInfo')
      .last()
      .find('.StatContent')
      .first()
      .text()
  ).toEqual('1.5 NCT');
  expect(
    wrapper
      .find('.ChainInfo')
      .last()
      .find('.StatContent')
      .last()
      .text()
  ).toEqual('0.5 NCT');
});
