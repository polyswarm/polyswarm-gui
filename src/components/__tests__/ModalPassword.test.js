import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import ModalPassword from '../ModalPassword';

it('renders without crashing', () => {
  const wrapper = render(<ModalPassword />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows when open is set', () => {
  const wrapper = mount(<ModalPassword open />);
  expect(wrapper.find('.ModalBackground')).toHaveLength(1);
});

it('does not show when open is not set', () => {
  const wrapper = mount(<ModalPassword />);
  expect(wrapper.find('.ModalBackground')).toHaveLength(0);
});

it('calls prop onModalRequestClose when background clicked', () => {
  const onModalRequestClose = jest.fn();
  const wrapper = mount(
    <ModalPassword open onModalRequestClose={onModalRequestClose} />
  );

  wrapper.find('.ModalBackground').simulate('click');

  expect(onModalRequestClose).toHaveBeenCalledTimes(1);
});

it('calls prop onModalRequestClose when cancel is clicked', () => {
  const onModalRequestClose = jest.fn();
  const wrapper = mount(
    <ModalPassword open onModalRequestClose={onModalRequestClose} />
  );

  wrapper.find('.flat-cancel').simulate('click');

  expect(onModalRequestClose).toHaveBeenCalledTimes(1);
});

it('updates the password when typed', () => {
  const wrapper = mount(<ModalPassword open />);
  wrapper.setState({ open: true });
  const setState = jest.spyOn(ModalPassword.prototype, 'setState');
  setState.mockClear();

  wrapper.find('#password').simulate('change', { target: { value: 'asdf' } });

  expect(setState).toHaveBeenCalledWith({ password: 'asdf' });
});

it('shows error message when error is true', () => {
  const wrapper = mount(<ModalPassword open />);
  wrapper.setState({ password_error: 'error' });

  expect(wrapper.find('.AnimatedInput-ErrorLabel')).toHaveLength(1);
  expect(wrapper.find('.AnimatedInput-ErrorLabel').text()).toEqual('error');
});

it('does not show error message when error is false', () => {
  const wrapper = mount(<ModalPassword open />);
  wrapper.setState({ open: true, password_error: null });

  expect(wrapper.find('.AnimatedInput-Error')).toHaveLength(0);
});

it('calls onUnlockClick when enter pressed', () => {
  const onUnlockClick = jest.spyOn(ModalPassword.prototype, 'onUnlockClick');

  const wrapper = mount(<ModalPassword open />);
  wrapper.setState({ open: true });
  onUnlockClick.mockClear();

  wrapper.find('#password').simulate('keypress', { key: 'Enter' });

  expect(onUnlockClick).toHaveBeenCalledTimes(1);
});

it('does not call onUnlockAccount when a key other than enter is pressed', () => {
  const onUnlockClick = jest.spyOn(ModalPassword.prototype, 'onUnlockClick');

  const wrapper = mount(<ModalPassword open />);
  wrapper.setState({ open: true, password_error: null });
  onUnlockClick.mockClear();

  wrapper.find('#password').simulate('keypress', { key: 'Shift' });

  expect(onUnlockClick).toHaveBeenCalledTimes(0);
});

it('calls onKeySelected with state values when onUnlockClick called', () => {
  const onKeySelected = jest.spyOn(ModalPassword.prototype, 'onKeySelected');
  const wrapper = mount(<ModalPassword open />);
  const instance = wrapper.instance();
  wrapper.setState({
    password: 'asdf',
    address: 'fdsa',
    file: { name: 'file' },
    password_error: null
  });
  onKeySelected.mockClear();

  instance.onUnlockClick();

  expect(onKeySelected).toHaveBeenCalledTimes(1);
  expect(onKeySelected).toHaveBeenCalledWith({ name: 'file' }, 'fdsa', 'asdf');
});
