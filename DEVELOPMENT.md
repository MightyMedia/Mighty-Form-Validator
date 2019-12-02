# Development

This project uses composer and NPM to install all it's development tools and dependencies. After that gulp is used to compile the JavaScript and CSS of the demo.

## Getting started

- Execute `./build/install.sh` in project root.
  - This performs a composer install, which installs NPM locally, executes `npm install` and compiles CSS and JavaScript (by executing `build/install-gulp.sh`).
- To build the CSS and JavaScript use:
  - `./build/install-gulp.sh` - One time, installs dependencies like gulp (`npm install`) and performs a one time build. Is executed automatically when running composer.
  - `./build/default.sh` - One time, builds production-ready code (everything is minified, etc).
  - `./build/watch.sh` - Gulp watcher for development (unminified code). When active, this triggers compiling on file changes.

---

## TODO
- Make better demo-page
  - Smaller separate demo's (on going)
  - Style input validation style a bit nicer (cross and check-marks?)
- Better documentation (features and options in table?)
  - Explain writing/adding custom validators
- Add more (core) validators
  - Phone mask, including auto-correction of input value
  - URL check
  - (custom) AJAX-call validator
- Expand existing validators (options / features)
  - number validator should be able to use html5 min/max attributes for validation
- Validation dependent of other field - only require validation if other field is set/validated
  - This is called a Conditional validator
- Option to execute validation on key-up event, not only on change.
  - Determine for each field if validation should execute on key-up event
- Option to only validate a field when the user changed the value (not always on every focus change)
