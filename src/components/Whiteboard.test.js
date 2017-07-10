import React from 'react';
import { shallow, mount } from 'enzyme';
import { EventEmitter } from 'events';
import Whiteboard from './Whiteboard';
import Satori from 'satori-rtm-sdk';

const ee = new EventEmitter;
let wrapper;

beforeAll(() => {
  spyOn(Satori.prototype, 'subscribe').and.returnValue(ee);
});

beforeEach(() => {
  wrapper = mount(<Whiteboard id="1" color={'blue'} />);
});

test('renders without crashing', () => {
  const wrapper = shallow(<Whiteboard id={'123'} color="blue" />);
  expect(wrapper.find('#whiteboard').length).toBe(1);
});

test('it should process a drawing message and set the id', () => {
  ee.emit('rtm/subscription/data', {
    body: {
      messages: [{
        id: 123,
        user: { avatar: {}, id: 'a1' }
      }]
    }
  });

  expect(wrapper.instance().whiteboardState['a1']).
    toEqual({ drawing: false, user: { avatar: {}, id: 'a1' } });
});

test('it should set color for user based on message', () => {
  const mockMessage = {
    id: 'a123',
    color: 'blue',
    buttonPressed: true,
    user: { avatar: {}, id: 'a1' }
  };

  ee.emit('rtm/subscription/data', { body: { messages: [mockMessage] } });
  expect(wrapper.instance().whiteboardState['a1']).
    toEqual({ drawing: true, color: 'blue', user: { avatar: {}, id: "a1" } });
});

test('it should draw based on message', () => {
  const mockMessage1 = {
    id: 'b456',
    color: 'blue',
    buttonPressed: false,
    user: { avatar: {}, id: 'a1' }
  };

  const mockMessage2 = {
    id: 'b456',
    color: 'blue',
    buttonPressed: true,
    user: { avatar: {}, id: 'a1' },
    y: 1,
    x: 1,
  };

  const mockMessage3 = {
    id: 'b456',
    color: 'blue',
    user: { avatar: {}, id: 'a1' },
    buttonPressed: true,
    y: 2,
    x: 2,
  };

  ee.emit('rtm/subscription/data', { body: { messages: [mockMessage1] } });
  ee.emit('rtm/subscription/data', { body: { messages: [mockMessage2] } });

  expect(wrapper.instance().whiteboardState['a1'])
    .toEqual({ drawing: true, color: 'blue', lastX: 1, lastY: 1, user: { avatar: {}, id: 'a1' } });

  ee.emit('rtm/subscription/data', { body: { messages: [mockMessage3] } });

  expect(wrapper.instance().whiteboardState['a1'])
    .toEqual({ drawing: true, color: 'blue', lastX: 2, lastY: 2, user: { avatar: {}, id: 'a1' } });
});

test('it should clear the canvas', () => {
  const clearMessage = { clearCanvas: true };
  const expectedResult = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 };

  ee.emit('rtm/subscription/data', { body: { messages: [clearMessage] } });

  expect(wrapper.instance().rect).toEqual(expectedResult);
});


