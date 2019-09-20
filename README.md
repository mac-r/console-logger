# 📝 Console Logger

Console logger is a development tool, that makes web developers more productive. It prints `console.log` to your terminal when development console is out of reach.

## Introduction

Many people like to debug code using `console.log`, but sometimes it is not possible. Below are the situations, when you can't leverage `console.log` for debugging:
  - Remote browser emulators
  - Chrome extensions
  - Hybrid mobile apps (Ionic, etc.)
  - etc.

I made a development tool to solve those problems.

After a simple integration `console.log` output will go to the terminal window so you can enjoy using it again.

<img src="https://cdn.blinkloader.com/express/qf0gEaOkgpWuKfYxseTMO4LnA/Screen Shot 2019-09-19 at 15.56.57.png"/>

## Installation

```
npm install -g @mac-r/console-logger
```

## Usage

Add this at the beginning of your `html` template, which serves all other bundles:

```html
<meta property="console:server" content="ws://127.0.0.1:8081" />
<script src="https://www.unpkg.com/@mac-r/console-logger@1.0.1/dist/console-logger.min.js"></script>
```

Then run the following command in your terminal:

```
console-logger
```

Now you can start using `console.log` in your code. The output will go to the terminal.

#### Advanced Usage

You can run `console-logger` on a custom `PORT`:

```
PORT=1234 console-logger
```

Just don't forget to change `console:server` value in the html template.
