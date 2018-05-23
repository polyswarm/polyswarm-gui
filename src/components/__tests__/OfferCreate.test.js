import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferCreate from '../OfferCreate';

it('renders without crashing', () => {
  const wrapper = render(<OfferCreate />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});