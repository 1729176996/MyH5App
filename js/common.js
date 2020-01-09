mui.init();
//读取文件
function readFile(fileName,successFunction,failFunction){
	//判断是否有5+内置的对象
	if(plus){
		//操作文件
		plus.io.resolveLocalFileSystemURL("_doc/"+fileName,function(entry){
			///读取文件
			entry.file(function(file){
				var fileReader = new plus.io.FileReader();
				fileReader.readAsText(file, 'utf-8');
				fileReader.onloadend = function(evt){
					//alert(evt.target.result);
					//console.log("内容:"+evt.target.result);
					successFunction(evt.target.result);
				}
			});
		
		},function(e){
			//console.log("文件不存在 ");
			failFunction('文件不存在');
		});
	}else{
		failFunction('不支持html5+');
	}
}
//写入文件
function writeFile(fileName,contentStr,successFunction,failFunction){
	//判断是否有5+内置的对象
	if(plus){
		//操作文件
		plus.io.resolveLocalFileSystemURL("_doc/"+fileName,function(entry){
			///写入新的内容
			entry.createWriter(function(writer){
				writer.write(contentStr);
				successFunction('写入成功');
			},function(e){
				failFunction('写入失败:'+e.message);
			});
		},function(e){
			//console.log("文件不存在 ");
			failFunction('文件不存在');
		});
	}else{
		failFunction('不支持html5+');
	}
}
//创建文件
function createFile(fileName,successFunction,failFunction){
	//判断是否有5+内置的对象
	if(plus){
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){
			//fs.root是根目录操作对象DirectoryEntry
			fs.root.getFile(fileName,{create:true},function(fileEntry){
				fileEntry.file( function(file){
					var fileReader = new plus.io.FileReader();
					fileReader.readAsText(file, 'utf-8');
					fileReader.onloadend = function(evt) {
						//alert(evt.target.result);
						//mui.alert('创建成功','提示','确定',null,'div');
						successFunction('创建成功');
					}
				} );
			});
		} );
	}else{
		failFunction('不支持html5+');
	}
}
//删除文件
function removeFile(fileName,successFunction,failFunction){
	//判断是否有5+内置的对象
	if(plus){
		//操作文件
		plus.io.resolveLocalFileSystemURL("_doc/"+fileName,function(entry){
			//删除文件
			entry.remove(function(entry){
				successFunction('删除成功');
			}, function(e){
				failFunction('删除失败:'+e.message);
			});
		},function(e){
			//console.log("文件不存在 ");
			failFunction('文件不存在');
		});
	}else{
		failFunction('不支持html5+');
	}
}

//获取浏览器所在端
function getBrowser(){
	function IsPC(){
		var userAgentInfo = navigator.userAgent;
		var Agents = new Array("Android","iPhone","SymbianOS","Windows Phone","iPad", "iPod");  
		var flag = true;
		for(var v = 0;v<Agents.length; v++){
			if(userAgentInfo.indexOf(Agents[v]) > 0){
				flag = false; break;
			}
		}
		return flag;
	}
	var browser = '';
	if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
		//苹果端
		browser = '苹果端';
	}else if(/(Android)/i.test(navigator.userAgent)){
		//安卓端
		browser = '安卓端';
	}else{
		//PC端
		browser = '电脑端';
	};
	return browser;
}