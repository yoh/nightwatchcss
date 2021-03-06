var async = require('async');

/**
 * if multiple screen width are given resize browser dimension
 */

module.exports = function(done) {

    var that = this;

    if(this.screenWidth && this.screenWidth.length > 0) {

        async.waterfall([
            function(done) {

                /**
                 * get current browser resolution to change back to it
                 * after all shots were taken
                 */
                if(!this.defaultScreenDimension) {
                    this.instance.windowHandleSize(function(err,res) {
                        that.defaultScreenDimension = res.value;
                        done(null);
                    });
                } else {
                    done(null);
                }
            }.bind(this),

            function(done) {
                this.newScreenSize = {};

                /**
                 * resize browser resolution
                 */
                this.instance.call(function() {
                    that.newScreenSize.width = parseInt(that.screenWidth.pop(), 10);
                    that.newScreenSize.height = parseInt(that.defaultScreenDimension.height, 10);

                    /**
                     * if shot will be taken in a specific screenWidth, rename file and append screen width
                     * value in filename
                     */
                    if(that.newScreenSize) {
                        that.filenameCurrent = that.filenameCurrent.replace(/\.(current|new|diff)\.png/,'.' + that.newScreenSize.width + 'px.$1.png');
                        that.filenameNew = that.filenameNew.replace(/\.(current|new|diff)\.png/,'.' + that.newScreenSize.width + 'px.$1.png');
                        that.filenameDiff = that.filenameDiff.replace(/\.(current|new|diff)\.png/,'.' + that.newScreenSize.width + 'px.$1.png');
                        that.filename = that.filenameCurrent;
                    }

                    that.instance.windowHandleSize({width: that.newScreenSize.width, height: that.newScreenSize.height}, function() {
                        done();
                    });
                });
            }.bind(this)

        ], function(err) {
            done();
        });

    } else {

        /**
         * if no screenWidth option was set just continue
         */
        done();

    }

};
