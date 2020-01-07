var mulu,content,loading;
$(function(){
    FastClick.attach(document.body);
	mulu = new Vue({
	    el: "#mulu",
	    data:{
			list:[]
	    },
	    mounted:function(){
	        this.init();
	    },
	    methods:{
			init:function(){
				var _this = this;
				var url = window.localStorage.getItem('href');
				if(!url){
					mui.alert('没有获取到正确的页面地址','提示','确定',function(){
						window.history.back();
					},'div');
					return;
				}
				loading = weui.loading("加载中");
				$.ajax({
					url:url,
					type:'GET',
					timeout:8000,
					success:function(data){
						
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
						if(_list.length>0){
							content.init(_list[0].href,0);
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
			look:function(item,index){
				content.init(item.href,index);
			},
			sub:function(){
				mui('.mui-off-canvas-wrap').offCanvas().close();
	        }
	    }
	});
    content = new Vue({
        el: "#content",
        data:{
			title:'',
			content:'',
			index:null
        },
        mounted:function(){
            var _this = this;
			
        },
        methods:{
			init:function(url,index){
				var _this = this;
				loading = weui.loading("加载中");
				$.ajax({
					url:url,
					type:'GET',
					timeout:8000,
					success:function(data){
						
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
			pre:function(){
				var _this = this;
				if(_this.index===0){
					mui.alert('已经是第一章了','提示','确定',null,'div');
					return;
				}
				_this.init(mulu.list[_this.index-1].href,_this.index-1);
			},
			next:function(){
				var _this = this;
				_this.init(mulu.list[_this.index+1].href,_this.index+1);
			},
			sub:function(){
				
            }
        }
    })
});
