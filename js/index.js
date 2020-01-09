var vm,loading;
var readHistories = [];
$(function(){
    FastClick.attach(document.body);
	scrollWrapper = new Vue({
	    el: "#main",
	    data:{
			list:[],
			readHistories:[],
			type:'all'
	    },
	    mounted:function(){
			var _this = this;
			if(getBrowser()=='电脑端'){
				readHistories = window.localStorage.getItem('readHistories')?JSON.parse(window.localStorage.getItem('readHistories')):[];
				var type = window.localStorage.getItem('type');
				if(type){
					_this.type = type;
					if(type=='all'){
						_this.toAll();
					}else{
						_this.toHistory();
					}
				}else{
					_this.type = 'all';
					window.localStorage.setItem('type','all');
					_this.toAll();
				}
			}else{
				// H5 plus事件处理
				function plusReady(){
					createFile('readHistories.txt',function(msg){
						readFile('readHistories.txt',function(msg){
							readHistories = msg?JSON.parse(msg):[];
							var type = window.localStorage.getItem('type');
							if(type){
								_this.type = type;
								if(type=='all'){
									_this.toAll();
								}else{
									_this.toHistory();
								}
							}else{
								_this.type = 'all';
								window.localStorage.setItem('type','all');
								_this.toAll();
							}
						},function(msg){})
					},function(msg){});
				}
				if(window.plus){
					plusReady();
				}else{
					document.addEventListener('plusready',plusReady,false);
				}
			}
	    },
	    methods:{
			init:function(){
				var _this = this;
				var url = 'http://www.xbiquge.la/xiaoshuodaquan/';
				loading = weui.loading("加载中");
				$.ajax({
					url:url,
					type:'GET',
					timeout:8000,
					success:function(data){
						
						var list = data.split(/<div class="novellist">([\s\S]*?)<div class="clear">/);
						var _list = [];
						for(key in list){
							var typeArr = list[key].match(/<h2>([\s\S]*?)<\/h2>/);
							var type = typeArr&&(typeArr.length==2)?typeArr[1]:'';
							if(type){
								var obj = {
									type:type,
									list:[]
								};
								var li_list = list[key].split(/<li>([\s\S]*?)<\/li>/);
								for(k in li_list){
									var arr = li_list[k].split(/<a href="([\s\S]*?)">([\s\S]*?)<\/a>/);
									if(arr&&arr.length==4){
										var o = {
											name:arr[2],
											href:arr[1]
										};
										obj.list.push(o);
									}
								}
								_list.push(obj)
							}
						}
						_this.list = _list;
						_this.$nextTick(function(){
							loading.hide();
							mui('#scrollWrapper').scroll({
								indicators:false,
								deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
							}).scrollTo(0,0,0);
						})
					},
					error:function(xhr, errorType, error,msg){
						mui.alert(msg,'提示','确定',null,'div');
						loading.hide();
					}
				})
			},
			look:function(item){
				window.localStorage.setItem('name',item.name);
				window.localStorage.setItem('href',item.href);
				window.location.href = 'read.html';
			},
			toTop:function(){
				mui('#scrollWrapper').scroll({
					indicators:false,
					deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				}).scrollTo(0,0,100);
			},
			toAll:function(){
				var _this = this;
				_this.type = 'all';
				window.localStorage.setItem('type','all');
				_this.init();
			},
			toHistory:function(){
				var _this = this;
				_this.type = 'history';
				window.localStorage.setItem('type','history');
				_this.readHistories = readHistories;
				_this.$nextTick(function(){
					mui('#scrollWrapper').scroll({
						indicators:false,
						deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
					}).scrollTo(0,0,0);
				})
			},
			deleteReadHistory:function(item){
				var _this = this;
				readHistories = readHistories.filter(function (obj) {
					return !(obj.name == item.name&&obj.href == item.href);
				});
				if(getBrowser()=='电脑端'){
					window.localStorage.setItem('readHistories',JSON.stringify(readHistories));
					location.reload(true);
				}else{
					writeFile('readHistories.txt',JSON.stringify(readHistories),function(msg){
						//mui.alert('保存成功','提示','确定',null,'div');
						location.reload(true);
					},function(msg){
						mui.alert('保存失败','提示','确定',null,'div');
					});
				}
			}
	    }
	});
});
