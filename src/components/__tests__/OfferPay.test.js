import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferPay from '../OfferPay';

it('renders without crashing', () => {
  const wrapper = render(<OfferPay />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});