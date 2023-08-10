<template>
	<view>
		<uni-card v-for="(card,index) in cards" :key="index" :class="'card bank-' + card.bankId" sub-title="银行卡" padding="10upx 0"
			thumbnail="/static/img/store.png">
			<view class="name">
				{{card.bankName}}
			</view>
			
			<view class="type">
				{{card.type}}
			</view>
			<view class="number">
				{{card.number}}
			</view>
		</uni-card>
		<view class="">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cards: [{
					bankId:'1',
					number: '6217001180039467467',
					bankName: '建设银行',
					type: '储蓄卡',
					idFrezed: false,
					img: '',
				}, {
					bankId:'2',
					number: '6217001180039467467',
					bankName: '农业银行',
					type: '储蓄卡',
					idFrezed: false,
					img: '',
				},
				{
					bankId:'3',
					number: '6217001180039467467',
					bankName: '建设银行',
					type: '储蓄卡',
					idFrezed: false,
					img: '',
				}],
			}
		},
		onLoad() {
			// for(let card; cards){
			// 	const number=card.number
			// 	 const lineNumOfCursorLeft = (cardNum.slice(0, number).match(/-/g) || []).length
			// 	 // 去掉所有-的字符串
			// 	 const noLine = cardNum.replace(/-/g, '')
			// 	 // 去除格式不对的字符并重新插入-的字符串
			// 	 const newCardNum = noLine.replace(/\D+/g, '').replace(/(\d{4})/g, '$1-').replace(/-$/, '')
			// }
		},
		methods: {

		}
	}
</script>

<style>
	.number {
		font-size: 17px;
		font-family: menlo, tahoma;
		text-shadow: 1px 1px 2px #666;
		line-height: 18px;
		color: black;
		text-align: left;
		padding-left: 20px;
	}
	.bank-1 {
		//建行
		background-color: #0f3e96;
		color: black;
	}
	.bank-2 {
		//农业
	  background-color: #00913e;
	}	
	.bank-3 {
		//工商
	  background-color: #dd231c;
	}
	.card{
		height: 200upx;
		.name{
			color: white;
		}
		.type{
			color: white;
		}
	}
</style>