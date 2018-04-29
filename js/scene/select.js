/*
 * scene/play.js
 *
 *  JavaScript class that represents a hyne scene to play the game.
 *
 *
 *
 */
window.GAME = (function (window, module) {
    'use strict';



    /*= start scene/select.js =*/
    // frame and character counter used for text display
    var frameCounter, charCounter;
    // buttons
    var buttons = [];
    // define board sizes
    var boards = {
        "beginner": {
            size: {
                width: 8,
                height: 8
            },
            mines: 10
        },
        "intermediate": {
            size: {
                width: 16,
                height: 16
            },
            mines: 40
        },
        "expert": {
            size: {
                width: 30,
                height: 16
            },
            mines: 99
        }
    };



    // exportable object
    module.SelectMode = {
        /*
         * public void _START(props)
         *
         */
        _START: function (props) {
            // set some startup variables
            var centerX = (640 - 192) / 2;
            frameCounter = 0;
            charCounter = 0;

            // >this< references the hyne object
            // to retain access to the set scene method
            var hyne = this;

            // create buttons
            buttons = [];
            buttons.push(new GAME.Button(
                "BEGINNER",
                centerX,
                144,
                192,
                32,
                setMode.bind(hyne, "beginner")
            ));

            buttons.push(new GAME.Button(
                "INTERMEDIATE",
                centerX,
                192,
                192,
                32,
                setMode.bind(hyne, "intermediate")
            ));

            buttons.push(new GAME.Button(
                "EXPERT",
                centerX,
                240,
                192,
                32,
                setMode.bind(hyne, "expert")
            ));

            buttons.push(new GAME.Button(
                "EXIT",
                centerX,
                288,
                192,
                32,
                function () {
                    // detect if cocoon
                    if (window.Cocoon)
                        if (window.Cocoon.App) window.Cocoon.App.exit();
                }
            ));
        },



        /*
         * public void render($display)
         *
         */
        render: function ($display) {
            // clear display
            $display.clear();

            // boring text because I can't do actual logos
            $display.context.buffer.textBaseline = "hanging";
            $display.context.buffer.textAlign = "left";

            // substr function
            function countSubstr(text, cStart) {
                var maxLen = text.length;
                var curLen = charCounter - cStart;
                if (curLen <= 0) return "";
                if (curLen >= maxLen) return text;
                return text.substr(0, curLen);
            }

            $display.context.buffer.font = "32px Courier";
            $display.context.buffer.fillStyle = "#22F96F";
            $display.context.buffer.fillText(countSubstr("> minesweeper", 0) + "_", 48, 32);

            $display.context.buffer.font = "28px Courier";
            $display.context.buffer.fillStyle = "#31E070";
            $display.context.buffer.fillText(countSubstr("> by nacho c.", 12) + "_", 48, 80);

            // buttons - only render when text has been rendered fully (30 characters)
            if (charCounter >= 32) {
                $display.context.buffer.font = "20px Courier";
                for (var bIndex in buttons)
                    buttons[bIndex].render($display.context.buffer);
            }

            // increase frame counter, every 8 frames add one character
            frameCounter++;
            if ((frameCounter % 6) === 0) charCounter++;

            // copy buffers
            $display.copy();
        },



        /*
         * public void update($mouse)
         *
         */
        update: function ($mouse) {
            var bIndex, mGet;



            if ($mouse.click()) {
                mGet = $mouse.get();

                // buttons - only interact when text has been rendered fully (30 characters)
                if (charCounter >= 32)
                    for (bIndex in buttons) buttons[bIndex].click = buttons[bIndex].isInBounds(mGet.x, mGet.y);
            }


            // on mouse button release
            if ($mouse.release()) {
                mGet = $mouse.get();

                // buttons - only interact when text has been rendered fully (30 characters)
                if (charCounter >= 32) {
                    for (bIndex in buttons) {
                        if (buttons[bIndex].isInBounds(mGet.x, mGet.y))
                            if (buttons[bIndex].click) buttons[bIndex].onclick();
                        buttons[bIndex].click = false;
                    }
                } else {
                    // on release though, display all characters asap (and by extension, buttons)
                    charCounter = 32;
                }

            }
        }

    };




    /*
     * private void setMode(difficulty)
     *
     */
    function setMode(difficulty) {
        /*jshint validthis:true */

        // default mode
        if (!difficulty) difficulty = "beginner";

        // validate if mode exists
        if (!boards[difficulty]) return null;

        // set mode
        this.scene('play').set(boards[difficulty]);
    }



    /*= end scene/select.js =*/



    // expose to public
    return module;
})(window, window.GAME || {});
