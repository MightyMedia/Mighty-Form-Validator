# Development

This project usesd composer and NPM to install all it's development tools and dependencies. After that is uses gulp to compile the JavaScript and CSS of the demo.

## Getting started

- Execute `./build/install.sh` in project root.
  - This perform a composer install, whic installs NPM (locally). Executes `npm install` and compiles CSS and JavaScript (by executing `build/gulp-install.sh`).
- To build the CSS and JavaScript use:
  - `./build/gulp-install.sh` - One time, installs dependencies like gulp (`npm install`) and performs a one time build. Is executed automaticly when running composer.
  - `./build/gulp-default.sh` - One time, builds production-ready code (everything is minified, etc). 
  - `./build/gulp-watch.sh` - Gulp watcher for development (unminified code). WHen active executes compiling on file changes.

---

## TODO
- Make better demo-page
  - Smaller seperate demo's
  - Style input validation style a bit nicer (cross and check-marks?)
- Update to latest versions for (dev)dependencies
- Better documentation (features and options in table?)
  - Explain writing/adding custom validators
- Add more (core) validators
  - Phone mask, including auto-correction of input value
  - URL check
  - (custom) AJAX-call validator
- Expand existing validators (options / features)
  - number validator should be able to use html5 min/max attributes for validation
- Validation dependent of other field - only require validation if other field is set/validated)
- Option to execute validation on key-up event, not only on change.
  - Determine for each field if validation should execute on key-up event
- Options to only validate a field when the user changed the value (not always on every focus change)
