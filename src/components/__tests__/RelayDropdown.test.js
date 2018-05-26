import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import RelayDropdown from '../RelayDropdown';

it('renders without crashing', () => {
  const wrapper = render(<RelayDropdown />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('Shows Deposit and Withdraw when hovered over main part', () => {
  const wrapper = mount(<RelayDropdown />);

  wrapper.simulate('mouseEnter');
  
  expect(wrapper.find('.RelayDropdown-Choices').find('p').first().text()).toEqual('Deposit');
  expect(wrapper.find('.RelayDropdown-Choices').find('p').last().text()).toEqual('Withdraw');
});

it('Changes selected value when an option is clicked', () => {
  const wrapper = mount(<RelayDropdown />);
  wrapper.simulate('mouseEnter');

  wrapper.find('.RelayDropdown-Choices').find('p').last().simulate('click');
  
  expect(wrapper.find('p').first().text()).toEqual('Withdraw');

});

it('Calls setState when a row is clicked', () => {
  const setState = jest.spyOn(RelayDropdown.prototype, 'setState');
  const wrapper = mount(<RelayDropdown />);

  wrapper.simulate('mouseEnter');
  wrapper.find('.RelayDropdown-Choices').find('p').last().simulate('click');


  expect(setState).toHaveBeenCalledWith({selected: 1});
});

it('Calls onSelectionChanged when a row is clicked', () => {
  const onSelectionChanged = jest.fn();
  const wrapper = mount(<RelayDropdown onSelectionChanged={onSelectionChanged} />);

  wrapper.simulate('mouseEnter');
  wrapper.find('.RelayDropdown-Choices').find('p').last().simulate('click');


  expect(onSelectionChanged).toHaveBeenCalledWith(1);
});

it('Does not call onSelectionChanged when the already selected row is clicked', () => {
  const onSelectionChanged = jest.fn();
  const wrapper = mount(<RelayDropdown onSelectionChanged={onSelectionChanged} />);

  wrapper.simulate('mouseEnter');
  wrapper.find('.RelayDropdown-Choices').find('p').first().simulate('click');


  expect(onSelectionChanged).toHaveBeenCalledTimes(0);
});