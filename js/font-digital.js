/*
 * font-digital.js
 *
 *  JavaScript class that represents a font for text.
 *
 *
 *
 */
window.GAME = (function (window, module) {
    'use strict';



    /*= start font.js =*/
    // bitmap
    var bitmap;

    // font attributes
    var font = {
        48: {
            x: 1,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 2,
            yoffset: 0,
            xadvance: 20
        },
        49: {
            x: 19,
            y: 1,
            width: 5,
            height: 27,
            xoffset: 4,
            yoffset: 1,
            xadvance: 10
        },
        50: {
            x: 25,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 2,
            yoffset: 0,
            xadvance: 20
        },
        51: {
            x: 43,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 3,
            yoffset: 0,
            xadvance: 20
        },
        52: {
            x: 61,
            y: 1,
            width: 17,
            height: 27,
            xoffset: 2,
            yoffset: 1,
            xadvance: 20
        },
        53: {
            x: 79,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 2,
            yoffset: 0,
            xadvance: 20
        },
        54: {
            x: 97,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 2,
            yoffset: 0,
            xadvance: 20
        },
        55: {
            x: 115,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 3,
            yoffset: 0,
            xadvance: 20
        },
        56: {
            x: 133,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 2,
            yoffset: 0,
            xadvance: 20
        },
        57: {
            x: 151,
            y: 1,
            width: 17,
            height: 28,
            xoffset: 2,
            yoffset: 0,
            xadvance: 20
        },
        32: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            xoffset: 2,
            yoffset: 0,
            xadvance: 9
        }
    };



    module.FontDigital = {
        setBitmap: function (bitmapImage) {
            window.console.log(bitmapImage);
            bitmap = bitmapImage;
        },
        render: function (context, text, x, y) {
            for (var n = 0; n < text.length; n++) {
                var char = font[text.charCodeAt(n)];
                if (char) {
                    window.console.log(char);

                }

            }
        }
    };




    /*= end font.js =*/



    // expose to public
    return module;
})(window, window.GAME || {});
