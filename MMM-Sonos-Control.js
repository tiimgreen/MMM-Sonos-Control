Module.register('MMM-Sonos-Control', {
  defaults: {
    sonosRoomName: 'Living Room',
    updateInterval: 5000, // every 5 seconds
    apiBase: 'http://localhost',
    apiPort: 5005,
    apiEndpoint: 'zones'
  },

  current_song: {
    title: '',
    album: '',
    artist: '',
    albumArtUrl: '',
    duration: ''
  },

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.update();

    // refresh every x milliseconds
    setInterval(
      this.update.bind(this),
      this.config.updateInterval
    );
  },

  update: function() {
    this.sendSocketNotification(
      'SONOS_UPDATE',
      this.config.apiBase + ":" + this.config.apiPort + "/" + this.config.apiEndpoint
    );
  },

  updateSonosInfo: function(data) {
    var sonos = this.getRoomInfo(data, this.config.sonosRoomName);

    var state = sonos.coordinator.state
    var currentTrack = state.currentTrack;

    this.current_song.title = currentTrack.title;
    this.current_song.album = currentTrack.album;
    this.current_song.artist = currentTrack.artist;
    this.current_song.albumArtUrl = currentTrack.absoluteAlbumArtUri;
    this.current_song.duration = (state.elapsedTime / currentTrack.duration) * 100;
  },

  getRoomInfo: function(data, roomName) {
    return data.filter(function(room) {
      var membersArray = room.members.map(function(member) {
        return member.roomName;
      });

      return membersArray.includes(roomName);
    })[0];
  },

  render: function(data) {
    this.updateSonosInfo(data);
    this.updateDom();
  },

  getMusicPlayer: function() {
    return '<div class="player">\
      <div class="album-cover">\
        <img src="' + this.current_song.albumArtUrl + '" />\
      </div>\
      <div class="song-progress-bar">\
        <div class="inner-bar" style="width: ' + this.current_song.duration + '%"></div>\
      </div>\
      <div class="song-info">\
        <div class="module-content">\
          <div>\
            <div class="light small dimmed">' + this.current_song.title + '</div>\
            <div class="bright medium light">' + this.current_song.artist + '</div>\
          </div>\
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

  getScripts: function() {
    return [
      'script.js',
      '//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.js'
    ];
  },

  getStyles: function() {
    return [
      'style.css',
      'player.css'
    ];
  },

  getHeader: function() {
    return this.config.primaryRoomName + ' Sonos';
  },

  getDom: function() {
    return $(this.getMusicPlayer())[0];
  },

  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case 'SONOS_DATA':
        this.render(payload);
        break;
    }
  }
});
