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



            exec('export DISPLAY=:0 ; chromium-browser --no-sandbox --disable-translate --kiosk --incognito https://www.thing-it.com/', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }

                console.log(`Browser exit with:  ${stdout}`);
            });


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
