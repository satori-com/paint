import RTM from 'satori-rtm-sdk';
import config from '../config';

const MODE = RTM.SubscriptionMode.SIMPLE;
const defaultOptions = {
  history: {
    age: 30,
  }
};

const options = {};

if (config.role && config.roleKey) {
  options.authProvider = RTM.roleSecretAuthProvider(config.role, config.roleKey)
}

const stream = new RTM(config.endpoint, config.appKey, options);

stream.start();

export function publish(action) {
  stream.publish(config.channel, action);
}

export function isConnected() {
  return stream.isConnected();
}

export function onConnect(cb) {
  stream.on('enter-connected', cb)
}

function getFilter(id) {
  return `SELECT * FROM \`${config.channel}\` where id='${id}'`
}

export function resubscribe(options) {
  options = Object.assign({}, defaultOptions, options);

  if (options.id) {
    options.filter = getFilter(options.id);
  }

  stream.resubscribe(config.channel, MODE, options);
}

export function subscribe(callback, options = {}) {
  options = Object.assign({}, defaultOptions, options);

  if (options.id) {
    options.filter = getFilter(options.id);
  }

  const sat = stream.subscribe(config.channel, MODE, options);
  sat.on('rtm/subscription/data', (message) => {
    if (message.body.messages.length) {
      message.body.messages.forEach(message => callback(message));
    }
  });
}
