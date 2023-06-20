<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="telephone" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input" @tap="chooseCity">
					{{region}}
				</view>

			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="address" auto-height="true" placeholder="输入详细地址"></textarea>
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#f06c7a" :checked="isDefault" @change="isDefaultChange" />
				</view>
			</view>
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除收货地址
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>

		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue"
			@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import {
		addAddress,
		updateAddress,
		deleteAddress
	} from '../../../../api/address';
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				editType: 'edit',

				name: '',
				telephone: '',
				address: '',
				isDefault: false,
				cityPickerValue: [0, 0, 1],
				themeColor: '#007AFF',
				region: ''
			};
		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.region = e.label;
				this.cityPickerValue = e.value;
			},
			isDefaultChange(e) {
				this.isDefault = e.detail.value;
			},
			del() {
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: (res) => {
						if (res.confirm) {
							deleteAddress({
								id: this.id
							}).then((response) => {
								uni.navigateBack({
									success() {
										uni.$emit("update")
									}
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			save() {
				let data = {
					"name": this.name,
					"telephone": this.telephone,
					"region": this.region,
					"address": this.address,
					"isDefault": this.isDefault
				}
				if (this.editType == 'edit') {
					data.id = this.id
				}
				if (!data.name) {
					uni.showToast({
						title: '请输入收件人姓名',
						icon: 'none'
					});
					return;
				}
				if (!data.telephone) {
					uni.showToast({
						title: '请输入收件人电话号码',
						icon: 'none'
					});
					return;
				}
				const phoneRegex = /^1[3456789]\d{9}$/; //手机号验证正则表达式
				if (phoneRegex.test(data.telephone) != true) {
					uni.showToast({
						icon: 'none',
						title: '手机号不正确'
					});
					return;
				}
				if (!data.address) {
					uni.showToast({
						title: '请输入收件人详细地址',
						icon: 'none'
					});
					return;
				}
				if (data.region.length == 0) {
					uni.showToast({
						title: '请选择收件地址',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '正在提交'
				})
				console.log(data)

				//实际应用中请提交ajax,模板定时器模拟提交效果
				setTimeout(() => {
					if (this.editType == 'edit') {
						updateAddress(data).then((response) => {
							uni.navigateBack({
								success() {
									uni.$emit("update")
								}
							})
						})
					} else if (this.editType == 'add') {
						addAddress(data).then((response) => {
							uni.navigateBack({
								success() {
									uni.$emit("update")
								}
							})
						})
					}
				}, 300)


			}
		},
		onLoad(e) {
			//获取传递过来的参数

			this.editType = e.type;
			if (e.type == 'edit') {
				uni.getStorage({
					key: 'address',
					success: (e) => {
						this.id = e.data.id;
						this.name = e.data.name;
						this.telephone = e.data.telephone;
						this.address = e.data.address;
						this.isDefault = e.data.isDefault;
						this.region = e.data.region;
					}
				})
			}

		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	};
</script>
<style lang="scss">
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