var vm,loading;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			types:[]
	    },
	    mounted:function(){
			this.init();
	    },
	    methods:{
			init:function(){
				var _this = this;
				var key = '4334b0604e6114478d0c543ff1a5ade3';
				var url = 'https://way.jd.com/jisuapi/recipe_class?appkey='+key;
				$.ajax({
					url:url,
					type:'GET',
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						if(data){
							if(data.code == "10000"){
								if(data.result&&data.result.result&&data.result.result.length>0){
									_this.types = data.result.result;
								}else{
									_this.types = [];
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
						})
					},
					error:function(xhr, errorType, error,msg){
						mui.alert(msg,'提示','确定',null,'div');
					}
				});
			},
			toTop:function(){
				mui('#scrollWrapper').scroll({
					indicators:false,
					deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				}).scrollTo(0,0,100);
			},
			recipeByClass:function(itm){
				window.localStorage.setItem('recipeClass',JSON.stringify(itm));
				window.location.href = 'recipeByClass.html';
			}
	    }
	});
});
