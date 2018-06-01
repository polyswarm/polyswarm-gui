import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson, mountToJson } from 'enzyme-to-json';
import FileResult from '../FileResult';

it('renders without crashing', () => {
  const wrapper = render(<FileResult />);
  expect(renderToJson(wrapper)).toMatchSnapshot();
});

it('returns Good when given 70 over 100', () => {
  expect(FileResult.computeIndicator(70, 100)).toEqual('Good');
});

it('returns Good when given 1000 over 100', () => {
  expect(FileResult.computeIndicator(1000, 100)).toEqual('Good');
});

it('returns Warning when given 699 over 1000 ', () => {
  expect(FileResult.computeIndicator(699, 1000)).toEqual('Warning');
});

it('returns Bad when given 49 over 100 ', () => {
  expect(FileResult.computeIndicator(49, 100)).toEqual('Bad');
});

it('returns Bad when given 0 over 1', () => {
  expect(FileResult.computeIndicator(0, 1)).toEqual('Bad');
});

it('returns Bad when given a negative number', () => {
  expect(FileResult.computeIndicator(-1, 10)).toEqual('Bad');
  expect(FileResult.computeIndicator(10, -1)).toEqual('Bad');
});

it('returns null when given 1 over 0', () => {
  expect(FileResult.computeIndicator(1, 0)).toEqual(null);
});

it("doesnt show any Indicator if good isn't used", () => {
  const wrapper = mount(<FileResult total={100}>asdf</FileResult>);

  expect(wrapper.find('.FileResult-Indicator-Good')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Warning')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Bad')).toHaveLength(0);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it("doesnt show any Indicator if total isn't used", () => {
  const wrapper = mount(<FileResult good={100}>asdf</FileResult>);

  expect(wrapper.find('.FileResult-Indicator-Good')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Warning')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Bad')).toHaveLength(0);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('doesnt show any Indicator if good is null', () => {
  const wrapper = mount(
    <FileResult good={null} total={100}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Good')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Warning')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Bad')).toHaveLength(0);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('doesnt show any Indicator if total is null', () => {
  const wrapper = mount(
    <FileResult good={10} total={null}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Good')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Warning')).toHaveLength(0);
  expect(wrapper.find('.FileResult-Indicator-Bad')).toHaveLength(0);
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows good when ratio > 70%', () => {
  const wrapper = mount(
    <FileResult good={70} total={100}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Good')).toHaveLength(1);
  expect(wrapper.find('.FileResult-Indicator-Good').text()).toEqual('70 / 100');
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows warning when ratio at 69%', () => {
  const wrapper = mount(
    <FileResult good={69} total={100}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Warning')).toHaveLength(1);
  expect(wrapper.find('.FileResult-Indicator-Warning').text()).toEqual(
    '69 / 100'
  );
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows warning when ratio at 50%', () => {
  const wrapper = mount(
    <FileResult good={50} total={100}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Warning')).toHaveLength(1);
  expect(wrapper.find('.FileResult-Indicator-Warning').text()).toEqual(
    '50 / 100'
  );
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows bad when ratio at 49%', () => {
  const wrapper = mount(
    <FileResult good={49} total={100}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Bad')).toHaveLength(1);
  expect(wrapper.find('.FileResult-Indicator-Bad').text()).toEqual('49 / 100');
  expect(mountToJson(wrapper)).toMatchSnapshot();
});

it('shows bad when ratio is 0%', () => {
  const wrapper = mount(
    <FileResult good={0} total={100}>
      asdf
    </FileResult>
  );

  expect(wrapper.find('.FileResult-Indicator-Bad')).toHaveLength(1);
  expect(wrapper.find('.FileResult-Indicator-Bad').text()).toEqual('0 / 100');
  expect(mountToJson(wrapper)).toMatchSnapshot();
});
