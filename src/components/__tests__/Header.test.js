import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Header from '../Header';

it('renders without crashing', () => {
  const wrapper = render(<Header />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('shows title props', () => {
  const wrapper = render(<Header title={'Title'}/>);

  expect(wrapper.find('h3').text()).toBe('Title');

  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('should call onClick callback when clicked', () => {
  const onClick = jest.fn();
  const wrapper = mount(<Header active='-1'
    title={'Title'}
    onClick={onClick}/>);

  wrapper.find('button').simulate('click');

  expect(onClick).toHaveBeenCalledTimes(1);
});

it('should not show the button if create set', () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <Header title={'Title'}
      create
      onClick={onClick}/>
  );

  expect(wrapper.find('button')).toHaveLength(0);
});

it('should not show button if active greater than 0', () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <Header title={'Title'}
      active='1'
      onClick={onClick}/>
  );

  expect(wrapper.find('button')).toHaveLength(0);
});

it('should show the button when neither active nor create set', () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <Header title={'Title'}
      active='-1'
      onClick={onClick}/>
  );

  expect(wrapper.find('button')).toHaveLength(1);
});

it('calls onBack when img is clicked.', () => {
  const onBack = jest.spyOn(Header.prototype, 'onBack');
  const wrapper = mount(
    <Header title={'Title'}/>
  );

  wrapper.find('img').simulate('click');

  expect(onBack).toHaveBeenCalledTimes(1);
});

it('calls prop onBack when img pressed', () => {
  const onBack = jest.fn();
  const wrapper = mount(
    <Header title={'Title'}
      create
      onBack={onBack}/>
  );

  wrapper.find('img').simulate('click');

  expect(onBack).toHaveBeenCalledTimes(1);
});