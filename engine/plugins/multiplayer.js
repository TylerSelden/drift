class Connection {
  constructor(signalServer, gameCode, onMsg, { onOpen = () => {}, onClose = () => {} } = {}) {
    this.Code = gameCode;
    this.OnMsg = onMsg;
    this.OnOpen = onOpen;
    this.OnClose = onClose;

    this.Socket = new WebSocket(signalServer);
    this.Peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    
    this.DataChannel = null;

    this.Socket.onmessage = this.onSocketMsg.bind(this);
    this.Socket.onopen = this.onSocketOpen.bind(this);

    this.Peer.onicecandidate = ({ candidate }) => {
      if (candidate) this.signal({ type: "ice", data: candidate });
    };

    this.Peer.ondatachannel = this.setupDataChannel.bind(this);
  }

  signal(msg) {
    this.Socket.send(JSON.stringify(msg));
  }

  setupDataChannel(evt) {
    if (evt) this.DataChannel = evt.channel;

    this.DataChannel.onopen = () => {
      this.Socket.close();
      this.OnOpen();
    };

    this.DataChannel.onmessage = (evt) => {
      this.OnMsg(evt.data);
    };

    this.DataChannel.onclose = this.OnClose;
  }

  async onSocketMsg({ data }) {
    const msg = JSON.parse(data);

    if (msg.type === "ping") {
      this.signal({ type: "pong" });
    } else if (msg.type === "pong") {
      this.DataChannel = this.Peer.createDataChannel("data");
      this.setupDataChannel();
      const offer = await this.Peer.createOffer();
      await this.Peer.setLocalDescription(offer);
      this.signal({ type: "offer", data: offer });
    } else if (msg.type === "offer" && !this.Peer.currentRemoteDescription) {
      await this.Peer.setRemoteDescription(new RTCSessionDescription(msg.data));
      const answer = await this.Peer.createAnswer();
      await this.Peer.setLocalDescription(answer);
      this.signal({ type: "answer", data: answer });
    } else if (msg.type === "answer") {
      await this.Peer.setRemoteDescription(new RTCSessionDescription(msg.data));
    } else if (msg.type === "ice" && msg.data) {
      try {
        await this.Peer.addIceCandidate(msg.data);
      } catch (e) {
        console.warn("Error adding ICE candidate: " + e);
      }
    }
  }

  onSocketOpen() {
    this.signal({ type: "code", data: this.Code });
    this.signal({ type: "ping" });
  }

  Send(data) {
    if (this.DataChannel?.readyState === "open") {
      this.DataChannel.send(data);
      return 0;
    } else {
      console.warn("DataChannel is not open");
      return 1;
    }
  }
}

export { Connection };
