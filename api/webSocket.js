// websocket.js

class WebSocketModule {
  constructor(url) {
	  console.log("websocket已经创建啦")
    this.url = url;
    this.socket = null;
	this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
	console.log('连接成功')
    // WebSocket连接的事件处理逻辑
    // ...
  }

  send(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open.');
    }
  }

  close() {
    this.socket.close();
  }
}

export default WebSocketModule;