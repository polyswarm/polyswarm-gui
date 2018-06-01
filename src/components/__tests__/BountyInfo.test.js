import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import BountyInfo from '../BountyInfo';

const wallet = {homeNct: '1', sideNct: '1', homeEth: '1', sideEth: '1'};
const address = 'author';

it('renders without crashing', () => {
  const bounty = { };
  const wrapper = render(<BountyInfo
    wallet={wallet}
    address={address}
    bounty={bounty}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});