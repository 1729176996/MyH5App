var vm,loading;
var num = 20;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			keyword:'',
			list:[]
	    },
	    mounted:function(){
			var _this = this;
			var keyword = window.localStorage.getItem('recipeSearch')?window.localStorage.getItem('recipeSearch'):'';
			if(keyword){
				_this.keyword = keyword;
				_this.search();
			}
	    },
	    methods:{
			search:function(){
				var _this = this;
				var key = '4334b0604e6114478d0c543ff1a5ade3';
				var url = 'https://way.jd.com/jisuapi/search?keyword='+_this.keyword+'&num='+num+'&appkey='+key;
				loading = weui.loading("加载中");
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
										_this.list = data.result.result.list;
									}
								}else{
									mui.alert('查询错误','提示','确定',null,'div');
								}
							}else{
								mui.alert(data.msg,'提示','确定',null,'div');
							}
						}else{
							mui.alert('查询错误','提示','确定',null,'div');
						}
						_this.$nextTick(function(){
							mui('#scrollWrapper').scroll({
								indicators:false,
								deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
							}).scrollTo(0,0,0);
							
							if(loading){
								loading.hide();
							}
						})
					},
					error:function(xhr, errorType, error,msg){
						if(loading){
							loading.hide();
						}
						mui.alert(msg,'提示','确定',null,'div');
					}
				})
			},
			showDetail:function(item){
				var _this = this;
				window.localStorage.setItem('recipe_name',item.name);
				window.localStorage.setItem('recipe_id',item.id);
				window.localStorage.setItem('recipeSearch',_this.keyword);
				window.location.href = 'recipeDetail.html';
			}
	    }
	});
});
