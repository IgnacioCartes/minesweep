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



    /*= start button.js =*/



    function Button(text, x, y, width, height, onclick) {
        this.text = text || "X";
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 16;
        this.height = height || 16;
        this.onclick = onclick ||  (function () {});
    }



    Button.prototype.isInBounds = function (x, y) {
        if ((x >= this.x) && (y >= this.y) && (x <= (this.x + this.width)) && (y <= (this.y + this.height))) {
            return true;
        } else {
            return false;
        }
    };



    Button.prototype.render = function (context) {

        // set generic properties
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#99B5CC";

        // border color depends on click property
        if (this.click) {
            context.strokeStyle = "#22F96F";
        } else {
            context.strokeStyle = "#99B5CC";
        }

        // border
        context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // text
        context.fillText(
            this.text,
            this.x + (this.width / 2),
            this.y + (this.height / 2)
        );
    };
    


    /*= end button.js =*/



    // expose to public
    module.Button = Button;
    return module;
})(window, window.GAME || {});
