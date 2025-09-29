//this function is to allow to use 
function getTvShowName()
{
	var thisMenuFile = new File ($.fileName);
	//alert(thisMenuFile.parent.absoluteURI.indexOf("o/000_TOOLS") > -1)

	if((thisMenuFile.parent.absoluteURI.indexOf("TV_SHOW_NUMERO_1") > -1) && (thisMenuFile.parent.absoluteURI.indexOf("s/TOOLS") > -1)){
		return "TV_SHOW_NUMERO_1";
		}
	else if (thisMenuFile.parent.absoluteURI.indexOf("TV_SHOW_NUMERO_2") > -1){
		return "TV_SHOW_NUMERO_2";
		}
	else {
		return "TV_SHOW_NUMERO_1";
		}	
}//end of function getTvShowName();

var tvShowName = getTvShowName();