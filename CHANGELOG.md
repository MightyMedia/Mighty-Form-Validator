# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Renamed dev tools to make more sense
- Updated documentation


## [0.1.1] - 2019-11-06

### Added
- Add custom ancestor selector

### Changed
- Changed demo
- Updated dev todo's
- Updated build tools to latest versions


## [0.1.0] - 2019-10-06

### Added
- Validator Engine class with all the validation logic, options handling and the `notempty`/required validator: `mightyFormValidator.js`
- Default validators, placed in: `validators/`
  - E-mail validator (`validators/email.js`)
  - Date validator (`validators/date.js`)
  - Min-max length validator (`validators/length.js`)
  - Is number validator (`validators/number.js`)
  - Custom regex validator (`validators/regex.js`)
  - Equals value validator (`validators/equals.js`)
  - Zipcode validator (`validators/zipcode.js`)
- Documentation
  - Including very basic development documentation
- Demo
- Changelog
- Build tools (for development)
