import React from 'react';
import {render, shallow, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferRequest from '../OfferRequest';
import HttpRequest from '../OfferRequest/http';

const offer = {
  author: 'author',
  expert: 'expert',
  balance: '100',
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

const mockUploadFiles = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve());
});

const mockSendRequest = jest.fn().mockImplementation(() => {
  return new Promise(resolve => resolve());
});

jest.mock('../OfferRequest/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      sendRequest: mockSendRequest
    };
  });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.setMock('react-transition-group', require('../__mocks__/react-transition-group'));
  HttpRequest.mockClear();
  HttpRequest.mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      sendRequest: mockSendRequest
    };
  });
});

it('renders without crashing', () => {
  const wrapper = render(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('deletes the index 0 when onFileRemoved called', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(0);
  expect(instance.state.files).toHaveLength(1);
  expect(instance.state.files).toEqual([{name: 'omed'}]);
});

it('deletes the file at index when onFileRemoved called', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(1);
  expect(instance.state.files).toHaveLength(1);
  expect(instance.state.files).toEqual([{name: 'demo'}]);
});

it('deletes all files when onClearAll is called', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onClearAll();

  expect(instance.state.files).toHaveLength(0);
  expect(instance.state.files).toEqual([]);
});

it('doesn\'t delete the file at index when out of bounds', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(1000);
  expect(instance.state.files).toHaveLength(2);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}]);
});

it('doesn\'t delete the file at index when negative', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  instance.setState({files});

  //act
  instance.onFileRemoved(-1);
  expect(instance.state.files).toHaveLength(2);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}]);
});

it('doesn\'t throw with an empty file array when onFileRemoved called', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();

  //act
  instance.onFileRemoved(0);
});

it('stores additional files in state.files', () => {
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onMultipleFilesSelected([{name: 'asdf'}]);
  expect(instance.state.files).toHaveLength(3);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}, {name: 'asdf'}]);
});

it('calls sendMessage if onWalletChangeHandler called with true', () => {
  const sendMessage = jest.spyOn(OfferRequest.prototype, 'sendMessage');
  const wrapper = shallow(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();

  instance.onWalletChangeHandler(true);
  
  expect(sendMessage).toHaveBeenCalledTimes(1);
});

it('opens the modal when the button is clicked', () => {
  const wrapper = mount(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  wrapper.find('.OfferRequest-Button').find('button').simulate('click');

  expect(wrapper.find('.ModalPassword')).toHaveLength(1);
});

it('enables the button when at least one file is present', (done) => {
  const wrapper = mount(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  expect(wrapper.find('.OfferRequest-Button').find('button').props().disabled).toBeTruthy();
  wrapper.setState({files}, () => {
    try {
      expect(wrapper.find('.OfferRequest-Button').find('button').props().disabled).toBeFalsy();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('calls upload files when send message is called', (done) => {
  const wrapper = mount(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files}, () => {
    instance.sendMessage()
      .then(() => {
        try {
          expect(mockUploadFiles).toHaveBeenCalledTimes(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});

it('calls send request if upload succeeds', (done) => {
  const wrapper = mount(<OfferRequest 
    offer={offer}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files}, () => {
    instance.sendMessage()
      .then(() => {
        try {
          expect(mockSendRequest).toHaveBeenCalledTimes(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});

it('calls addMessage if sendRequest succeeds', (done) => {
  const addMessage = jest.fn();
  const wrapper = mount(<OfferRequest 
    offer={offer}
    addMessage={addMessage}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files}, () => {
    instance.sendMessage()
      .then(() => {
        try {
          expect(addMessage).toHaveBeenCalledTimes(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});

it('calls onError if uploadFiles fails', (done) => {
  const mockBadUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error =  {
        status: 401
      };
      reject(error);
    });
  });
  
  HttpRequest.mockImplementation(() => {
    return {
      uploadFiles: mockBadUploadFiles,
      sendRequest: mockSendRequest
    };
  });
  const onError = jest.fn();
  const wrapper = mount(<OfferRequest 
    offer={offer}
    onError={onError}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files}, () => {
    instance.sendMessage()
      .then(() => {
        try {
          expect(onError).toHaveBeenCalledTimes(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});

it('calls onError if sendRequest fails', (done) => {
  const mockBadSendRequest = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const error =  {
        status: 401
      };
      reject(error);
    });
  });
  
  HttpRequest.mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      sendRequest: mockBadSendRequest
    };
  });
  const onError = jest.fn();
  const wrapper = mount(<OfferRequest 
    offer={offer}
    onError={onError}
    walletList={walletList}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files}, () => {
    instance.sendMessage()
      .then(() => {
        try {
          expect(onError).toHaveBeenCalledTimes(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
  });
});