import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Button from '../Button';

it('renders without crashing', () => {
const wrapper = render(<Button />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});