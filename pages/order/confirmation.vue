<template>
	<view>
		<!-- 收货地址 -->
		<view class="addr" @tap="selectAddress">
			<view class="icon">
				<image src="../../static/img/addricon.png" mode=""></image>
			</view>
			<view class="right" v-if="Object.keys(this.recinfo).length > 0">
				<view class="tel-name" >
					<view class="name">
						{{recinfo.name}}
					</view>
					<view class="tel" >
						{{recinfo.telephone}}
					</view>
				</view>
				<view class="addres" >
					{{recinfo.region}}
					{{recinfo.address}}
				</view>
			</view>

			<view class="right" v-if="Object.keys(this.recinfo).length == 0">点击这边去添加地址</view>
		</view>
		<!-- 购买商品列表 -->
		<view class="buy-list">
			<view class="" v-for="(store,id) in buylist" :key="id">
				{{store.name}}
				<view class="row" v-for="(row,index) in store.goods" :key="index">
					<view class="goods-info">
						<view class="img">
							<image :src="$base_url+row.img"></image>
							<!-- 这边有问题 -->
						</view>
						<view class="info">
							<view class="title">{{row.name}}</view>
							<view class="spec">数量:{{row.num}}</view>
							<view class="price-number">
								<view class="price">￥{{row.price*row.num}}</view>
								<view class="number">
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提示-备注 -->
		<view class="order">
			<view class="row">
				<view class="left">
					积分 :
				</view>
				<view class="right">
					已扣除{{int}}积分抵扣{{deduction|toFixed}}元
				</view>
			</view>
			<view class="row">
				<view class="left">
					备注 :
				</view>
				<view class="right">
					<input placeholder="备注内容" v-model="note" />
				</view>
			</view>
		</view>
		<!-- 明细 -->
		<view class="detail">
			<view class="row">
				<view class="nominal">
					商品金额
				</view>
				<view class="content">
					￥{{goodsPrice|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					运费
				</view>
				<view class="content">
					￥+{{freight|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					积分抵扣
				</view>
				<view class="content">
					￥-{{deduction|toFixed}}
				</view>
			</view>
		</view>
		<view class="blck">

		</view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice|toFixed}}</view>
				</view>
				<view class="btn" @tap="toPay" >提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		deleteById
	} from '../../api/cart'
	import {
		generateOrder
	} from '../../api/order'
	import {
		generateOrderItem
	} from '../../api/orderItem'
	import {
		getAddressByDefault
	} from '../../api/address'
	export default {
		data() {
			return {
				type_goods:null,
				type:null,
				isDisabled:false,
				buylist: [], //订单列表
				goodsPrice: 0.0, //商品合计价格
				sumPrice: 0.0, //用户付款价格
				freight: 12.00, //运费
				note: '', //备注
				int: 1200, //抵扣积分
				deduction: 0, //抵扣价格
				recinfo: {
					// name: "大黑哥",
					// head: "大",
					// telephone: "18816881688",
					// region: '福建省-厦门市-集美区',
					// address: '理工学院',
				}

			};
		},
		onLoad(){
			this.getAddressByDefault();
		},
		onLoad(option) {
			if(option.type!=null){
				uni.setStorage({
					key:'orderType',
					data:option.type
				})
				this.type=option.type
			}else{
				uni.getStorage({
					key:'orderType',
					success: (res) => {
						this.type=res.data;
					}
				})
			}
			
			
			// 在页面加载时获取数据
			uni.getStorage({
				key: 'selectAddress',
				success: (res) => {
					this.recinfo = res.data;
				},
				fail() {
					this.recinfo = null;
				}
			});

			if (this.type == 2) {
				this.type_goods=1
				uni.getStorage({
					key: 'buylist',
					success: (res) => {
						this.buylist = res.data
						for (let i = 0; i < this.buylist.length; i++) {
							for (let j = 0; j < this.buylist[i].goods.length; j++) {
								this.goodsPrice = this.goodsPrice + (this.buylist[i].goods[j].num * this
									.buylist[i].goods[j].price);
							}
						}
						//合计
						this.deduction = this.int / 100;
						this.sumPrice = this.goodsPrice - this.deduction + this.freight;
					}
				});
			}

			if (this.type == 1) {
				this.type_goods=1
				uni.getStorage({
					key: 'goodsOrder',
					success: (res) => {
						let store = {
							name: res.data.storeName,
							storeId: res.data.storeId,
							goods: [{
								id: res.data.id,
								name: res.data.name,
								img: res.data.img,
								num: res.data.num,
								price: res.data.price
							}],
						}

						let buylist = [];
						this.type = 1;
						buylist.push(store)
						this.buylist = buylist;
						this.goodsPrice = this.buylist[0].goods[0].num * this.buylist[0].goods[0].price
						this.deduction = this.int / 100;
						this.sumPrice = this.goodsPrice - this.deduction + this.freight;
						console.log("buylist",this.buylist)
					},
				});
			}

			if (this.type == 0) {
				this.type_goods=0
				uni.getStorage({
					key: 'petOrder',
					success: (res) => {

						let store = {
							name: res.data.etc.store.name,
							storeId: res.data.etc.store.id,
							goods: [{
								id: res.data.id,
								name: res.data.name,
								img: res.data.img,
								num: 1,
								price: res.data.price
							}],
						}
						let buylist = [];
						this.type = 0;
						buylist.push(store)
						this.buylist = buylist;
						this.goodsPrice = this.buylist[0].goods[0].num * this.buylist[0].goods[0].price
						this.deduction = this.int / 100;
						this.sumPrice = this.goodsPrice - this.deduction + this.freight;
						
					},
				});
			}
			
			
			console.log("buylist",this.buylist)
		
		},
		onShow() {
			// 在页面显示时更新数据
			// 这里可以直接赋值，而不需要再次调用 $forceUpdate 方法
			this.$forceUpdate()
			this.recinfo = uni.getStorageSync('selectAddress')
			
		},
	onBackPress() {
			//页面后退时候，清除订单信息A
			// this.clearOrder();
		},
		filters: {
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		methods: {
			getAddressByDefault() {
				getAddressByDefault({}).then((response) => {
					if (response.data.data == null) {
						this.recinfo = null;
					} else {
						this.recinfo = response.data.data;
						this.recinfo.id = null;
					}
				}).catch((error) => {
				})
			},
			//removebuylist的本地存储，删除了后端数据库的内容，
			clearOrder() {
				uni.removeStorage({
					key: 'buylist',
					success: (res) => {
						if (this.type == 2) {
							let ids = '';
							for (let i = 0; i < this.buylist.length; i++) {
								for (let j = 0; j < this.buylist[i].goods.length; j++) {
									ids += this.buylist[i].goods[j].cartId + ',';
								}
							}
							deleteById({
								ids: ids
							}).then((response) => {
							
							})
						};
						this.buylist = [];
					},
				});
			},

			toPay() {
				//商品列表
				
				if(Object.keys(this.recinfo).length === 0){
					uni.showToast({
						title:"请输入地址",
						icon:'error'
					})
					return;
				}
				let paymentOrder = [];
				let len = this.buylist.length;
				for (let i = 0; i < len; i++) {
					paymentOrder.push(this.buylist[i]);
				}
				if (paymentOrder.length == 0) {
					uni.showToast({
						title: '订单信息有误，请重新购买',
						icon: 'none'
					});
					return;
				}
				this.recinfo.id=null;
				generateOrder({
					...this.recinfo,
					price: this.sumPrice,
					postscript: this.note
				}).then((response) => {
					let orderId = response.data.data
					// this.buylist
					for (let i = 0; i < this.buylist.length; i++) {
						for (let j = 0; j < this.buylist[i].goods.length; j++) {
							if(this.type_goods==0){
								generateOrderItem({
									status:1,
									itemId: this.buylist[i].goods[j].id,
									num: this.buylist[i].goods[j].num,
									type: this.type_goods,
									price: this.buylist[i].goods[j].price,
									orderId: orderId
								}).then((response) => {
								
								})
							}else{
								console.log("goods?",this.buylist[i].goods[j].goodsId)
								generateOrderItem({
									status:1,
									itemId: this.buylist[i].goods[j].goodsId,
									num: this.buylist[i].goods[j].num,
									type: this.type_goods,
									price: this.buylist[i].goods[j].price,
									orderId: orderId
								}).then((response) => {
									
								})
							}
							
						}
					}
					console.log("clean???")
					this.clearOrder();
				}).catch((error) => {
					console.log(error)
				})

				//本地模拟订单提交UI效果
				uni.showLoading({
					title: '正在提交订单...'
				})
				setTimeout(() => {
					uni.setStorage({
						key: 'paymentOrder',
						data: paymentOrder,
						success: () => {
							uni.hideLoading();
							uni.redirectTo({
								url: "../pay/payment/payment?amount=" + this.sumPrice
							})
						}
					})
				}, 1000)

			},
			//选择收货地址
			selectAddress() {
				uni.navigateTo({
					url: '../user/address/address?type=select'
				})
			}
		},

	}
</script>

<style lang="scss">
	.addr {
		width: 86%;
		padding: 20upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;
		display: flex;

		.icon {
			width: 80upx;
			height: 80upx;
			display: flex;
			align-items: center;

			image {
				width: 60upx;
				height: 60upx;
			}
		}

		.tel-name {
			width: 100%;
			display: flex;
			font-size: 32upx;

			.tel {
				margin-left: 40upx;
			}
		}

		.addres {
			width: 100%;
			font-size: 26upx;
			color: #999;
		}
	}

	.buy-list {
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			margin: 30upx 0;

			.goods-info {
				width: 100%;
				display: flex;

				.img {
					width: 22vw;
					height: 22vw;
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 10upx;

					image {
						width: 22vw;
						height: 22vw;
					}
				}

				.info {
					width: 100%;
					height: 22vw;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;

					.title {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						overflow: hidden;
					}

					.spec {
						font-size: 22upx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						height: 40upx;
						display: flex;
						align-items: center;
						padding: 0 10upx;
						border-radius: 20upx;
						margin-bottom: 20vw;
					}

					.price-number {
						position: absolute;
						width: 100%;
						bottom: 0upx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 28upx;
						height: 40upx;

						.price {
							color: #f06c7a;
						}

						.number {
							display: flex;
							justify-content: center;
							align-items: center;

						}
					}
				}
			}
		}
	}

	.order {
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			margin: 20upx 0;
			height: 40upx;
			display: flex;

			.left {
				font-size: 28upx;
			}

			.right {
				margin-left: 40upx;
				font-size: 26upx;
				color: #999;

				input {
					font-size: 26upx;
					color: #999;
				}
			}
		}
	}

	.blck {
		width: 100%;
		height: 100upx;
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.settlement {
			width: 80%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 60upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}

	.detail {
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			height: 60upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.nominal {
				font-size: 28upx;
			}

			.content {
				font-size: 26upx;
				color: #f06c7a;
			}
		}
	}
</style>