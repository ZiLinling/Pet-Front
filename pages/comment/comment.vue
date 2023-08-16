<template>
	<view class="total">
		<view class="tips">
			{{tips_text}}
		</view>
		<view class="body" v-for="good in goods" >
			
			<!-- 评分 -->
			<view class="stars">
				<view class="introducion">
					<img :src="$base_url+good.img" class="icon">
					<text class="title" cols="30" rows="10">{{good.introduction}}</text>
				</view>
				
					<view>
						<view class="content">
							<view class="row">
								描述相符
								<uni-rate class="rate" v-model="comments[good.id].level_description" :margin="20"></uni-rate>
							</view>
							<view class="row">
								物流服务
								<uni-rate class="rate" v-model="comments[good.id].level_logistic" :margin="20"></uni-rate>
							</view>
							<view class="row">
								服务态度
								<uni-rate class="rate" v-model="comments[good.id].level_service" :margin="20"></uni-rate>
							</view>
						</view>
					</view>
			</view>
			
			
			<!-- 评论 -->
			<view class="writting">
				<view class="buttons" v-for="row in label" :key="row.id">
					<button class="button" @click="add(row)">{{row.text}}</button>
				</view>
				<uni-easyinput type="textarea" autoHeight v-model="comments[good.id].comment" placeholder="说说你对该商品的看法吧">
				</uni-easyinput>
			</view>
			
		</view>
	<view class="commit">
		<button @click="release()">发布</button>
	</view>
	
	</view>
</template>

<script>
	import {getGoods} from '@/api/goods.js'
	import {save} from '@/api/comment.js'
	import{toComment} from '@/api/orderItem.js'
	export default {
		data() {
			return {
				ids:'',
				category:['全部','玩具','保健','主粮'],
				tips_text: '客户真是的评价能帮助用户做决策',
				goodsList:[],
				comments: [],
				goods: [],
				
				label: [{
						id: 1,
						text: '整体评价',
						type: false,
					},
					{
						id: 2,
						text: '产品质量',
						type: false,
					},
					{
						id: 3,
						text: '购物体验',
						type: false,
					},
				]
			}
		},
		onLoad(option) {
			this.ids=option.itemIds;
			var idsArr =option.goodsIds.split(",");
			let i=1;
			for(let i=0;i<idsArr.length;i++){
				if(idsArr[i]==''){
					break;
				}
				
				getGoods({id:idsArr[i]}).then((response)=>{
					let good={
						id:i,
						img:response.data.data.img,
						introduction:response.data.data.name+' 类别：'+this.category[response.data.data.category]+"  描述："+response.data.data.description,
					}
					i++;
					this.goods.push(good)
					let comment= {
						goodsId: response.data.data.id,
						level: null,
						comment: '',
						level_service: null,
						level_logistic: null,
						level_description: null,
					};
					this.comments.push(comment)
				})
			}
		},
		methods: {
			// add(row) {
			// 	let text = row.text
			// 	if (row.type) {
			// 		if (this.comment.comment == '') {
			// 			this.comment.comment += text + ":";
			// 		} else {
			// 			this.comment.comment += '\n' + text + ":";
			// 		}
			// 	}
			// },
			release(){
				for(let i=0;i<this.comments.length;i++){
					if(this.comments[i].level_description==null||this.comments[i].level_logistic==null||this.comments[i].level_service==null){
						uni.showToast({
							title:'请先全部完成评分'
						})
						return;
					}
					this.comments[i].level=(this.comments[i].level_description+this.comments[i].level_logistic+this.comments[i].level_service)/3
					console.log(this.comments[i])
					save({...this.comments[i]}).then((response)=>{
					})
				}
				toComment({ids:this.ids}).then((response)=>{
					uni.switchTab({
						url: "/pages/tabBar/user/user",
					})
				})
				
			}
			
		}
	}
</script>

<style>
	.total{
		background: linear-gradient(50deg, #94dbde, #ddbfde);
		width: 100%;
		height: 100%;
	}
	.tips {
		text-align: center;
		color: #9e9e9e;
	}

	.body {
		width: 100%;
		margin-bottom: 20upx;
	}

	.writting {
		background-color: #ffffff;
		border-color: #c0c0c0;
		border-radius: 1%;
		margin-top: 30upx;
		margin-left: 5%;
		width: 90%;
		text-align: center;

		.comment {
			margin-left: 5%;
			border: solid 1;
		}

		.buttons {
			margin-top: 20upx;
			margin-bottom: 20upx;
			display: inline-block;
			width: 26%;

			.button {
				font-size: 16upx;
				height: 60upx;
				background-color: #ebebeb;
				margin-left: 20%;
			}

		}
	}

	.stars {
		padding-top:5upx;
		border-radius: 2%;
		border-color: #c0c0c0;
		margin-top: 50upx;
		margin-left: 5%;
		width: 90%;
		text-align: center;
		background-color: white;
		
		.introducion{
			display: flex;
			margin-top: 20upx;
			margin-left: 8%;
			font-size: 18upx;
			margin-bottom: 5upx;
			.icon{
				display: inline-block;
				
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
			}
			.title{
				width: 78%;
				margin-left: 2%;
				
				display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
				overflow: hidden;
				word-break: break-all;  /* break-all(允许在单词内换行。) */
				text-overflow: ellipsis;  /* 超出部分省略号 */
				-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
				-webkit-line-clamp: 2; /** 显示的行数 **/
				
				text-align:justify;  /* 设置两端对齐 */


			}
		}
		
	}

	.row {
		height: 80upx;
		font-size: 30upx;

		.rate {
			margin-right: 10%;
			display: flex;
			float: right;

		}
	}
	.commit{
		margin-top: 30upx;
		width: 30%;
		margin-left:35%;
	}
</style>