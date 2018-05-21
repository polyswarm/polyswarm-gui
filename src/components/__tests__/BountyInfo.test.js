import React from 'react';
import {render, mount} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyInfo from '../BountyInfo';

it('renders without crashing', () => {
  const bounty = { };
  const wrapper = render(<BountyInfo bounty={bounty}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});