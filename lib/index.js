#!/usr/bin/env node

const server = require('./server');
const middlewares = require('./middlewares');
const { jsonParser, session, konsole } = middlewares;

let app = server();

app.use(jsonParser);
app.use(konsole);
app.use(session);

app.listen({ port: process.env.PORT || 8081 });
