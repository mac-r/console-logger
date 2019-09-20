/*

  Parser middleware adds object property to the event,
  if message is a serialized JSON.

*/

module.exports = ({ev, next}) => {
  try {
    if (ev.message) {
      ev.object = JSON.parse(ev.message);
    }
  } catch(error) {
    ev.error = error;
  }
  next();
}
