var ConsoleLogger = (function(cl) {
  "use strict";

  cl.config = {
    server: (document.querySelector("meta[property='console:server']") || {}).content
  };

  cl.start = function () {
    cl.init = function () {
      var server = cl.config.server;

      if (!server) {
        console.error("Console logger: server url is not specified.");
        return;
      }

      if ("WebSocket" in window === false) {
        console.error("Console logger: WebSocket is not supported by this browser.");
        return;
      }

      cl.ws = new WebSocket(server);
      cl.connected = false;
    }

    cl.init();

    cl.send = function(event) {
      var ws = cl.ws;
      ws.send(JSON.stringify(event));
    }


    cl.ws.onopen = function() {
      cl.connected = true;
      cl.send({type: 'CONNECTION', origin: 'https://example.com/foobar'});
      setTimeout(function () {
        cl.initPatchedConsole();
      }, 250);
    };


    cl.respond = function(id, value) {
      cl.send({ type: 'RESP', id: id, value: value });
    }

    cl.eventMap = {
      CONSOLE: true
    };

    cl.ws.onmessage = function(ev) {
      var e = JSON.parse(ev.data);
      if (cl.eventMap[e.type]) {
        var target = window[e.target];
        var res = target[e.prop].apply(target, e.args);
        e.resp === true && cl.respond(e.id, res);
      }
    };

    cl.ws.onclose = function() {
      console.log("Console logger: connection lost 🔌");
      setTimeout(cl.start, 1000);
    };
  }

  cl.initPatchedConsole = function() {
    window.console.log = function(value) {
      ConsoleLogger.send({type: 'CONSOLE', value: value});
    }
  }

  return cl;
}(ConsoleLogger || {}));

ConsoleLogger.start();
