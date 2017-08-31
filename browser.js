module.exports = {
    metadata: {
        family: "browser",
        plugin: "browser",
        label: "Browser",
        dataTypes: {},
        actorTypes: [],
        sensorTypes: [],
        services: [],
        configuration: []
    },


    create: function (device) {
        return new Browser();
    }
};

var q = require('q');

function Browser() {
    /**
     *
     */

    Browser.prototype.start = function () {
        var deferred = q.defer();

        this.objects = [];


        if (this.isSimulated()) {
            deferred.resolve();
        } else {

            const {exec} = require('child_process');

            /**
             * release running xServer
             */
            exec('rm /tmp/.X0-lock', (err, stdout, stderr) => {
                //    exec('/usr/bin/X :0', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }

                console.log(`xServer release:  ${stdout}`);

            });


            /**
             * lock new xServer on DISPLAY : 0
             */
//            setTimeout(function () {
                exec('/usr/bin/X :0 -nocursor', (err, stdout, stderr) => {
                    //    exec('/usr/bin/X :0', (err, stdout, stderr) => {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }

                    console.log(`xServer lock:  ${stdout}`);

                });
//            }, 2000);


            /**
             * Initialise Input devices
             */
//            setTimeout(function () {
                exec('export DISPLAY=:0 ; chromium-browser --no-sandbox --disable-translate --kiosk --incognito --test-type https://www.thing-it.com/', (err, stdout, stderr) => {
                    //exec('chromium-browser --no-sandbox --disable-translate --kiosk --incognito https://www.thing-it.com/', (err, stdout, stderr) => {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }

                    console.log(`Browser exit with:  ${stdout}`);
                });
 //           }, 2000);


            deferred.resolve();
        }

        return deferred.promise;
    };


    /**
     *
     */
    Browser.prototype.getState = function () {
        return {};
    };

    /**
     *
     */
    Browser.prototype.setState = function () {
    };

    /**
     *
     */

    Browser.prototype.stop = function () {

    };

    /**
     *
     */
}
