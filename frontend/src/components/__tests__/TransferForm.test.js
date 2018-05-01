import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import TransferForm from '../TransferForm';

it('renders without crashing', () => {
const wrapper = render(<TransferForm />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});