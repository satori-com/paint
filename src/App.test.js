import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import Controls from './components/Controls';
import * as rtmHandler from './lib/rtm';

let wrapper;
let SatoriMock;
let SatorSubscribeMock;

beforeEach(() => {
  wrapper = shallow(<App match={{ params: 1 }} />);
  SatoriMock = rtmHandler.publish = jest.fn();
  SatorSubscribeMock = rtmHandler.subscribe = jest.fn();
});

test('should detect mobile', () => {
  Object.defineProperty(window.navigator, "userAgent", {
    writable: true,
    value: 'iPhone'
  });

  expect(App.isMobile()).toBe(true);

  window.navigator.userAgent = undefined;
});

test('it should render availble colors', () => {
  const colorCount = Controls.availableColors.length;

  wrapper = shallow(<Controls />);
  const colors = wrapper.find('.color-item');

  expect(colors.length).toEqual(colorCount);
});

test('it should set a color', () => {
  const controls = shallow(<Controls handleSetColor={wrapper.instance().handleSetColor}  />);
  const colors = controls.find('.color-item');

  colors.forEach(item => {
    item.simulate('click');

    expect(wrapper.state('color')).toBe(item.key());
  });

  //expect(controls.find('.color-item .is-active').length).toBe(1);
});

test('it should handle drop-down menu', () => {
  const controls = shallow(<Controls handleDropDown={wrapper.instance().handleDropDown} />);
  const strokeSelector = controls.find('.stroke-selector');
  strokeSelector.simulate('click');

  expect(wrapper.state('dropdownVisible')).toBe(true);
  expect(controls.find('.stroke-dropdown').length).toBe(1);
});

test('it should render the proper amount strokes', () => {
  const controls = shallow(<Controls />);
  const strokeSelector = controls.find('.stroke-selector');

  strokeSelector.simulate('click');
  const strokes = controls.find('.stroke-item');

  expect(strokes.length).toBe(Controls.strokes.length);
});

test('it should handle setting stroke', () => {
  const controls = shallow(<Controls handleSetStroke={wrapper.instance().handleSetStroke}/>);
  const strokeSelector = controls.find('.stroke-selector');
  strokeSelector.simulate('click');
  const stroke = wrapper.find('.stroke-item');
  stroke.last().simulate('click');

  expect(wrapper.state('stroke')).toBe(4);
});

test('it should handle setting the eraser', () => {
  const controls = shallow(<Controls handleSetEraser={wrapper.instance().handleSetEraser}/>);
  const eraserItem = controls.find(('.eraser'));
  eraserItem.simulate('click');

  expect(wrapper.state('color')).toBe('rgb(233, 233, 233)');
});

test('it should publish reset canvas', () => {

  const controls = shallow(<Controls handleResetCanvas={wrapper.instance().handleResetCanvas}/>);
  const reset = controls.find('.reset');
  reset.simulate('click');

  expect(SatoriMock).toBeCalledWith({ "clearCanvas": true });
});

test('it should handle mouseDown and mouseUp', () => {
  const component = mount(<App match={{ params: 1 }} />);
  const whiteboard = component.find('#whiteboard');
  whiteboard.simulate('mouseDown');

  expect(component.state('buttonPressed')).toBe(true);
  whiteboard.simulate('mouseUp');
  expect(component.state('buttonPressed')).toBe(false);
});

test('it should handle a mouse move', () => {
  SatoriMock = rtmHandler.subscribe = jest.fn();

  const component = mount(<App match={{ params: 1 }} />);
  const whiteboard = component.find('#whiteboard');

  whiteboard.simulate('mouseDown');
  whiteboard.simulate('mouseMove', { clientX: 1, clientY: 1 });

  expect(component.state('buttonPressed')).toBe(true);
  expect(component.state('x')).toBe(1);
  expect(component.state('y')).toBe(1);
});

