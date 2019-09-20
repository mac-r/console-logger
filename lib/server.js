const WebSocket = require('ws');
const nanoid = require('nanoid');

class ConsoleLogger {
  constructor() {
    this.middlewares = [];
    this.onHandler = null;
  }

  use(middleware) {
    this.middlewares = [...this.middlewares, middleware];
  }

  on(handler) {
    this.onHandler = handler;
  }

  connectMiddlewares() {
    const { onHandler, middlewares } = this;

    this.wss.on('connection', (ws, req) => {
      let promiseMap = {};

      const cache = (object) => {
        if (object) { ws.cache = {...(ws.cache || {}), ...object} };
        return ws.cache || {};
      };

      // TODO
      ws.on('close', () => {});

      ws.on('message', (message) => {
        const ev = { message };
        const parsedMessage = JSON.parse(message);
        const { type, id, value } = parsedMessage;

        if (type === 'RESP' && id && value) {
          promiseMap[id].resolve(value);
          delete promiseMap[id];
        }

        const send = (eventType, payload) => {
          const ets = { type: eventType, id: nanoid(10), ...payload };
          ws.readyState === 1 && ws.send(JSON.stringify(ets));
          if (ets.resp) {
            let pResolve;
            const p = new Promise((resolve, reject) => { pResolve = resolve });
            promiseMap[ets.id] = { promise: p, resolve: pResolve };
            return promiseMap[ets.id].promise;
          }
        };

        const handleEvent = (handler) => {
          let middlewareArgsCollection = {};
          const sequence = [ ...middlewares, (middlewareArgs) => {
            middlewareArgsCollection = {...middlewareArgsCollection, ...middlewareArgs};
            type === 'CONNECTION' && handler && handler({ ev, req, send, cache, ...middlewareArgsCollection }).catch();
          }];
          let i = 0; const next = (middlewareArgs) => {
            middlewareArgsCollection = {...middlewareArgsCollection, ...middlewareArgs};
            i++; sequence[i]({ ev, req, send, cache, next: sequence[i+1] && next, ...middlewareArgsCollection });
          };
          sequence[i]({ ev, req, send, next, cache });
        }

        handleEvent(onHandler);
      });

      ws.on('error', (err) => {
        if (err.code !== 'ECONNRESET') {
          const errMsg = JSON.stringify(err);
          console.log(errMsg);
        }
      });
    })
  }

  listen({port}, cb) {
    const { middlewares } = this;
    this.wss = new WebSocket.Server({port}, cb);
    this.connectMiddlewares();
    return this;
  }

  close(cb) {
    this.wss.close(cb);
  }
}

module.exports = () => {
  return new ConsoleLogger();
}
