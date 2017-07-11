import AvatarPanel from './components/AvatarPicker';
import Controls from './components/Controls';
import jsCookie from 'js-cookie';
import React, { PureComponent } from 'react';
import SatoriLogo from './resources/SatoriLogoWithText.svg';
import uuid from 'uuid';
import Whiteboard from './components/Whiteboard';
import { publish, onConnect, isConnected } from './lib/rtm';
import './App.css';

const USER_CACHE_PREFIX = 'satori-demo-user';
const ERASER_COLOR = 'rgb(233, 233, 233)';
const DEFAULT_COLOR = '#FF5400';
const DEFAULT_STROKE = 4;

class App extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showMessage: false,
      buttonPressed: false,
      color: DEFAULT_COLOR,
      dropdownVisible: false,
      showAvatarPicker: false,
      showParticipantList: false,
      stroke: DEFAULT_STROKE,
      user: null,
      x: 0,
      y: 0,
    };

    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleResetCanvas = this.handleResetCanvas.bind(this);
    this.handleSetColor = this.handleSetColor.bind(this);
    this.handleSetEraser = this.handleSetEraser.bind(this);
    this.handleSetStroke = this.handleSetStroke.bind(this);
    this.handleSetUser = this.handleSetUser.bind(this);
    this.handleShowParticipantList = this.handleShowParticipantList.bind(this);
    this.handleMessageWindow = this.handleMessageWindow.bind(this);
  }

  static saveUserToCookie(user) {
    jsCookie.set(USER_CACHE_PREFIX, user);
  }

  getUserFromCookie() {
    try {
      return JSON.parse(jsCookie.get(USER_CACHE_PREFIX));
    } catch (e) {
      this.setState({ showAvatarPicker: true });
    }
  }

  componentDidMount() {
    const user = this.getUserFromCookie();

    if (!user || !user.name) {
      return this.setState({ showAvatarPicker: true });
    }

    this.handleSetUser(user, false);
  }

  handleDropDown() {
    this.setState({
      dropdownVisible: !this.state.dropdownVisible
    });
  }

  handleSetUser(user, saveUser = true) {
    if (!user || user.name.length === 0) {
      return;
    }

    if (!user.id) {
      user.id = uuid();
    }

    if (user.avatar && typeof user.avatar !== 'object') {
      user.avatar = { avatar: user.avatar, color: user.color };
    }

    if (saveUser) {
      App.saveUserToCookie(user);
    }

    this.setState({ user, showAvatarPicker: false });

    if (isConnected()) {
      publish({ user, id: this.props.match.params.id, color: DEFAULT_COLOR });
    } else {
      onConnect(() => publish({ user, id: this.props.match.params.id, color: DEFAULT_COLOR }));
    }
  }

  handleMessageWindow() {
    this.setState({ showMessage: !this.state.showMessage })
  }

  handleShowParticipantList() {
    this.setState({ showParticipantList: !this.state.showParticipantList })
  }

  handleMouseDown({ x, y }) {
    const action = {
      buttonPressed: true,
      x,
      y,
      color: this.state.color,
      stroke: this.state.stroke,
    };

    // Publish the mouse down event with starting coords
    this.publishAndSet(action);
  }

  handleMouseMove({ x, y }) {

    if (this.state.buttonPressed) {
      const action = {
        buttonPressed: true,
        x,
        y
      };

      // Publish the drawing coords
      this.publishAndSet(action);
    }
  }

  handleMouseUp() {
    const action = {
      buttonPressed: false
    };

    this.publishAndSet(action)
  }

  handleSetColor(color) {
    this.publishAndSet({ color: color });
  }

  handleSetStroke(stroke) {
    this.publishAndSet({
      stroke: stroke,
      dropdownVisible: !this.state.dropdownVisible
    });
  }

  handleSetEraser() {
    this.publishAndSet({ color: ERASER_COLOR });
  }

  handleResetCanvas() {
    publish({ clearCanvas: true, id: this.props.match.params.id });
  }

  publishAndSet(action) {
    const newState = Object.assign(
      {},
      this.state,
      action,
      { id: this.props.match.params.id }
    );

    publish(newState);
    this.setState(newState);
  }

  render() {
    return (
      <div className="App-overlay">
        <div className="App">
          <div className="App-header">
            <img src={SatoriLogo} alt="" />
            <div className="App-links">
              <button
                className="participants-dropdown-trigger"
                onClick={this.handleShowParticipantList}
              >
                <div
                  className={`chevron ${this.state.showParticipantList ? 'dropdown-active' : ''}`} />
              </button>
            </div>
          </div>
          <div id="App-main">
            <div className="App-content">
              <Controls
                color={this.state.color}
                dropdownVisible={false}
                stroke={this.state.stroke}
                handleDropDown={this.handleDropDown}
                handleResetCanvas={this.handleResetCanvas}
                handleSetColor={this.handleSetColor}
                handleSetEraser={this.handleSetEraser}
                handleSetStroke={this.handleSetStroke}
                showDropDown={this.state.dropdownVisible}
                handleShowMessage={this.handleMessageWindow}
              />
              <AvatarPanel
                show={this.state.showAvatarPicker}
                onSubmit={this.handleSetUser}
              />

              <Whiteboard
                color={this.state.color}
                showMessage={this.state.showMessage}
                eraserColor={ERASER_COLOR}
                drawing={this.state.buttonPressed}
                height={400}
                id={this.props.match.params.id}
                showParticipantList={this.state.showParticipantList}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                onTouchMove={this.handleMouseMove.bind(this)}
                onTouchStart={this.handleMouseDown.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
