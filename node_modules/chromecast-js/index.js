var util = require( 'util' );
var events = require( 'events' );
var mdns = require('mdns-js2');
var Device = require('./device').Device;
var debug = require('debug')('chromecast-js');

var Browser = function( options ) {
  events.EventEmitter.call( this );
  this.init( options );
};

util.inherits( Browser, events.EventEmitter );

exports.Browser = Browser;


Browser.prototype.init = function( options ) {
  var self = this;

  var mdnsBrowser = new mdns.Mdns(mdns.tcp('googlecast'));

  mdnsBrowser.on('ready', function () {
      mdnsBrowser.discover();
  });

  mdnsBrowser.on('update', function (device) {
      var dev_config = {addresses: device.addresses, name: device.name};
      self.device = new Device(dev_config);
      self.emit('deviceOn', self.device);
  });
};