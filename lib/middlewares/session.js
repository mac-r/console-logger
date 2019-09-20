const nanoid = require('nanoid');
const events = require('../events');

/*

  Session middleware creates a session on the client
  and adds a session object.

*/

const { CONNECTION, CREATE_SESSION } = events;

module.exports = ({ev, send, next, cache, console}) => {
  if (ev.error) { next() } else {
    const { type } = ev.object;
    let { session } = cache();

    if (type === CONNECTION && session === undefined) {
      session = { id: nanoid() };
      cache({session});
      console.clear();
      console.log("Console logger: connection established ✅");
      send(CREATE_SESSION, {session});
    }

    const sessionHandler = (object) => {
      if (object) { cache({...cache().session, ...object}) };
      return cache().session;
    };

    next({session: sessionHandler});
  };
}
