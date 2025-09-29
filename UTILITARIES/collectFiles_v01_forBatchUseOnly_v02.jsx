app.beginUndoGroup('checkFootageSources');
/*
GOAL OF THIS SCRIPT :  BE ABLE TO DETECT SOME ISSUES IN AN ALREADY OPENED AFTER AFTER PROJECT.
ISSUES DETECTED:
- FOOTAGE "UNPROPERLY LOCATED' (which means, not located in the '(Footage)' Folder near the project's file);
- BROKEN LINKS (Missing files)
- THERE IS NO FOOTAGE FOLDER 
    
-----------------SUMMARY -----------------
//PART 0: DECLARING SOME VARIABLES

PART 1: BEFORE CHECKING THE BADLY LOCATED FUNCTIONS,THESE FUNCTIONS ARE CALLED BY MOTHER FUNCTION :
	-	getInArr01_allBrokenLinks() :
		//this function gets the info about any footage broken source link

	-	isAbsentFootageFolder() : 
		//returns False if there is a 'footage' folder in same directory as the currently opened .aep file, and True is footage folder is absent

	-	function getFootageFolder()
		//Gets info about footage folder, either by finding it if exists or whether by creating one


PART 2: MOTHER FUNCTION, THE ONE THATS IS CALLED FROM OTHER .JSX FILES
-	function getCollectMsg(booleanRepair,booleanGetFullInfo):
	//THIS ONE IS THE 'MOTHER FUNCTION' THAT WILL HANDLE THE REST OF THEM:


PART 3: FUNCTIONS THAT GET THE INFO ABOUT BADLY LOCATED FOOTAGES, AND TURN IT INTO A READABLE MESSAGE
-	function checkFtgSources():
	//One of the key functions, is used to get the info about badly located footage sources;

-	getR_checkFtgSources():
	//Makes out of checkFtgSources() info a readable text (in the form of an array)

-	resultCheckMsg():
	//adds final touch to get a text based on what getR_checkFtgSources() returns

-	doShortTextCheck(longCheckText):
	//will be used for a button to reformulate in shorter form a text


PART 4: MAKE BACK-UP COPY OF THE CURRENTLY OPENED AEP FILE BEFORE MODIFYING IT
-	function getOldFolder():
	//Find (if needed creates) an 'old' folder in same directory as the currently opened After project
	
-	function createFileBackUp():
	//create a backUp in the Old Folder 


PART 5: FUNCTIONS THAT PROCESS THE FOOTAGE COPY...REPLACE
-	function DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb):
	//one of the key functions here, manages some other function to process the 'copy and replace' stuff for all unproperly located footage sources

-	function copyToFootageFolder(itemName, itemFullPath , item):
	// Is used at some point by DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb)
				
-	function customReplace(ftgToReplace, replaceLink, importOrNot):
	// Is used at some point by DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb)
		
-	function DO_CLEAN_ON_BG_ITEMS(), also function DO_CLEAN_ON_BG_ITEMS_SMALL():
	//ONE OF THE TWO FUNCTIONS TO CLEAN UP MESS AFTER HANDLING A .PSD LAYER THAT WAS IMPORTED AS COMPOSITION-
						
-	getAllFootagesInFtgFolder():
	gets the info about all the files existing in the footage folder in explorer.

-	getMsg_checkIf_existsInFtgFolder(thisItem):
	Compares a source footage to all the files in footage folder, on these points : file name and size.

----------------- END OF SUMMARY -----------------
*/





//----------------PART 0: DECLARING SOME VARIABLES----------------

//the following include is to allow us to use the function getAllFolders(thisArray):
#include 'getInArrayAllFolderObjs_v03.jsx'

//Some simple variables about the project itself that will be used to reach the project containing folder, the files / folders around it...
var myFile = app.project.file;
var myFolder = myFile.parent;
var projectFolder = app.project.rootFolder;

//important variable, checkedFtgSources will store the info about the 'unproperly located' footage sources
var checkedFtgSources = checkFtgSources();
var checkedFtgSources_itemsArr =  checkedFtgSources[2];

/*get the info about all the files existing in the footage folder in explorer.
Will be used to know if a file has already been copied in footage folder and should not be copied again.
*/
var allFootagesInFtgFolder = getAllFootagesInFtgFolder();
var allFootagesinFtgF_names = allFootagesInFtgFolder[0];
var allFootagesinFtgF_links = allFootagesInFtgFolder[1];
var allFootagesinFtgF_fileSizes = allFootagesInFtgFolder[2];

//On a production i was working on, some folders within after project were there on a regular basis; could be used for some item managmeent.
var fxFolder, animFolder, movFolder, bgFolder, compsFolder, fileNameComp, threeDFolder, myPreciseComp;//  = null;
var projectFolderNumItems = projectFolder.items.length
for (var i = 1; i <= projectFolderNumItems; i++) {  // Start index at 1, continue <= length
	var item = projectFolder.items[i];  // Access directly, no need to adjust index
	
	if (item instanceof FolderItem) {
		if ((item.name.indexOf('_FX')>0)||(item.name === '4_Fx')) {
			fxFolder = item;
			}
		else if ((item.name.indexOf('_ANIM')>0)||(item.name.indexOf('7_ani')>0)) {
		   animFolder = item;
			}
		else if (item.name.indexOf('_MOV')>0) {
			movFolder = item;
			}
		else if ((item.name === '02_BG')||(item.name === '1_bg')) {
			bgFolder = item;
			}
		else if ((item.name.indexOf('_COMP')>0)||(item.name === '5_comp')) {
			compsFolder = item;
			}
		else if (item.name === '04_3D') {
			threeDFolder = item;
			}
		}
	else if (item instanceof CompItem) {
		if (item.layers.length === 3) {
			if (item.layers[1].name === 'BruitNoTrame') {
				myPreciseComp = item;
				}
			}
		}			
	}//end of for loop to get some predefined folders

if ( !animFolder || !bgFolder || !fxFolder || !threeDFolder || !movFolder || !compsFolder || !myPreciseComp ) {
	// alert('The folders '01_ANIM', '02_BG', '03_FX', '04_3D', '05_MOV', '06_COMP', et la compo finale doivent exister dans le projet.');
	}



//----------------------------------------------------------------------------------------------------
// PART 1: BEFORE CHECKING THE BADLY LOCATED FUNCTIONS,THESE FUNCTIONS ARE CALLED BY MOTHER FUNCTION :

//this function gets the info about any footage broken source link
function getInArr01_allBrokenLinks() {
	//alert('getInArr01_allBrokenLinks() is running');
	var r_itemNames =[];
	var r_itemFileSources =[];
	var r_items =[];
	var r_chosenRepairingLink =[];
	var resultTemp = [r_itemNames,r_itemFileSources, r_items]

	var projectNumItems = app.project.numItems;
	for (var i = 1; i <= projectNumItems ; i ++) // app.project.numItems
	{
		var thisItem = app.project.item(i);
		if (thisItem.hasOwnProperty('mainSource')) {
			if (thisItem.mainSource.hasOwnProperty('file')) {
				if (thisItem.footageMissing === true) {
					r_itemNames.push(thisItem.name);
					r_itemFileSources.push(thisItem.mainSource.file.absoluteURI);
					r_items.push(thisItem);
				}
			}
		}
	}

	//alert('getInArr01_allBrokenLinks() was running');
	return resultTemp;
}//end of function getInArr01_allBrokenLinks()



//returns False if there is a 'footage' folder in same directory as the currently opened .aep file, and True is footage folder is absent
function isAbsentFootageFolder() {
	//alert('isAbsentFootageFolder is running);
	var folderArrInMyFolder = [];
	var folderObj = new Folder(myFolder.absoluteURI);
	var folderFiles = folderObj.getFiles(function(file) {
		return file instanceof Folder;
	});
	
	var folderFilesLength = folderFiles.length;
	for (var i = 0; i < folderFilesLength; i++) {
		var folderName = folderFiles[i].name;
		
		if ((folderName === '(Footage)') || (folderName === '(Metrage)')) {		
			folderArrInMyFolder.push(folderFiles[i]);
			break;
			}
	}
	
	if (folderArrInMyFolder.length === 0) { // WHICH MEANS : if no footage Folder was found
		return [true, null];
		}
	
	else {  // WHICH MEANS : if surprisingly a footage Folder was found
		return [false, folderArrInMyFolder[0]];
		}
	//alert('isAbsentFootageFolder was running);
}	


//Gets info about footage folder, either by finding it if exists or whether by creating one
function getFootageFolder() {
	//alert('getFootageFolder is running')
	var newFootageFolder_01 = myFolder.absoluteURI + '/' + '(Footage)';
	var newFootageFolder_02 = new Folder (newFootageFolder_01);
	if (newFootageFolder_02.exists) {
		return newFootageFolder_02;
		}
	else {
		newFootageFolder_02.create();
		return newFootageFolder_02;
		}
	//alert('getFootageFolder was running')
} //end function getFootageFolder





//----------------------------------------------------------------------------------------------------
//PART 2: MOTHER FUNCTION, THE ONE THATS IS CALLED FROM OTHER .JSX FILES

//THIS ONE IS THE 'MOTHER FUNCTION' THAT WILL HANDLE THE REST OF THEM:
function getCollectMsg(booleanRepair,booleanGetFullInfo) {
	//alert('getCollectMsg() function is running');
	var thisBoolean = false;
	var msg ='';
		
	const brokenLinksNb = getInArr01_allBrokenLinks()[0].length;
	if (brokenLinksNb > 0) {
		msg = 'ERROR : No \'collect Files/check sources\' was done because ' + getInArr01_allBrokenLinks()[0].length + ' footage(s) was(were) missing: ';
		thisBoolean = false;
		}

	else if (brokenLinksNb === 0) {
		const badFootNb = checkFtgSources()[0].length
			thisBoolean = true;
			var applyLine =  'The \'Collect Files\' script was applied. ';
			msg += applyLine;
			if (isAbsentFootageFolder()[0] === false) {
				if (badFootNb === 0) {
					thisBoolean = false;
					msg =' Good news ! No footage was located out of \'Footage Folder\'(so no action was to be done here);'
					}
				else if (badFootNb > 0) {
					thisBoolean = true;
					if (booleanGetFullInfo === false) {
						msg = badFootNb + ' items located out of \'Footage Folder\'.';
						}
					var footageF_fullPath = getFootageFolder().absoluteURI + '/';
					if (booleanRepair) {
						createFileBackUp();
						DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb);
						DO_CLEAN_ON_BG_ITEMS();
						DO_CLEAN_ON_BG_ITEMS_SMALL();
						const badFootNb_after = checkFtgSources()[0].length;
						if (badFootNb_after === 0) {
							msg += '...Good!';
							}
						msg += ' After use of script, ' +  badFootNb_after + ' items were located out of it.';
						}
					else if (booleanRepair === false) {
						if (booleanGetFullInfo) {
							const firstCheckResult = String(resultCheckMsg('before',[],true));
							msg = msg.replace(applyLine,'');
							msg+= '\n';
							msg+= firstCheckResult;
							var longerVersion = msg;
							
							//
							var checkWin = new Window('palette', 'checkWinName', undefined);
							checkWin.orientation = 'column';
							var ET04a = checkWin.add('edittext', [10, 40, 450, 540], msg, { multiline: true });
							var groupOne = checkWin.add('group', undefined, 'groupOneNameTest');
							groupOne.orientation = 'row';
							var BT01 = groupOne.add('button', undefined, 'Short text');
							var BT02 = groupOne.add('button', undefined, 'Long text');
							var BT03 = groupOne.add('button', undefined, 'Close');
							BT01.onClick = function() { //This function is to reformulate text in shorter version						
								var reformulatedText = 'FOOTAGE SOURCE CHECK:\n\n' +  badFootNb + ' item(s) have their source outside of \'Footage\' folder :';
								reformulatedText += doShortTextCheck(msg);
								ET04a.text = reformulatedText;
								}
							BT02.onClick = function() { //This function is to reformulate text in longer version
								if (ET04a.text.length != longerVersion.length) {
									ET04a.text = longerVersion;
									}								
								}
							BT03.onClick = function() { //This function will describe how to close the function				
								checkWin.close()
								}
							checkWin.center();
							checkWin.show()
						}
					}
						} // end else if (badFootNb > 0) { so end of situation if there is at least one footage unproperly located
				}//end of situation(isAbsentFootageFolder()[0] === false)

			else if (isAbsentFootageFolder()[0] === true) {
				thisBoolean = true;
				if (booleanRepair) {
					msg = ' No \'Footage\' folder found! so \'footage\' folder was created, and all sources were collected in it.'
					var footageF_fullPath = getFootageFolder().absoluteURI + '/';
					createFileBackUp();
					DO_fileCopy_AND_REPLACE_AND_DELETE();
					DO_CLEAN_ON_BG_ITEMS();
					}
				else if (booleanRepair === false) {
					msg = ' No \'Footage\' folder found! so \'footage\' folder was created, so ALL sources badly located.'
					}
				}//end of situation if isAbsentFootageFolder()[0] === true
		}//end of situation if there is no footage broken link
//alert('getCollectMsg() function was running:' + String([thisBoolean, msg]));
return [thisBoolean, msg]
} //end of function getCollectMsg()





//-----------------------------------------------------------------------------------------------------
//PART 3: FUNCTIONS THAT GET THE INFO ABOUT BADLY LOCATED FOOTAGES, AND TURN IT INTO A READABLE MESSAGE
//One of the key functions, is used to get the info about badly located footage sources;
function checkFtgSources() {
	//alert('checkFtgSources is running')
	var theFolderName = getFootageFolder();
	var r_itemNames =[];
	var r_itemFileSources =[];
	var r_items =[];
	var r_goodItems =[];
	var resultTemp = [r_itemNames,r_itemFileSources, r_items, r_goodItems];
	
	var projectNumItems = app.project.numItems;
	for (var i = 1; i <= projectNumItems ; i ++) { // app.project.numItems
		var thisItem = app.project.item(i);
		if (thisItem.hasOwnProperty('mainSource')) {
			if (thisItem.mainSource.hasOwnProperty('file')) {
				if (thisItem.mainSource.file.absoluteURI.indexOf(theFolderName.toString()) === -1) {        
					var nameAndURI = thisItem.name + '\n\nnameAndURI  = ' + String(thisItem.mainSource.file.absoluteURI);
					r_itemNames.push(thisItem.name);
					r_itemFileSources.push(thisItem.mainSource.file.absoluteURI);
					r_items.push(thisItem);		
					}		
				}
			}
	}
	return resultTemp;
	//alert('checkFtgSources was running')
}//end of function checkFtgSources()




//Makes out of checkFtgSources() info a readable text (in the form of an array)
function getR_checkFtgSources() {
    //alert('getR_checkFtgSources ALERT 00 : is running');
    var counter = 0;
	var sep01 = '\n';
	var sep02 = '\n\n';
	var counter02;
	var r_checkFtgSources = [];

	var checkFtgSourcesLength = checkFtgSources()[0].length;
	for (var z = 0; z < checkFtgSourcesLength; z ++) {
		counter ++;
		var counter02;
			if (counter < 10) {
				counter02 = '0' + counter;
				}
			else if (counter > 9) {
				counter02 = counter;
				}

		r_checkFtgSources.push('n°' + counter02);
		r_checkFtgSources.push(sep01);
		r_checkFtgSources.push('- Name : ' + checkFtgSources()[0][z]+ ';');
		r_checkFtgSources.push(sep01);
		r_checkFtgSources.push('- Found source : ' + sep01 + decodeURI(checkFtgSources()[1][z])+ ';');
		r_checkFtgSources.push(sep02);	 
	}//end loop for z...
	//alert('getR_checkFtgSources ALERT 00 : was running');
	return r_checkFtgSources;
}//end function getR_checkFtgSources


//adds final touch to get a text based on what getR_checkFtgSources() returns
function resultCheckMsg (beforeOrAfter, checkMessage, introOrNot) {
	//alert('resultCheckMsg function is running')
	var checkMessage = getR_checkFtgSources();
	var resultProgram = '';
	if (introOrNot) {
		resultProgram += 'FOOTAGE SOURCE CHECK: ';
		}
	resultProgram += ' : \n\
' + checkFtgSources()[0].length +' item(s) have their source outside of \'Footage\' folder : \n\
' + checkMessage.join('');
	//alert('resultCheckMsg function was running')
	return resultProgram;
}//end function resultCheckMsg


//will be used for a button to reformulate in shorter form a text
function doShortTextCheck(longCheckText) {
	//alert('doShortTextCheck function is running'):
	var shortCheckArr = longCheckText.split(/\n/gi);
	var itemObjArr = [];
	var itemNameArr = [];
	var itemSourceArr = [];

	for (var y = 0; y < shortCheckArr.length; y ++) {
		var thisBit = shortCheckArr[y];
		var nextBit = shortCheckArr[y+1];
			if (thisBit.indexOf('Found source') > -1) {
				itemSourceArr.push(nextBit);
				}
		}

	var itemSourceArr = itemSourceArr.sort();
	var seenSources = [[],[]];
	
	var itemSourceArrLength = itemSourceArr.length;
	for (var v = 0; v < itemSourceArrLength; v ++) {
		var thisBit = itemSourceArr[v]
		if (v>0) {
			var prevBit = itemSourceArr[v-1];
			if (itemObjArr.length === 0) {
				var thisObj = {};
				thisObj.source = prevBit;
				thisObj.number = 1;
				itemObjArr.push(thisObj); 
				}
				var itemObjArrLength = itemObjArr.length;
				for (var x = itemObjArrLength -1; x >= 0  ; x --) {
					if (itemObjArr[x].source === thisBit) {
						itemObjArr[x].number ++;
						break;
						}
					if (x === 0) {
						var thisObj = {};
						thisObj.source = thisBit;
						thisObj.number = 1
						itemObjArr.push(thisObj);
						}
				}//end for loop x
			} //end if v>0;
		}//end for loop v;

	var shortCheckText = '\n';
	itemObjArr.sort(function(a, b) {return b.number - a.number}); 

	var itemObjArrLength = itemObjArr.length;
	for (var x = 0; x <  itemObjArrLength; x ++) {
		var thisItem = itemObjArr[x];
		if (itemObjArr[x].number === 1) {
			shortCheckText += '-> ' + itemObjArr[x].number + ' ITEM\'s source :\n' + itemObjArr[x].source;  
			}
		if (itemObjArr[x].number > 1) {
			shortCheckText += '-> ' + itemObjArr[x].number + ' ITEMS\'s source :\n' + itemObjArr[x].source;
			}
		if (x < itemObjArr.length-1 ) {
			shortCheckText += '\n\n' ;              
			}                                      
		}//end for loop
//alert('doShortTextCheck function was running'):
return shortCheckText;
}//end function doShortTextCheck





//-----------------------------------------------------------------------------------------------------
//PART 4: MAKE BACK-UP COPY OF THE CURRENTLY OPENED AEP FILE BEFORE MODIFYING IT
//Find (if needed creates) an 'old' folder in same directory as the currently opened After project
function getOldFolder() {
	//alert('getOldFolder is running')
	var folderArrInMyFolder = [];
	var folderObj = Folder(myFolder.absoluteURI);
	var folderFiles = folderObj.getFiles(function(file) {
		return file instanceof Folder;
	});

	var folderFilesLength = folderFiles.length;
	for (var i = 0; i < folderFilesLength; i++) {
		var folderName = folderFiles[i].name;				
		if (folderName.match(/old/i)) {
			folderArrInMyFolder.push(folderFiles[i]);
			}
	}
	if (folderArrInMyFolder.length === 0) {
		var newOldFolder_01 = myFolder.absoluteURI + '/' + '_old';
		var newOldFolder_02 = new Folder (newOldFolder_01);
		newOldFolder_02.create();
		return newOldFolder_02;
	} 	
		
else {
	return folderArrInMyFolder[0];
	}	
	//alert('getOldFolder was running')
}//end function getOldFolder



//create a backUp in the Old Folder 
function createFileBackUp() {
	//alert ('function createFileBackUp() is running : ' + oldFolder.absoluteURI);	
	var oldFolder = getOldFolder();	
	var futureBackUpCoordinates_01 = oldFolder.absoluteURI + '/' + myFile.name.slice(0, myFile.name.length - 4 ) + ' copy_01' + '.aep';
	var futureBackUpCoordinates_02 = oldFolder.absoluteURI + '/' + myFile.name.slice(0, myFile.name.length - 4 ) + ' copy_02' + '.aep';
	var futureBackUpCoordinates_03 = oldFolder.absoluteURI + '/' + myFile.name.slice(0, myFile.name.length - 4 ) + ' copy_03' + '.aep';
	var futureBackUpCoordinates_04 = oldFolder.absoluteURI + '/' + myFile.name.slice(0, myFile.name.length - 4 ) + ' copy_04' + '.aep';

	if (new File(futureBackUpCoordinates_01).exists) {
		if (new File(futureBackUpCoordinates_01).length === app.project.file.length) {
			//alert ('a same-size copy already exists');
			}

		else if (new File(futureBackUpCoordinates_01).length != app.project.file.length) {
			if (new File(futureBackUpCoordinates_02).exists) {		
				if (new File(futureBackUpCoordinates_03).exists) {					
					if (new File(futureBackUpCoordinates_04).exists) {
						var copiedFile = myFile.copy(futureBackUpCoordinates_01);	
						}
					
					else if (new File(futureBackUpCoordinates_04).exists === false) {
						var copiedFile = myFile.copy(futureBackUpCoordinates_04);
						}
					}
				
				else if (new File(futureBackUpCoordinates_03).exists === false) {
					var copiedFile = myFile.copy(futureBackUpCoordinates_03);
					}
			}			
			else if (new File(futureBackUpCoordinates_02).exists === false) {
				var copiedFile = myFile.copy(futureBackUpCoordinates_02);
				}

			var copiedFile = myFile.copy(futureBackUpCoordinates_01);
			}
		}

	else if (new File(futureBackUpCoordinates_01).exists === false) {
		var copiedFile = myFile.copy(futureBackUpCoordinates_01);
		}
	//alert ('function createFileBackUp() was running');
}//end of function createFileBackUp





//-----------------------------------------------------------------------------------------------------
//PART 5: FUNCTIONS THAT PROCESS THE FOOTAGE COPY...REPLACE

//one of the key functions here, manages some other function to process the 'copy and replace' stuff for all unproperly located footage sources
function DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb) {
	//alert('DO_fileCopy_AND_REPLACE_AND_DELETE() is running')
	var copiedFiles =[['//pushedCopyOneFile     : '],['//pushedY     : '], ['replaceLink     : ']];
	var ftgToRemove =[];

	for (var y = badFootNb-1; y >= 0 ; y --) {
		var msgIfExistsInFtgFolder = getMsg_checkIf_existsInFtgFolder(checkedFtgSources_itemsArr[y]);
		if (msgIfExistsInFtgFolder[0] === true) {
			ftgToRemove.push(customReplace(msgIfExistsInFtgFolder[1], msgIfExistsInFtgFolder[2], false));
			}
		else if (msgIfExistsInFtgFolder[0] === false) {
			var isCopyNeeded = true;

			//This following paragraph is to avoid to import for each .psd layer another time the whole psdFile
			var copiedFilesLength = copiedFiles[0].length;
			if (copiedFilesLength > 1) {
				for (var x = 1; x < copiedFilesLength.length ; x ++) {
					if  (copiedFiles[0][x].indexOf(checkedFtgSources_itemsArr[y].mainSource.file.name) > -1 ) {
						isCopyNeeded = false;
						break;
						}
					}
				}
	
			if (isCopyNeeded === true) {
				//START THIS PROCESS : COPY THE FOOTAGE FILE IN EXPLORER + DURING THAT, GET THE LINK OF COPIED FILE LOCATION + + REPLACE SOURCE + ADD THE FORMER PSD LAYER IN THE 'to delete' LIST
				var copyOneFile = copyToFootageFolder(checkedFtgSources[0][y], checkedFtgSources[1][y], checkedFtgSources_itemsArr[y]);
				copiedFiles[0].push(String(copyOneFile)); 
				copiedFiles[1].push(y); 
				var replaceLink = new File (copyOneFile);
				ftgToRemove.push(customReplace(checkedFtgSources_itemsArr[y], replaceLink, true));
				}
		
			else if (isCopyNeeded === false) {
				//START THIS PROCESS : GET THE LINK OF COPIED FILE LOCATION + REPLACE SOURCE + ADD THE FORMER PSD LAYER IN THE 'to delete' LIST
				var replaceLink = new File (copiedFiles[0][x]);
				ftgToRemove.push(customReplace(checkedFtgSources_itemsArr[y], replaceLink,false));
				}

			} //end (getMsg_checkIf_existsInFtgFolder(thisItem) === false)
}

// PROCESS TO DELETION OF ITEMS IF NEEDED
var ftgToRemoveLenght = ftgToRemove.length;
for (var i = 0; i < ftgToRemoveLenght; i ++) { // DEBUT DE SUPPR LES ITEMS
	if (ftgToRemove[i] != null) {
	ftgToRemove[i].remove();
	}
}

}//END FUNCTION DO_fileCopy_AND_REPLACE_AND_DELETE()



// Is used at some point by DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb)
function copyToFootageFolder(itemName, itemFullPath , item) {
    //alert('1 copyToFootageFolder item is running 00 : itemName : ' + itemName);
    //alert('1 copyToFootageFolder item is running 00 : itemFullPath : ' + itemFullPath);
    //alert('1 copyToFootageFolder item is running 00 : item: ' + item.toString());
	var footageF_fullPath = getFootageFolder().absoluteURI + '/';
	var fileWronglyLocated02 = new File(itemFullPath);
	var myFile = app.project.file;
	var itemName02;

	if (itemName.indexOf('.psd') > -1) {
		itemName02 = item.mainSource.file.name ;
		var copyToFootageFolderResult = footageF_fullPath + itemName02 ;
		}
	
	else if ((itemName.indexOf('[') > -1) && (itemName.indexOf(']') > -1) ) { //this paragraph is to handle any image sequence				
		var replaceLinkFolder = item.mainSource.file.path;
		var folder = new Folder(replaceLinkFolder);
			if (folder.exists) {
				var createdFolder = new Folder(footageF_fullPath + folder.name)
				createdFolder.create();
				var files = folder.getFiles();
        
				var filesLength = files.length
				for (var i = 0; i <  filesLength; i++) {
					var thisFile = new File (String(files[i]));
					var copyDestination = createdFolder.absoluteURI + '/' + thisFile.name;
					var copiedFile = thisFile.copy(copyDestination);
					}
				}    		
			itemName02 = item.mainSource.file.name;
			var copyToFootageFolderResult = createdFolder.absoluteURI +'/'+ itemName02;
		}

	else {
		itemName02 = item.mainSource.file.name;
		var copyToFootageFolderResult = footageF_fullPath + itemName02;
		}
	
	fileWronglyLocated02.copy(copyToFootageFolderResult); // TEMP. DISABLED
//alert('1 copyToFootageFolder item was running 10 : itemFullPath : ' + itemFullPath);
return copyToFootageFolderResult;
} // end of function copyToFootageFolder()



// Is used at some point by DO_fileCopy_AND_REPLACE_AND_DELETE(badFootNb)
function customReplace(ftgToReplace, replaceLink, importOrNot) { //START OF FUNCTION customReplace
	//alert('customReplace is running 00: ' + 'ftgToReplace : ' + ftgToReplace.name.toString())
	var ftgToRemove_inside = null;
	var FILE_OBJ_FROM_REPLACE_LINK = new File (replaceLink);

	if (FILE_OBJ_FROM_REPLACE_LINK.exists) {
		if (ftgToReplace.name.indexOf('.psd') > -1 && ftgToReplace.name.indexOf('/') === -1) {
			ftgToReplace.replace(FILE_OBJ_FROM_REPLACE_LINK);
			return null;
			}
		else if (ftgToReplace.name.indexOf('.psd') > -1 && ftgToReplace.name.indexOf('/') >-1) {
			var goOnBool = true;
			var thisItemInImportedBG = null;
			var projNumItems = app.project.numItems;
			for (var t = 1; t <= projNumItems; t ++) {
				var thisItemInProj =app.project.item(t)
				if (thisItemInProj.hasOwnProperty('mainSource')) {
					if (thisItemInProj.mainSource.hasOwnProperty('file')) {
						if ((thisItemInProj != ftgToReplace) && (thisItemInProj.mainSource.file.name === ftgToReplace.mainSource.file.name)) {
							if (thisItemInProj.mainSource.file.length ===  ftgToReplace.mainSource.file.length) {
								var  XXX = thisItemInProj.name.indexOf('.psd');
								var thisItemNameForCompare = thisItemInProj.name.slice(0, XXX+4);
								var  YYY = ftgToReplace.name.indexOf('.psd');
								var FTRNameForCompare =  ftgToReplace.name.slice(0,YYY+ 4);   
								if (thisItemNameForCompare === FTRNameForCompare) {
									thisItemInImportedBG = thisItemInProj;    
									var ftgToReplaceUsedInLength = ftgToReplace.usedIn.length;
									
									for(var w = 0; w < ftgToReplaceUsedInLength ; w ++) {
										var thisComp = ftgToReplace.usedIn[w];
										var thisCompNumLayers = thisComp.numLayers
										for (var v = 1; v <= thisCompNumLayers ; v++ ) {
											if (thisComp.layer(v).source === ftgToReplace) {
												var aimedLayer = thisComp.layer(v);
												aimedLayer.replaceSource(thisItemInImportedBG, true);
												goOnBool = false;
												//alert (' In the composition \'' + thisComp.name + '\', the aimedLayer called \''+ aimedLayer.name + '\'\'s source was replaced by thisItemInImportedBG : \''+ thisItemInImportedBG.name);
												}// end of actions if name is same
											}
										}//end for loop : the usedIn Comp items where the footage  to replace is used
									break;
									}
								}
							}
						}
					}
				}//end for loop : this paragraph was meant to be sure the needed psd file had not already been imported in project


			if (thisItemInImportedBG === null) {
				var importOptions = new ImportOptions();
				importOptions.file = new File (replaceLink);
				importOptions.importAs = ImportAsType.COMP;
				var importedBGComp = app.project.importFile(importOptions);
				var importedBGFolder;
				for(var i = 1 ; i <= app.project.rootFolder.numItems ; i ++) {	
					if (app.project.rootFolder.item(i).name === importedBGComp.name + ' Layers') {
						var importedBGFolder = app.project.rootFolder.item(i);
						break;
						}
					}//end for loop		

				for(var u = 1 ; u <= importedBGFolder.numItems ; u ++) {
					if (importedBGFolder.item(u).name === ftgToReplace.name) {
						thisItemInImportedBG = importedBGFolder.item(u);
						break;
						}
					}	
				var projNumItems = app.project.numItems;
				for (var t = 1; t <= projNumItems; t ++) {
					var thisItemInProj =app.project.item(t)
					if (thisItemInProj.hasOwnProperty('mainSource')) {
						if (thisItemInProj.mainSource.hasOwnProperty('file')) {
							if ((thisItemInProj != ftgToReplace) && (thisItemInProj.mainSource.file.name === ftgToReplace.mainSource.file.name)) {
								if (thisItemInProj.mainSource.file.length ===  ftgToReplace.mainSource.file.length) {
									var  XXX = thisItemInProj.name.indexOf('.psd');
									var thisItemNameForCompare = thisItemInProj.name.slice(0, XXX+4);
									var  YYY = ftgToReplace.name.indexOf('.psd');
									var FTRNameForCompare =  ftgToReplace.name.slice(0,YYY+ 4);
									if (thisItemNameForCompare === FTRNameForCompare) {
										thisItemInImportedBG = thisItemInProj;    
										for(var w = 0; w < ftgToReplace.usedIn.length ; w ++) {
											var thisComp = ftgToReplace.usedIn[w];
											for (var v = 1; v <= thisComp.numLayers ; v++ ) {
												if (thisComp.layer(v).source === ftgToReplace) {
													var aimedLayer = thisComp.layer(v);
													aimedLayer.replaceSource(thisItemInImportedBG, true);
													}// actions if name is same
												}//end for loop : the layers of the comp item
											}//end for loop : the usedIn Comp items where the footage  to replace is used

										break;
										}
									}
								}
							}
						}
					}//end for loop inprojNumItems
				}//end of situation if the psd had not already been imported
			ftgToRemove_inside = ftgToReplace;
			}//fin du customReplaceSiC'estPSD

		else if ((ftgToReplace.name.indexOf('[') > -1) && (ftgToReplace.name.indexOf(']') > -1) ) {
			ftgToReplace.replaceWithSequence(FILE_OBJ_FROM_REPLACE_LINK,false);	
			}

		else {
		ftgToReplace.replace(FILE_OBJ_FROM_REPLACE_LINK);	
		}

		return ftgToRemove_inside;
		}
}//end of function customReplace(ftgToReplace, replaceLink)




//ONE OF THE TWO FUNCTIONS TO CLEAN UP MESS AFTER HANDLING A .PSD LAYER THAT WAS IMPORTED AS COMPOSITION-
function DO_CLEAN_ON_BG_ITEMS_SMALL() {
    //alert('DO_CLEAN_ON_BG_ITEMS_SMALL is running')
	var projNumItems = app.project.numItems;
	for (var i = 1; i <= projNumItems ; i ++) { // app.project.numItems
		var thisItem = app.project.item(i);
		if (thisItem instanceof FolderItem && thisItem.name.indexOf('Layers')>-1) {
			if (thisItem.numItems === 0) {
				thisItem.remove();
				}
			}
		}
	//alert('DO_CLEAN_ON_BG_ITEMS_SMALL was running')
}//end function DO_CLEAN_ON_BG_ITEMS_SMALL


//ONE OF THE TWO FUNCTIONS TO CLEAN UP MESS AFTER HANDLING A .PSD LAYER THAT WAS IMPORTED AS COMPOSITION-
function DO_CLEAN_ON_BG_ITEMS() {
	//alert('D0_CLEAN_ON_BG_ITEMS() function is running');
	var r_oldBGLayersFolders = [];
	var r_newBGLayersFolders  = [];
	var r_oldBgComp = [];
	var r_newBgComp  = [];
	
	var projNumItems = app.project.numItems;
	for (var i = 1; i <= projNumItems ; i ++) {// app.project.numItems
		var thisItem = app.project.item(i);
		//if (thisItem instanceof FootageItem) {
		if ((thisItem instanceof FolderItem) && (thisItem.name.indexOf('Layers')>-1)) {
			//alert (thisItem.name + ' has this many items :' + thisItem.numItems);
			if (thisItem.numItems === 0) {
				r_oldBGLayersFolders.push(thisItem); 	
				}
			else if ((thisItem.numItems > 0) && (thisItem.name.indexOf (' 2 Layers') > -1 )) {
				r_newBGLayersFolders.push(thisItem); 	
				}
			}
		}

	if (r_oldBGLayersFolders.length === 1 && r_newBGLayersFolders.length === 1) {
		projNumItems = app.project.numItems;
		for (var i = 1; i <= projNumItems ; i ++) {// app.project.numItems
			var thisItem = app.project.item(i);
			if (thisItem instanceof CompItem) {
				if(thisItem.name === r_oldBGLayersFolders[0].name.slice(0,-7)) {
					r_oldBgComp.push(thisItem)
					}
				else if (thisItem.name === r_newBGLayersFolders[0].name.slice(0,-7)) {
					r_newBgComp.push(thisItem)
					}
				}
			}//fin du for
		}

	if (r_oldBGLayersFolders.length === 1 && r_newBGLayersFolders.length === 1 && r_oldBgComp.length === 1 && r_newBgComp.length === 1) {
		var thisOld_BgLayerFolder = r_oldBGLayersFolders[0];
		var thisNew_BgLayerFolder = r_newBGLayersFolders[0];
		var thisOld_BgComp = r_oldBgComp[0];
		var thisNew_BgComp = r_newBgComp[0];
		thisNew_BgComp.remove();
		thisNew_BgLayerFolder.parentFolder = thisOld_BgLayerFolder.parentFolder;
		thisNew_BgLayerFolder.name = thisOld_BgLayerFolder.name;
		thisOld_BgLayerFolder.remove();
		}

	//alert('D0_CLEAN_ON_BG_ITEMS() function was running');
	return null;
}//end of function DO_CLEAN_ON_BG_ITEMS()




//gets the info about all the files existing in the footage folder in explorer.
function getAllFootagesInFtgFolder() {
//alert(getAllFootagesInFtgFolder is running')
    var itemNameArray = [];
    var itemStringArray = [];
    var itemFileLengthArray = [];
    var result = [itemNameArray, itemStringArray, itemFileLengthArray];
    var footageF = getFootageFolder().absoluteURI + '/';
	var allFiles = []
	var allFoldersInFootageF = getAllFolders([footageF]);

	var allFoldersInFootageFLength = allFoldersInFootageF.length;
	for (var i = 0 ; i < allFoldersInFootageFLength ; i ++) {
		allFoldersInFootageF[i].getFiles(function(file) {
		if (file instanceof File) {
			allFiles.push( file);
		}
		});
	}

	
	var allFilesLength = allFiles.length;
	for (var i = 0 ; i < allFilesLength ; i ++) {
		 var thisFile = allFiles[i];
		 itemNameArray.push(thisFile.name);
		 itemStringArray.push(thisFile.toString());
		 itemFileLengthArray.push(thisFile.length);
	}
	 return result;
//alert(getAllFootagesInFtgFolder was running')
}//end of function getAllFootagesInFtgFolder




//Compares a source footage to all the files in footage folder, on these points : file name and size.
function getMsg_checkIf_existsInFtgFolder(thisItem) {
	//alert('getMsg_checkIf_existsInFtgFolder('+thisItem.name+')' is running);
	var itemSourceFileName = thisItem.mainSource.file.name;
	var thisBool = false;
	var searchingNameResult = -1;
	
	var allFtgsInFtgFolderLength = allFootagesinFtgF_names.length;
	for (var i = 0 ; i < allFtgsInFtgFolderLength ; i ++) {	
		if   ( allFootagesinFtgF_names[i].toString() === itemSourceFileName) {
			searchingNameResult = i;
		}
    }
	
	if ( searchingNameResult > -1) {
		var thisItemFileSize = thisItem.mainSource.file.length;
		var foundItemFileSize = allFootagesinFtgF_fileSizes[searchingNameResult];
		
		if (thisItemFileSize === foundItemFileSize) {
			thisBool = true;
			var result = [thisBool, thisItem, allFootagesinFtgF_links[searchingNameResult]];
			return result;
			}
	}//end if (searchingNameResult > -1)

	else if ( searchingNameResult === -1) {
		return [thisBool];
		}
	//alert('getMsg_checkIf_existsInFtgFolder('+thisItem.name+')' was running);
}//end function getMsg_checkIf_existsInFtgFolder



				

//an abandoned alternative for 'mother function'
/*
function mainFunction() {
	//alert('mainFunction is running 00');
	if (getCollectMsg()[0] === true) {
		var footageF_fullPath = getFootageFolder().absoluteURI + '/';
		createFileBackUp();
		DO_fileCopy_AND_REPLACE_AND_DELETE();
	}
	//alert('mainFunction was running 00');
} // end mainFunction
*/


app.endUndoGroup();