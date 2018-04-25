window.onload = (function () {
    'use strict';

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

        // Set scene
        /*
        hyne.scene('play').set({
            size: {
                width: 8,
                height: 8
            },
            mines: 10
        });
        */
        hyne.scene('select').set({});

        // run
        hyne.run();
    });



    /*
    
    screen dimensions: 320x180 (2x)
    border: 4px
    area for tiles: 288x160 (9x5) (size 32x32)
    area for scroll bars: 24x16
    
    
    */




})();
