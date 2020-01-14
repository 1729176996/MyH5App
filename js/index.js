var vm,loading;
$(function(){
    FastClick.attach(document.body);
	vm = new Vue({
	    el: "#main",
	    data:{
			list:[]
	    },
	    mounted:function(){
			this.init();
	    },
	    methods:{
			init:function(){
				var _this = this;
				_this.list = [
					{
						name:'小说',func:function(){
							window.localStorage.setItem('type','all');
							window.location.href = 'novel.html';
						}
					},
					{
						name:'历史上的今天',func:function(){
							window.location.href = 'historyToday.html';
						}
					},
					{
						name:'笑话',func:function(){
							window.location.href = 'joker.html';
						}
					}
				];
				_this.$nextTick(function(){
					mui('#scrollWrapper').scroll({
						indicators:false,
						deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
					}).scrollTo(0,0,0);
				})
			},
			toTop:function(){
				mui('#scrollWrapper').scroll({
					indicators:false,
					deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				}).scrollTo(0,0,100);
			},
			selectItem:function(item){
				if(item&&item.func){
					item.func();
				}
			}
	    }
	});
});
