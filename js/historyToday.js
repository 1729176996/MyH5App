var vm,loading;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			type:1,
			list:[]
	    },
	    mounted:function(){
			this.init(1);
	    },
	    methods:{
			init:function(type){
				var _this = this;
				_this.type = type;
				var key = 'feb592ad650f4f3c8d1c13bbfad1358f';
				var today = new Date();
				var url = 'http://api.avatardata.cn/HistoryToday/LookUp?key='+key+'&yue='+(today.getMonth()+1)+'&ri='+today.getDate()+'&type='+_this.type+'&page=1&rows=50';
				loading = weui.loading("加载中");
				$.ajax({
					url:url,
					type:'GET',
					dataType:'json',
					timeout:8000,
					success:function(data){
						console.log(data);
						if(data&&data.result&&data&&data.result.length>0){
							_this.list = data.result;
						}else{
							_this.list = [];
						}
						_this.$nextTick(function(){
							mui('#scrollWrapper').scroll({
								indicators:false,
								deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
							}).scrollTo(0,0,0);
							loading.hide();
						})
					},
					error:function(xhr, errorType, error,msg){
						mui.alert(msg,'提示','确定',null,'div');
						loading.hide();
					}
				})
			},
			toTop:function(){
				mui('#scrollWrapper').scroll({
					indicators:false,
					deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				}).scrollTo(0,0,100);
			},
			selectItem:function(item){
				
			}
	    }
	});
});
