import React from 'react';
import { Modal } from 'react-overlays';
import { AvatarPicker } from '@satori-sdk/component-library';

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.5
};

export default function AvatarPanel(props) {
  return (
    <Modal
      show={props.show}
      style={modalStyle}
      backdropStyle={backdropStyle}
    >
      <div className="Avatar-picker-dialog">
        <AvatarPicker onSubmit={props.onSubmit} />
      </div>
    </Modal>
  )
}

