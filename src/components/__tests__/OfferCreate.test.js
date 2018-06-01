import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferCreate from '../OfferCreate';
import HttpOfferCreate from '../OfferCreate/http';

const wallet = {homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1'};
const address = 'author';

const mockCreateOffer = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve());
});

jest.mock('../OfferCreate/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      createOffer: mockCreateOffer,
    };
  });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.setMock('react-transition-group', require('../__mocks__/react-transition-group'));
  HttpOfferCreate.mockClear();
  HttpOfferCreate.mockImplementation(() => {
    return {
      createOffer: mockCreateOffer,
    };
  });
});

it('renders without crashing', () => {
  const wrapper = render(<OfferCreate wallet={wallet}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('disables the button when max reward is less than 0.0625', (done) =>{
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();
  
  instance.onDurationChanged('300');
  instance.onExpertChanged('0xAF8302a3786A35abEDdF19758067adc9a23597e5');
  instance.onRewardChanged('.006');

  wrapper.setState({}, () => {
    try {
      expect(wrapper.find('.Offer-Create-Upload').find('button').props().disabled).toBeTruthy();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('disables the button when duration is 0', (done) => {
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();
  
  instance.onDurationChanged('0');
  instance.onExpertChanged('0xAF8302a3786A35abEDdF19758067adc9a23597e5');
  instance.onRewardChanged('1');

  wrapper.setState({}, () => {
    try {
      expect(wrapper.find('.Offer-Create-Upload').find('button').props().disabled).toBeTruthy();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('disables the button when duration is negative', (done) => {
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  instance.onDurationChanged('-300');
  instance.onExpertChanged('0xAF8302a3786A35abEDdF19758067adc9a23597e5');
  instance.onRewardChanged('1');

  wrapper.setState({}, () => {
    try {
      expect(wrapper.find('.Offer-Create-Upload').find('button').props().disabled).toBeTruthy();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('disables the button when expert address is not an ethereum address', (done) => {
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  instance.onDurationChanged('300');
  instance.onExpertChanged('0x000sdf7h');
  instance.onRewardChanged('1');

  wrapper.setState({}, () => {
    try {
      expect(wrapper.find('.Offer-Create-Upload').find('button').props().disabled).toBeTruthy();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('enables the button when reward, duration and expert are filled with valid values', (done) => {
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  instance.onDurationChanged('300');
  instance.onExpertChanged('0xAF8302a3786A35abEDdF19758067adc9a23597e5');
  instance.onRewardChanged('1');

  wrapper.setState({}, () => {
    try {
      expect(wrapper.find('.Offer-Create-Upload').find('button').props().disabled).toBeFalsy();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls createOffer when the button is clicked', (done) => {
  const createOffer = jest.spyOn(OfferCreate.prototype, 'createOffer');
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  instance.onDurationChanged('300');
  instance.onExpertChanged('0xAF8302a3786A35abEDdF19758067adc9a23597e5');
  instance.onRewardChanged('1');

  wrapper.setState({}, () => {
    wrapper.find('.Offer-Create-Upload').find('button').simulate('click');
    try {
      expect(createOffer).toHaveBeenCalledTimes(1);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls http.createOffer when onWalletChangedHandler is called with true', (done) => {
  const wrapper = mount(<OfferCreate 
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  wrapper.setState({
    duration: '300',
    reward: '1',
    expert: '0xAF8302a3786A35abEDdF19758067adc9a23597e5'
  }, () => {
    instance.createOffer()
      .then(() => {
        try {
          expect(mockCreateOffer).toHaveBeenCalledWith(
            '0xAF8302a3786A35abEDdF19758067adc9a23597e5',
            '1000000000000000000',
            300);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});

it('calls prop addOffer if posted successfully', (done) => {
  const addOffer = jest.fn();
  const wrapper = mount(<OfferCreate 
    addOffer={addOffer}
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  wrapper.setState({
    duration: '300',
    reward: '1',
    expert: '0xAF8302a3786A35abEDdF19758067adc9a23597e5'
  }, () => {
    instance.createOffer()
      .then(() => {
        try {
          expect(addOffer).toHaveBeenCalledTimes(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});

it('calls prop onError when http.createOffer fails', (done) => {
  const mockBadCreateOffer = jest.fn().mockImplementation(() => {
    return new Promise((result, reject) => {
      const error = {
        status: 401,
      };
      reject(error);
    });
  });
  HttpOfferCreate.mockImplementation(() => {
    return {
      createOffer: mockBadCreateOffer
    };
  });
  const onError = jest.fn();
  const wrapper = mount(<OfferCreate 
    onError={onError}
    address={address}
    wallet={wallet}/>);
  const instance = wrapper.instance();

  wrapper.setState({
    duration: '300',
    reward: '1',
    expert: '0xAF8302a3786A35abEDdF19758067adc9a23597e5'
  }, () => {
    instance.createOffer().then(() => {
      try {
        expect(onError).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
  });
});