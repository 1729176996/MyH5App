var vm,loading;
var start = 0,num = 20;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			list:[],
			recipeClass:{}
	    },
	    mounted:function(){
			this.init();
	    },
	    methods:{
			init:function(){
				var _this = this;
				_this.recipeClass = window.localStorage.getItem('recipeClass')?JSON.parse(window.localStorage.getItem('recipeClass')):{};
				mui.init({
					pullRefresh : {
						container:"#scrollWrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
						down : {
							height:50,//可选,默认50.触发下拉刷新拖动距离,
							auto: false,//可选,默认false.首次加载自动下拉刷新一次
							contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
							contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
							contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
							callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								_this.getList('下拉');
							}
						},
						up : {
							height:50,//可选.默认50.触发上拉加载拖动距离
							auto:false,//可选,默认false.自动上拉加载一次
							contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
							contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
							callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
								_this.getList('上拉');
							}
						}
					}
				});
				_this.getList('下拉');
			},
			getList:function(refreshType){
				var _this = this;
				var key = '4334b0604e6114478d0c543ff1a5ade3';
				if(refreshType=='下拉'){
					start = 0;
				}else{
					start += num;
				}
				var url = 'https://way.jd.com/jisuapi/byclass?classid='+_this.recipeClass.classid+'&num='+num+'&start='+start+'&appkey='+key;
				$.ajax({
					url:url,
					type:'GET',
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						if(data){
							if(data.code == "10000"){
								if(data.result){
									if(data.result.result&&data.result.result&&data.result.result.list&&data.result.result.list.length>0){
										if(refreshType=='下拉'){
											_this.list = data.result.result.list;
										}else if(refreshType=='上拉'){
											_this.list = _this.list.concat(data.result.result.list);
										}
									}
								}else{
									if(refreshType=='下拉'){
										start = 0;
									}else{
										start -= num;
									}
									mui.alert('查询错误','提示','确定',null,'div');
								}
							}else{
								if(refreshType=='下拉'){
									start = 0;
								}else{
									start -= num;
								}
								mui.alert(data.msg,'提示','确定',null,'div');
							}
						}else{
							if(refreshType=='下拉'){
								start = 0;
							}else{
								start -= num;
							}
							mui.alert('查询错误','提示','确定',null,'div');
						}
						_this.$nextTick(function(){
							if(refreshType=='下拉'){
								mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
								mui('#scrollWrapper').pullRefresh().scrollTo(0,0,0);
							}else if(refreshType=='上拉'){
								mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
							}
							if(loading){
								loading.hide();
							}
						})
					},
					error:function(xhr, errorType, error,msg){
						if(refreshType=='下拉'){
							start = 0;
						}else{
							start -= num;
						}
						if(refreshType=='下拉'){
							mui('#scrollWrapper').pullRefresh().endPulldownToRefresh();
							mui('#scrollWrapper').pullRefresh().scrollTo(0,0,0);
						}else if(refreshType=='上拉'){
							mui('#scrollWrapper').pullRefresh().endPullupToRefresh();
						}
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
			showDetail:function(item){
				window.localStorage.setItem('recipe_name',item.name);
				window.localStorage.setItem('recipe_id',item.id);
				window.location.href = 'recipeDetail.html';
			}
	    }
	});
});
