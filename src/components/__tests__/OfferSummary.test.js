import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferSummary from '../OfferSummary';

it('renders without crashing', () => {
  const wrapper = render(<OfferSummary />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});