import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Transfer from '../Transfer';

it('renders without crashing', () => {
    const wrapper = render(<Transfer />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});