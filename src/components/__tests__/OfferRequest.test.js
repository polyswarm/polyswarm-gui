import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferRequest from '../OfferRequest';

it('renders without crashing', () => {
  const wrapper = render(<OfferRequest />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});