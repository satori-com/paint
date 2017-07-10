import React, { PureComponent } from 'react';
import { RootCloseWrapper } from 'react-overlays';
import Types from 'prop-types';
import eraser from '../resources/icon-eraser.svg';
import reset from '../resources/icon-refresh.svg';
import share from '../resources/icon-share.svg';
import code from '../resources/ic_code_black_36px.svg';
import { ShareContainer } from '@satori-sdk/component-library';

export default class Controls extends PureComponent {
  static availableColors = [
    '#FF5400',
    '#22272b',
    '#00A0EE',
    '#5E676E',
  ];

  static strokes = [4, 8, 16, 24];

  render() {
    const props = this.props;

    return (
      <div className="App-controls">
        <div className="colors">
          {Controls.availableColors.map((color, index) => {
            return (
              <div
                className={`color-item ${color === props.color ? 'is-active' : ''}`}
                key={color}
                style={{ backgroundColor: `${color}` }}
                onClick={() => props.handleSetColor(color)} />
            )
          })}
          <div
            className={`eraser ${props.color === 'white' ? 'is-active' : ''}`}
            onClick={props.handleSetEraser}
          >
            <img src={eraser} alt="eraser" className="eraser-image" />
          </div>
          <div
            className='reset'
            onClick={props.handleResetCanvas}
          >
            <img src={reset} alt="reset" className="eraser-image" />
          </div>
        </div>

        <RootCloseWrapper
          onRootClose={props.handleDropDown}
          disabled={!props.showDropDown}
        >
          <div className={`strokes-wrapper ${props.showDropDown ? 'stroke-height' : ''}`}>
            <div className="strokes">
              <div
                className="stroke-selector"
                onClick={props.handleDropDown}
              >
                <div
                  className="stroke-dot"
                  style={{ height: props.stroke, width: props.stroke }}
                />
              </div>
              <div className={`stroke-dropdown ${props.showDropDown ? 'stroke-dropdown-expanded' : ''}`}>
                {Controls.strokes.map((stroke) => {
                  return (
                    <div
                      className="stroke-item"
                      key={stroke}
                      onClick={() => props.handleSetStroke(stroke)}
                    >
                      <div className="stroke-dot" style={{ height: stroke, width: stroke }} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </RootCloseWrapper>
        <ShareContainer
          placement="bottom"
          className="share-control"
          shareUrl={window.location.href}
        >
          <img
            className="share-image"
            src={share}
            alt="Share URL"
          />
        </ShareContainer>
        <div className="code-control-item">
          <img
            src={code}
            alt="code"
            onClick={this.props.handleShowMessage}
          />
        </div>
      </div>

    );

  }

}

Controls.propTypes = {
  color: Types.string,
  stroke: Types.number,
  handleDropDown: Types.func,
  handleSetColor: Types.func,
  showDropDown: Types.bool,
  handleSetEraser: Types.func,
  handleResetCanvas: Types.func,
  handleSetStroke: Types.func,
  handleShowMessage: Types.func,
};
