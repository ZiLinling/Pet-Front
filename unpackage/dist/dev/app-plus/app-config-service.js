
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/tabBar/home/home","pages/tabBar/shop/shop","pages/category/category","pages/tabBar/cart/cart","pages/tabBar/user/user","pages/goods/goods-list/goods-list","pages/goods/goods","pages/login/login","pages/login/reg","pages/login/forget","pages/login/agreement","pages/order/confirmation","pages/user/order_list/order_list","pages/user/setting/setting","pages/msg/msg","pages/msg/chat/chat","pages/user/keep/keep","pages/user/address/address","pages/user/address/edit/edit","pages/user/deposit/deposit","pages/pay/payment/payment","pages/pay/success/success","pages/goods/ratings/ratings","pages/search/search_pet","pages/search/search_pet_detail","pages/goods/pet","pages/store/store","pages/search/search_goods_detail","pages/user/setting/personal_detail/personal_detail"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"","navigationBarBackgroundColor":"#ffffff","backgroundColor":"#ffffff","backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"},"tabBar":{"color":"#333333","selectedColor":"#f06c7a","borderStyle":"#EEEEEE","backgroundColor":"#ffffff","list":[{"pagePath":"pages/tabBar/home/home","iconPath":"static/img/tabBar/home.png","selectedIconPath":"static/img/tabBar/home-on.png","text":"首页"},{"pagePath":"pages/tabBar/shop/shop","iconPath":"static/img/tabBar/home.png","selectedIconPath":"static/img/tabBar/home-on.png","text":"周边"},{"pagePath":"pages/tabBar/cart/cart","iconPath":"static/img/tabBar/cart.png","selectedIconPath":"static/img/tabBar/cart-on.png","text":"购物车"},{"pagePath":"pages/tabBar/user/user","iconPath":"static/img/tabBar/user.png","selectedIconPath":"static/img/tabBar/user-on.png","text":"我的"}]},"darkmode":false,"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"宠物宝","compilerVersion":"3.8.4","entryPagePath":"pages/tabBar/home/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/tabBar/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTextStyle":"black","enablePullDownRefresh":true,"onReachBottomDistance":50,"navigationStyle":"custom"}},{"path":"/pages/tabBar/shop/shop","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTextStyle":"black","enablePullDownRefresh":true,"onReachBottomDistance":50,"navigationStyle":"custom"}},{"path":"/pages/category/category","meta":{},"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"全部分类","bounce":"none"}},{"path":"/pages/tabBar/cart/cart","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":true,"navigationBarTextStyle":"black","navigationBarTitleText":"购物车","titleNView":{"splitLine":{"color":"#EEEEEE"}}}},{"path":"/pages/tabBar/user/user","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTextStyle":"black","navigationStyle":"custom","bounce":"none"}},{"path":"/pages/goods/goods-list/goods-list","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":true,"bounce":"none"}},{"path":"/pages/goods/goods","meta":{},"window":{"navigationBarTitleText":"","navigationBarBackgroundColor":"#f1f1f1","onReachBottomDistance":50,"navigationStyle":"custom","bounce":"none"}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"登录","bounce":"none"}},{"path":"/pages/login/reg","meta":{},"window":{"navigationBarTitleText":"注册","bounce":"none"}},{"path":"/pages/login/forget","meta":{},"window":{"navigationBarTitleText":"忘记密码","bounce":"none"}},{"path":"/pages/login/agreement","meta":{},"window":{"navigationBarTitleText":"用户协议","bounce":"none"}},{"path":"/pages/order/confirmation","meta":{},"window":{"navigationBarTitleText":"确认订单","softinputNavBar":"none"}},{"path":"/pages/user/order_list/order_list","meta":{},"window":{"navigationBarTitleText":"我的订单","navigationBarBackgroundColor":"#f8f8f8","backgroundColorTop":"#f3f3f3","backgroundColorBottom":"#ffffff"}},{"path":"/pages/user/setting/setting","meta":{},"window":{"navigationBarBackgroundColor":"#f8f8f8","navigationBarTitleText":"我的设置","backgroundColorTop":"#ffffff","backgroundColorBottom":"#f3f3f3"}},{"path":"/pages/msg/msg","meta":{},"window":{"enablePullDownRefresh":true,"navigationBarTitleText":"消息列表","navigationBarBackgroundColor":"#f06c7a","navigationBarTextStyle":"white"}},{"path":"/pages/msg/chat/chat","meta":{},"window":{"navigationBarBackgroundColor":"#f2f2f2","backgroundColorTop":"#e5e5e5","backgroundColorBottom":"#e5e5e5","softinputNavBar":"none","bounce":"none"}},{"path":"/pages/user/keep/keep","meta":{},"window":{"navigationBarTitleText":"我的收藏","navigationBarTextStyle":"black","bounce":"none"}},{"path":"/pages/user/address/address","meta":{},"window":{"navigationBarBackgroundColor":"#ffffff","navigationBarTitleText":"地址管理","backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"}},{"path":"/pages/user/address/edit/edit","meta":{},"window":{"navigationBarBackgroundColor":"#ffffff","navigationBarTitleText":"编辑收件人地址","backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"}},{"path":"/pages/user/deposit/deposit","meta":{},"window":{"navigationBarBackgroundColor":"#ffffff","navigationBarTitleText":"充值","backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"}},{"path":"/pages/pay/payment/payment","meta":{},"window":{"navigationBarBackgroundColor":"#ffffff","navigationBarTitleText":"订单支付","backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"}},{"path":"/pages/pay/success/success","meta":{},"window":{"navigationBarBackgroundColor":"#ffffff","navigationBarTitleText":"支付成功","backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"}},{"path":"/pages/goods/ratings/ratings","meta":{},"window":{"navigationBarTitleText":"商品评论","enablePullDownRefresh":true,"onReachBottomDistance":50,"backgroundColorTop":"#ffffff","backgroundColorBottom":"#ffffff"}},{"path":"/pages/search/search_pet","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/search/search_pet_detail","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/goods/pet","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/store/store","meta":{},"window":{"navigationBarTitleText":"商店详情","enablePullDownRefresh":false}},{"path":"/pages/search/search_goods_detail","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/user/setting/personal_detail/personal_detail","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
