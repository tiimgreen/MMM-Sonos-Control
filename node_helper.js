var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function() {
    console.log('Sonos helper starting...');
  },

  socketNotificationReceived: function(notification, url) {
    console.log('helper: ' + notification);

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
  }
})
