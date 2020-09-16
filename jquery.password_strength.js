/*
 * Password Strength (0.1.4)
 * by Sagie Maoz (n0nick.net)
 * n0nick@php.net
 *
 * This plugin will check the value of a password field and evaluate the
 * strength of the typed password. This is done by checking for
 * the diversity of character types: numbers, lowercase and uppercase
 * letters and special characters.
 *
 * Copyright (c) 2010 Sagie Maoz <n0nick@php.net>
 * Licensed under the GPL license, see http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 * NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 *
 * Password strength Customized by Dayton Outar for Semantic UI
 *
 */

(function ($) {
    var passwordStrength = new function () {
        this.countRegexp = function (val, rex) {
            var match = val.match(rex);
            return match ? match.length : 0;
        };

        // Modified by Dayton Outar
        this.getCharacters = function (val) {
            var len = val.length;
            var nums = this.countRegexp(val, /\d/g),
                lowers = this.countRegexp(val, /[a-z]/g),
                uppers = this.countRegexp(val, /[A-Z]/g),
                symbols = len - nums - lowers - uppers;

            return {
                characters: len,                
                lowers: lowers,
                uppers: uppers,
                numbers: nums,
                symbols: symbols
            }
        };

        this.getStrength = function (val,
            minCharacters,
            minLowerCaseCharacters,
            minUpperCaseCharacters,
            minNumbers,
            minSymbols) {
            var len = val.length;

            // too short =(
            if (len < minCharacters) {
                return 0;
            }

            var nums = this.countRegexp(val, /\d/g),
                lowers = this.countRegexp(val, /[a-z]/g),
                uppers = this.countRegexp(val, /[A-Z]/g),
                specials = len - nums - lowers - uppers;

            this.Characters = {
                numbers: nums,
                lowers: lowers,
                uppers: uppers,
                specials: specials
            }

            // just one type of characters =(
            if (nums == len || lowers == len || uppers == len || specials == len) {
                return 1;
            }

            var strength = 0;
            if (nums >= minNumbers) {
                strength += 2;
            }
            if (lowers >= minLowerCaseCharacters) {
                strength += uppers ? 4 : 3;
            }
            if (uppers >= minUpperCaseCharacters) {
                strength += lowers ? 4 : 3;
            }
            if (specials >= minSymbols) {
                strength += 5;
            }
            if (len > minCharacters) {
                strength += 1;
            }

            return strength;
        };

        this.getStrengthLevel = function (
            val,
            minCharacters,
            minLowerCaseCharacters,
            minUpperCaseCharacters,
            minNumbers,
            minSymbols) {
            var strength = this.getStrength(
                val,
                minCharacters,
                minLowerCaseCharacters,
                minUpperCaseCharacters,
                minNumbers,
                minSymbols);

            val = 1;
            if (strength <= 0) {
                val = 1;
            } else if (strength > 0 && strength <= 4) {
                val = 2;
            } else if (strength > 4 && strength <= 10) {
                val = 3;
            } else if (strength > 10 && strength <= 15) {
                val = 4;
            } else if (strength > 15) {
                val = 5;
            }

            return val;
        };
    };

    // Modifications to UI by Dayton Outar to fit Semantic-UI
    $.fn.password_strength = function (options) {
        var settings = $.extend({
            minCharacters: 7,
            minLowerCaseCharacters: 1,
            minUpperCaseCharacters: 1,
            minNumbers: 1,
            minSymbols: 1,
            texts: {
                1: 'Lame (20%)',
                2: 'Weak (40%)',
                3: 'Normal (60%)',
                4: 'Good (80%)',
                5: 'Strong (100%)'
            },
            onCheck: null
        }, options);

        var d = {
            characters: settings.minCharacters,
            lowers: settings.minLowerCaseCharacters,
            uppers: settings.minUpperCaseCharacters,
            numbers: settings.minNumbers,
            symbols: settings.minSymbols
        };

        return this.each(function () {
            var $container = $('<div/>').attr('class', 'ui pointing below label').text('Password Meter (0%)'),
                $bar = null;
            $(this).before($container);

            $(this).bind('keyup', function () {
                var val = $(this).val(),
                    level = passwordStrength.getStrengthLevel(
                        val,
                        settings.minCharacters,
                        settings.minLowerCaseCharacters,
                        settings.minUpperCaseCharacters,
                        settings.minNumbers,
                        settings.minSymbols);

                if (val.length > 0) {
                    var _class = '';
                    switch (level) {
                        case 1:
                            _class = 'red';
                            break;
                        case 2:
                            _class = 'orange';
                            break;
                        case 3:
                            _class = 'yellow';
                            break;
                        case 4:
                            _class = 'blue';
                            break;
                        case 5:
                            _class = 'green';
                            break;
                    }

                    if (!$container.hasClass(_class) && level in settings.texts) {
                        $container.text(settings.texts[level]).attr('class', 'ui pointing below label ' + _class);
                    }
                } else {
                    $container.text('Password Meter (0%)').attr('class', 'ui pointing below label');
                }
                if (settings.onCheck) {
                    settings.onCheck.call(this, level, passwordStrength.getCharacters(val), d);
                }
            });

            if ($(this).val() != '') { // thanks Jason Judge
                $(this).trigger('keyup');
            }
        });
    };

})(jQuery);
