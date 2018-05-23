import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import ModalPay from '../ModalPay';

it('renders without crashing', () => {
  const wrapper = render(<ModalPay />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});