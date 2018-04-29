window.onload = (function () {
    'use strict';



    /* handle preloading of assets */
    function preload(objects, store, callback) {

        // store has got to be initialized beforehand
        if (typeof store !== "object") {
            window.console.error("An empty object must be provided to store the assets!");
            return null;
        }

        // keep track of loaded assets
        var loadCount = 0,
            requiredCount = Object.keys(objects).length;

        // and listeners
        var listeners = {};

        // iterate
        for (var key in objects) {
            var filename = objects[key];
            var ext = filename.split('.').pop().toLowerCase();
            if ((ext === "png") || (ext === "jpg") || (ext === "gif")) {
                // image
                store[key] = new window.Image();
                store[key].src = filename;
                store[key].onload = loadedAsset;
            } else if ((ext === "mp3") || (ext === "wav")) {
                // audio
                store[key] = new window.Audio(filename);
                store[key].addEventListener('canplaythrough', loadedAsset);
                listeners[key] = 'canplaythrough';
            }
        }

        // internal loaded asset function
        function loadedAsset() {
            /* jshint validthis:true */
            loadCount++;

            if (loadCount === requiredCount) {
                // remove all listeners
                for (var key in listeners) {
                    this.removeEventListener(listeners[key], loadedAsset);
                }
                if (typeof callback === "function") callback();
            }
        }

    }



    // actual function to be executed on window load
    return (function () {

        // import
        var HYNE = window.HYNE;

        // Create a new hyne core
        var hyne = new HYNE({
            mobile: true
        });

        // Mount services
        hyne.service(HYNE.Service.Interval);
        hyne.service(HYNE.Service.Display, {
            width: 640,
            height: 360,
            appendTo: window.document.body,
            layers: ["buffer"]
        });
        //hyne.service(HYNE.Service.Keyboard);
        hyne.service(HYNE.Service.Mouse, {
            touch: true,
            width: 640,
            height: 360
        });

        // Set new render and update methods on frame
        hyne.routine('render', 'frame', [HYNE.Service.Display]);
        hyne.routine('update', 'frame', [HYNE.Service.Mouse]);

        // Create play scene
        hyne.scene('play', GAME.PlayMode);
        hyne.scene('select', GAME.SelectMode);

        // set scene
        hyne.scene('select').set({});

        // preload assets and run
        GAME.assets = {};
        preload({
                tiles: "assets/images/tiles.png",
                selector: "assets/images/selector.png",
                click: "assets/audio/click.wav",
                explosion: "assets/audio/grenade.wav",
                cheer: "assets/audio/cheer.wav"
            }, GAME.assets,
            function () {
                hyne.run();
            }
        );
    });



})();
