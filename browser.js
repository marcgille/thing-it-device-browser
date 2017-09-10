module.exports = {
    metadata: {
        family: "browser",
        plugin: "browser",
        label: "Browser",
        dataTypes: {},
        actorTypes: [],
        sensorTypes: [],
        services: [{
            id: "restartBrowser",
            label: "Restart Browser"
        }, {
            id: "setBrightness",
            label: "Set Brightness"
        }
        ],
        state: [
            {
                id: "lcdBrightness",
                label: "LCD Brightness",
                type: {
                    id: "integer"
                },
                defaultValue: "255"
            }, {
                id: "markupMode",
                label: "Markup Mode",
                type: {
                    id: "boolean"
                },
                defaultValue: "false"
            }
        ],
        configuration: [
            {
                id: "lcdRotate",
                label: "LCD Rotate",
                type: {
                    id: "integer"
                }
            }, {
                id: "url",
                label: "URL",
                type: {
                    id: "string"
                }
            }, {
                id: "markup",
                label: "Markup",
                type: {
                    id: "html"
                }
            }
        ]
    },


    create: function (device) {
        return new Browser();
    }
};

var q = require('q');
var psTree = require('ps-tree');
var {exec} = require('child_process');

function Browser() {
    /**
     *
     */

    Browser.prototype.start = function () {
        var deferred = q.defer();


        //DEBUG ENABLE
        this.logLevel = 'debug';

        if (this.isSimulated()) {

            deferred.resolve();

        } else {

            let spawn = require('child_process').spawn;
            let urltoload = "";

            if (this.state.markupMode) {
                //TODO specify right destination
                urltoload = "file:///data/thing-it-work/browser/markup-example.html";
            } else {
                urltoload = String(this.configuration.url);
            }


            //if xserver already running -> release
            exec('pkill Xorg', (err, stdout, stderr) => {
                if (err) {
                    this.logDebug(`Nothing to kill with Raspian Lite command: ${err}`);

                    exec('rm /tmp/.X0-lock', (err, stdout, stderr) => {
                        if (err) {
                            this.logDebug(`Really no xServer to Kill ${err}`);
                            return;
                        }
                        this.logDebug(`xServer released on Docker:  ${stdout}`);
                    });

                    return;
                }

                this.logDebug(`xServer released on Raspbian Lite:  ${stdout}`);
            });


            //lock new xServer on DISPLAY : 0 and disable cursor
            setTimeout(function () {
                exec('export DISPLAY=:0; Xorg -nocursor', (err, stdout, stderr) => {
                    //exec('/usr/bin/X :0 -nocursor', (err, stdout, stderr) => {
                    if (err) {
                        this.logDebug(`exec error: ${err}`);
                        return;
                    }
                    this.logDebug(`xServer started:  ${stdout}`);

                });
            }.bind(this), 5000);


            //Start Chromium on Display 0
            setTimeout(function () {
                this.logDebug(`Starting CHROMIUM BROWSER with URL: `, String(urltoload));

                this.chromium = spawn('export DISPLAY=:0 && chromium-browser ',
                    [
                        '--no-sandbox ' +
                        '--disable-translate ' +
                        '--kiosk ' +
                        '--incognito ' +
                        '--test-type ' +
                        '"' + String(urltoload) + '"',
                    ], {shell: true}
                );

                this.chromium.on('close', (code) => {
                    this.logDebug(`Chromium child process exited with code ${code}`);
                    //TODO Invoke restart after browser exited unexpected?
                });

            }.bind(this), 10000);


            //disable power saving on D 0
            setTimeout(function () {
                exec('export DISPLAY=:0; sudo xset s off; sudo xset -dpms; sudo xset s noblank', (err, stdout, stderr) => {

                    if (err) {
                        this.logDebug(`Disable power saving NOT successfull. ${err}`);
                        return;
                    }

                    this.logDebug(`Power saving successfully disabled.  ${stdout}`);

                });
            }.bind(this), 15000);

            //Test restart service
            // setTimeout(function () {
            //     this.restart();
            // }.bind(this), 50000);


            //Test Brightness
            // setTimeout(function () {
            //     this.state.lcdBrightness = 50;
            //     this.setBrightness();
            // }.bind(this), 20000);
            //
            // setTimeout(function () {
            //     this.state.lcdBrightness = 255;
            //     this.setBrightness();
            // }.bind(this), 40000);


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

        var kill = function (pid, signal, callback) {
            signal = signal || 'SIGKILL';
            callback = callback || function () {
            };

            var killTree = true;

            if (killTree) {
                psTree(pid, function (err, children) {
                    [pid].concat(
                        children.map(function (p) {
                            return p.PID;
                        })
                    ).forEach(function (tpid) {
                        try {
                            process.kill(tpid, signal)
                        }
                        catch (ex) {
                        }
                    });
                    callback();
                });

            } else {

                try {
                    process.kill(pid, signal)
                }
                catch (ex) {
                }
                callback();
            }
        };

        kill(this.chromium.pid);

        this.logDebug(`Killing chromium process`);


    };

    /**
     *
     */
    Browser.prototype.restart = function () {

        this.logDebug(`Invoke Browser restart`);

        this.stop();
        this.start();

    };

    /**
     *
     */
    Browser.prototype.setBrightness = function () {

        exec('echo ' + this.state.lcdBrightness + ' > /sys/class/backlight/rpi_backlight/brightness', (err, stdout, stderr) => {
            if (err) {
                this.logDebug(`exec error: ${err}`);
                return;
            }
            this.logDebug(`Set LCD Brightness to: ` + this.state.lcdBrightness + ' ' + stdout);

        });
    };
}


