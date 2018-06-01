import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Header from '../Header';

const wallet = { homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1' };
const address = 'author';

it('renders without crashing', () => {
  const wrapper = render(<Header wallet={wallet} address={address} />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows title props', () => {
  const wrapper = render(
    <Header wallet={wallet} address={address} title={'Title'} />
  );

  expect(wrapper.find('h3').text()).toBe('Title');

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should show polyswarm logo when back is not set', () => {
  const wrapper = mount(<Header wallet={wallet} address={address} />);

  expect(wrapper.find('img').props().src).toEqual(
    '../public/img/polyswarm-white.svg'
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should show back button when back is set', () => {
  const wrapper = mount(<Header wallet={wallet} address={address} back />);

  expect(wrapper.find('img').props().src).toEqual(
    '../public/img/back-arrow.svg'
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should call prop onBack when back is set and arrow is clicked', () => {
  const onBack = jest.fn();
  const wrapper = mount(
    <Header wallet={wallet} address={address} back onBack={onBack} />
  );

  wrapper
    .find('img')
    .slice(0, 1)
    .simulate('click');

  expect(onBack).toHaveBeenCalledTimes(1);
});

it('should show first two actions as buttons', () => {
  const actions = [
    { title: 'first', onClick: () => {} },
    { title: 'second', onClick: () => {} }
  ];
  const wrapper = render(
    <Header wallet={wallet} address={address} actions={actions} />
  );

  expect(
    wrapper
      .find('.Button')
      .first()
      .text()
  ).toEqual('first');
  expect(
    wrapper
      .find('.Button')
      .last()
      .text()
  ).toEqual('second');
  expect(wrapper.find('.Dropdown')).toHaveLength(0);
});

it('should show the dropdown menu if more than two actions', () => {
  const actions = [
    { title: 'first', onClick: () => {} },
    { title: 'second', onClick: () => {} },
    { title: 'third', onClick: () => {} }
  ];
  const wrapper = render(
    <Header wallet={wallet} address={address} actions={actions} />
  );

  expect(wrapper.find('.Dropdown')).toHaveLength(1);
});

it('should list all items over two as elements in the dropdown', () => {
  const actions = [
    { title: 'first', onClick: () => {} },
    { title: 'second', onClick: () => {} },
    { title: 'third', onClick: () => {} }
  ];
  const wrapper = mount(
    <Header wallet={wallet} address={address} actions={actions} />
  );

  wrapper
    .find('.Dropdown')
    .slice(0, 1)
    .simulate('mouseEnter');

  expect(
    wrapper
      .find('.Dropdown')
      .find('p')
      .text()
  ).toEqual('third');
});

it('should call actions onClick function when clicked', () => {
  const first = jest.fn();
  const actions = [
    { title: 'first', onClick: first },
    { title: 'second', onClick: () => {} },
    { title: 'third', onClick: () => {} }
  ];
  const wrapper = mount(
    <Header wallet={wallet} address={address} actions={actions} />
  );

  wrapper
    .find('.Button')
    .slice(0, 1)
    .simulate('click');

  expect(first).toHaveBeenCalledTimes(1);
});

it('should show the address and balances', () => {
  const wrapper = render(<Header wallet={wallet} address={address} />);

  expect(wrapper.find('.Header-Address').text()).toEqual('author1 NCT 1 ETH');
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
