<template>
	<view>
		<uni-card padding="10upx 10upx" :is-full="true" class="store">
			<template v-slot:title>
				<uni-list>
					<uni-section :title="store.name" type="line">
						<!-- <template v-slot:footer>
							<image class="slot-image" :src="$base_url+store.img" mode="widthFix"></image>
						</template> -->
					</uni-section>
				</uni-list>
			</template>
			<image :src="$base_url+store.img" mode="aspectFill" style="width: 100%;"></image>

			<uni-list>
				<view class="box" @tap="keep">
					<view class="icon" :class="[isKeep?'shoucangsel':'shoucang']"></view>
					<view class="text">{{isKeep?'已':''}}收藏</view>
				</view>
				<uni-list-item :title="'联系电话:'+store.telephone"></uni-list-item>
				<uni-list-item :title="'地址:'+store.address" />
				<uni-list-item title="简介" :note="store.description" />
			</uni-list>
		</uni-card>
		</uni-section>

		<view class="order">

			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index"
				:class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view>
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
		checkFavor,
		addFavor,
		deleteFavor
	} from '@/api/favor';
	import {
		getById,
		pageByStoreId
	} from '../../api/store';
	export default {
		data() {
			return {
				isKeep: '',
				favorId: '',
				id: '',
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

			this.id = option.cid
			this.checkFavor()
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
			checkFavor() {
				checkFavor(this.id, 3).then((response) => {
					this.favorId = response.data.data.id
					this.isKeep = true
				}).catch((error) => {
					this.isKeep = false

				})
			},
			//收藏
			keep() {


				if (this.isKeep == true) {
					deleteFavor(this.favorId).then((response) => {
						this.isKeep = false
						this.checkFavor()
					})
				} else if (this.isKeep == false) {
					addFavor(this.id, 3).then((response) => {

						this.isKeep = true
						this.checkFavor()

					})
				}

			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					url: '/pages/item/pet/pet?cid=' + e.id + '&breed=' + e.breedName
				});
			},
			//排序类型
			select(index) {
				if (this.type != index) {
					this.type = index
					this.goodsList = []
					this.pageNum = 1
					pageByStoreId(this.pageNum, this.pageSize, this.store.id, index).then((response) => {
						console.log(response.data)
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

	.icon {
		font-size: 26upx;
	}

	.store {
		.description {
			margin-top: 20upx;
			padding-top: 20upx;
			font-size: 30upx;
			width: 100%;
			border-top: 1px solid rgba(0, 0, 0, 0.1);
		}

		.box {
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.icon {
				font-size: 40upx;
				color: #828282;
			}

			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}

	.order {
		width: 92%;
		padding: 0 4%;
		height: 88upx;
		display: flex;
		margin-bottom: 10upx;
		justify-content: space-around;
		align-items: flex-end;
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
			margin-top: 0upx;

			&.on {
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}
		}
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