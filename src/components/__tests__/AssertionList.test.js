import React from 'react';
import {render} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import AssertionList from '../AssertionList';

it('renders without crashing', () => {
  const bounty = {assertions: []};
  const wrapper = render(<AssertionList bounty={bounty}/>);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('renders the correct number of children', () => {
  const assertions = [
    {author: 'asdf', verdicts: [false], bid: 5, metadata: 'Nothing'},
    {author: 'demo', verdicts: [false], bid: 5, metadata: ''},
    {author: 'fdsa', verdicts: [true], bid: 1000, metadata: 'VIRUS'},
  ];
  const artifacts = [{name: 'first'}];
  const bounty = {assertions: assertions, artifacts: artifacts, amount: 5, };
  const wrapper = render(<AssertionList bounty={bounty}/>);

  expect(wrapper.find('.Card')).toHaveLength(3);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('renders emptystate placeholder if not assertions', () => {
  const assertions = [];
  const artifacts = [{name: 'first'}];
  const bounty = {assertions: assertions, artifacts: artifacts, amount: 5, };
  const wrapper = render(<AssertionList bounty={bounty}/>);

  expect(wrapper.find('.Assertion-Placeholder')).toHaveLength(1);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});
