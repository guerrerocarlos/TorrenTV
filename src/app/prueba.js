peerflix = require('peerflix')
readTorrent = require('read-torrent')

function doTorrent(err,torrent){
	engine = peerflix(torrent)
	engine.on('verify',function(index){
		console.log('verify!');
	});
}

readTorrent('/home/maquina/Downloads/[kickass.to]need.for.speed.2014.1080p.brrip.x264.yify.torrent',doTorrent);
