/*
 * minefield.js
 *
 *  JavaScript class that represents a minefield.
 *
 *
 *
 */
window.GAME = (function (window, module) {
    'use strict';



    /*= start minefield.js =*/
    // pending array - used when clearing multiple tiles
    var pending = [];
    var image;

    // text colors array
    var adjColors = [
        "#000000",
        "#DFDFDF",
        "#4B81FA",
        "#7FFA4B",
        "#FA4B7F",
        "#3961BD",
        "#BD9339",
        "#39BDB4",
        "#BBBDBD"
    ];



    function Minefield(width, height, mines) {
        // get minefield properties
        this.width = width;
        this.height = height;
        this.mines = mines;

        // minefield variables
        this.isPopulated = false;
        this.gameState = 0;
        this.cleared = 0;
        this.clearedProgress = 0;
        this.startTime = null;
        this.finalTime = null;

        // compute properties
        this.length = width * height;
        this.flagged = 0;

        // throw an error if trying to put way too many mines
        if (this.mines >= this.length)
            throw new Error("Number of mines cannot be greater to the size of the minefield.");

        // density over 50% is also a mistake, but lets just warn
        if ((this.mines / this.length) > 0.5)
            window.console.warn("This minefield has a mine density over 50%, which is just a bad idea overall.");

        // set arrays to store minefield
        this.adjacent = new Array(this.length);
        this.exposed = new Array(this.length);
        this.minesLocations = [];

        // create minefield
        this.populateMinefield();

        // load image
        image = new window.Image();
        image.src = 'assets/images/tiles.png';

        // initial rendering onload
        image.onload = this.render.bind(this);

        return this;
    }



    Minefield.prototype.render = function () {
        // if there is no canvas, create it now
        if (!this.canvas) {
            this.canvas = window.document.createElement('canvas');
            this.canvas.width = this.width * GAME.Config.tileSize;
            this.canvas.height = this.height * GAME.Config.tileSize;
            this.context = this.canvas.getContext('2d');

            this.context.font = "24px verdana, sans-serif";
            this.context.fillStyle = "#E0E8FA";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
        }

        // same for minimap
        /*
        if (!this.minimap) {
            this.minimap = window.document.createElement('canvas');
            this.minimap.width = this.width;
            this.minimap.height = this.height;
            this.minimapCtx = this.minimap.getContext('2d');
            window.console.log(this.minimap);
        }
        */

        // draw - main rendering loop
        for (var n = 0; n < this.length; n++) {
            // position
            var x = n % this.width;
            var y = Math.floor(n / this.width);

            var exposed = this.exposed[n],
                adjacent = this.adjacent[n];
            var tile = 0;
            if (exposed === 1)
                if (adjacent <= 0) {
                    tile = 64;
                } else {
                    tile = 128;
                }

            // draw tile
            this.context.drawImage(image,
                tile, 0,
                GAME.Config.tileSize, GAME.Config.tileSize,
                x * GAME.Config.tileSize, y * GAME.Config.tileSize,
                GAME.Config.tileSize, GAME.Config.tileSize);

            // draw to minimap
            /*
            var pixel = this.minimapCtx.createImageData(1, 1);
            if (exposed === 1) {
                pixel.data[0] = 15;
                pixel.data[1] = 16;
                pixel.data[2] = 17;
            } else {
                pixel.data[0] = 190;
                pixel.data[1] = 192;
                pixel.data[2] = 194;
            }
            pixel.data[3] = 255;
            this.minimapCtx.putImageData(pixel, x, y);
            */

            // draw text
            if (exposed === 1) {
                if (adjacent === -1) {
                    this.context.fillStyle = "#AA1B2F";
                } else {
                    this.context.fillStyle = adjColors[adjacent];
                }
                this.context.fillText((adjacent === -1 ? "*" : adjacent.toString()), x * GAME.Config.tileSize + 32, y * GAME.Config.tileSize + 32);
            } else if (exposed <= -1) {
                this.context.fillStyle = "#FCFFFF";
                this.context.fillText((exposed === -1 ? "X" : "?"), x * GAME.Config.tileSize + 32, y * GAME.Config.tileSize + 28);
            }
        }

    };


    Minefield.prototype.populateMinefield = function () {
        // initialize arrays
        for (var n = 0; n < this.length; n++) {
            this.adjacent[n] = 0;
            this.exposed[n] = 0;
        }

        // laying mines
        var laid = 0;
        while (laid < this.mines) {
            var target = parseInt(Math.floor(Math.random() * this.length));
            if (this.adjacent[target] !== -1) {
                // -1 is the value that determines there is a mine on this tile
                this.adjacent[target] = -1;
                // store mine
                this.minesLocations.push(target);
                // let neighbors know about new mine
                applyToNeighbors(this, target, neightborIsMine);
                laid++;
            }
        }

        // set variables
        this.cleared = 0;
        this.clearedProgress = 0;
        this.isPopulated = true;

        return this;
    };



    Minefield.prototype.flag = function (tile) {
        // ignore if map is not populated (for whatever reason)
        if (!this.isPopulated || this.gameState) return this;
        // only continue if tile is not yet exposed
        if (this.exposed[tile] < 1) {
            // shift between different flagged states
            this.exposed[tile]--;
            if (this.exposed[tile] < -2) this.exposed[tile] = 0;
            // if flagged -1, increase count, else decrease
            if (this.exposed[tile] === -1) {
                this.flagged++;
            } else if (this.exposed[tile] === -2) {
                this.flagged--;
            }
        }
        // render canvas
        this.render();

        return this;
    };



    Minefield.prototype.expose = function (tile) {
        // ignore if map is not populated (for whatever reason)
        if (!this.isPopulated || this.gameState) return this;
        // get initial time
        if (!this.startTime) this.startTime = Date.now();
        // only continue if tile is not yet exposed and not flagged
        if (this.exposed[tile] === 0) {
            // is this a mine?
            if (this.adjacent[tile] === -1) {
                // it was a mine, sorry
                this.exposed[tile] = 1;
                this.gameState = -1;
                this.finalTime = Date.now() - this.startTime;
                // expose all mines
                exposeAllMines(this);
            } else {
                this.exposed[tile] = 1;
                this.cleared++;
                // iteratively expose neighbors if this tile's adjacent value is 0
                if (this.adjacent[tile] === 0) exposeMultiple(this, tile);
                this.clearedProgress = this.cleared / (this.length - this.mines);
                // determine winning conditions
                if (this.cleared >= (this.length - this.mines)) {
                    // you won! lets set the game state and store final time
                    this.gameState = 1;
                    this.finalTime = Date.now() - this.startTime;
                    // flag remaining mines
                    flagAllMines(this);
                }
            }
        }
        // render canvas
        this.render();

        return this;
    };



    Minefield.prototype.getRemainingMines = function () {
        return this.mines - this.flagged;
    };



    Minefield.prototype.getElapsedTime = function () {
        if (!this.startTime) return 0;
        if (this.finalTime) return this.finalTime;
        return (Date.now() - this.startTime);
    };



    Minefield.prototype.adjToString = function () {
        var str = "";
        for (var n = 0; n < this.length; n++) {
            if (this.adjacent[n] === -1) {
                str += "*";
            } else if (this.adjacent[n] === 0) {
                str += "_";
            } else {
                str += this.adjacent[n].toString();
            }
            str += " ";
            if ((n % this.width) === (this.width - 1)) str += "\n";
        }
        return str;
    };



    Minefield.prototype.mfToString = function () {
        var str = "";
        for (var n = 0; n < this.length; n++) {
            if (this.exposed[n] === 1) {
                if (this.adjacent[n] === -1) {
                    str += "*";
                } else if (this.adjacent[n] === 0) {
                    str += " ";
                } else {
                    str += this.adjacent[n].toString();
                }
            } else if (this.exposed[n] === -1) {
                str += "!";
            } else if (this.exposed[n] === -2) {
                str += "?";
            } else {
                str += "_";
            }
            str += " ";
            if ((n % this.width) === (this.width - 1)) str += "\n";
        }
        return str;
    };



    function exposeAllMines(minefield) {
        for (var index in minefield.minesLocations) {
            // expose mines
            minefield.exposed[minefield.minesLocations[index]] = 1;
        }
        minefield.flagged = minefield.mines;
    }



    function flagAllMines(minefield) {
        for (var index in minefield.minesLocations) {
            // expose mines
            minefield.exposed[minefield.minesLocations[index]] = -1;
        }
        minefield.flagged = minefield.mines;
    }



    function applyToNeighbors(minefield, tile, fn) {
        var x = (tile % minefield.width);
        // top neighbors (if not top row)
        if (tile >= minefield.width) {
            if (x > 0) fn(minefield, tile - minefield.width - 1);
            fn(minefield, tile - minefield.width);
            if (x < minefield.width - 1) fn(minefield, tile - minefield.width + 1);
        }
        // side neighbors
        if (x > 0) fn(minefield, tile - 1);
        if (x < minefield.width - 1) fn(minefield, tile + 1);
        // bottom neighbors (if not bottom row)
        if (tile < minefield.length - minefield.width) {
            if (x > 0) fn(minefield, tile + minefield.width - 1);
            fn(minefield, tile + minefield.width);
            if (x < minefield.width - 1) fn(minefield, tile + minefield.width + 1);
        }
    }



    function neightborIsMine(minefield, tile) {
        // increase adjacent value if not a mine
        if (minefield.adjacent[tile] !== -1) minefield.adjacent[tile]++;
    }



    function iterateExpose(minefield, tile) {
        // expose if not a mine and not exposed already
        var wasExposed = minefield.exposed[tile];
        if ((minefield.adjacent[tile] > -1) && (minefield.exposed[tile] === 0)) {
            minefield.exposed[tile] = 1;
            minefield.cleared++;
        }
        // keep iterating this tile's adjacent value is 0 and was not exposed already
        if ((minefield.adjacent[tile] === 0) && (wasExposed < 1)) {
            applyToNeighbors(minefield, tile, iterateExpose);
        }
    }



    function exposeMultiple(minefield, tile) {
        pending = [tile];
        // repeat this loop until there's no pending tiles to look through
        while (pending.length) {
            var firstInQueue = pending[0];
            // if first tile in queue has 0 adjacent mines, find and expose neighbors
            if (minefield.adjacent[firstInQueue] === 0) {
                applyToNeighbors(minefield, firstInQueue, exposeNeighbors);
            }
            // expose this if needed
            if (minefield.exposed[firstInQueue] === 0) {
                minefield.exposed[firstInQueue] = 1;
                minefield.cleared++;
            }
            // splice this tile from pending queue now
            pending.splice(0, 1);
        }
    }



    function exposeNeighbors(minefield, tile) {
        // if no adjacent tile and not exposed, push to pending (as long as it wasn't there already)
        if ((minefield.adjacent[tile] === 0) && (minefield.exposed[tile] === 0))
            if (pending.indexOf(tile) === -1)
                pending.push(tile);
        // now, expose if it wasnt
        if (minefield.exposed[tile] === 0) {
            minefield.exposed[tile] = 1;
            minefield.cleared++;
        }
    }




    /*= end minefield.js =*/



    // expose to public
    module.Minefield = Minefield;
    return module;
})(window, window.GAME || {});
