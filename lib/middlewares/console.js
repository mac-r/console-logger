const events = require('../events');

const { CONSOLE } = events;

module.exports = ({send, next, ev}) => {
  if (ev.error) { next() } else {

    if (ev.object && ev.object.type === CONSOLE) {
      console.log(ev.object.value);
    }

    next({
      console: {
        log:   (value) => { send(CONSOLE, { target: 'console', prop: 'log',   args: [value] }) },
        error: (value) => { send(CONSOLE, { target: 'console', prop: 'error', args: [value] }) },
        warn:  (value) => { send(CONSOLE, { target: 'console', prop: 'warn',  args: [value] }) },
        info:  (value) => { send(CONSOLE, { target: 'console', prop: 'info',  args: [value] }) },
        debug: (value) => { send(CONSOLE, { target: 'console', prop: 'debug', args: [value] }) },
        clear: () => { send(CONSOLE, { target: 'console', prop: 'clear', args: [] }) }
      }
    });
  };
}
