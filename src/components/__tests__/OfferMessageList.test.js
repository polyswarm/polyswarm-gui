import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import OfferMessageList from '../OfferMessageList';

it('renders without crashing', () => {
  const wrapper = render(<OfferMessageList />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});