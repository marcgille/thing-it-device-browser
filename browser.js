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
