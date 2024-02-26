console.log.nickname = "rakka";
console.log("Extension loaded");
console.log(console.log.nickname);

let mediaStreams = new Set();
let bufferSources = [];
let connectingNodes = [];

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

var nativeRTCPeerConnectionConstructor = RTCPeerConnection;
function RTCPeerConnectionConstructor() {
  console.log("Wrapped rtc peer connection");
  let pc = new nativeRTCPeerConnectionConstructor();
  return pc;
}


// Record mediastream
function recordAudioStream(stream) {
  
  let chunks = [];
  let recorder = new MediaRecorder(stream);
  recorder.ondataavailable((event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  });
  
  recorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: 'audio/webm; codecs=opus',
    });
    chunks = [];

    // const filename = `audio_channel_${index}_${Date.now()}.webm`;
    const filename = `audio_${Date.now()}.webm`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    // a.style.display = 'none';
    document.body.appendChild(a);
    window.URL.revokeObjectURL(url);
  };
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

// Override object's constructor
RTCPeerConnection = RTCPeerConnectionConstructor;
RTCPeerConnection.prototype = RTCPeerConnectionConstructor.prototype;
RTCPeerConnection.prototype.constructor = RTCPeerConnection;

let name = "rakka";