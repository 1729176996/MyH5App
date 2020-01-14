var vm,loading;
var page = 1,maxResult = 20;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			list:[],
			type:'',
			refreshType:'',//上拉或下拉
	    },
	    mounted:function(){
			this.type = 'dtgxt';
			this.init();
	    },
	    methods:{
			init:function(){
				var _this = this;
				loading = weui.loading("加载中");
				mui.init({
					pullRefresh : {
						container:"#scrollWrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
						down : {
							height:50,//可选,默认50.触发下拉刷新拖动距离,
							auto: true,//可选,默认false.首次加载自动下拉刷新一次
							contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
							contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
							contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
							callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								_this.refreshType = '下拉';
								page = 1;
								_this.getList();
							}
						},
						up : {
							height:50,//可选.默认50.触发上拉加载拖动距离
							auto:false,//可选,默认false.自动上拉加载一次
							contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
							contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
							callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								_this.refreshType = '上拉';
								page++;
								_this.getList();
							}
						}
					}
				});
			},
			getList:function(){
				var _this = this;
				var key = '4334b0604e6114478d0c543ff1a5ade3';
				var url = 'https://way.jd.com/showapi/'+_this.type+'?page='+page+'&maxResult='+maxResult+'&appkey='+key+'&showapi_sign=bd0592992b4d4050bfc927fe7a4db9f3';
				$.ajax({
					url:url,
					type:'GET',
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						if(data){
							if(data.code == "10000"){
								if(data.result&&data.result.showapi_res_code==0){
									if(data.result.showapi_res_body&&data.result.showapi_res_body.contentlist&&data.result.showapi_res_body.contentlist.length>0){
										if(_this.refreshType=='下拉'){
											_this.list = data.result.showapi_res_body.contentlist;
										}else if(_this.refreshType=='上拉'){
											_this.list = _this.list.concat(data.result.showapi_res_body.contentlist);
										}
									}else{
										if(_this.refreshType=='下拉'){
											_this.list = [];
										}
									}
								}else{
									page--;
									mui.alert(data.result.showapi_res_error,'提示','确定',null,'div');
								}
							}else{
								page--;
								mui.alert(data.msg,'提示','确定',null,'div');
							}
						}else{
							page--;
							mui.alert('查询错误','提示','确定',null,'div');
						}
						_this.$nextTick(function(){
							if(_this.refreshType=='下拉'){
								mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
							}else if(_this.refreshType=='上拉'){
								mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
							}
							if(loading){
								loading.hide();
							}
							_this.refreshType = '';
						})
					},
					error:function(xhr, errorType, error,msg){
						page--;
						if(_this.refreshType=='下拉'){
							mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
						}else if(_this.refreshType=='上拉'){
							mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
						}
						_this.refreshType = '';
						if(loading){
							loading.hide();
						}
						mui.alert(msg,'提示','确定',null,'div');
					}
				})
			},
			toTop:function(){
				mui('#scrollWrapper').pullRefresh().scrollTo(0,0,100);
			},
			changgeType:function(type){
				var _this = this;
				_this.type = type;
				_this.refreshType = '下拉';
				page = 1;
				loading = weui.loading("加载中");
				_this.getList();
			}
	    }
	});
});
