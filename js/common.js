mui.init();
// H5 plus事件处理
function plusReady(){
	
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}