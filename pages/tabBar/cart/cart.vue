<template>
	<view>

		<!-- 占位 -->
		<view v-if="showHeader" class="place">
			<u-icon name="map-fill" color="#000000" size="28" class="address-icon"></u-icon>
			<p>{{address}}</p>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="tis" v-if="storeList.length==0">购物车是空的哦~</view>
			<!-- store是商店，cnt是遍历的数字 -->
			<view v-for="store in storeList" :key="store.id" class="store">
				<view>
					<image src="/static/img/store.png" class="store-logo"></image>
					{{store.name}}

				</view>

				<view class="row" v-for="goods in store.goodsVOList" :key="goods.id">
					<!-- 删除按钮 -->

					<view class="menu" @tap.stop="deleteGood(goods.cartId)">

						<view class="icon shanchu"></view>
					</view>
					<!-- 商品 -->
					<view class="carrier" :class="[theIndex==goods.id?'open':oldIndex==goods.id?'close':'']"
						@touchstart="touchStart(goods.id,$event)" @touchmove="touchMove(goods.id,$event)"
						@touchend="touchEnd(goods.id,$event)">
						<!-- checkbox -->
						<view class="checkbox-box" @tap="selected(goods.id,store.id)">
							<view class="checkbox">
								<view :class="[goods.selected?'on':'']"></view>
							</view>
						</view>
						<!-- 商品信息 -->
						<view class="goods-info" @tap="toGoods(goods)">
							<view class="img">
								<image :src="goods.img"></image>
							</view>
							<view class="info">
								<view class="title">{{goods.name}}</view>
								<view class="price-number">
									<view class="price">￥{{goods.price}}</view>
									<view class="number">
										<view class="sub" @tap.stop="sub(goods.id)">
											<view class="icon jian"></view>
										</view>
										<view class="input" @tap.stop="discard">
											<input type="number" v-model="goods.num" @input="sum($event,goods.id)" />
										</view>
										<view class="add" @tap.stop="add(goods.id)">
											<view class="icon jia"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>


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
				<view class="sum">合计:<view class="money">￥{{sumPrice}}</view>
				</view>
				<view class="btn" @tap="toConfirmation">结算({{selectedList.length}})</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCart,
		deleteById,
		updateNum,
		updateSelected,
		isAllSelected
	} from '../../../api/cart';
	export default {
		data() {
			return {
				address: '福建省厦门市集美区',
				sumPrice: '0.00',
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				selectedList:[],
				selected_length:null,
				isAllselected: false,
				goodsList: [
					// {
					// 	id: 1,
					// 	img: '/static/img/goods/p1.jpg',
					// 	name: "猫咪玩具",
					// 	price: 30,
					// 	number: 1,
					// 	selected: false,
					// 	storeId: 0
					// },
				],
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				isStop: false,
				storeList: [],
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

			uni.getAccountInfoSync('token');
		},
		activated() {
			this.address = '福建省厦门市集美区',
				this.headerPosition = "fixed",
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



		},
		methods: {
			// 先调用后端接口，然后sql查询返回storelist（在订单列表中查询啥storeid存在），在storeList数组中存下storeId和商店名称
			// 直接所有需要的参数查询回来，然后我给他分开push到两个数组里面就好了吧

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
						for (let j = 0; j < response.data.data[i].goodsVOList.length; j++) {
							this.goodsList.push(response.data.data[i].goodsVOList[j]);
						}

					}
					// this.sum();
					// uni.switchTab({
					// 	url: "/pages/tabBar/home/home"
					// })
					this.sum();
				}).catch((error) => {
					console.log(error)
					// uni.showToast({
					// 	title: error.message,
					// 	icon:  "none"
					// })
				})
			},

			//加入商品 参数 goods:商品数据
			joinGoods(goods) {
				/*
				 * 这里只是展示一种添加逻辑，模板并没有做从其他页面加入商品到购物车的具体动作，
				 * 在实际应用上，前端并不会直接插入记录到goodsList这一个动作，一般是更新列表和本地列表缓存。
				 * 一般商城购物车的增删改动作是由后端来完成的,
				 * 后端记录后返回前端更新前端缓存
				 */
				let len = this.goodsList.length;
				let isFind = false; //是否找到ID一样的商品
				for (let i = 0; i < len; i++) {
					let row = this.goodsList[i];
					if (row.id == goods.id) { //找到商品一样的商品
						this.goodsList[i].num++; //数量自增
						isFind = true; //找到一样的商品
						break; //跳出循环
					}
				}
				if (!isFind) {
					//没有找到一样的商品，新增一行到购物车商品列表头部
					this.goodsList[i].unshift(goods);
				}
			},
			//控制左滑删除效果-begin
			touchStart(index, event) {
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
			touchMove(index, event) {
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
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}
			},
			touchEnd(index, $event) {
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end


			//商品跳转
			toGoods(e) {
				uni.showToast({
					title: '商品' + e.id,
					icon: "none"
				});
				uni.navigateTo({
					url: '../../goods/goods?cid=' + e.goodsId
				});
			},
			//跳转确认订单页面
			toConfirmation() {
				let selected_goods = [];	
				if(this.selectedList.length==0){
					uni.showToast({
						title: '尚未选中商品',
						icon: 'none'
					});
					return;
				}
				//获得选中了的商品列表
				for (let i = 0; i < this.selectedList.length; i++) {
					selected_goods.push(this.goodsList[this.selectedList[i]]);
				}
				console.log(selected_goods)
				//用reduce根据storeId分类给store
				const store = Object.values(selected_goods.reduce((acc, obj) => {
				  const key = obj.storeId;
				  if (!acc[key]) {
				    acc[key] = { storeId: key, goods: [] ,name:this.storeList[key].name};
				  }
				  acc[key].goods.push(obj);
				  return acc;
				}, {}));
				console.log("store")
				console.log(store)
				//传值为store
				uni.setStorage({
					key: 'buylist',
					data: store,
					success: () => {
						uni.navigateTo({
							url: '../../order/confirmation'
						})
					}
				})
			},
			//删除商品
			deleteGoods() {
				console.log("selectedList")
				console.log(this.selectedList)
				let ids = '';
				for (let i = 0; i < this.selectedList.length; i++) {
					ids += (this.goodsList[this.selectedList[i]].cartId) + ',';
				}
				this.deleteById(ids);
			},
			deleteGood(id) {
				this.deleteById(id);
			},
			deleteById(ids) {
				deleteById({
					ids: ids
				}).then((response) => {
					console.log("删除成功")
					this.sum();
					this.oldIndex = null;
					this.theIndex = null;
					this.getCart();
				}).catch((error) => {
					console.log(error)
				})

			},
			// 选中商品
			selected(index) {
				let selected=this.goodsList[index].selected;
				if(selected==true){
					selected=false
				}else{
					selected=true
				}
				updateSelected({
					cartId:this.goodsList[index].cartId,
					selected:selected
				}).then((response)=>{
					console.log(response)
					this.goodsList[index].selected=selected
					this.sum();
				}).catch((error)=>{
					console.log(error)
				})
				
			},
			//全选
			allSelect() {
				let len = this.goodsList.length;
				let arr = [];
				for (let i = 0; i < len; i++) {
					this.goodsList[i].selected = this.isAllselected ? false : true;
					arr.push(this.goodsList[i].id);
				}
				this.selectedList = this.isAllselected ? [] : arr;
				this.isAllselected = this.isAllselected || this.goodsList.length == 0 ? false : true;
				console.log("this.isAllselected   "+this.isAllselected)
				isAllSelected({
					isAllSelected:this.isAllselected
				}).then((response)=>{
					console.log(response)		
				}).catch((error)=>{
					console.log(error)
				})
				this.sum();
			},
			// 减少数量
			sub(index) {
				if (this.goodsList[index].num <= 1) {
					return;
				}
				this.goodsList[index].num--;
				updateNum({
					cartId:this.goodsList[index].cartId,
					num:this.goodsList[index].num
				}).then((response)=>{
					console.log(response)		
				}).catch((error)=>{
					console.log(error)
				})
				this.sum();
			},
			// 增加数量
			add(index) {
				this.goodsList[index].num++;
				updateNum({
					cartId:this.goodsList[index].cartId,
					num:this.goodsList[index].num
				}).then((response)=>{
					console.log(response)		
				}).catch((error)=>{
					console.log(error)
				})
				this.sum();
			},
			// 合计
			sum() {
				this.sumPrice = 0;
				this.selectedList=[];
				for (let i = 0; i <this.goodsList.length; i++) {
					if(this.goodsList[i].selected==true){
						this.selectedList.push(i)
						this.sumPrice = this.sumPrice + (this.goodsList[i].num * this.goodsList[i].price);
					}else{
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
		padding: 20upx 0 120upx 0;

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
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
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
		width: 90%;
		margin-left: 5%;
		background-color: #f8f8e4;
		padding-bottom: 20upx;
		margin-bottom: 30upx;
		border-radius: 20upx;
	}

	.store-logo {
		width: 40upx;
		height: 40upx;
		margin: 15upx 0 0 15upx;
	}
</style>