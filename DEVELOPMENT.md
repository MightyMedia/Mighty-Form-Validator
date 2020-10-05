# Development

This project uses composer and NPM to install all it's development tools and dependencies. After that gulp is used to compile the JavaScript and CSS of the demo.

## Getting started

- Execute `./build/install.sh` in project root.
  - This performs a composer install, which installs NPM locally, executes `npm install` and compiles CSS and JavaScript (by executing `build/install-gulp.sh`).
- To build the CSS and JavaScript use:
  - `./build/install-gulp.sh` - One time, installs dependencies like gulp (`npm install`) and performs a one time build. Is executed automatically when running composer.
  - `./build/default.sh` - One time, builds production-ready code (everything is minified, etc).
  - `./build/watch.sh` - Gulp watcher for development (un-minified code). When active, this triggers compiling on file changes.

