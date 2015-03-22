var util = require( 'util' );
var events = require( 'events' );
var ssdp = require('node-ssdp').Client;
var http = require('http');
var Device = require('./device').Device;
var debug = require('debug')('chromecast-js');

var Browser = function( options ) {
  events.EventEmitter.call( this );
  this.init( options );
};

util.inherits(Browser, events.EventEmitter );

exports.Browser = Browser;

Browser.prototype.update = function( device ) {
    var dev_config = {addresses: device.addresses, name: device.name};
    this.device = new Device(dev_config);
    this.emit('deviceOn', this.device);
}

Browser.prototype.init = function( options ) {
  var self = this;

  var ssdpBrowser = new ssdp();
  ssdpBrowser.on('response', function (headers, statusCode, rinfo) {
      if (statusCode != 200)
		  return;
	  if (!headers['LOCATION'])
		  return;
	  var request = http.get(headers['LOCATION'], function(res) {
		  var body = '';
		  res.on('data', function(chunk) {
		    body += chunk;
		  });
		  res.on('end', function() {
			  if (body.search('<manufacturer>Google Inc.</manufacturer>') == -1)
				  return;
			  var match = body.match(/<friendlyName>(.+?)<\/friendlyName>/);
			  if (!match || match.length != 2)
				  return;
			  self.update({addresses: [rinfo.address], name: match[1]});
		  });
	  });
  });
  ssdpBrowser.search('urn:dial-multiscreen-org:service:dial:1');
};