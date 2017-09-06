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
            }
        ],
        configuration: [
            {
                id: "lcdRotate",
                label: "LCD Rotate",
                type: {
                    id: "integer"
                },
                defaultValue: "0"
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

        //this.objects = [];


        if (this.isSimulated()) {
            deferred.resolve();
        } else {

            let spawn = require('child_process').spawn;


            //if xserver already running -> release
            exec('rm /tmp/.X0-lock', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }
                console.log(`xServer release:  ${stdout}`);
            });


            //lock new xServer on DISPLAY : 0 and disable cursor
            exec('/usr/bin/X :0 -nocursor', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }
                console.log(`xServer lock:  ${stdout}`);

            });


            /**
             * Start Chromium on Display 0
             */
            this.chromium = spawn('export DISPLAY=:0 && ' +
                'chromium-browser ' +
                '--no-sandbox ' +
                '--disable-translate ' +
                '--kiosk ' +
                '--incognito ' +
                '--test-type ' +
                'https://www.thing-it.com/thing-it/display.html?tip=0.8#!/?mesh=58f71098a124543ca4361a8a',
                {
                    shell: true
                }
            );

            this.chromium.on('close', (code) => {
                console.log(`Chromium child process exited with code ${code}`);
                //TODO Invoke restart after browser exited unexpected?
            });


            //disable power saving on D 0
            setTimeout(function () {
                exec('export DISPLAY=:0; sudo xset s off; sudo xset -dpms; sudo xset s noblank', (err, stdout, stderr) => {

                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }

                    console.log(`Power saving disabled:  ${stdout}`);

                });
            }, 10000);


            //Test restart service
            //  setTimeout(function () {
            //      this.restart();
            //  }.bind(this), 50000);



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

        console.log(`killing child process`);


    };

    /**
     *
     */
    Browser.prototype.restart = function () {

        console.log(`invoke stop`);
        this.stop();

        console.log(`invoke start`);
        this.start();

    };

    /**
     *
     */
    Browser.prototype.setBrightness = function () {

        exec('echo ' + this.state.lcdBrightness + ' > /sys/class/backlight/rpi_backlight/brightness', (err, stdout, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }
            console.log(`Set LCD Brightness to: ` + this.state.lcdBrightness + ' ' + stdout);

        });
    };
}


