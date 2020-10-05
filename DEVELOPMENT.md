# Development

This project uses Composer and NPM to install all of it's development tools and dependencies. After that gulp is used to compile the JavaScript and CSS (scss) of the demo. This works perfectly well on macOs and should also work without any problem on Linux based systems.


## Getting started

- Setup development tools:
  - Execute `./build/install.sh` in project root.
    - This performs a composer install, which installs NPM locally, executes `npm install` and compiles CSS and JavaScript (by executing `build/install-gulp.sh`).
- While developing
  - `./build/watch.sh` - Gulp watcher for development (un-minified code). When active, this triggers compiling on file changes.
- Prepare for production/deployment
  - `./build/default.sh` - One time, builds production-ready code (everything is minified, etc).
