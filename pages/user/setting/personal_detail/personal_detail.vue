<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="title">头像</view>
				<view class="right">
					<view class="tis">
						<image src="/static/img/face.jpg" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					昵称
				</view>
				<view class="input">
					<input placeholder="请输入个人姓名" type="text" v-model="user.name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入电话号码" type="text" v-model="user.phone" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					邮箱
				</view>
				<view class="input">
					<input placeholder="请输入邮箱" type="text" v-model="user.email" />
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存信息
			</view>

		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue"
			@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import {
		getUser,
		updateUser
	} from '../../../../api/user';
	export default {
		components: {
			mpvueCityPicker
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '个人信息'
			});
			getUser().then((response) => {
				this.user = response.data.data
			}).catch((error) => {
				this.user = null
			})
		},
		data() {
			return {
				editType: 'edit',
				email: '',
				name: '',
				telephone: '',
				address: '',
				isDefault: false,
				cityPickerValue: [0, 0, 1],
				themeColor: '#007AFF',
				region: '',
				user: [{
					name: '',
					phone: '',
					email: '',
				}],
			};
		},
		methods: {
			save() {
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				});
				updateUser(this.user).then(res => {})

				setTimeout(function() {
					uni.navigateBack()
				}, 400);

			}
		},
	};
</script>
<style lang="scss">
	.row {
		widows: 100%;
		min-height: 90upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 1upx #eee;

		&:last-child {
			border-bottom: none;
		}

		.title {
			font-size: 32upx;
			color: #333;
		}

		.right {
			display: flex;
			align-items: center;
			color: #999;

			.tis {
				font-size: 26upx;
				margin-right: 15upx;
				max-height: 120upx;

				image {
					width: 100upx;
					height: 100upx;
					border-radius: 100%;
					margin: 10upx 0;
				}
			}

			.icon {
				width: 40upx;
				color: #cecece;
			}
		}

	}

	.save {
		view {
			display: flex;
		}

		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #f06c7a;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;

		view {
			display: flex;
		}

		.row {
			width: 94%;

			margin: 0 3%;
			border-top: solid 1upx #eee;

			.nominal {
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}

			.input {
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;

				&.switch {
					justify-content: flex-end;
				}

				.textarea {
					margin: 20upx 0;
					min-height: 120upx;
				}
			}

			.del {
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f06c7a;
				background-color: rgba(255, 0, 0, 0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
</style>