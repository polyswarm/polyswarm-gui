import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ChainInfo from '../ChainInfo';

it('renders without crashing', () => {
const wrapper = render(<ChainInfo balance={0} transfer={0}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});