import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import AddressField from '../AddressField';

it('renders without crashing', () => {
const wrapper = render(<AddressField />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});