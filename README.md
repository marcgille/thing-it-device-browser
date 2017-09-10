# thing-it-device-browser

[![NPM](https://nodei.co/npm/thing-it-device-browser.png)](https://nodei.co/npm/thing-it-device-browser/)
[![NPM](https://nodei.co/npm-dl/thing-it-device-browser.png)](https://nodei.co/npm/thing-it-device-browser/)

[[thing-it-node]](https://github.com/marcgille/thing-it-node/) Device Plugin for a custom Website that allows you to display and interact with the [[thing-it]](http://www.thing-it.com) universe via the [official Raspberry Pi 7" touchscreen display](https://github.com/marcgille/thing-it-node/)

<p align="center"><a href="./documentation/images/front.jpg"><img src="./documentation/images/front.jpg" width="80%" height="80%"></a></p>
<p align="center"><a href="./documentation/images/back.jpg"><img src="./documentation/images/back.jpg" width="80%" height="80%"></a></p>


## Setup
**[thing-it-device-browser]** is currently tested only on a Raspberry Pi 3. It may works on other versions of Raspberry but the installation process may differ from the following.

### Hardware
Follow the instructions on XXX to Connect your Touchscreen to your Raspberry Pi 3.

**Note:** Make sure your power supply delivers enough power for your Pi and your Touchscreen. 

### Software

#### Image
The easiest way to use **[thing-it-device-browser]** is to download one of our preinstalled **[thing-it-node-image-display]** from [thing-it.com](http://www.thing-it.com). These image comes with full out of the Box support for the offiziell 7" Raspberry Pi Display.
<!--- TODO  --->

#### Raspbian Lite

You can also install all requirements by hand. 
The first step will be to follow the install instrunctions on the [thing-it-node wiki](https://github.com/marcgille/thing-it-node/wiki) to [setup a raspberry pi 3](https://github.com/marcgille/thing-it-node/wiki/Raspberry-Pi-Installation) as **[thing-it-node]**.

**Note:** Make sure you grap the latest **LITE** version of Raspbian. We don't need all the stuff "Raspbian With Desktop" will come with.

Manuell install xServer, Chromium Browser and a few dependencies.

```
sudo apt-get -y update

sudo apt-get -y install lsb-release xserver-xorg xorg jwm chromium-browser libgtk-3-dev
```

Now you are ready to add and configure a **[thing-it-device-browser]** in your Mesh.


## User Interface
