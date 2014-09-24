reload-man
==================
Livereload for all.

### 

Usually livereload is just used by front-end developer.

But now, by creating a proxy server, we can use livereload in back-end project, such as PHP, Python, Ruby ...

Demo (http://youtu.be/DOVaulGDIVM)

## Installation

### Node.js
```bash
$ sudo npm install -g reload-man
```

## Usage

```bash
$ reload-man -D /var/www
```

### Options
```
**-D**  http server\'s docRoot, no default value
**-H**  http server port, default port is 80
**-P**  proxy server port, default port is 8090
**-S**  websocket server port, default port is 31396
**-v**  show version
```

## License

MIT
