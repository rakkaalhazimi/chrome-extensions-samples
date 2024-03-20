// TODO: Wrap class that have multiple constructor signatures

console.log.nickname = "rakka";
console.log("Extension loaded");
console.log(console.log.nickname);

let mediaStreams = new Set();
let bufferSources = [];
let connectingNodes = [];
let audioTracks = [];
let currentPc;

function wrapNativeFunction(nativeFunction, decorator) {
  return function () {
    return decorator.call(this, nativeFunction, arguments);
  };
}

function createMediaStreamSourceDecorator(nativeFunction, originalArguments) {
  console.log("createMediaStreamSource wrapped by rakka.");
  console.log("Arguments: ");
  console.log(originalArguments);
  console.log("");

  let stream = originalArguments[0];
  mediaStreams.add(stream);

  let wrapped = nativeFunction.apply(this, originalArguments);
  return wrapped;
}


function connectDecorator(nativeFunction, originalArguments) {
  console.log("connect wrapped by rakka.");
  console.log("Arguments: ");
  console.log(originalArguments);

  console.log("Connected by: ");
  console.log(this);
  console.log("");

  let node = originalArguments[0];
  connectingNodes.push(node);

  let wrapped = nativeFunction.apply(this, originalArguments);
  return wrapped;
}


function createBufferSourceDecorator(nativeFunction, originalArguments) {
  console.log("createBufferSource wrapped by rakka.");
  console.log("Arguments: ");
  console.log(originalArguments);
  console.log("");

  let wrapped = nativeFunction.apply(this, originalArguments);
  return wrapped;
}


function createMediaElementSourceDecorator(nativeFunction, originalArguments) {
  console.log("createElementSource wrapped by rakka.");
  console.log("Arguments: ");
  console.log(originalArguments);
  console.log("");

  let wrapped = nativeFunction.apply(this, originalArguments);
  return wrapped;
}


function createMediaElementSourceDecorator(nativeFunction, originalArguments) {
  console.log("createElementSource wrapped by rakka.");
  console.log("Arguments: ");
  console.log(originalArguments);
  console.log("");

  let wrapped = nativeFunction.apply(this, originalArguments);
  return wrapped;
}


function addTrackDecorator(nativeFunction, originalArguments) {
  
  console.log("addTrack wrapped by rakka.");
  let track = arguments[0];
  audioTracks.push(track);
  
  let wrapped = nativeFunction.apply(this, originalArguments);
  return wrapped;
}


let nativeRTCPeerConnectionConstructor = RTCPeerConnection;
function RTCPeerConnectionConstructor(configuration) {
  console.log("Wrapped rtc peer connection");
  console.log("Configuration: ", configuration);
  let pc = new nativeRTCPeerConnectionConstructor(configuration);
  currentPc = pc;
  return pc;
}

let nativeMediaStream = MediaStream;
let mediaStreamCount = 0;
function mediaStreamConstructor() {
  console.log("Construct new mediastream: ", mediaStreamCount);
  console.log("Argument: ");
  console.log(arguments);
  mediaStreamCount++;
  
  let ms;
  
  if (arguments.length == 0) {
    ms = new nativeMediaStream();
    
  } else {
    let arg = arguments[0];
    console.log("Argument type: ");
    console.log(typeof arg);
    ms = new nativeMediaStream(arg);
  }
  
  mediaStreams.add(ms);
  
  return ms;
  
  
  
  
  // let ms;
  
  // try {
  //     ms = new nativeMediaStream();
  //     throw Error("Debug");
  // } catch(err) {
  //   console.log("Error found");
  //   console.error(err);
  // }
  // return ms;
}


// Override object's method
AudioContext.prototype.createMediaStreamSource = wrapNativeFunction(
  AudioContext.prototype.createMediaStreamSource, createMediaStreamSourceDecorator
);

AudioNode.prototype.connect = wrapNativeFunction(
  AudioNode.prototype.connect, connectDecorator
);

AudioContext.prototype.createBufferSource = wrapNativeFunction(
  AudioContext.prototype.createBufferSource, createBufferSourceDecorator
);

AudioContext.prototype.createMediaElementSource = wrapNativeFunction(
  AudioContext.prototype.createMediaElementSource = createMediaElementSourceDecorator
);

MediaStream.prototype.addTrack = wrapNativeFunction(
  MediaStream.prototype.addTrack, addTrackDecorator
);

// Override object's constructor
RTCPeerConnection = RTCPeerConnectionConstructor;
// RTCPeerConnection.prototype = RTCPeerConnectionConstructor.prototype;
// RTCPeerConnection.prototype.constructor = RTCPeerConnection;

// MediaStream = mediaStreamConstructor;
// MediaStream.prototype = nativeMediaStream.prototype;
// MediaStream.prototype.constructor = MediaStream;

let name = "rakka";