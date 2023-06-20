<template>
	<view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">

			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index"
				:class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods,index) in goodsList" :key="index" @tap="toGoods(goods)">
					<image mode="aspectFill" :src="$base_url+goods.img"></image>
					<view class="name" v-if="type==0">{{goods.breedName}}</view>
					<view class="info">
						<view class="slogan">{{goods.name}}</view>
						<view class="price">{{goods.price}}$</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	import {
		getById,
		pageByStoreId
	} from '../../api/store';
	export default {
		data() {
			return {
				goodsList: [],
				loadingText: "正在加载...",
				headerTop: "0px",
				headerPosition: "fixed",
				store: {},
				type: 0,
				count1: 0, //数量
				pageNum: 1, //当前页号
				pageSize: 6,
				orderbyList: [{
						text: "宠物",
						selected: true,
						orderbyicon: ['sheng', 'jiang'],
						orderby: 0
					},
					{
						text: "商品",
						selected: false,
						orderbyicon: ['sheng', 'jiang'],
						orderby: 0
					},
				],
				orderby: "sheng"
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.cid)
			getById(option.cid).then((response) => {
				this.store = response.data.data
				pageByStoreId(1, 6, parseInt(this.store.id), 0).then((response) => {
					this.count1 = response.data.etc.total
					this.pageNum++
					let p = response.data.data.records
					for (let i = 0; i < p.length; i++) {
						this.goodsList.push(p[i])
					}
				})
				if (this.goodsList.length >= this.count1) {
					this.loadingText = '没有更多了'
				}
			})
			uni.setNavigationBarTitle({
				title: this.store.name
			});
			//兼容H5下排序栏位置
			// #ifdef H5
			//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			uni.showToast({
				title: '触发上拉加载'
			});
			let len = this.goodsList.length;
			if (len >= this.count1) {
				this.loadingText = '没有更多了';
				return false;
			}
			pageByStoreId(this.pageNum, this.pageSize, this.storeId, this.type).then((response) => {
				this.pageNum++;
				this.count1 = response.data.etc.total
				let p = response.data.data.records
				for (let i = 0; i < p.length; i++) {
					this.goodsList.push(p[i])
				}
			})
		},
		methods: {
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					url: '/pages/goods/pet?cid=' + e.id + '&breed=' + e.breedName
				});
			},
			//排序类型
			select(index) {
				if (this.type != index) {
					this.type = index
					this.goodsList = []
					this.pageNum = 1
					pageByStoreId(this.pageNum, this.pageSize, this.storeId, index).then((response) => {
						this.pageNum++;
						this.count1 = response.data.etc.total
						let p = response.data.data.records
						for (let i = 0; i < p.length; i++) {
							this.goodsList.push(p[i])
						}
					})
				}
				let tmpTis = this.orderbyList[index].text + "排序 "
				if (this.orderbyList[index].orderbyicon) {
					let type = this.orderbyList[index].orderby == 0 ? '升序' : '降序';
					if (this.orderbyList[index].selected) {
						type = this.orderbyList[index].orderby == 0 ? '降序' : '升序';
						this.orderbyList[index].orderby = this.orderbyList[index].orderby == 0 ? 1 : 0;
					}
					tmpTis += type
				}
				this.orderbyList[index].selected = true;
				let len = this.orderbyList.length;
				for (let i = 0; i < len; i++) {
					if (i != index) {
						this.orderbyList[i].selected = false;
					}
				}
				console.log(this.orderbyList[index].orderby)
				if (this.orderbyList[index].orderby == 0) {
					this.goodsList.sort((a, b) => a.price - b.price);
				} else {
					this.goodsList.sort((a, b) => b.price - a.price);
				}
			}
		}

	}
</script>

<style lang="scss">
	.icon {
		font-size: 26upx;
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 88upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 0px;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;

		.target {
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;

			&.on {
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}


		}
	}

	.place {

		background-color: #ffffff;
		height: 100upx;

	}

	.goods-list {
		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}

		.product-list {
			width: 92%;
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.product {
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

				image {
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}

				.name {
					width: 92%;
					padding: 10upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;

					.price {
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}

					.slogan {
						color: #807c87;
						font-size: 24upx;
					}
				}
			}

		}
	}
</style>