import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import id from 'uuid';

export default class RedirectComponent extends Component {
  constructor(props) {
    super(props);

    this.id = id().slice(0, 8);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Redirect to={`/${this.id}`} />
    );
  }
}
