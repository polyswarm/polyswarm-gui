import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import Landing from '../Landing';

it('renders without crashing', () => {
    const wrapper = render(<Landing />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});