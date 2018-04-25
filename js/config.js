/*
 * config.js
 *
 *  Configuration file
 *
 *
 *
 */
window.GAME = (function (window, module) {
    'use strict';




    /*= start config.js =*/
    var Config = {
        tileSize: 64,
        viewportSize: {
            width: 8,
            height: 5
        },
        minefieldOffset: {
            x: 16,
            y: 16
        },
        framesToFlag: 10
    };
    /*= end config.js =*/



    // expose to public
    module.Config = Config;
    return module;
})(window, window.GAME || {});
