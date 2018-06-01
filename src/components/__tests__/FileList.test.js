import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson, mountToJson } from 'enzyme-to-json';
import FileList from '../FileList';

beforeEach(() => {
  jest.setMock(
    'react-transition-group',
    require('../__mocks__/react-transition-group')
  );
});

it('throws when created without files', () => {
  expect(() => {
    render(<FileList />);
  }).toThrow();
});

it('renders without crashing', () => {
  const files = [];
  const wrapper = render(<FileList files={files} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('contains 3 FileProgress when 3 added', () => {
  const files = [{ name: 'asdf' }, { name: 'demo' }, { name: 'test' }];
  const wrapper = render(<FileList files={files} />);
  expect(wrapper.find('.ListItem')).toHaveLength(3);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls remove when FileProgress remove button clicked', () => {
  const remove = jest.fn();
  const files = [{ name: 'asdf' }];
  const wrapper = mount(<FileList removeFile={remove} files={files} />);
  wrapper.find('.ListItem').simulate('mouseEnter');
  wrapper
    .find('.ListItem')
    .find('button')
    .simulate('click');
  expect(remove).toHaveBeenCalled();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('calls clearAll when clearAll button is clicked', () => {
  const clearAll = jest.fn();
  const files = [{ name: 'asdf' }];
  const wrapper = mount(<FileList clear={clearAll} files={files} />);

  //act
  wrapper.find('.Clear-Button').simulate('click');

  expect(clearAll).toHaveBeenCalledTimes(1);
});

it('prevents the remove button from showing when FileList has readonly property', () => {
  const files = [{ name: 'asdf' }];
  const wrapper = mount(<FileList readonly files={files} />);

  wrapper.find('.ListItem').simulate('mouseEnter');

  expect(wrapper.find('.ListItem').find('button')).toHaveLength(0);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('calls onClick when a row is clicked', () => {
  const onClick = jest.fn();
  const files = [{ name: 'asdf' }];
  const wrapper = mount(<FileList onClick={onClick} files={files} />);

  //act
  wrapper
    .find('.item-0')
    .find('.ListItem-Child')
    .simulate('click');

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick).toHaveBeenCalledWith(0);
});

it('marks the ListItem as alternate when active is set.', () => {
  const files = [{ name: 'asdf' }, { name: 'demo' }];
  const wrapper = mount(<FileList active={0} files={files} />);

  expect(
    wrapper
      .find('.item-0')
      .find('li')
      .hasClass('alternate')
  ).toBeTruthy();
  expect(
    wrapper
      .find('.item-1')
      .find('li')
      .hasClass('alternate')
  ).toBeFalsy();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('marks the ListItem as alternate when active is set.', () => {
  const files = [{ name: 'asdf' }, { name: 'demo' }];
  const wrapper = mount(<FileList active={1} files={files} />);

  expect(
    wrapper
      .find('.item-0')
      .find('li')
      .hasClass('alternate')
  ).toBeFalsy();
  expect(
    wrapper
      .find('.item-1')
      .find('li')
      .hasClass('alternate')
  ).toBeTruthy();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('does not mark the ListItem as alternate when active is negative.', () => {
  const files = [{ name: 'asdf' }, { name: 'demo' }];
  const wrapper = mount(<FileList active={-1} files={files} />);

  expect(
    wrapper
      .find('.item-0')
      .find('li')
      .hasClass('alternate')
  ).toBeFalsy();
  expect(
    wrapper
      .find('.item-1')
      .find('li')
      .hasClass('alternate')
  ).toBeFalsy();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('does not mark the ListItem as alternate when active is out of bounds.', () => {
  const files = [{ name: 'asdf' }, { name: 'demo' }];
  const wrapper = mount(<FileList active={3} files={files} />);

  expect(
    wrapper
      .find('.item-0')
      .find('li')
      .hasClass('alternate')
  ).toBeFalsy();
  expect(
    wrapper
      .find('.item-1')
      .find('li')
      .hasClass('alternate')
  ).toBeFalsy();
  expect(mountToJson(wrapper)).toMatchSnapshot();
});
