<template>
	<view>
		<view class="title">
			优惠券
		</view>
		<view class="coupon">
			<view class="item" v-for="(row,index) in couponList" :key="index">
				<view class="left">
					<view class="item_title">
						{{row.title}}
					</view>
					<view class="rule">
						{{row.rule}}<text v-if="row.type==0"> |不限制张数 </text>
					</view>
					<view class="price">
						￥{{row.pay_value}}
					</view>
				</view>

				<view class="right">
					<view class="panic_buy" v-if="row.possessed==0&&row.type==1">
						<button @tap="panicBuy()" class="button">限时抢购</button>
					</view>
					<view class="panic_buy" v-if="row.possessed==0&&row.type==0">
						<button @tap="add(row)" class="button">抢 购</button>

					</view>

					<view class="panic_buy" v-if="row.possessed==1">
						<button @tap="toUse(row)" class="button">去使用</button>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		add,
		getCoupons
	} from '@/api/couponsByUser.js'
	export default {
		data() {
			return {
				exist: [],
				couponList: [{
					id: 1,
					title: '170代2000元代金券',
					rule: '周一至周五可用',
					pay_value: 170,
					acutal_value: 200,
					type: 1,
					create_time: '',
					end_time: '',
				}, {
					id: 2,
					title: '90代100元代金券',
					rule: '周一至周五可用',
					pay_value: 90,
					acutal_value: 100,
					type: 0,
					create_time: '',
					end_time: '',
				}],
			}
		},
		mounted() {		
			this.getCoupons()
		},
		activated() {
			this.getCoupons()
		},

		methods: {
			getCoupons(){
				getCoupons({}).then((response) => {
					let myCoupons = response.data.data
					for (let i = 0; i < this.couponList.length; i++){
						this.$set(this.couponList[i], 'possessed', 0)
						const test =this.couponList[i];			
						for (let j = 0; j < myCoupons.length; j++) {
							if (this.couponList[i].id == myCoupons[j].couponId) {
							   this.$set(this.couponList[i], 'possessed', 1)
							}
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			
			add(row) {
				add({
					couponId: row.id
				}).then((response) => {
					console.log(response)
					this.getCoupons()
				}).catch((err) => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.title {
		text-align: center;
		font-size: 40upx;
		font-weight: 600;
	}

	.item {
		width: 90%;
		height: 25%;
		background-color: #fff5ea;
		border: solid 4upx #ffe6c9;
		margin-top: 30upx;
		margin-left: 4%;
		border-radius: 20upx;
		padding: 10upx 0 10upx 10upx;

		.left {
			display: inline-block;
			width: 45%;
			justify-content: flex-start;
			margin-left: 10upx;

			.item_title {
				font-weight: 550;
				color: #2a2a2a;
			}

			.rule {
				font-weight: 400 !important;
				font-size: 24upx;
				color: #5f5f5f;
			}

			.price {
				font-size: 30upx;
				font-weight: 550;
				color: #ff9137;
				margin-top: 10upx;
				margin-left: 10upx;
			}
		}

		.right {
			display: inline-block;
			width: 45%;
			float: right;
			height: 100%;

			.panic_buy {
				display: flex;
				width: 200upx;
				height: 80upx !important;
				margin-left: 100upx;
				margin-top: 10upx;

				.button {
					border-radius: 50px;
					background-color: #ff9137;
					margin-top: auto;
					font-size: 25upx;
					color: #ffffff;
				}
			}
		}

	}
</style>