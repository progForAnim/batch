//this function is is to get all folders that can be found for each one of the folders in a folders array.
function findFoldersFromthisArray(thisArray) {
    var thisArr = [];
	for (var i = 0; i < thisArray.length ; i ++) {
		var thisObj = thisArray[i];
		if (thisObj.exists && thisObj instanceof Folder) {
			thisArr.push(thisObj);
			}
		else {
			var newObj = new Folder (thisObj);
			if (newObj.exists && thisObj instanceof Folder) {
				thisArr.push(newObj);
				}
			}
		}
    return thisArr;
}// end function findLayerSets(layers)




//this function is is to get only certain subfolders within an array of folders
function findFoldersFromFoldersArray(thisArray) {
    //alert('findFoldersFromFoldersArray is running')
	var foundFolders = [];
    var emptArr = []

	var maybeFoundFolders = []

    if (thisArray.length > 0) {
		for (var j = 0 ; j <  thisArray.length ; j ++) {
			var xstageCounter = 0
			var thisF = thisArray[j];
			thisF.getFiles(function(f) {
				if ( f instanceof File && f.name.match(/.xstage/gi)) {
					xstageCounter ++ ;
					}
				else if ( f instanceof Folder && xstageCounter === 0) {
					foundFolders.push(f) ;
					}
				else if ( f instanceof Folder && xstageCounter > 0) {
					if (f.name === 'frames') {
						foundFolders = [] ;
						foundFolders.push(f) ;
						return foundFolders ;
						}
					}
				});
			}
		}
	//alert('findFoldersFromFoldersArray was running')
	return foundFolders;
}// end findFoldersFromFoldersArray(thisArray)




//this function is to get all folders and subfolders, from an array of folders. Currently it looks for maximum 12 levels of subfolders.
function getAllFolders(thisArray) {
	var emptyArray = [];
	var allFoldersBasis, allFolders_01,allFolders_02,allFolders_03,allFolders_04,allFolders_05,allFolders_06,allFolders_07,allFolders_08,allFolders_09,allFolders_10 = [];
	var allFoldersBasis = findFoldersFromthisArray(thisArray);
	var allFolders_01 = emptyArray.concat(findFoldersFromFoldersArray(allFoldersBasis));
	if (allFolders_01.length > 0) {
		var allFolders_02 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_01));
		if (allFolders_02.length > 0) {
			var allFolders_03 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_02))
			if (allFolders_03.length > 0) {
				var allFolders_04 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_03))
				if (allFolders_04.length > 0) {
					var allFolders_05 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_04))
					if (allFolders_05.length > 0) {
						var allFolders_06 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_05))
						if (allFolders_06.length > 0) {
							var allFolders_07 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_06))
							if (allFolders_06.length > 0) {
								var allFolders_08 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_07))
								if (allFolders_08.length > 0) {
									var allFolders_09 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_08))
									if (allFolders_09.length > 0) {
										var allFolders_10 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_09))
										if (allFolders_10.length > 0) {
										var allFolders_11 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_10))
											if (allFolders_11.length > 0) {
											var allFolders_12 = emptyArray.concat(findFoldersFromFoldersArray(allFolders_11))
												if (allFolders_12.length > 0) {
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

	 var allFolders_allLevels = emptyArray.concat(allFoldersBasis, allFolders_01,allFolders_02,allFolders_03,allFolders_04,allFolders_05,allFolders_06,allFolders_07,allFolders_08,allFolders_09,allFolders_10);
	for(var i =  allFolders_allLevels.length -1; i >= 0 ; i --) {
		if (allFolders_allLevels[i] === undefined) {
			allFolders_allLevels.pop() ;
			}
		}
//alert ('getAllFolders was running  : ' + allFolders_allLevels.toString());
return allFolders_allLevels
}// end function getAllFolders