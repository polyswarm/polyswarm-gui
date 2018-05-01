import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import TransformForm from '../TransformForm';

it('renders without crashing', () => {
const wrapper = render(<TransformForm />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});