let Socket, Peer, DataChannel;

let Code, OnOpen, OnMsg, OnClose;

function signal(msg) {
  Socket.send(JSON.stringify(msg));
}

function setupDataChannel(evt) {
  if (evt) DataChannel = evt.channel;
  DataChannel.onopen = () => {
    Socket.close();
    OnOpen();
  }
  DataChannel.onmessage = (evt) => {
    OnMsg(evt.data);
  }
  DataChannel.onclose = OnClose;
}

async function onSocketMsg({ data }) {
  const msg = JSON.parse(data);

  if (msg.type === "offer" && !Peer.currentRemoteDescription) {
    await Peer.setRemoteDescription(new RTCSessionDescription(msg.data));
    const answer = await Peer.createAnswer();
    await Peer.setLocalDescription(answer);
    signal({ type: "answer", data: answer });
  } else if (msg.type === "answer") {
    await Peer.setRemoteDescription(new RTCSessionDescription(msg.data));
  } else if (msg.type === "ice" && msg.data) {
    try {
      await Peer.addIceCandidate(msg.data);
    } catch (e) {
      console.warn("Error adding ICE candidate: " + e);
    }
  }
}

async function onSocketOpen() {
  signal({ type: "code", data: Code });
  await new Promise(r => setTimeout(r, 500 + Math.random() * 2500));
  if (!DataChannel) {
    DataChannel = Peer.createDataChannel("data");
    setupDataChannel();
  }

  const offer = await Peer.createOffer();
  await Peer.setLocalDescription(offer);
  signal({ type: "offer", data: offer });
}

function Start(signalServer, gameCode, onMsg, { onOpen = () => {}, onClose = () => {} } = {}) {
  [ Code, OnMsg, OnOpen, OnClose ] = [ gameCode, onMsg, onOpen, onClose ];

  Socket = new WebSocket(signalServer);
  Peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  Peer.onicecandidate = ({ candidate }) => {
    if (candidate) signal({ type: "ice", data: candidate });
  }
  Peer.ondatachannel = setupDataChannel;
  Socket.onmessage = onSocketMsg;
  Socket.onopen = onSocketOpen;
}

function Send(data) {
  if (DataChannel?.readyState === "open") {
    DataChannel.send(data);
    return 0;
  } else {
    console.warn("DataChannel is not open");
    return 1;
  }
}

export { Start, Send }
