var NodeHelper = require('node_helper');
var request = require('request');
var process = require('child_process');
var express = require('express');
var app = express();
var body_parser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = NodeHelper.create({
  start: function() {
    console.log('Sonos helper starting...');

    var self = this;

    app.post('/', function(req, res) {
        console.log('Sonos change posted');
        self.sendSocketNotification('SONOS_DATA', req.body.data);
    });

    app.listen(4444, function() {
        console.log('Webhook server listening...');
    });
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
  }
})
