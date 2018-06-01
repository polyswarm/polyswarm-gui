import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson, mountToJson } from 'enzyme-to-json';
import ListItem from '../ListItem';

it('renders without crashing', () => {
  const item = 'asdf';
  const wrapper = render(<ListItem>{item}</ListItem>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('renders the child I pass', () => {
  const item = 'asdf';
  const wrapper = render(<ListItem>{item}</ListItem>);
  expect(wrapper.text()).toEqual('asdf');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('calls the mock function when I click close', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = mount(<ListItem remove={remove}>{item}</ListItem>);
  wrapper.find('.ListItem').simulate('mouseEnter');
  wrapper.find('button').simulate('click');
  expect(remove).toHaveBeenCalled();
});

it('shows remove button when hovered', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = mount(<ListItem remove={remove}>{item}</ListItem>);
  wrapper.find('.ListItem').simulate('mouseEnter');
  expect(wrapper.find('button')).toHaveLength(1);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('adds the active class when active property is true', () => {
  const remove = jest.fn();
  const item = 'asdf';
  const wrapper = render(
    <ListItem remove={remove} active>
      {item}
    </ListItem>
  );
  expect(wrapper.hasClass('active')).toBeTruthy();
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('adds the alternate class when active and alternate properties are true', () => {
  const item = 'asdf';
  const wrapper = render(
    <ListItem active alternate>
      {item}
    </ListItem>
  );
  expect(wrapper.hasClass('alternate')).toBeTruthy();
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('adds neither extra class when just alternate property is true', () => {
  const item = 'asdf';
  const wrapper = render(<ListItem alternate>{item}</ListItem>);
  expect(wrapper.hasClass('alternate')).toBeFalsy();
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows the badge when alert is set', () => {
  const item = 'asdf';
  const wrapper = render(
    <ListItem alert active>
      {item}
    </ListItem>
  );
  expect(wrapper.find('.alert')).toHaveLength(1);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('computes "ListItem active" with just active', () => {
  expect(ListItem.computeClassName(true, false)).toEqual('ListItem active');
});

it('computes "ListItem alternate" with both active and alternate', () => {
  expect(ListItem.computeClassName(true, true)).toEqual('ListItem alternate');
});

it('computes "ListItem" with just alternate', () => {
  expect(ListItem.computeClassName(false, true)).toEqual('ListItem');
});

it('computes "ListItem" with neither active nor alternate', () => {
  expect(ListItem.computeClassName(false, false)).toEqual('ListItem');
});
