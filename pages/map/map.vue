<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map v-if="show" :style="'width: 100%;height:'+this.windowHeight*2+'upx;'" :latitude="latitude"
					:longitude="longitude" :markers="markers" :circles="circles" show-location>
				</map>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		base_url
	} from '../../api/axios';
	export default {
		data() {
			return {
				base_url: base_url,
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				markers: [],
				show: false,
				windowHeight: uni.getSystemInfoSync.windowHeight,
				circles: [{
					latitude: 0,
					longitude: 0,
					fillColor: "#b2efffaa",
					color: '#89f6ff',
					radius: 300,
					strokeWidth: 1
				}],
			}
		},
		onLoad() {
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
			this.getMyLocation()
			console.log(this.windowHeight)
		},
		methods: {
			getMyLocation() {
				uni.getLocation({
					// map组件默认为国测局坐标gcj02，调用 uni.getLocation返回结果传递给组件时，需指定 type 为 gcj02 
					type: 'gcj02',
					success: ({
						longitude,
						latitude
					}) => {
						// 定位得到的经纬度
						console.log('当前位置的经度：' + longitude)
						console.log('当前位置的纬度：' + latitude)
						this.longitude = this.circles[0].longitude = longitude
						this.latitude = this.circles[0].latitude = latitude
						// 画出定位位置
						this.markers[0] = {
							id: 1,
							longitude: 118.086064,
							latitude: 24.622929,
							title: '我的位置11111',
							iconPath: base_url + "/resource/icon/location.png",
							width: 25,
							label: {
								text: "1111"
							}

						}
						console.log(this.markers[0])
						this.show = true
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>