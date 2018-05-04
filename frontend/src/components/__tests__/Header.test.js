import React from 'react';
import {render, shallow} from 'enzyme';
import {renderToJson, shallowToJson} from 'enzyme-to-json';
import Header from '../Header';

it('renders without crashing', () => {
  const wrapper = render(<Header />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('Uses title PolySwarm ', () => {
  const wrapper = shallow(<Header/>);
  expect(wrapper.text()).toEqual('PolySwarm Nectar Relay');
});