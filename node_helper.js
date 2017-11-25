var NodeHelper = require('node_helper');
var request = require('request');
var PythonShell = require('python-shell');

module.exports = NodeHelper.create({
  start: function() {
    console.log('Sonos helper starting...');
    this.skyWriterStart();
  },

  socketNotificationReceived: function(notification, url) {
    if (notification == 'SONOS_UPDATE') {
      var self = this;

      request(url, function(error, response, body) {
        if (error) {
          console.error('Error: ' + error);
        } else if (parseInt(response.statusCode) == 200) {
          self.sendSocketNotification('SONOS_DATA', JSON.parse(body));
        }
      });
    }
  },

  skyWriterStart: function() {
    var self = this;
    var pyShell = new PythonShell('modules/' + this.name + '/skywriter.py', { mode: 'json', args: [JSON.stringify(this.config)]});
    console.log('Skywriter started');

    pyShell.on('message', function (message) {
      if (message.hasOwnProperty('gesture')) {
        console.log('Gesture: ', JSON.parse(body));
        self.sendSocketNotification('SKYWRITER_GESTURE', JSON.parse(body));
      }

      if (message.hasOwnProperty('gesture')) {
        console.log('Rotate: ', JSON.parse(body));
        self.sendSocketNotification('SKYWRITER_ROTATE', JSON.parse(body));
      }
    });

    pyShell.end(function (err) {
      if (err) throw err;
      console.log("node_helper_[" + self.name + "] " + 'finished running...');
    });
  }
})
