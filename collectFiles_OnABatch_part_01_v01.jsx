//DS_repairLinks_OnABatch_part_01_v01;
//#include 'getTvShowName.jsx'
#include 'UTILITARIES/shorterFormForArray.jsx'

var fileObjBatchMenu = new File ($.fileName);
var LCC_scriptsFolder = new Folder (fileObjBatchMenu.parent.absoluteURI);
var LCC_scriptFolder_02 = LCC_scriptsFolder.fsName.replace(/\\/g,'/');
var utilitaireF = '/UTILITARIES';


var histoFilePath = LCC_scriptFolder_02 + utilitaireF + '/HISTORY_collectFiles_OnABatch_part_01_v01.txt';
var histoFile = new File(histoFilePath);
var thisScriptFile = new File ($.fileName);
var sliceStart_02 = -1 * thisScriptFile.name.length;
var thisScriptFileName_02 = thisScriptFile.name.slice(sliceStart_02); 
var thisScriptFileNameWithoutExt = thisScriptFileName_02.slice(0, -4);

#include 'UTILITARIES/batchMenu_v02.jsx'


function executeScript_02 (targetFolderForBatch, pathForBatch, reportFileFullPath, startNumber, endNumber, booleanRepair, excludeNumber,  folderArray, reportTextArray){
	//alert ('executeScript is running');
	alert(GET_EXCLUDE_INFO(excludeNumber)[0].toString());
	alert(GET_EXCLUDE_INFO(excludeNumber)[1].toString());
	var textValue = checkAndReplaceFootages_onABatch (targetFolderForBatch, pathForBatch, reportFileFullPath, startNumber, endNumber, excludeNumber, booleanRepair, folderArray, reportTextArray);
	//alert ('executeScript was running');
}


function checkAndReplaceFootages_onABatch (targetFolderForBatch, pathForBatch, reportFileFullPath, startNumber, endNumber, excludeNumber, booleanRepair, folderArray, reportTextArray){
	//alert ('checkAndReplaceFootages_onABatch function is running');
	var folderObj = Folder(pathForBatch);
	var folderFiles = folderObj.getFiles(function(file) {
		return file instanceof Folder;
	});
			
	var bigCounter = 0;
	var aepFilesBigCounter = 0;
	var aepWithErrorArray =[];
	var aepPerfects = [];
	var collectedAeps = [];
	var aepMissingOrBrokenSource = [];
	var aepNotProcessed = [];
	var txtFile = new File(reportFileFullPath);		
	var excludeInfo = GET_EXCLUDE_INFO(excludeNumber);        
	var processingTextArray = [[],[],[]];	
	// for info : this Array processingTextArray must be written like this : 	[['situationA','situationB'],[0,1], ['name00','name01']]	
	var bigLinebreak = '\n\ ';
	var linebreak = '\n';
	var alinea = '  ';
	reportTextArray.push('//////////////////////////////////////////////////////////////////////////////' );
	reportTextArray.push('SEARCHING PARAMETERS INFO  :');
	reportTextArray.push(alinea+ 'This folder was checked : ' + pathForBatch);
	reportTextArray.push(alinea+ 'Out of the ' + folderFiles.length +' folders there, ' + folderArray.length + ' folders pass the \'name test\' + have inside at least one .AEP file.');
	reportTextArray.push(alinea+ 'Among the ' + folderArray.length + ' \'matching\' folders, script launched on these ones:');
	reportTextArray.push(alinea + String(endNumber - startNumber + 1) + ' FOLDER(S) CONCERNED : '+ linebreak + alinea + '     - FROM (included)    : folder N.' + lpad(startNumber + 1, 3) + ', named  \' ' + decodeURI(folderArray[startNumber].name) +'\' ...' + linebreak + alinea + '     - TO   (included)    : folder N.' + lpad(endNumber + 1, 3)  + ', named \'' + decodeURI(folderArray[endNumber].name) +'\' ;'  );
	  if (excludeNumber != undefined &&  excludeInfo != null){
		  reportTextArray[reportTextArray.length -1] += '\n'+ alinea + alinea + excludeInfo[0];		
		  }
	reportTextArray.push(linebreak);
	reportTextArray.push('Progress of script execution : NOT FINISHED YET... script is processing ...' );
	reportTextArray.push('//////////////////////////////////////////////////////////////////////////////' );
	reportTextArray.push(linebreak);
	reportTextArray.push('DETAILS                    :' );
	reportTextArray.push('');
	txtFile.open('w');
	txtFile.write(convertArrayInText(reportTextArray)); 
	txtFile.close();

	for (var j = startNumber; j <= endNumber ; j++) { 	  
		var thisName = decodeURI(folderArray[j].name);							
		var subFolder = folderArray[j];
		var subFolderFiles = subFolder.getFiles(function(file) {
			return file instanceof File && file.name.match(/\.aep$/i); // Check for .aep files
		});
		
								
		aepFilesBigCounter += subFolderFiles.length;
		var msgForAepToNotProcess = 'These .aep were not treated, because: user\'s choice;';
		if (excludeInfo[1].indexOf(j) > -1){
			processingTextArray[0].push(msgForAepToNotProcess);
			processingTextArray[1].push(j+1);
			processingTextArray[2].push(thisName);
			}
		if (subFolderFiles.length === 0){
			var msgForFolderWithoutFiles = subFolderFiles.length + ' (ZERO) .aep files found in this folder :';
			processingTextArray[0].push(msgForFolderWithoutFiles);
			processingTextArray[1].push(j+1);
			processingTextArray[2].push(thisName);
			//alert (msgForFolderWithoutFiles);	
			//alert('processingTextArray : test 00A :' + convertArrayInText(processingTextArray))			
		}
		else if (subFolderFiles.length === 1){
			reportTextArray.push(subFolderFiles.length + ' .aep file was found in this folder:  \'' + thisName + '\' :');	
		}
		else if (subFolderFiles.length > 1){
			reportTextArray.push(subFolderFiles.length + ' .aep files were found in this folder:  \'' + thisName + '\' :');	
		}


		for (var k = 0; k < subFolderFiles.length; k++) {
			var myFile = subFolderFiles[k];
			if (excludeInfo[1].indexOf(j) > -1){
				aepNotProcessed.push(subFolderFiles[k].name + '     -> ')
				}// end   else if (excludeInfo[1].indexOf(j) >-1
			else if (excludeInfo[1].indexOf(j) === -1){
				app.openFast(subFolderFiles[k]);
				#include 'UTILITARIES/collectFiles_v01_forBatchUseOnly_v02.jsx'
				var checkResult = getCollectMsg(booleanRepair, false)
				var checkResult_00_Bool =  checkResult[0];
				var checkResult_00 =  checkResult[1];
				var checkResult_01 = subFolderFiles[k].name + '     -> ' + checkResult_00;
				//alert(': test 00C :' )
				processingTextArray[0].push(checkResult_00);
				//alert(': test 00D :' )
				processingTextArray[1].push(j+1);
				processingTextArray[2].push(subFolderFiles[k].name);
				// for info : this Array processingTextArray must be written like this : 	[['situationA','situationB'],[0,1], ['name00','name01']]				
				reportTextArray.push(checkResult_01);
				txtFile.open('w');
				txtFile.write(convertArrayInText(reportTextArray)); 
				txtFile.close();

				if (checkResult_00_Bool === false && (checkResult_00.indexOf('missing')>-1)) { //counter is from the included script
					aepMissingOrBrokenSource.push(subFolderFiles[k].name + '     -> ')
					app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
					}
				else if (checkResult_00_Bool === true && (checkResult_00.indexOf('collected') === -1)) { //counter is from the included script  
					bigCounter ++;
					aepWithErrorArray.push(subFolderFiles[k].name + '     -> ' );
					//#include 'UTILITARIES/checkFootageSources_v01_ONLY_CHECK_forBatchUseOnly - Copie.jsx'
					//var checkResult_02 = '\ -> After use of script, ' + resultCheckMsg_batchVersion(r_checkFtgSources);
					var checkResult_02 = '\ -> After use of script, ' + checkFtgSources()[0].length +' item(s) have their source outside of \'Footage\' folder.'
					aepWithErrorArray.push(checkResult_02 + linebreak);
					app.project.close(CloseOptions.SAVE_CHANGES);
					}
					
				else if (checkResult_00_Bool === false && (checkResult_00.indexOf('Good')>-1)){
					aepPerfects.push(subFolderFiles[k].name);
					app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)
					}    
				}//end excludeInfo[1].indexOf(j) === -1)
								
			reportTextArray.push(bigLinebreak);
			txtFile.open('w');
			txtFile.write(convertArrayInText(reportTextArray)); 
			txtFile.close();
			var processedTextArray = getShorterArray(processingTextArray);
			//info : this function getShorterArray is from included script: UTILITARIES/shorterFormForArray.jsx;
			
			var reportTextArray_02 = doMyArraySplice(reportTextArray, 14, 1000, processedTextArray);			
			} // end of For loop, through the aep files that are in an index of FolderArray
		
		
		} // end of for loop through all folders


	var txtArray_03 = [];
		       
	if ( aepWithErrorArray.length === 0 && aepMissingOrBrokenSource.length === 0 && aepPerfects.length > 0){		
		txtArray_03.push(linebreak)
		txtArray_03.push('TOTAL RESULT               : => Good news :) None  of the AEP files had broken link or any footage \'badly located\'.' );
		txtArray_03.push(linebreak);			
		}
    
	else if ( aepWithErrorArray.length === 0 && aepMissingOrBrokenSource.length > 0 && aepPerfects.length === 0){		
		txtArray_03.push(linebreak)
		txtArray_03.push('TOTAL RESULT               : => ERROR :  In ' + aepMissingOrBrokenSource.length + ' .AEP files, no \'collect Files/check sources\' was done because at least 1 footage(s) was(were) missing.' );
		txtArray_03.push(linebreak);				
		}
    
	else if ( aepWithErrorArray.length > 0 && aepMissingOrBrokenSource.length === 0 && aepPerfects.length === 0){		
		txtArray_03.push('TOTAL RESULT               : => ' + bigCounter + ' .AEP files had a footage \'badly located\' ;' );
		txtArray_03.push(linebreak)				
		} 
	else {				
		txtArray_03.push(linebreak)
        txtArray_03.push('TOTAL RESULT               :')

		if (aepWithErrorArray.length > 0){
		   //alert ('zzzz   aepWithErrorArray.length.length > 0 : ' + aepWithErrorArray.length)
			txtArray_03.push(alinea +'=> ' + bigCounter + ' .AEP files had at least 1 footage \'badly located\' (out of \'footage folder\'). ');
			}
    
		if (aepPerfects.length > 0){
			txtArray_03.push(alinea +'=> ' + aepPerfects.length + ' .AEP were \'good\' (no problem found) ;' );
			}
		if (aepMissingOrBrokenSource.length > 0){
			txtArray_03.push(alinea +'=> ERROR :  In ' + aepMissingOrBrokenSource.length + ' .AEP files, no \'collect Files/check sources\' was done because at least 1 footage(s) was(were) missing ;' );
			}
		txtArray_03.push('' );
		}
          
	if (aepNotProcessed.length > 0){
		if (txtArray_03[txtArray_03.length -1] ===linebreak){
			txtArray_03.pop();
			}
		txtArray_03.push(alinea +'=> \'EXCLUDED\'  : ' + aepNotProcessed.length + ' .aep files were not treated according to user instructions.' );
		txtArray_03.push(linebreak);              
		}       
	var newProgress = 'Progress of script execution --> FINISHED (Script has looped through all required files/folders!) <--' ;
	var thisIndexForSplice = 9;
	reportTextArray_02.splice(thisIndexForSplice, 1, newProgress);
	var txtArray_03_String = convertArrayInText( txtArray_03);
	reportTextArray_02.splice(thisIndexForSplice+1, 0, txtArray_03_String);
	var reportTextArray_02_String = convertArrayInText(reportTextArray_02);
	
	txtFile.open('w');
	txtFile.write(reportTextArray_02_String);
	txtFile.close();
		
	var processedTextArray_04 = getShorterArray(processingTextArray);
	//info : this function getShorterArray is from included script: UTILITARIES/shorterFormForArray.jsx;
	var reportTextArray_05 = doMyArraySplice(reportTextArray_02, thisIndexForSplice + 6 , 1000, processedTextArray_04);
	
	txtFile.open('w');
	txtFile.write(convertArrayInText(reportTextArray_05));
	txtFile.close();
	
	var finalText = 'Script completed. The .txt file has been created at: ' + txtFile.fsName +  bigLinebreak + bigLinebreak + String(txtArray_03).replace(/,/g,'\ ');
	var textValue = convertArrayInText(reportTextArray_05)
	displayFinalMessage(textValue, reportFileFullPath, txtFile); // this function is included in batchMenu

} //end of function checkAndReplaceFootages_onABatch()

var winFinal = new Window('palette', 'thisScriptFile.name', undefined);



	



