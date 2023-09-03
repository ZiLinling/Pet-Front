<template>
	<view>
		<view class="chat-list">
			<view class="chat" v-for="(chat,index) in chatList" :key="index">
				<view class="row" @tap="toChat(chat)">
					<view class="left">
						<image :src="$base_url+chat.face"></image>
					</view>
					<view class="right">
						<view class="top">
							<view class="username">{{chat.userName}}</view>
							<view class="time">{{chat.time}}</view>
						</view>
						<view class="bottom">
							<view class="msg">{{chat.msg}}</view>
							<view class="tis" v-if="chat.tisNum>0">{{chat.tisNum}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import WebSocketModule from '@/api/webSocket.js'
	import {
		listMsg
	}
	from '@/api/msg';
	export default {
		data() {
			return {
				chatList: []
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			console.log("list")
			listMsg({}).then((response) => {
				console.log(response)
				this.chatList = response.data.data;
				console.log("msgLsit", this.chatList)
			}).catch((error) => {
				console.log(error)
			})
		},
		methods: {
			// init(username) {
			// 	//username直接传进来，不用初始化
			// 	// this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
			// 	// let username = this.user.username;
			// 	let _this = this;
			// 	if (typeof(WebSocket) == "undefined") {
			// 		console.log("您的浏览器不支持WebSocket");
			// 	} else {
			// 		console.log("您的浏览器支持WebSocket");
			// 		let socketUrl = "ws://localhost:9090/imserver/" + username;
			// 		if (socket != null) {
			// 			socket.close();
			// 			socket = null;
			// 		}
			// 		// 开启一个websocket服务
			// 		socket = new WebSocket(socketUrl);
			// 		//打开事件
			// 		socket.onopen = function() {
			// 			console.log("websocket已打开");
			// 		};
			// 		//  浏览器端收消息，获得从服务端发送过来的文本消息
			// 		socket.onmessage = function(msg) {
			// 			console.log("收到数据====" + msg.data)
			// 			let data = JSON.parse(msg
			// 				.data) // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
			// 			if (data.users) { // 获取在线人员信息
			// 				_this.users = data.users.filter(user => user.username !==
			// 					username) // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
			// 			} else {
			// 				// 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
			// 				//  // {"from": "zhang", "text": "hello"}
			// 				if (data.from === _this.chatUser) {
			// 					_this.messages.push(data)
			// 					// 构建消息内容
			// 					_this.createContent(data.from, null, data.text)
			// 				}
			// 			}
			// 		};
			// 		//关闭事件
			// 		socket.onclose = function() {
			// 			console.log("websocket已关闭");
			// 		};
			// 		//发生了错误事件
			// 		socket.onerror = function() {
			// 			console.log("websocket发生了错误");
			// 		}
			// 	}
			// },

			init(username) {
				//username直接传进来，不用初始化
				// this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
				// let username = this.user.username;
				let _this = this;
				if (typeof(WebSocket) == "undefined") {
					console.log("您的浏览器不支持WebSocket");
				} else {
					console.log("您的浏览器支持WebSocket");
					let socketUrl = "ws://localhost:8090/pet/" + username;
					if (socketModule != null) {
						console.log("close?")
						socketModule.close();
						socketModule = null;
					}
					// 开启一个websocket服务
					const socketModule = new WebSocketModule(socketUrl);
				}
			},
			toChat(chat) {
				//调到init去打开websocket
				this.init(chat.userName)
				// uni.navigateTo({
				// 	url: "chat/chat?recipient=" + chat.recipient + "&username=" + chat.userName
				// })
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(0, 0, 0, 0);
	}

	.chat-list {
		width: 94%;
		padding: 0 3%;

		.chat {
			width: 100%;
			height: 100upx;
			padding: 20upx 0;
			border-bottom: solid 1upx #eaeaea;

			.row {
				display: flex;
				justify-content: flex-start;

				.left {
					flex-shrink: 0;
					width: 100upx;
					height: 100upx;

					image {
						width: 100upx;
						height: 100upx;
						border-radius: 20upx;
					}
				}

				.right {
					flex-shrink: 1;
					width: 98%;
					padding-left: 2%;

					.top {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;

						.usernam {
							font-size: 26upx;
						}

						.time {
							font-size: 22upx;
							color: #bebebe;
						}
					}

					.bottom {
						width: 100%;
						height: 40upx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.msg {
							font-size: 25upx;
							color: #777;
						}

						.tis {
							width: 35upx;
							height: 35upx;
							font-size: 22upx;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #eb4d3d;
							color: #fff;
							border-radius: 100%;
						}
					}
				}
			}
		}
	}
</style>