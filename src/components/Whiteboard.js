import { Console } from '@satori-sdk/component-library';
import iconPicture from '../resources/icon-picture.svg';
import Participants from '../components/Participants';
import React, { Component } from 'react';
import Types from 'prop-types';
import { subscribe, resubscribe } from '../lib/rtm';

class Whiteboard extends Component {
  static propTypes = {
    showMessage: Types.bool,
    color: Types.string.isRequired,
    drawing: Types.bool,
    eraserColor: Types.string,
    height: Types.number,
    id: Types.string.isRequired,
    onMouseDown: Types.func,
    onMouseMove: Types.func,
    onMouseUp: Types.func,
    onTouchMove: Types.func,
    onTouchStart: Types.func,
  };

  static defaultProps = {
    onMouseDown: () => {
    },
    onMouseMove: () => {
    },
    onMouseUp: () => {
    },
    onTouchMove: () => {
    },
    onTouchStart: () => {
    },
  };

  static isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }

  constructor(props) {
    super(props);

    this.setUpContext = this.setUpContext.bind(this);
    this.processDrawingMessage = this.processDrawingMessage.bind(this);
    this.renderer = this.renderer.bind(this);

    this.state = {};
    this.whiteboardState = {};
  }

  componentDidMount() {
    this.ctx = this.whiteboard.getContext('2d');
    this.whiteboard.width = this.whiteboard.offsetWidth;
    this.whiteboard.height = this.whiteboard.offsetHeight;

    subscribe(this.processDrawingMessage, { id: this.props.id });
    this.renderer();
  }

  componentWillUpdate() {
    if (!this.hasDrawn) {
      this.hasDrawn = this.checkForCoords();
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderId);
  }

  beginPath(currentX, currentY) {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(currentX, currentY, this.stroke / 2, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

  renderer() {
    this.setState(this.whiteboardState);
    this.renderId = requestAnimationFrame(this.renderer);
  }

  mergeParticipantState(action) {
    this.whiteboardState[this.user.id] = Object.assign({}, this.whiteboardState[this.user.id], action);
  };

  processDrawingMessage(message) {
    this.message = message;

    this.rect = this.whiteboard.getBoundingClientRect();
    this.color = message.color;
    this.stroke = message.stroke;
    this.user = message.user;

    if (message.clearCanvas) {
      return this.resetCanvas();
    }

    if (this.whiteboardState[this.user.id]) {
      this.mergeParticipantState({ color: this.color });
    }

    if (message.buttonPressed && !this.whiteboardState[this.user.id]) {
      return this.mergeParticipantState({
        drawing: true,
        color: this.color,
        user: this.user,
      });
    }

    if (message.buttonPressed && !this.whiteboardState[this.user.id].drawing) {
      const lastX = message.x;
      const lastY = message.y;

      this.beginPath(lastX, lastY);

      return this.mergeParticipantState({
        drawing: true,
        lastX: lastX,
        lastY: lastY,
      });
    }

    if (!message.buttonPressed) {
      return this.mergeParticipantState({
        drawing: false,
        color: this.color,
        user: this.user,
      });
    }

    if (this.whiteboardState[this.user.id].drawing) {
      this.setupDrawing(message);
    }
  }

  checkForCoords() {
    for (const user in this.whiteboardState) {
      if (this.whiteboardState.hasOwnProperty(user) && this.whiteboardState[user].lastX) {
        return true;
      }
    }

    return false;
  }

  convertCoords(event) {
    event.preventDefault();

    const rect = this.whiteboard.getBoundingClientRect();
    const x = Whiteboard.isMobile() && event.targetTouches[0] ? event.targetTouches[0].clientX : event.clientX;
    const y = Whiteboard.isMobile() && event.targetTouches[0] ? event.targetTouches[0].clientY : event.clientY;

    return { x: Math.floor(x - rect.left), y: Math.floor(y - rect.top) };
  }

  setupDrawing(message) {
    this.rect = this.whiteboard.getBoundingClientRect();

    const { lastX, lastY } = this.whiteboardState[this.user.id];
    const currentX = message.x;
    const currentY = message.y;

    this.draw(currentX, currentY, lastX, lastY);

    this.mergeParticipantState({
      drawing: true,
      lastX: currentX,
      lastY: currentY,
      user: this.user,
    });
  }

  draw(currentX, currentY, prevX, prevY) {
    this.ctx.beginPath();
    this.ctx.moveTo(prevX, prevY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.stroke;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
    this.ctx.closePath();
  }

  resetCanvas() {
    this.ctx.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height);
  }

  setUpContext(ele) {
    let resizeTimer;

    this.whiteboard = ele;

    window.addEventListener('resize', () => {
      this.whiteboard.height = this.whiteboard.offsetHeight;
      this.whiteboard.width = this.whiteboard.offsetWidth;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resubscribe({ id: this.props.id });
      }, 250);

    })
  }

  render() {
    const { ...handlers } = this.props;

    return (
      <div id="whiteboard-container">
        {
          !this.hasDrawn &&
          <img
            className={`iconPicture ${this.props.color === this.props.eraserColor ? 'erasing' : ''}`}
            src={iconPicture}
            onMouseDown={handlers.onMouseDown}
            onMouseUp={handlers.onMouseUp}
            alt="" />
        }

        <canvas
          height={this.props.height}
          id="whiteboard"
          className={this.props.color === this.props.eraserColor ? 'erasing' : ''}
          onMouseDown={(event) => handlers.onMouseDown(this.convertCoords(event))}
          onMouseMove={(event) => handlers.onMouseMove(this.convertCoords(event))}
          onMouseUp={(event) => handlers.onMouseUp(this.convertCoords(event))}
          onTouchEnd={(event) => handlers.onMouseUp(this.convertCoords(event))}
          onTouchMove={(event) => handlers.onTouchMove(this.convertCoords(event))}
          onTouchStart={(event) => handlers.onTouchStart(this.convertCoords(event))}
          ref={this.setUpContext}
        />
        {
          this.props.showMessage &&
          <Console
            className="console"
            message={this.message}
          />
        }
        <div
          className={`participants ${this.props.showParticipantList ? 'participants-list' : ''}`}>
          <h1 className="sub-heading">
            Participants
          </h1>
          <Participants
            participants={this.state}
            eraserColor={this.props.eraserColor}
          />
        </div>
      </div>
    );
  }
}

export default Whiteboard;
