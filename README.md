reload-man
==================
Livereload cli tools.

### 

Usually livereload is just used by front-end developer.

But now, by creating a proxy server, we can use livereload in back-end project, such as PHP, Python, Ruby ...

Demo (http://webtest.qiniudn.com/reload-man.mp4)


## Installation

Actually this is a node packaged module

You've to [install node.js](http://nodejs.org/download/) first

```bash
$ sudo npm install -g reload-man
```

## Usage

```bash
$ reload-man -D /var/www
```

### Options
```
-D  http server\'s docRoot, no default value
-H  http server port, default port is 80
-P  proxy server port, default port is 8090
-S  websocket server port, default port is 31396
-v  show version
```

## License

MIT
