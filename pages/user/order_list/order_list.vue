<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<view class="grid" v-for="(grid,tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
			</view>
		</view>
		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="list.length==0">
					<image src="../../../static/img/noorder.png"></image>
					<view class="text">
						没有相关订单
					</view>
				</view>
				<view class="row" v-for="(row,index) in list" :key="index">
					<view class="status">{{typeText[row.etc.order_status]}}</view>


					<view class="store">
						<image :src="$base_url+row.img"></image>
						{{row.name}}

					</view>
					<!-- row是商店，商店下面的商品~ -->
					<view class="" v-for="(item,no) in row.etc.orderItems" :key="no">


						<view class="order-info">
							<view class="left">
								<image :src="$base_url+item.etc.img"></image>
							</view>
							<view class="right">
								<view class="name">
									{{item.etc.name}}
								</view>
								<view class="price-number">
									￥<view class="price">{{item.price}}</view>
									x<view class="number">{{item.num}}</view>
								</view>
							</view>
						</view>

						<!-- 这边需要一个分割线 -->
					</view>

					<view class="time">
						订单生成时间：{{row.etc.time}}
					</view>

					<view class="detail">
						<view class="number">共{{row.etc.num}}件商品</view>
						<view class="sum">合计￥<view class="price">{{row.etc.price}}</view>
						</view>
						<!-- <view class="nominal">(含运费 ￥{{item.freight}})</view> -->
					</view>

					<view class="btns">
						<block v-if="row.etc.order_status=='1'">
							<view class="default" @tap="cancelOrder(row)">取消订单</view>
							<view class="pay" @tap="toPayment(row)">付款</view>
						</block>
						<block v-if="row.etc.order_status=='2'">
							<view class="default" @tap="remindDeliver(row)">提醒发货</view>
						</block>
						<block v-if="row.etc.order_status=='3'">
							<view class="default" @tap="showLogistics(row)">查看物流</view>
							<view class="pay" @tap="confirm(row)">确认收货</view>
							<view class="pay" @tap="rejected(row)">我要退货</view>
						</block>
						<block v-if="row.etc.order_status=='4'">
							<view class="pay" @tap="toComment(row)">评价</view>
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.etc.order_status=='5'">
							<view class="default">查看进度</view>
						</block>
						<block v-if="row.etc.order_status=='6'">
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.etc.order_status=='7'">
							<view class="default">已取消</view>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>
<script>
	import {
		listOrderItem,
		toPay,
		cancelOrderItem,
		confirm,
		rejected
	} from '@/api/orderItem'
	export default {
		data() {
			return {
				num: 1,
				headerPosition: "fixed",
				headerTop: "0px",
				typeText: {
					1: '等待付款',
					2: '等待商家发货',
					3: '商家已发货',
					4: '等待用户评价',
					5: '商品退货处理中',
					6: '交易已完成',
					7: '订单已取消',
					8: '退款成功',
				},
				orderType: ['全部', '待付款', '待发货', '待收货', '待评价', '退换货'],
				orders: [],
				//订单列表 演示数据
				orderList: [
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				],
				list: [],
				tabbarIndex: 0
			};
		},

		onLoad(option) {
			this.getList()

			//option为object类型，会序列化上个页面传递的参数		
			let tbIndex = parseInt(option.tbIndex) + 1;
			this.list = this.orderList[tbIndex];
			this.tabbarIndex = tbIndex;
			//兼容H5下排序栏位置
			// #ifdef H5
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
		},
		onPageScroll(e) {
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
		},
		methods: {
			toComment(row) {
				let goodsIds = ''
				let itemIds = ''
				for (let i = 0; i < row.etc.orderItems.length; i++) {
					goodsIds += row.etc.orderItems[i].itemId + ','
					itemIds += row.etc.orderItems[i].id + ','
				}
				uni.navigateTo({
					url: '/pages/comment/comment?goodsIds=' + goodsIds + "&itemIds=" + itemIds
				})
			},
			getList() {
				this.orderList = [
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				];
				listOrderItem().then((response) => {
					this.orders = response.data.data;
					for (let i = this.orders.length - 1; i >= 0; i--) {
						let stores = this.orders[i].etc.stores
						for (let j = stores.length - 1; j >= 0; j--) {
							let store = stores[j]
							this.orderList[0].push(store)
							this.orderList[store.etc.order_status].push(store)
						}
					}
					// this.orderList[0].
					console.log("new", this.orderList)
					this.num++;
				}).catch((error) => {
					console.log(error)
				})
			},
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			},
			showLogistics(row) {

			},
			remindDeliver(row) {
				uni.showToast({
					title: '已提醒商家发货'
				})
			},
			cancelOrder(row) {
				uni.showModal({
					title: '取消订单',
					content: '确定取消此订单？',
					success: (res) => {
						if (res.confirm) {
							this.doCancelOrder(row);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			doCancelOrder(row) {
				let typeNum = this.orderList.length;
				let items = row.etc.orderItems
				let ids = items[0].id;
				for (let i = 1; i < items.length; i++) {
					ids += "," + items[i].id
				}
				cancelOrderItem({
					ids
				}).then((response) => {
					this.getList()

					this.list = this.orderList[1];
					this.tabbarIndex = 1;
				}).catch((error) => {
					console.log(error)
				})

			},
			toPayment(row) {
				//本地模拟订单提交UI效果
				uni.showLoading({
					title: '正在获取订单...'
				})
				let items = row.etc.orderItems

				let ids = items[0].id;
				for (let i = 1; i < items.length; i++) {
					ids += "," + items[i].id
				}


				// 跳转到付款页面(暂时不要)
				let paymentOrder = [];
				paymentOrder.push(row);
				console.log(row)
				setTimeout(() => {
					uni.setStorage({
						key: 'paymentOrder',
						data: paymentOrder,
						success: () => {
							uni.hideLoading();
							uni.navigateTo({
								url: '../../pay/payment/payment?amount=' + row.etc.price * row.etc.num
							})
						}
					})
				}, 500)
			},
			confirm(row) {

				let items = row.etc.orderItems
				let ids = items[0].id;
				for (let i = 1; i < items.length; i++) {
					ids += "," + items[i].id
				}
				uni.showModal({
					title: '提示',
					content: '是否确认订单？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							confirm({
								ids
							}).then((response) => {
								this.getList()
								this.list = this.orderList[3];
								this.tabbarIndex = 3;
							}).catch((error) => {
								console.log(error)
							})
						}
					},
					fail: (error) => {
						console.log(error)
					}
				});
			},
			rejected(row) {

				let items = row.etc.orderItems
				let ids = items[0].id;
				for (let i = 1; i < items.length; i++) {
					ids += "," + items[i].id
				}
				uni.showModal({
					title: '提示',
					content: '是否退货？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							rejected({
								ids
							}).then((response) => {
								this.getList()
								this.list = this.orderList[3];
								this.tabbarIndex = 3;
							}).catch((error) => {
								console.log(error)
							})
						}
					},
					fail: (error) => {
						console.log(error)
					}
				});
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.topTabBar {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #f8f8f8;
		height: 80upx;
		display: flex;
		justify-content: space-around;

		.grid {
			width: 20%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #444;
			font-size: 28upx;

			.text {
				height: 76upx;
				display: flex;
				align-items: center;

				&.on {
					color: #f06c7a;
					border-bottom: solid 4upx #f06c7a;
				}
			}

		}
	}

	.order-list {
		margin-top: 80upx;
		padding-top: 20upx;
		width: 100%;

		.list {
			width: 94%;
			margin: 0 auto;

			.onorder {
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;

				image {
					width: 20vw;
					height: 20vw;
					border-radius: 100%;
				}

				.text {
					width: 100%;
					height: 60upx;
					font-size: 28upx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.row {
				width: calc(100% - 40upx);
				padding: 10upx 20upx;
				border-radius: 10upx;
				background-color: #fff;
				margin-bottom: 20upx;

				.store {
					margin-bottom: 20upx;
					margin-top: 10upx;
					font-size: 36upx;
					font-weight: 540;

					image {
						margin-right: 15upx;
						border-radius: 50%;
						width: 50upx;
						height: 50upx;
					}

					display: flex;
					align-items: center;
				}

				.status {
					font-size: 26upx;
					color: #ec652f;
					height: 50upx;
					display: inline-block;
					font-size: 30upx;
					font-weight: 800;
					float: right;
					align-items: center;
				}

				.time {
					margin-bottom: 10upx;
					font-size: 10upx;
					color: #cac9c9;
				}

				.order-info {
					width: 100%;
					display: flex;

					.left {
						flex-shrink: 0;
						width: 25vw;
						height: 25vw;

						image {
							width: 25vw;
							height: 25vw;
							border-radius: 10upx;
						}
					}

					.right {
						width: 100%;
						margin-left: 10upx;
						position: relative;

						.name {
							width: 100%;
							font-size: 34upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.price-number {
							position: absolute;
							bottom: 0;
							width: 100%;
							display: flex;
							justify-content: flex-end;
							font-size: 22upx;
							color: #333;
							display: flex;
							align-items: flex-end;

							.price {
								font-size: 24upx;
								margin-right: 5upx;
							}

						}
					}
				}

				.price-number {
					position: absolute;
					bottom: 0;
					width: 100%;
					display: flex;
					justify-content: flex-end;
					font-size: 22upx;
					color: #333;
					display: flex;
					align-items: flex-end;

					.price {
						font-size: 24upx;
						margin-right: 5upx;
					}

				}

				.detail {
					padding-bottom: 10upx;
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 40upx;
					font-size: 26upx;

					.sum {
						padding: 0 8upx;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 30upx;
						}
					}

				}

				.btns {
					height: 80upx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					view {
						min-width: 120upx;
						height: 50upx;
						padding: 0 20upx;
						border-radius: 50upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28upx;
						margin-left: 20upx;
					}

					.default {
						border: solid 1upx #ccc;
						color: #666;
					}

					.pay {
						border: solid 1upx #ec652f;
						color: #ec652f;
					}
				}
			}
		}
	}
</style>