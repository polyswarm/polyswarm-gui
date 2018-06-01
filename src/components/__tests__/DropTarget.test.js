import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import DropTarget from '../DropTarget';

it('renders without crashing', () => {
  const wrapper = render(<DropTarget />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should call onFileSelected when files are dropped', () => {
  // arrange
  const filesSelected = jest.fn();
  const wrapper = mount(<DropTarget onFilesSelected={filesSelected} />);
  const instance = wrapper.instance();
  const preventDefault = jest.fn();
  const clear = jest.fn();
  const spyItem = jest.fn(() => 'item');
  const event = {
    preventDefault: preventDefault,
    dataTransfer: {
      items: {
        0: {
          kind: 'file',
          getAsFile: spyItem
        },
        length: 1,
        clear: clear
      }
    }
  };

  // act
  instance.onDropHandler(event);

  // assert
  expect(filesSelected).toHaveBeenCalled();
  expect(clear).toHaveBeenCalled();
});

it('should upload files from items when present', () => {
  // arrange
  const filesSelected = jest.fn();
  const wrapper = mount(<DropTarget onFilesSelected={filesSelected} />);
  const instance = wrapper.instance();
  const preventDefault = jest.fn();
  const clear = jest.fn();
  const clearData = jest.fn();
  const spyItem = jest.fn(() => 'item');
  const event = {
    preventDefault: preventDefault,
    dataTransfer: {
      clearData: clearData,
      files: ['file'],
      items: {
        0: {
          kind: 'file',
          getAsFile: spyItem
        },
        length: 1,
        clear: clear
      }
    }
  };

  // act
  instance.onDropHandler(event);

  // assert
  expect(clear).toHaveBeenCalled();
  expect(filesSelected.mock.calls).toHaveLength(1);
  /*
    mock.calls is an array of the arguments. So, [0] is the first call.
    Each call is an array of args. So [0][0] is our calls
    We pass an array of files, so [0][0][0] should be our item
  */
  expect(filesSelected.mock.calls[0][0][0]).toBe('item');
  expect(filesSelected.mock.calls).toMatchSnapshot();
});

it('should upload froms from files when items not present', () => {
  // arrange
  const filesSelected = jest.fn();
  const wrapper = mount(<DropTarget onFilesSelected={filesSelected} />);
  const instance = wrapper.instance();
  const preventDefault = jest.fn();
  const clearData = jest.fn();
  const event = {
    preventDefault: preventDefault,
    dataTransfer: {
      clearData: clearData,
      files: ['file']
    }
  };

  // act
  instance.onDropHandler(event);

  // assert
  expect(clearData).toHaveBeenCalled();
  expect(filesSelected.mock.calls).toHaveLength(1);
  /*
    mock.calls is an array of the arguments. So, [0] is the first call.
    Each call is an array of args. So [0][0] is our calls
    We pass an array of files, so [0][0][0] should be our item
  */
  expect(filesSelected.mock.calls[0][0][0]).toBe('file');
  expect(filesSelected.mock.calls).toMatchSnapshot();
});
