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



    /*= start scene/play.js =*/
    var minefield, cursor, click = {};
    var mview = {};

    var selector;

    // buttons
    var buttons = [];



    // exportable object
    module.PlayMode = {



        /*
         * public void _START(props)
         *
         */
        _START: function (props) {
            // create new minefield
            minefield = new GAME.Minefield(props.size.width || 8, props.size.height || 8, props.mines || 10);
            cursor = 0;

            // >this< references the hyne object
            // to retain access to the set scene method
            var hyne = this;

            // define view properties
            mview = {
                size: {
                    width: GAME.Config.viewportSize.width * GAME.Config.tileSize,
                    height: GAME.Config.viewportSize.height * GAME.Config.tileSize
                },
                offset: {
                    x: 0,
                    y: 0
                },
                bounds: {
                    x: (minefield.width - GAME.Config.viewportSize.width) * GAME.Config.tileSize,
                    y: (minefield.height - GAME.Config.viewportSize.height) * GAME.Config.tileSize
                },
                sweep: {
                    x: 0,
                    y: 0
                },
                scrollbars: {
                    size: {
                        width: GAME.Config.viewportSize.width / minefield.width,
                        height: GAME.Config.viewportSize.height / minefield.height
                    }
                }
            };

            // create buttons
            // they really should be a new class but ehh --- now they are!
            buttons = [];
            buttons.push(new GAME.Button(
                "RESTART",
                mview.size.width + GAME.Config.minefieldOffset.x + 20,
                GAME.Config.minefieldOffset.y + 224,
                80,
                32,
                function () {
                    // recreate minefield with same variables
                    var mfWidth = minefield.width,
                        mfHeight = minefield.height,
                        mfMines = minefield.mines;
                    minefield = new GAME.Minefield(mfWidth, mfHeight, mfMines);
                    // reset scrolling
                    mview.offset.x = 0;
                    mview.offset.y = 0;
                }
            ));

            buttons.push(new GAME.Button(
                "EXIT",
                mview.size.width + GAME.Config.minefieldOffset.x + 20,
                GAME.Config.minefieldOffset.y + 272,
                80,
                32,
                function () {
                    // return to select scene
                    hyne.scene('select').set();
                }
            ));

            // load selector image
            selector = new window.Image();
            selector.src = 'assets/images/selector.png';
        },



        /*
         * public void render($display)
         *
         */
        render: function ($display) {
            // clear display
            $display.clear();

            // draw minefield
            if (minefield.canvas)
                $display.context.buffer.drawImage(
                    minefield.canvas,
                    mview.offset.x,
                    mview.offset.y,
                    mview.size.width,
                    mview.size.height,
                    GAME.Config.minefieldOffset.x,
                    GAME.Config.minefieldOffset.y,
                    mview.size.width,
                    mview.size.height
                );

            // and minimap
            /*
            if (minefield.minimap) {
                $display.context.buffer.drawImage(
                    minefield.minimap,
                    mview.size.width + GAME.Config.minefieldOffset.x + 16,
                    GAME.Config.minefieldOffset.y
                );
            }
            */

            // render cursor if active and selected tile is still not exposed
            if (click.is && (click.in === "minefield") && (minefield.exposed[click.target] <= 0)) {
                if (selector.complete) {
                    var frame = ((click.time % 8 >= 4) ? 0 : 64);
                    $display.context.buffer.drawImage(
                        selector,
                        frame,
                        0,
                        64,
                        64,
                        (click.on.x * GAME.Config.tileSize) - mview.offset.x + GAME.Config.minefieldOffset.x,
                        (click.on.y * GAME.Config.tileSize) - mview.offset.y + GAME.Config.minefieldOffset.y,
                        64,
                        64
                    );
                }
            }

            // only render scrollbars when needed
            $display.context.buffer.fillStyle = "#EFF4F6";

            if (mview.scrollbars.size.width < 1) {
                var scrollbarWidth = mview.scrollbars.size.width * mview.size.width;
                var scrollbarPositionX = Math.floor((mview.size.width - scrollbarWidth) * (mview.offset.x / mview.bounds.x));
                $display.context.buffer.fillRect(scrollbarPositionX + GAME.Config.minefieldOffset.x, mview.size.height + GAME.Config.minefieldOffset.y, scrollbarWidth, 8);
            }

            if (mview.scrollbars.size.height < 1) {
                var scrollbarHeight = mview.scrollbars.size.height * mview.size.height;
                var scrollbarPositionY = Math.floor((mview.size.height - scrollbarHeight) * (mview.offset.y / mview.bounds.y));
                $display.context.buffer.fillRect(mview.size.width + GAME.Config.minefieldOffset.x, scrollbarPositionY + GAME.Config.minefieldOffset.y, 8, scrollbarHeight);
            }

            // text
            $display.context.buffer.font = "40px DS-Digital";
            $display.context.buffer.textBaseline = "hanging";
            $display.context.buffer.textAlign = "right";

            if (minefield.gameState === -1) {
                // red text when you lost
                $display.context.buffer.fillStyle = "#AA1B2F";
            } else {
                // green text by default
                $display.context.buffer.fillStyle = "#22F96F";
            }

            // remaining mines
            $display.context.buffer.fillText(
                minefield.getRemainingMines().toString(),
                mview.size.width + GAME.Config.minefieldOffset.x + 80,
                GAME.Config.minefieldOffset.y + 32
            );

            // time
            $display.context.buffer.fillText(
                Math.floor(minefield.getElapsedTime() / 1000),
                mview.size.width + GAME.Config.minefieldOffset.x + 80,
                GAME.Config.minefieldOffset.y + 96
            );

            // small text
            $display.context.buffer.font = "20px DS-Digital";
            $display.context.buffer.fillStyle = "#99B5CC";

            $display.context.buffer.fillText(
                "MINES",
                mview.size.width + GAME.Config.minefieldOffset.x + 80,
                GAME.Config.minefieldOffset.y + 16
            );

            $display.context.buffer.fillText(
                "TIMER",
                mview.size.width + GAME.Config.minefieldOffset.x + 80,
                GAME.Config.minefieldOffset.y + 80
            );

            // buttons
            for (var bIndex in buttons)
                buttons[bIndex].render($display.context.buffer);

            // copy buffers
            $display.copy();
        },



        /*
         * public void update($mouse)
         *
         */
        update: function update($mouse) {
            var bIndex, mGet;

            // on mouse down
            if ($mouse.click()) {
                click.is = true;
                // determine what tile was clicked (if any)
                mGet = $mouse.get();

                if ((mGet.x >= GAME.Config.minefieldOffset.x) && (mGet.y >= GAME.Config.minefieldOffset.y) && (mGet.x < (GAME.Config.minefieldOffset.x + mview.size.width)) && (mGet.y < (GAME.Config.minefieldOffset.y + mview.size.height))) {
                    click.on = {
                        x: Math.floor((mGet.x + mview.offset.x - GAME.Config.minefieldOffset.x) / GAME.Config.tileSize),
                        y: Math.floor((mGet.y + mview.offset.y - GAME.Config.minefieldOffset.y) / GAME.Config.tileSize)
                    };
                    click.in = "minefield";
                    click.target = (click.on.y * minefield.width) + click.on.x;
                } else {
                    click.in = "out-of-bounds";
                }

                // check button interaction
                for (bIndex in buttons) buttons[bIndex].click = buttons[bIndex].isInBounds(mGet.x, mGet.y);
            }

            // on mouse button release
            if ($mouse.release()) {
                mGet = $mouse.get();
                // detect if this click is still active (no sweeping or stuff)
                if (click.is) {
                    if (click.in === "minefield") {
                        // depending on how long click was held, reveal or flag mine
                        if (click.time < GAME.Config.framesToFlag) {
                            minefield.expose(click.target);
                        } else {
                            minefield.flag(click.target);
                        }
                    }
                    //window.console.log(m, mCursor, click.time);
                    click.is = false;
                    click.time = 0;
                }

                // check button interaction
                for (bIndex in buttons) {
                    if (buttons[bIndex].isInBounds(mGet.x, mGet.y))
                        if (buttons[bIndex].click) buttons[bIndex].onclick();
                    buttons[bIndex].click = false;
                }
            }

            if (click.is) {
                click.time++;
            } else {
                click.time = 0;
            }

            // simulate "sweeping"
            var sweep = $mouse.sweep();

            // detect sweeping and add to screen scrolling
            if (Math.abs(sweep.x) >= 6) mview.sweep.x += Math.sign(sweep.x) * 4;
            if (Math.abs(sweep.y) >= 6) mview.sweep.y += Math.sign(sweep.y) * 4;
            // cap sweep
            if (Math.abs(mview.sweep.x) > 12) mview.sweep.x = 12 * Math.sign(sweep.x);
            if (Math.abs(mview.sweep.y) > 12) mview.sweep.y = 12 * Math.sign(sweep.y);

            // a sweep is not a click
            if (mview.sweep.x || mview.sweep.y) click.is = false;

            // react to sweeping
            if (mview.sweep.x) {
                // move offset
                mview.offset.x += (mview.sweep.x * 2);
                // ensure we don't go out of bounds
                if (mview.offset.x < 0) mview.offset.x = 0;
                if (mview.offset.x > mview.bounds.x) mview.offset.x = mview.bounds.x;
                // if abs sweep value is greater than 1, slow down
                // if abs sweep value is 1, only stop to "snap to grid"
                if (Math.abs(mview.sweep.x) > 1) {
                    mview.sweep.x -= Math.sign(mview.sweep.x);
                } else {
                    if ((mview.offset.x % 32) === 0) mview.sweep.x = 0;
                }
            }

            // same for y
            if (mview.sweep.y) {
                mview.offset.y += (mview.sweep.y * 2);
                if (mview.offset.y < 0) mview.offset.y = 0;
                if (mview.offset.y > mview.bounds.y) mview.offset.y = mview.bounds.y;
                if (Math.abs(mview.sweep.y) > 1) {
                    mview.sweep.y -= Math.sign(mview.sweep.y);
                } else {
                    if ((mview.offset.y % 32) === 0) mview.sweep.y = 0;
                }
            }
        }
    };



    /*= end scene/play.js =*/



    // expose to public
    return module;
})(window, window.GAME || {});
