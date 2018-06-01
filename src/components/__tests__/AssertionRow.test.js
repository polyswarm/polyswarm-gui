import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import AssertionRow from '../AssertionRow';

it('renders without crashing', () => {
  const assertion = {
    author: 'asdf',
    verdicts: [true],
    bid: 10,
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }];
  const wrapper = render(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('sets card title to author: address', () => {
  const assertion = {
    author: 'asdf',
    verdicts: [true],
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }];
  const wrapper = render(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );

  expect(wrapper.find('.CardHeader').text()).toEqual('Author: asdf');
});

it('sets the subheader to be the bid in NCT', () => {
  const assertion = {
    author: 'asdf',
    bid: 10,
    verdicts: [true],
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }];
  const wrapper = render(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );

  expect(
    wrapper
      .find('.CardHeader')
      .find('p')
      .text()
  ).toEqual('10 Nectar (NCT)');
});

it('puts the metadata as a statrow', () => {
  const assertion = {
    author: 'asdf',
    bid: 10,
    verdicts: [true],
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }];
  const wrapper = render(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );

  expect(
    wrapper
      .find('.StatRow')
      .first()
      .find('p')
      .last()
      .text()
  ).toEqual('Some virus');
});

it("displays each file with it's verdict as a statrow", () => {
  const assertion = {
    author: 'asdf',
    bid: 10,
    verdicts: [true, false],
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }, { name: 'good_file' }];
  const wrapper = mount(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );

  expect(
    wrapper
      .find('.StatTitle')
      .at(1)
      .text()
  ).toEqual('evil_file');
  expect(
    wrapper
      .find('.StatContent')
      .at(1)
      .text()
  ).toEqual('Malicious');
  expect(
    wrapper
      .find('.StatTitle')
      .at(2)
      .text()
  ).toEqual('good_file');
  expect(
    wrapper
      .find('.StatContent')
      .at(2)
      .text()
  ).toEqual('Safe');
});

it('assigns Assertion-Malignant when there is only one malicious verdict', () => {
  const assertion = {
    author: 'asdf',
    bid: 10,
    verdicts: [true, false],
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }, { name: 'good_file' }];
  const wrapper = render(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );

  expect(
    wrapper.find('.CardHeader').hasClass('Assertion-Malignant')
  ).toBeTruthy();
  expect(wrapper.find('.CardHeader').hasClass('Assertion-Benign')).toBeFalsy();
});

it('assigns Assertion-Benign when no malicious verdict', () => {
  const assertion = {
    author: 'asdf',
    bid: 10,
    verdicts: [false, false],
    metadata: 'Some virus'
  };
  const artifacts = [{ name: 'evil_file' }, { name: 'good_file' }];
  const wrapper = render(
    <AssertionRow assertion={assertion} artifacts={artifacts} />
  );

  expect(
    wrapper.find('.CardHeader').hasClass('Assertion-Malignant')
  ).toBeFalsy();
  expect(wrapper.find('.CardHeader').hasClass('Assertion-Benign')).toBeTruthy();
});
