import React, { Component }from 'react';
import Types from 'prop-types';
import { SVGAvatar } from '@satori-sdk/component-library';

function createInitials(name) {
  const initials = name.split(' ');

  return initials.reduce((acc, ele) => {
    if (acc.length < 3) {
      acc.push(ele[0]);
    }

    return acc;
  }, []);
}

export default class Participants extends Component {

  hasChanged(nextParticipants, currentParticipants) {
    const np = Object.keys(nextParticipants);
    const p = Object.keys(currentParticipants);

    if (p.length !== np.length) {
      return true;
    }

    for (let i = 0; i < np.length; i++) {
      if (nextParticipants[np[i]].color !== currentParticipants[np[i]].color) {
        if (currentParticipants[np[i]].color !== this.props.eraserColor) {
          this.lastColor = currentParticipants[np[i]].color;
        }

        return true;
      }
    }

    return false;
  }

  shouldComponentUpdate(nextProps) {
    return this.hasChanged(nextProps.participants, this.props.participants);
  }

  renderParticipants(participants) {
    return Object.keys(participants).map((participant, index) => {
      const color = participants[participant].color;
      const name = participants[participant].user.name;
      const userColor = participants[participant].user.avatar.color;
      const avatar = participants[participant].user.avatar.avatar;
      const initials = participants[participant].user.initials || createInitials(name);

      return (
        <div key={index} className="participants-avatar">
          <SVGAvatar
            avatar={avatar}
            color={userColor}
            width={60}
          />
          <div
            className={`participants-avatar-dot`}
            style={{
              color: '#FFF',
              backgroundColor: color === this.props.eraserColor ? this.lastColor : color,
            }}
            key={index}
          >
            {initials}
          </div>
        </div>
      );
    });
  }

  render() {
    const participants = this.props.participants;

    if (Object.keys(participants).length === 0) {
      return null;
    }

    return (
      <div className="participants-avatars">
        {this.renderParticipants(participants)}
      </div>
    );
  }
}

Participants.propTypes = {
  participants: Types.object,
};
