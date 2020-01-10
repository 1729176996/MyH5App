var mulu,content,loading;
var readHistories = [];
$(function(){
    FastClick.attach(document.body);
	mulu = new Vue({
	    el: "#offCanvasSide",
	    data:{
			list:[],
			reading_index:null,
			name:'',
			infos:[],
			intros:[],
			cover:''
	    },
	    mounted:function(){
	        var _this = this;
			if(getBrowser()=='电脑端'){
				readHistories = window.localStorage.getItem('readHistories')?JSON.parse(window.localStorage.getItem('readHistories')):[];
				_this.init();
			}else{
				// H5 plus事件处理
				function plusReady(){
					createFile('readHistories.txt',function(msg){
						readFile('readHistories.txt',function(msg){
							readHistories = msg?JSON.parse(msg):[];
							_this.init();
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
			//初始化目录
			init:function(){
				var _this = this;
				var href = window.localStorage.getItem('href');
				var name = window.localStorage.getItem('name');
				if(!href){
					mui.alert('没有获取到正确的页面地址','提示','确定',function(){
						window.history.back();
					},'div');
					return;
				}
				loading = weui.loading("加载中");
				$.ajax({
					url:href,
					type:'GET',
					timeout:8000,
					success:function(data){
						
						_this.name = name;
						
						//包含有作者的片段
						var infoArr = data.match(/<div id="info">([\s\S]*?)<\/div>/);
						var info = infoArr&&(infoArr.length==2)?infoArr[0]:'';
						var infos = info.match(/<p>([\s\S]*?)<\/p>/g);
						for(key in infos){
							infos[key] = infos[key].replaceAll('href','xxx').replaceAll('onclick','yyyy').replaceAll('&nbsp;','');
						}
						_this.infos = infos;
						
						
						
						//包含有简介的片段
						var introArr = data.match(/<div id="intro">([\s\S]*?)<\/div>/);
						var intro = introArr&&(introArr.length==2)?introArr[1]:'';
						var intros = intro.match(/<p>([\s\S]*?)<\/p>/g);
						for(key in intros){
							intros[key] = intros[key].replaceAll('href','xxx').replaceAll('onclick','yyyy').replaceAll('&nbsp;','');
						}
						_this.intros = intros;
						
						var fmimgArr = data.match(/<div id="fmimg">([\s\S]*?)<\/div>/);
						var fmimg = fmimgArr&&(fmimgArr.length==2)?fmimgArr[1]:'';
						if(fmimg){
							var coverArr = fmimg.match(/src="([\s\S]*?)"/);
							var cover = coverArr&&(coverArr.length==2)?coverArr[1]:'';
							_this.cover = cover;
						}else{
							_this.cover = '';
						}
						
						var list = data.split(/<dd>([\s\S]*?)<\/dd>/);
						var _list = [];
						for(key in list){
							var arr = list[key].match(/<a href='([\s\S]*?)' >([\s\S]*?)<\/a>/);
							if(arr&&arr.length==3){
								var obj = {
									title:arr[2],
									href:'http://www.xbiquge.la'+arr[1]
								};
								_list.push(obj);
							}
						}
						_this.list = _list;
						
						var reading_index = 0;
						if(readHistories.length>0){
							for(key in readHistories){
								var obj = readHistories[key];
								if(obj.name == name&&obj.href == href){
									reading_index = obj.index;
									content.flag = true;
								}
							}
						}
						_this.reading_index = reading_index;
						if(_list.length>0){
							content.init(_list[reading_index].href,reading_index);
						}
						
						
						_this.$nextTick(function(){
							loading.hide();
							mui('#mulu').scroll({
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
			//阅读某一章
			look:function(item,index){
				var _this = this;
				_this.reading_index = index;
				content.init(item.href,index);
			}
	    }
	});
    content = new Vue({
        el: "#content",
        data:{
			name:'',
			title:'',
			content:'',
			index:null,
			flag:false
        },
        mounted:function(){
            
        },
        methods:{
			//初始化某一章
			init:function(url,index){
				var _this = this;
				loading = weui.loading("加载中");
				$.ajax({
					url:url,
					type:'GET',
					timeout:8000,
					success:function(data){
						_this.name = window.localStorage.getItem('name')?window.localStorage.getItem('name'):'';
						var titleArr = data.match(/<div class="bookname">([\s\S]*?)<h1>([\s\S]*?)<\/h1>/);
						var title = titleArr&&(titleArr.length==3)?titleArr[2]:'';
						_this.title = title;
						var contentArr = data.match(/<div id="content">([\s\S]*?)<\/div>/);
						var content = contentArr&&(contentArr.length==2)?contentArr[1]:'';
						_this.content = content;
						_this.index = index;
						_this.$nextTick(function(){
							loading.hide();
							mui('#contentWrapper').scroll({
								indicators:false,
								deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
							}).scrollTo(0,0,0);
							mui('.mui-off-canvas-wrap').offCanvas().close();
						})
					},
					error:function(xhr, errorType, error,msg){
						mui.alert(msg,'提示','确定',null,'div');
						loading.hide();
					}
				})
			},
			//上一章
			pre:function(){
				var _this = this;
				if(_this.index===0){
					mui.alert('已经是第一章了','提示','确定',null,'div');
					return;
				}
				_this.init(mulu.list[_this.index-1].href,_this.index-1);
			},
			//下一章
			next:function(){
				var _this = this;
				if(mulu.list&&mulu.list.length>0&&mulu.list.length==(_this.index+1)){
					mui.alert('已经是最后一章了','提示','确定',null,'div');
				}else{
					_this.init(mulu.list[_this.index+1].href,_this.index+1);
				}
			},
			//保存阅读进度
			save:function(){
				var _this = this;
				var name = window.localStorage.getItem('name')?window.localStorage.getItem('name'):'';
				var href = window.localStorage.getItem('href')?window.localStorage.getItem('href'):'';
				var flag = false;
				for(key in readHistories){
					var obj = readHistories[key];
					if(obj.name == name&&obj.href == href){
						obj.index = _this.index;
						obj.title = _this.title;
						flag = true;
					}
				}
				if(!flag){
					var readHistory = {
						name:name,
						href:href,
						index:_this.index,
						title:_this.title
					};
					readHistories.push(readHistory);
				}
				if(getBrowser()=='电脑端'){
					window.localStorage.setItem('readHistories',JSON.stringify(readHistories));
					_this.flag = true;
				}else{
					writeFile('readHistories.txt',JSON.stringify(readHistories),function(msg){
						//mui.alert('保存成功','提示','确定',null,'div');
						_this.flag = true;
					},function(msg){
						mui.alert('保存失败','提示','确定',null,'div');
					});
				}
			}
        }
    })
});
