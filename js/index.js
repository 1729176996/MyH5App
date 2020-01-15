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
			if(getBrowser()!='电脑端'){
				// H5 plus事件处理
				function plusReady(){
					// 检查当前版本，与从后台获取的版本作比较，以此判断是否更新     
					plus.runtime.getProperty(plus.runtime.appid,function(inf){
						// 当前版本
						var wgtVersion = inf.version;
						mui.ajax("https://1729176996.github.io/MyH5App/update/config.json", {
							dataType: 'json',
							type: 'get',
							success:function(data){
								// 如果有新版本，则提示需要更新
								if( data.version > wgtVersion ){
									mui.confirm('检查更新','发现新版本，是否更新',['确定','取消'],function(e){
										if(e.index==0){
											downloadWgt(); // 下载wgt方法
										}else{
											return;
										}
									})
								}else{
									return;
								}
							},
							error:function(err){}
						});
					});
				}
				if(window.plus){
					plusReady();
				}else{
					document.addEventListener('plusready',plusReady,false);
				}
			}else{
				/*mui.ajax("https://1729176996.github.io/MyH5App/update/config.json", {
					dataType: 'json',
					type: 'get',
					success:function(data){
						console.log(data);
					},
					error:function(err){
						console.log(err);
					}
				});*/
				$.ajax({
					url:'https://1729176996.github.io/MyH5App/update/version.json',
					type:'get',
					dataType: 'json',
					success:function(data){
						console.log(data);
					},
					error:function(xhr, errorType, error,msg){
						mui.alert(msg,'提示','确定',null,'div');
					}
				})
			}
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
