<template>
	<view>
		<view v-if="token">
			<uni-notice-bar show-icon scrollable text="[我宣布以上小组成绩无效]制作" />
			<!-- 商品列表 -->
			<view class="goods-list">
				<view class="tis" v-if="storeList.length==0">购物车是空的哦~
				</view>

				<!-- store是商店，cnt是遍历的数字 -->
				<uni-card v-for="(store,cnt) in storeList" :key="cnt" class="store" :title="store.name" sub-title="商品"
					padding="10upx 0" thumbnail="/static/img/store.png">
					<view class="row" v-for="(goods,index) in store.etc.goodsList" :key="index">

						<!-- 删除按钮 -->
						<view class="menu" @tap.stop="deleteGood(index,cnt)">

							<view class="icon shanchu"></view>
						</view>
						<!-- 商品 -->
						<view class="carrier"
							:class="[theIndex==index&&theCnt==cnt?'open':oldIndex==index&&oldCnt==cnt?'close':'']"
							@touchstart="touchStart(index,cnt,$event)" @touchmove="touchMove(index,cnt,$event)"
							@touchend="touchEnd(index,cnt,$event)">
							<!-- checkbox -->
							<view class="checkbox-box" @tap="selected(index,cnt)">
								<view class="checkbox">
									<view :class="[goods.etc.selected?'on':'']"></view>
								</view>
							</view>
							<!-- 商品信息 -->
							<view class="goods-info" @tap="toGoods(goods)">
								<view class="img">
									<image :src="$base_url+goods.img" mode="aspectFill"></image>
								</view>
								<view class="info">
									<view class="title">{{goods.name}}</view>
									<view class="price-number">
										<view class="price">￥{{goods.price}}</view>
										<view class="number">
											<view class="sub" @tap.stop="sub(index,cnt)">
												<view class="icon jian"></view>
											</view>
											<view class="input" @tap.stop="discard">
												<input type="number" v-model="goods.etc.num"
													@input="sum($event,index)" />
											</view>
											<view class="add" @tap.stop="add(index,cnt)">
												<view class="icon jia"></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</uni-card>
				<!-- 列表v-for从这开始 -->

			</view>
			<!-- 脚部菜单 -->
			<view class="footer" :style="{bottom:footerbottom}">
				<view class="checkbox-box" @tap="allSelect">
					<view class="checkbox">
						<view :class="[isAllselected?'on':'']"></view>
					</view>
					<view class="text">全选</view>
				</view>
				<view class="delBtn" @tap="deleteGoods()" v-if="selectedList.length>0">删除</view>
				<view class="settlement">
					<view class="sum">合计:
					<view class="discount_money">￥{{ (sumPrice * privilege[role]).toFixed(2) }}</view>
					<view class="money">({{sumPrice}})</view>
							
					</view>
						<view class="btn" @tap="toConfirmation">结算({{selectedList.length}})</view>
					</view>

				</view>
			</view>
			<view v-if="!token">
				<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png" style="margin-top: 300upx;">
					<button type="default" @click="toLogin()" class="login_button">快去登录</button>
				</u-empty>
			</view>
		</view>

</template>

<script>
	import {
		getCart,
		deleteByIds,
		updateNum,
		updateSelected,
		isAllSelected
	} from '@/api/cart';
	import{
		getRole,
		getUser
	} from '@/api/user.js'
	export default {
		data() {
			return {
				address: '福建省厦门市集美区',
				sumPrice: '0.00',
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				selectedList: [],
				selected_length: null,
				isAllselected: false,
				goodsList: [],
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				theCnt: null,
				oldCnt: null,
				isStop: false,
				storeList: [],
				token: '',
				role:null,
				privilege:[1,0.95,0.9,0.85,0.8,0.75,0.7],
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			//兼容H5下结算条位置
			// #ifdef H5
			this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight + 'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		onShow() {
			getUser({}).then((response)=>{
				console.log(response.data)
				this.token='exist'
			}).catch((err)=>{
				console.log(err)
				this.token==null;
				uni.removeStorage({
					key:'token',
				})
			})
			this.headerTop = null,
				this.statusTop = null,
				this.showHeader = true,
				this.isAllselected = false,
				this.goodsList = [],
				//控制滑动效果
				this.theIndex = null,
				this.oldIndex = null,
				this.isStop = false,
				this.getCart();
				
				getRole({}).then((res) => {
					this.role = res.data.data
				})
				
		},
		watch: {
			selectedList: [
				function(newVal, oldVal) {
					this.isAllselected = (newVal.length == this.goodsList.length);
				}

			]
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
			},
			getCart() {
				if (!uni.getStorageSync('token')) {
					this.storeList = [];
					this.goodsList = [];
					return;
				}
				getCart({}).then((response) => {
					this.storeList = [];
					this.goodsList = [];
					for (let i = 0; i < response.data.data.length; i++) {
						this.storeList.push(response.data.data[i]);
						for (let j = 0; j < response.data.data[i].etc.goodsList.length; j++) {
							this.goodsList.push(response.data.data[i].etc.goodsList[j]);
						}

					}
					console.log("stores", this.storeList)
					console.log("goods", this.goodsList)
					this.sum();
				}).catch((error) => {
					console.log(error)
				})
			},


			//控制左滑删除效果-begin
			touchStart(index, cnt, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			touchMove(index, cnt, event) {
				// let globalIndex = 0;
				// for (let i = 0; i < cnt; i++) {
				//     globalIndex += this.storeList[i].etc.goodsList.length;
				// }
				// globalIndex += index;

				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}
				if (Math.abs(moveY) > Math.abs(moveX)) {
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				if (moveX < 0) {
					this.theIndex = index;
					this.theCnt = cnt;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.oldCnt = cnt;

						this.theIndex = null;
						this.theCnt = null
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
							this.oldCnt = null;
						}, 150)
					}
				}
			},
			touchEnd(index, cnt, $event) {
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end


			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					url: '/pages/item/goods/goods?cid=' + e.goodsId
				});
			},
			//跳转确认订单页面
			toConfirmation() {
				// let selected_goods = [];
				if (this.selectedList.length == 0) {
					uni.showToast({
						title: '尚未选中商品',
						icon: 'none'
					});
					return;
				}
				// //获得选中了的商品列表
				// for (let i = 0; i < this.selectedList.length; i++) {

				// 	selected_goods.push(this.goodsList[this.selectedList[i]]);
				// }
				// //用reduce根据storeId分类给store
				// let i = 0;
				// const store = Object.values(selected_goods.reduce((acc, obj) => {
				// 	const key = obj.storeId;
				// 	if (!acc[key]) {
				// 		acc[key] = {
				// 			storeId: key,
				// 			goods: [],
				// 			name: this.storeList[i].name
				// 		};
				// 		i++;
				// 	}
				// 	acc[key].goods.push(obj);
				// 	return acc;
				// }, {}));
				// //传值为store

				let buylist = this.storeList
				for (let i = 0; i < buylist.length; i++) {
					let goodsList = buylist[i].etc.goodsList;

					for (let j = goodsList.length - 1; j >= 0; j--) {
						if (!goodsList[j].etc.selected) {
							goodsList.splice(j, 1);
						}
					}
					if (goodsList.length == 0) {
						buylist.splice(i, 1);
					}
				}
				uni.setStorage({
					key: 'buylist',
					data: buylist,
					success: () => {
						uni.navigateTo({
							url: '/pages/order/confirmation?type=2&role='+this.role
						})
					}
				})
			},
			//删除商品
			deleteGoods() {
				let ids = '';
				for (let i = 0; i < this.selectedList.length; i++) {
					ids += (this.goodsList[this.selectedList[i]].id) + ',';
				}
				 this.deleteByIds(ids);
			},
			deleteGood(index, cnt) {
				console.log("要删除了？", cnt, index)
				this.deleteById(this.storeList[cnt].etc.goodsList[index].id);
			},
			deleteByIds(ids) {
				deleteByIds({
					goodsIds: ids
				}).then((response) => {
					this.sum();
					this.oldIndex = null;
					this.oldCnt = null;
					this.theCnt = null;
					this.theIndex = null;
					this.getCart();
				}).catch((error) => {
					console.log(error)
				})

			},
			// 选中商品
			selected(index, cnt) {
				let selected = this.storeList[cnt].etc.goodsList[index].etc.selected;
				if (selected == true) {
					selected = false
				} else {
					selected = true
				}
				updateSelected({
					goodsId: this.storeList[cnt].etc.goodsList[index].id,
					selected: selected
				}).then((response) => {
					this.storeList[cnt].etc.goodsList[index].etc.selected = selected
					this.sum();
				}).catch((error) => {
					console.log(error)
				})

			},
			//全选
			allSelect() {
				let len = this.goodsList.length;
				let arr = [];
				for (let i = 0; i < len; i++) {
					this.goodsList[i].etc.selected = this.isAllselected ? false : true;
					arr.push(this.goodsList[i].id);
				}
				this.selectedList = this.isAllselected ? [] : arr;
				this.isAllselected = this.isAllselected || this.goodsList.length == 0 ? false : true;
				isAllSelected({
					isAllSelected: this.isAllselected
				}).then((response) => {
					console.log(response)
				}).catch((error) => {
					console.log(error)
				})
				this.sum();
			},
			// 减少数量
			sub(index, cnt) {
				if (this.storeList[cnt].etc.goodsList[index].etc.num <= 1) {
					uni.showToast({
						title: '不能再少了！',
						icon: 'fail'
					})
					return;
				}
				this.storeList[cnt].etc.goodsList[index].etc.num--;
				updateNum({
					goodsId: this.storeList[cnt].etc.goodsList[index].id,
					num: this.storeList[cnt].etc.goodsList[index].etc.num
				}).then((response) => {

				}).catch((error) => {

				})
				this.sum();
			},
			// 增加数量
			add(index, cnt) {
				this.storeList[cnt].etc.goodsList[index].etc.num++;
				updateNum({
					goodsId: this.storeList[cnt].etc.goodsList[index].id,
					num: this.storeList[cnt].etc.goodsList[index].etc.num
				}).then((response) => {

				}).catch((error) => {
					this.storeList[cnt].etc.goodsList[index].etc.num--;
					uni.showToast({
						title: error.message,
						icon: 'fail'
					})
				})
				this.sum();
			},
			// 合计
			sum() {
				this.sumPrice = 0;
				this.selectedList = [];
				for (let i = 0; i < this.goodsList.length; i++) {
					if (this.goodsList[i].etc.selected == true) {
						this.selectedList.push(i)
						this.sumPrice = this.sumPrice + (this.goodsList[i].etc.num * this.goodsList[i].price);
					} else {
						this.selectedList.splice(i, 1);
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			discard() {
				//丢弃
			}


		}
	}
</script>


<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}

	.checkbox-box {
		display: flex;
		align-items: center;

		.checkbox {
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}

		.text {
			font-size: 28upx;
			margin-left: 10upx;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 92%;
		display: inline-block;
		z-index: 10;
		background-color: #fff;
		margin-left: 4%;
		text-align: center;

		/*  #endif  */
		.title {
			font-size: 50upx;
			display: inline-block;
		}

	}

	.place {

		background-color: #ffffff;
		height: 80upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */

		p {
			position: absolute;
			margin-top: 30upx;
			display: inline-block;
		}

		.address-icon {

			margin-top: 20upx;
			display: inline-block;

		}
	}

	.goods-list {
		width: 100%;
		padding: 0upx 0 120upx 0;

		.tis {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}

		.row {
			width: calc(92%);
			height: calc(22vw + 40upx);
			margin: 20upx auto;

			border-radius: 15upx;
			box-shadow: 2upx 2upx 10upx 3upx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					font-size: 30upx;
				}

				position: absolute;
				width: 20%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-20%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;

				.checkbox-box {
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info {
					width: 100%;
					display: flex;
					padding-right: 20upx;

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
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 30upx;
							display: flex;
							align-items: center;
							padding: 0 10upx;
							border-radius: 15upx;
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
							height: 60upx;

							.price {}

							.number {
								display: flex;
								justify-content: center;
								align-items: flex-end;

								.input {
									width: 60upx;
									height: 60upx;
									margin: 0 10upx;
									background-color: #f3f3f3;

									input {
										width: 60upx;
										height: 60upx;
										display: flex;
										justify-content: center;
										align-items: center;
										text-align: center;
										font-size: 26upx;
									}
								}

								.sub,
								.add {
									width: 45upx;
									height: 45upx;
									background-color: #f3f3f3;
									border-radius: 5upx;

									.icon {
										font-size: 22upx;
										width: 45upx;
										height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;

									}
								}
							}
						}
					}
				}
			}
		}
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.delBtn {
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 60%;
				font-size: 25upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 400;
					text-decoration: line-through;
				}

				.discount_money {
					color: #f06c7a;
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 50upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;

				border-radius: 30upx;
			}
		}
	}

	.controller {
		float: right;
		display: flex;
		color: black;
		background-color: #aa9f4c;
	}

	.controller :hover {
		background-color: #ffff00;
	}


	.store {
		// width: 90%;
		// margin-left: 5%;
		// background-color: #f8f8e4;
		// padding-bottom: 20upx;
		// margin-bottom: 30upx;
		// border-radius: 20upx;
	}

	.store-logo {
		width: 40upx;
		height: 40upx;
		margin: 15upx 0 0 15upx;
	}

	.login_button {
		height: 90upx;
		border-radius: 30upx;
		margin-top: 20upx;
		background-color: #d5d5d5;
	}
</style>