var browser = require( 'airplay2' ).createBrowser();
var readTorrent = require( 'read-torrent' );

var device = ""

var doc = document.documentElement;
doc.ondragover = function () { this.className = 'hover'; return false; };
doc.ondragend = function () { this.className = ''; return false; };
doc.ondrop = function (event) {
  event.preventDefault && event.preventDefault();
  this.className = '';

  // now do something with:
  var magnet = event.dataTransfer.getData('Text');;
  new_torrent = ""

  if(!magnet.length>0){
    new_torrent = event.dataTransfer.files[0].path;

    readTorrent(new_torrent, function(err, torrent) {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      console.log(torrent)
      gotTorrent(torrent);
    });


    console.log(new_torrent);
  }else{
    gotTorrent(magnet);
  }
  return false;
};



browser.on( 'deviceOn', function( device ) {
   document.getElementById('airplay-icon').src = 'AirplayIcon.png';
   //document.getElementById('button1').classList.toggle('disabled');
   //document.getElementById('button1').classList.toggle('enabled');
   self.device = device
});

browser.start();

var gotTorrent = function (new_torrent){
  console.log("processing torrent");
  var peerflix = require('peerflix')
  var address = require('network-address');

  var engine = peerflix(new_torrent, {});

  var hotswaps = 0;
  var verified = 0;
  var invalid = 0;

  engine.on('verify', function() {
    verified++;
  });

  engine.on('invalid-piece', function() {
    invalid++;
  });

  var onready = function() {
  //mostrar algo ya que el motor ya inicio
  };
  if (engine.torrent) onready();
  else engine.on('ready', onready);

  engine.on('hotswap', function() {
    hotswaps++;
  });

  engine.server.on('listening', function() {
    var href = 'http://'+address()+':'+engine.server.address().port+'/';
    var filename = engine.server.index.name.split('/').pop().replace(/\{|\}/g, '');
    var filelength = engine.server.index.length;
    console.log(href);

    self.device.play(href, 0, function() {
          console.log(">>> Playing in AirPlay device: "+href)
    });

  });
}


