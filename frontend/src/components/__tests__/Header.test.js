import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Header from '../Header';

it('renders without crashing', () => {
const wrapper = render(<Header />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});