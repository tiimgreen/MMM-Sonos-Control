Module.register('MMM-Sonos-Control', {
  defaults: {
    primaryRoomName: 'Living Room',
    updateInterval: 5
  },

  start: function() {
    Log.info('Starting module: ' + this.name);
  },

  getDom: function() {
    var content = getMusicPlayer();
    return $(content)[0];
  },

  getMusicPlayer: function() {
    return '<div class="player">\
      <div class="album-cover">\
        <img src="" />\
      </div>\
      <div class="song-progress-bar">\
        <div class="inner-bar"></div>\
      </div>\
      <div class="song-info">\
        <h1 class="song-title"></h1>\
        <div class="song-band-wrapper">\
          <p class="song-band"><span class="song-artist">artist</span> - <span class="song-album">album</span></p>''
        </div>\
      </div>\
      <div class="player-buttons">\
        <div class="playerbtn song-back">\
          <i class="fa fa-backward" aria-hidden="true"></i>\
        </div>\
        <div class="playerbtn playToggle">\
          <i class="fa fa-play" aria-hidden="true"></i>\
        </div>\
        <div class="playerbtn song-forward">\
          <i class="fa fa-forward" aria-hidden="true"></i>\
        </div>\
      </div>\
    </div>';
  },

  getHeader: function() {
    return this.config.primaryRoomName + ' Sonos';
  }
});
