const socket = new WebSocket("wss://server.benti.dev:8443/drift");
const peer = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});
let dataChannel = null;

function log(name, data) {
  console.log(`== ${name.toUpperCase()} ==`);
  console.log(data);
  console.log();
}

function signal(msg) {
  log("socket msg sent", msg);
  socket.send(JSON.stringify(msg));
}

peer.onicecandidate = ({ candidate }) => {
  if (candidate) {
    signal({ type: "ice", data: candidate });
  }
}

peer.ondatachannel = (evt) => {
  dataChannel = evt.channel;
  setupDataChannel();
}

function setupDataChannel() {
  dataChannel.onopen = () => {
    console.log("Data channel open, socket closed!");
    socket.close();
  };
  dataChannel.onmessage = (evt) => {
    console.log(evt.data);
    document.getElementById("msgs").innerText += evt.data + "\n";
  }
}

socket.onmessage = async ({ data }) => {
  const msg = JSON.parse(data);
  log("socket msg received", msg);

  if (msg.type === "offer" && !peer.currentRemoteDescription) {
    await peer.setRemoteDescription(new RTCSessionDescription(msg.data));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    signal({ type: "answer", data: answer });
  } else if (msg.type === "answer") {
    await peer.setRemoteDescription(new RTCSessionDescription(msg.data));
  } else if (msg.type === "ice" && msg.data) {
    try {
      await peer.addIceCandidate(msg.data);
    } catch (e) {
      console.warn("Error adding ICE candidate: " + e);
    }
  }
}

socket.onopen = async () => {
  await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

  dataChannel = peer.createDataChannel("data");
  setupDataChannel();

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  signal({ type: "offer", data: offer });
}

function send(msg) {
  if (dataChannel?.readyState === "open") {
    dataChannel.send(msg);
  } else {
    console.warn("Channel is not open yet");
  }
}
