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
					<image mode="aspectFill" :src="getUrl(goods.img)"></image>
					<view class="name">{{goods.breedName}}</view>
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
		getCount,
		getCountBySpecie,
		page
	} from '../../../api/home';
	import {
		base_url
	} from '@/api/axios'
	export default {
		created() {
			let this_ = this;
			if (this.specie == '0') //查询宠物种类数量(相同物种下的不同种类)
			{
				getCount(this_.breedId).then((response) => {
					this_.count1 = response.data.data
				})
			} else //查询宠物物种数量(猫、狗、其他分类)
			{
				getCountBySpecie(this.specie).then(res => {
					this_.count1 = res.data.data;
				})
			}
			page(1, 6, this.breedName, this.specie).then((response) => {
				let p = response.data.data.records
				for (let i = 0; i < p.length; i++) {
					this.goodsList.push(p[i])
				}
			})
			if (this.goodsList.length >= this.count1) {
				this.loadingText = '没有更多了'
			}
		},
		data() {
			return {
				base_url: base_url,
				goodsList: [],
				loadingText: "正在加载...",
				headerTop: "0px",
				headerPosition: "fixed",
				breedName: '', //种类名称
				breedId: 0, //种类id
				count1: 0, //数量
				specie: 0, //种类物种分类
				pageNum: 2, //当前页号
				orderbyList: [{
						text: "综合",
						selected: true,
						orderbyicon: false,
						orderby: 0
					},
					{
						text: "价格",
						selected: false,
						orderbyicon: ['sheng', 'jiang'],
						orderby: 0
					},
					{
						text: "好评",
						selected: false,
						orderbyicon: false,
						orderby: 0
					}
				],
				orderby: "sheng"
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.breedName = option.name;
			this.breedId = option.cid;
			this.specie = option.specie;
			uni.setNavigationBarTitle({
				title: option.name
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

			page(this.pageNum, 4, this.breedName, this.specie).then((response) => {
				this.pageNum++;
				let p = response.data.data.records
				for (let i = 0; i < p.length; i++) {
					this.goodsList.push(p[i])
				}
			})
		},
		methods: {
			getUrl(url) {
				if (url) {
					return this.base_url + url
				} else {
					return "/"
				}
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					url: '../../goods/pet?cid=' + e.id + '&breed=' + e.breedName
				});
			},
			//排序类型
			select(index) {
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
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 0;
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
						font-size: 30upx;
						width: 100%;
						display: -webkit-box;
						/** 对象作为伸缩盒子模型显示 **/
						overflow: hidden;
						word-break: break-all;
						/* break-all(允许在单词内换行。) https://www.w3school.com.cn/cssref/pr_word-break.asp*/
						text-overflow: ellipsis;
						/* 超出部分省略号 */
						-webkit-box-orient: vertical;
						/** 设置或检索伸缩盒对象的子元素的排列方式 **/
						-webkit-line-clamp: 1;
						/** 显示的行数 **/
					}
				}
			}

		}
	}
</style>