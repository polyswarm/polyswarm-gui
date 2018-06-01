import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyCreate from '../BountyCreate';
import Http from '../BountyCreate/http';

const mockUploadFiles = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve();
  });
});

const mockUploadBounty = jest.fn().mockImplementation(() => {
  return new Promise(resolve => {
    resolve();
  });
});

jest.mock('../BountyCreate/http', () => {
  // Works and lets you check for constructor calls:
  return jest.fn().mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      uploadBounty: mockUploadBounty,
    };
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  Http.mockClear();
  mockUploadFiles.mockClear();
  mockUploadBounty.mockClear();
});

const wallet = {homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1'};
const address = 'author';

it('renders without crashing', () => {
  const wrapper = render(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('deletes the index 0 when onFileRemoved called', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onFileRemoved(0);
  expect(instance.state.files).toHaveLength(1);
  expect(instance.state.files).toEqual([{name: 'omed'}]);
});

it('deletes the file at index when onFileRemoved called', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onFileRemoved(1);
  expect(instance.state.files).toHaveLength(1);
  expect(instance.state.files).toEqual([{name: 'demo'}]);
});

it('deletes all files when onClearAll is called', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onClearAll();

  expect(instance.state.files).toHaveLength(0);
  expect(instance.state.files).toEqual([]);
});

it('doesn\'t delete the file at index when out of bounds', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onFileRemoved(1000);
  expect(instance.state.files).toHaveLength(2);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}]);
});

it('doesn\'t delete the file at index when negative', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files});

  //act
  instance.onFileRemoved(-1);
  expect(instance.state.files).toHaveLength(2);
  expect(instance.state.files).toEqual([{name: 'demo'}, {name: 'omed'}]);
});

it('doesn\'t throw with an empty file array when onFileRemoved called', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();

  //act
  instance.onFileRemoved(0);
});

it('stores additional files in state.files', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
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

it('calls uploadFiles when all parameters are met (files, addBounty, url)', (done) => {
  const addBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  // act
  instance.createBounty()
    .then(() => {
      try {
        // assert
        expect(mockUploadFiles).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('doesn\'t call uploadFiles when parameters are missing', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const instance = wrapper.instance();

  const state = {
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  // act
  instance.createBounty();
  // assert
  expect(mockUploadFiles).toHaveBeenCalledTimes(0);
});

it('doesn\'t call uploadBounty when uploadFiles fails', () => {
  const mockBadUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      reject();
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockBadUploadFiles,
      uploadBounty: mockUploadBounty,
    };
  });

  const addBounty = jest.fn();

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  // act
  instance.createBounty();

  // assert
  expect(mockUploadBounty).toHaveBeenCalledTimes(0);
});

it('calls uploadBounty when uploadFiles succeeds', (done) => {
  const mockGoodUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(['demo', 'asdf']);
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockGoodUploadFiles,
      uploadBounty: mockUploadBounty,
    };
  });

  const addBounty = jest.fn();

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'0.0625',
    duration: '300',
  };
  wrapper.setState(state);

  // act
  instance.createBounty()
    .then(() => {
      // assert
      try {
        expect(mockUploadBounty).toHaveBeenCalledWith('author', '62500000000000000', ['demo', 'asdf'], 300);
        expect(mockUploadBounty).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('calls addBounty when upload bounty is a success', (done) => {
  const mockGoodUploadFiles = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(['demo', 'asdf']);
    });
  });
  const mockGoodUploadBounty = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      resolve('asdf');
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockGoodUploadFiles,
      uploadBounty: mockGoodUploadBounty,
    };
  });

  const addBounty = jest.fn();

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  // act
  instance.createBounty()
    .then(() => {
    // assert
      try {
        expect(addBounty).toHaveBeenCalledWith('asdf');
        expect(addBounty).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('sets errors to null when uploads complete', (done) => {
  const addBounty = jest.fn();
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  const setStateMock = jest.spyOn(BountyCreate.prototype, 'setState');

  instance.createBounty()
    .then(() => {

      // assert
      try {
        expect(setStateMock).toHaveBeenLastCalledWith({error: null, files: []});
        expect(setStateMock).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('has uploading true after calling createBounty', (done) => {
  const setState = jest.spyOn(BountyCreate.prototype, 'setState');
  const addBounty = jest.fn();

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  setState.mockClear();

  // act
  instance.createBounty().then(() => {

  // assert
    try {
      expect(setState.mock.calls[0][0]).toEqual({error: null, files:[]});
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

it('disables button when there are no files', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const files = [
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  
  expect(wrapper.find('.Bounty-Create-Upload').find('button').props().disabled).toBeTruthy();
});

it('disables the button when reward is not set', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    duration: '1',
  };
  wrapper.setState(state);

  expect(wrapper.find('.Bounty-Create-Upload').find('button').props().disabled).toBeTruthy();
});

it('disables the button when reward_error is set', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
    reward_error: 'asdf'
  };
  wrapper.setState(state);

  expect(wrapper.find('.Bounty-Create-Upload').find('button').props().disabled).toBeTruthy();
});

it('disables the button when duration is not set', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
  };
  wrapper.setState(state);

  expect(wrapper.find('.Bounty-Create-Upload').find('button').props().disabled).toBeTruthy();
});

it('disables the button when duration_err is set', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
    duration_error: 'asdf'
  };
  wrapper.setState(state);

  expect(wrapper.find('.Bounty-Create-Upload').find('button').props().disabled).toBeTruthy();
});

it('enables button when there are files, a url, and reward & duration have valid values ', () => {
  const wrapper = mount(<BountyCreate 
    wallet={wallet}
    address={address}/>);
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  wrapper.setState({files: files, uploading: false, next: true, reward: 0.0625, duration: 1});
  expect(wrapper.find('.Bounty-Create-Upload').find('button').props().disabled).toBeFalsy();
});

it('calls createBounty when create clicked', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  wrapper.find('.Bounty-Create-Upload').find('.Button').simulate('click');

});

it('calls onBountyPosted when when button clicked', (done) => {
  const onBountyPosted = jest.spyOn(BountyCreate.prototype, 'onBountyPosted');
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  const instance = wrapper.instance();

  instance.createBounty()
    .then(() => {
      try {
        expect(onBountyPosted).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('calls on error when something goes wrong in the upload', (done) => {
  const mockBadUploadBounty = jest.fn().mockImplementation(() => {
    return new Promise(() => {
      throw Error('Failed.');
    });
  });
  Http.mockImplementation(() => {
    return {
      uploadFiles: mockUploadFiles,
      uploadBounty: mockBadUploadBounty,
    };
  });

  const addBounty = jest.fn();
  const onError = jest.fn();

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addBounty={addBounty}
      onError={onError}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  // act
  instance.createBounty()
    .then(() => {

    // assert
      try {
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith('Failed.');
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('should call addCreateBountyRequest and removeCreateBountyRequest in createBounty', (done) => {
  const addCreateBountyRequest = jest.spyOn(BountyCreate.prototype, 'addCreateBountyRequest');
  const removeCreateBountyRequest = jest.spyOn(BountyCreate.prototype, 'removeCreateBountyRequest');

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  // act
  instance.createBounty()
    .then(() => {

      // assert
      try {
        expect(addCreateBountyRequest).toHaveBeenCalledTimes(1);
        expect(removeCreateBountyRequest).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('should call addRequest and removeRequest in createBounty', (done) => {
  const addRequest = jest.fn();
  const removeRequest = jest.fn();

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      addRequest={addRequest}
      removeRequest={removeRequest}
      isUnlocked={true}/>
  );
  const instance = wrapper.instance();
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  // act
  instance.createBounty()
    .then(() => {

      // assert
      try {
        expect(addRequest).toHaveBeenCalledTimes(1);
        expect(removeRequest).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
});

it('enables next button when at least one file is entered', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );

  const instance = wrapper.instance();
  instance.onMultipleFilesSelected([{name: 'demo'}]);

  expect(wrapper.find('BountyCreate-Header-Buttons').last().disabled).toBeFalsy();
});

it('sets next: true when next button pushed', () => {
  const setState = jest.spyOn(BountyCreate.prototype, 'setState');

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  setState.mockClear();

  wrapper.find('.BountyCreate-Header-Buttons').find('button').last().simulate('click');

  expect(setState).toHaveBeenCalledWith({next: true});
});

it('shows the reward/duration page when next clicked', () => {
  const setState = jest.spyOn(BountyCreate.prototype, 'setState');

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  setState.mockClear();

  wrapper.find('.BountyCreate-Header-Buttons').find('button').last().simulate('click');

  expect(wrapper.find('.Bounty-Values')).toHaveLength(1);
});

it('enables the previous button when on next is true', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  expect(wrapper.find('.BountyCreate-Header-Buttons').find('button').first().props().disabled).toBeFalsy();
});

it('sets next: false when previous is clicked', () => {
  const setState = jest.spyOn(BountyCreate.prototype, 'setState');

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  wrapper.find('.BountyCreate-Header-Buttons').find('button').first().simulate('click');

  expect(setState).toHaveBeenCalledWith({next: false});
});

it('shows file list & drop target when next is false', () => {

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: false,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);

  expect(wrapper.find('.Drop-Target')).toHaveLength(1);
});

it('shows the error when reward_error set', () => {

  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
    reward_error: 'asdf'
  };
  wrapper.setState(state);

  expect(wrapper.find('.AnimatedInput').first().find('p').text()).toEqual('asdf');
});

it('shows the error when duration_error set', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
    duration_error: 'asdf'
  };
  wrapper.setState(state);

  expect(wrapper.find('.AnimatedInput').last().find('p').text()).toEqual('asdf');
});

it('calls setState with reward_error message when reward changed to less than 0.0625', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  wrapper.find('.AnimatedInput-Input').first().simulate('change', {target: {value: '0'}});

  const instance = wrapper.instance();

  expect(instance.state.reward_error).toEqual('Reward below 0.0625 minimum.');
});

it('calls setState with reward_error null when reward changed to more than 0.0625', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  wrapper.find('.AnimatedInput-Input').first().simulate('change', {target: {value: '1'}});

  const instance = wrapper.instance();

  expect(instance.state.reward_error).toEqual(null);
});

it('calls setState with duration_error message when duration error changed to less than 1', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  wrapper.find('.AnimatedInput-Input').last().simulate('change', {target: {value: '0'}});

  const instance = wrapper.instance();

  expect(instance.state.duration_error).toEqual('Duration below 1.');
});

it('calls setState with duration_error message when duration set to a float', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  wrapper.find('.AnimatedInput-Input').last().simulate('change', {target: {value: '1.2'}});

  const instance = wrapper.instance();

  expect(instance.state.duration_error).toEqual('Duration must be integer.');
});

it('calls setState with duration_error null when duration changed to more than 0', () => {
  const wrapper = mount(
    <BountyCreate url={'url'}
      wallet={wallet}
      address={address}
      isUnlocked={false}/>
  );
  const files = [
    {name: 'demo'},
    {name: 'omed'},
  ];
  const state = {
    files: files,
    uploading: false,
    next: true,
    reward:'5',
    duration: '1',
  };
  wrapper.setState(state);
  wrapper.find('.AnimatedInput-Input').last().simulate('change', {target: {value: '1'}});

  const instance = wrapper.instance();

  expect(instance.state.duration_error).toEqual(null);
});