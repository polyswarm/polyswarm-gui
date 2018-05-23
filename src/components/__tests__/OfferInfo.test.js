import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferInfo from '../OfferInfo';

it('renders without crashing', () => {
  const wrapper = render(<OfferInfo />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});