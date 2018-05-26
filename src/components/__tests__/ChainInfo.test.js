import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ChainInfo from '../ChainInfo';

it('renders without crashing', () => {
  const wrapper = render(<ChainInfo balance={0} transfer={0}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('displays the name of the networks', () => {
  const wrapper = render(<ChainInfo homeName={'home'} sideName={'side'}/>);
  
  expect(wrapper.find('li').first().text()).toEqual('home: ');
  expect(wrapper.find('li').last().text()).toEqual('side: ');
});

it('displays the current balances', () => {
  const wrapper = render(<ChainInfo homeName={'home'}
    homeBalance={1}
    sideName={'side'}
    sideBalance={2}/>);
  
    expect(wrapper.find('li').first().text()).toEqual('home: 1');
    expect(wrapper.find('li').last().text()).toEqual('side: 2');
});

it('displays the title', () => {
  const wrapper = render(<ChainInfo title={'Title'}/>);

  expect(wrapper.find('h2').text()).toEqual('Title');
});