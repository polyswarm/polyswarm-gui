import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferPay from '../OfferPay';
import HttpOfferPay from '../OfferPay/http';

const offer = {
  author: 'author',
  expert: 'expert',
  remaining: '100',
  closed: false,
  messages: [
    {
      type: 'payment',
      amount: '.5'
    },
    {
      type: 'payment',
      amount: '.0625'
    },
  ]
};

const walletList = [
  {address:'author', nct: '1', eth: '1'},
  {address:'demo', nct: '1', eth: '1'},
  {address:'omed', nct: '1', eth: '1'}
];

const mockPay = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve());
});

jest.mock('../OfferPay/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      pay: mockPay,
    };
  });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.setMock('react-transition-group', require('../__mocks__/react-transition-group'));
  HttpOfferPay.mockClear();
  HttpOfferPay.mockImplementation(() => {
    return {
      pay: mockPay,
    };
  });
});

it('renders without crashing', () => {
  const wrapper = render(<OfferPay offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('sets reward when input entered into field', () => {
  const setState = jest.spyOn(OfferPay.prototype, 'setState');
  const wrapper = mount(<OfferPay offer={offer}
    walletList={walletList}
    last={'.5'} />);
  setState.mockClear();

  wrapper.find('input').simulate('change', {target:{value: '1'}});

  expect(setState.mock.calls[0][0]).toEqual({reward: '1'});
});

it('displays an error when nectar is below 0.0625', () => {
  const setState = jest.spyOn(OfferPay.prototype, 'setState');
  const wrapper = mount(<OfferPay offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  setState.mockClear();

  wrapper.find('input').simulate('change', {target:{value: '0.01'}});

  expect(setState.mock.calls[1][0]).toEqual({reward_error: 'Reward below 0.0625 minimum.'});
});

it('displays an error when nectar is below the latest payment', () => {
  const setState = jest.spyOn(OfferPay.prototype, 'setState');
  const wrapper = mount(<OfferPay offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  setState.mockClear();

  wrapper.find('input').simulate('change', {target:{value: '0.4'}});

  expect(setState.mock.calls[1][0]).toEqual({reward_error: 'Reward must be higher than last payment of 0.5.'});
});

it('calls payExpert when onWalletChangedHandler is called with true', () => {
  const payExpert = jest.spyOn(OfferPay.prototype, 'payExpert');
  const wrapper = mount(<OfferPay offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  const instance = wrapper.instance();
  wrapper.setState({reward: 5});

  instance.onWalletChangeHandler(true);

  expect(payExpert).toHaveBeenCalledTimes(1);
});

it('calls http.pay when onWalletChangedHandler is called with true', (done) => {
  const wrapper = mount(<OfferPay offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  const instance = wrapper.instance();
  wrapper.setState({reward: '5'});

  instance.onWalletChangeHandler(true)
    .then(() => {
      try {
        expect(mockPay).toHaveBeenCalledTimes(1);
        done();
      } catch (e) {
        done.fail(e);
      }
    });

});

it('calls addMessage when http.pay success', (done) => {
  const addMessage = jest.fn();
  const wrapper = mount(<OfferPay 
    addMessage={addMessage}
    offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  const instance = wrapper.instance();
  wrapper.setState({reward: 5});

  instance.payExpert()
    .then(() => {
      try{
        expect(addMessage).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('calls onError when http.pay fails', (done) => {
  const mockBadPay = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error = {
        status: 401,
      };
      reject(error);
    });
  });
  HttpOfferPay.mockImplementation(() => {
    return {
      pay: mockBadPay,
    };
  });
  const onError = jest.fn();
  const wrapper = mount(<OfferPay
    onError={onError}
    offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  const instance = wrapper.instance();
  wrapper.setState({reward: 5});

  instance.payExpert()
    .then(() => {
      try{
        expect(onError).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('opens the modal when button is clicked', () => {
  const wrapper = mount(<OfferPay
    offer={offer}
    walletList={walletList}
    last={'.5'}/>);
  wrapper.setState({reward: 5});

  wrapper.find('.OfferPay-Content').find('.Button').simulate('click');

  expect(wrapper.find('.ModalPassword')).toHaveLength(1);
});