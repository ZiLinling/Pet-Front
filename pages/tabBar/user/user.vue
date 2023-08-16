<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="icon-btn">
				<view class="icon tongzhi" @tap="toMsg" v-if="user!=null"></view>
				<view class="icon setting" @tap="toSetting" v-if="user!=null"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 用户信息 -->
		<view class="user" @tap="toLogin" v-if="user==null">
			<!-- 头像 -->
			<view class="left">
				<image :src="img"></image>
			</view>
			<view class="right">
				<view class="username">尚未登录</view>
				<view class="account">点击此处跳转登录页面</view>
			</view>

		</view>
		<view class="user" v-if="user">
			<!-- 头像 -->
			<view class="left">
				<image :src="$base_url+user.img"></image>
			</view>
			<!-- 昵称,个性签名 -->
			<view class="right">
				<view class="username">{{user.name}}</view>
				<view class="account">账号:{{user.account}}</view>
			</view>
		</view>

		<view v-if="user">
			<view class="order">
				<!-- 订单类型 -->
				<view class="list">
					<view class="title">我的订单
						<view style="float: right; display: flex;">
							全部
						</view>
					</view>

					<view class="box" v-for="(row,index) in orderList" :key="index" @tap="toOrderList(index)">
						<view class="img">
							<view class="icon" :class="row.icon"></view>
						</view>
						<view class="text">{{row.text}}</view>
					</view>
				</view>
			</view>
			<!-- 工具栏 -->
			<view class="toolbar">
				<view class="title">我的工具栏</view>
				<view class="list">
					<view class="box" v-for="(row,index) in mytoolbarList" :key="index" @tap="toPage(row.url)">
						<view class="img">
							<image :src="row.img"></image>
						</view>
						<view class="text">{{row.text}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单-余额 -->

	</view>
</template>
<script>
	import {
		base_url
	} from '../../../api/axios';
	import {
		getUser
	} from '../../../api/user';
	export default {
		data() {
			return {
				base_url: base_url,
				isfirst: true,
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				img: '/static/img/face.jpg',
				//个人信息,
				user: null,
				// 订单类型
				orderList: [{
						text: '待付款',
						icon: "fukuan"
					},
					{
						text: '待发货',
						icon: "fahuo"
					},
					{
						text: '待收货',
						icon: "shouhuo"
					},
					{
						text: '待评价',
						icon: "pingjia"
					},
					{
						text: '退换货',
						icon: "tuihuo"
					}
				],
				// 工具栏列表
				mytoolbarList: [{
						url: '/pages/user/favor/favor?type=1',
						text: '我的收藏',
						img: '/static/img/user/point.png'
					},
					{
						url: '../../user/address/address',
						text: '收货地址',
						img: '/static/img/user/addr.png'
					},
					{
						url: '',
						text: '账户安全',
						img: '/static/img/user/security.png'
					},
					{
						url: '/pages/user/bank_card/bank_card',
						text: '银行卡',
						img: '/static/img/user/bank.png'
					},


				]
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.showHeader = true;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif	
			uni.$on('checkLogin', () => {
				this.getLogin()
			});
		},
		mounted() {
			this.getLogin()
		},
		activated() {
			this.getLogin()
		},
		methods: {
			//消息列表
			toMsg() {
				uni.navigateTo({
					url: '../../msg/msg'
				})
			},
			toOrderList(index) {
				uni.setStorageSync('tbIndex', index);
				uni.navigateTo({
					url: '../../user/order_list/order_list?tbIndex=' + index
				})
			},
			toSetting() {
				uni.navigateTo({
					url: '../../user/setting/setting'
				})
			},
			toMyQR() {
				uni.navigateTo({
					url: '../../user/myQR/myQR'
				})
			},
			toLogin() {
				uni.showToast({
					title: '请登录',
					icon: "none"
				});
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
				this.isfirst = false;
			},
			toDeposit() {
				uni.navigateTo({
					url: '../../user/deposit/deposit'
				})
			},
			toPage(url) {
				if (!url) {
					uni.showToast({
						title: '此功能尚未实现',
						icon: "none"
					});
					return;
				}
				console.log(url)
				uni.navigateTo({
					url: url
				})
			},
			getLogin() {
				getUser().then((response) => {
					this.user = response.data.data
				}).catch((error) => {
					this.user = null
				})
			}
		},
	}
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		background-color: #fff;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */

	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: white;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.icon-btn {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				color: black;
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {
		background-color: white;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.user {
		margin: 30upx 90upx;
		width: 92%;
		display: flex;
		align-items: center;
		// position: relative;
		background-color: white;
		padding-bottom: 50upx;

		.left {
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			margin-right: 20upx;
			border: solid 1upx #fff;
			border-radius: 100%;

			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}

		}

		.right {
			width: 100%;

			.username {
				margin-left: 50upx;
				font-size: 36upx;
				color: black;
			}

			.account {
				margin-top: 30upx;
				margin-left: 50upx;
				color: black;
				font-size: 28upx;
			}
		}

	}

	.order {
		width: 84%;
		margin: 30upx 4% 30upx 4%;
		padding: 30upx 4% 20upx 4%;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;

		.title {

			margin-top: -10upx;
			font-size: 30upx;
			height: 80upx;
			display: flex;
			align-items: center;
			width: 100%;
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			border-bottom: solid 1upx #17e6a1;
			padding-bottom: 10upx;

			.box {
				width: 20%;

				.img {
					width: 100%;
					display: flex;
					justify-content: center;

					.icon {
						font-size: 50upx;
						color: #464646;
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #3d3d3d;
				}
			}
		}

	}

	.toolbar {
		width: 92%;
		margin: 0 4% 0 4%;
		padding: 0 0 20upx 0;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;

		.title {
			padding-top: 10upx;
			margin: 0 0 10upx 3%;
			font-size: 30upx;
			height: 80upx;
			display: flex;
			align-items: center;
		}

		.list {
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 25%;
				margin-bottom: 30upx;

				.img {
					width: 23vw;
					height: 10.5vw;
					display: flex;
					justify-content: center;

					image {
						width: 9vw;
						height: 9vw;
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
					color: #3d3d3d;
				}
			}
		}
	}
</style>