# Password Strength Meter

This plugin will check the value of a password field and evaluate the strength of the typed password. This is done by checking for the diversity of character types: numbers, lowercase and uppercase letters and special characters.

## Requirements

 - [jQuery](https://jquery.com/) 1.6 or greater

## Installation

...

## Usage

To use, call the function on a password field:

```js
$('input[type=password]').password_strength(options);
```

The options argument is optional. Available values to set:

* __container__: Element to display the strength text in. If none given, a span would be created immediately after the password field.

* __minCharacters__: Minimum password length.

* __minLowerCaseCharacters__: ...

* __minUpperCaseCharacters__: ...

* __minNumbers__: ...

* __minSymbols__: ...

* __onCheck__: A callback that gets called after a strength check. Gets the new strength value as a parameter.

jQuery plugin page: http://plugins.jquery.com/project/password_strengths
