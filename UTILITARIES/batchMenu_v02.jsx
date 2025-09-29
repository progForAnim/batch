/*
SUMMARY:
//PART 00: DECLARING SOME VARIABLES
//PART 01: CODE USED FOR FIRST WINDOW
	function readHisto()
	function writeHisto(chosenFolder, folderPath)
	function getDateString()
	function writeReportFileName()
	function getReportFileFullPath()
	function  isCheckboxTrueAndValid()
	function getBatchLoc_02()
	Some description of first WINDOW
	function executeScript(targetFolderForBatch,pathForBatch, reportFileFullPath)
//PART 02: FUNCTIONS USED FOR SECOND WINDOW
	function getAepFilesInChosenFolder(chosenFolder, chosenFolderPath, reportFilePath)
	function displaySecondWindow(chosenFolder, chosenFolderPath, reportFilePath)
//PART 03: FUNCTIONS USED IN 'collectFiles_OnABatch_part_01_v01.jsx'
	function GET_EXCLUDE_INFO(text)
	function executeTxtFile(anyTxtFile)
	function convertArrayInText (array)
	function doMyArraySplice(ARRAY_01, spliceIndex, opt, ARRAY_02)
	function displayFinalMessage(textValue, reportFileFullPath, txtFile)
*/

//PART 00: DECLARING SOME VARIABLES
var fileObjBatchMenu = new File ($.fileName);
var LCC_scriptsFolder = new Folder (fileObjBatchMenu.parent.absoluteURI)
var LCC_scriptFolder_02 = LCC_scriptsFolder.fsName.replace(/\\/g,'/');
var UTILITARIESF = '/UTILITARIES',


#include 'getTvShowName.jsx'

//var rootTVShowName = 'AVSH';
if (tvShowName === 'TV_SHOW_NUMERO_1') {
	var regex_COMP = /(PRECOM(P|PO))|(COM(P|PO))_v\d{2}/ig;
//var regex_COMP = /^AVSH_\d{3}\_\d{2}\_(\d{3}|\d{3}\w)_((PRECOM(P|PO))|(COM(P|PO)))_v\d{3}\_LCC/i;
}
else if (tvShowName === 'TV_SHOW_NUMERO_2') {
var regex00 = /AVSH_\d\d\d\_\d\d\_\d\d\d\_COMPO_v\d\d\d\_LCC$/;
var regex_COMP = /^DS\d{3}\_s(\d{4}|d{4}\w)\_((PRECOM(P|PO))|(COM(P|PO)))_v/i;
var regex_COMP_withLetter = /^DS\d{3}\_s\d{4}\w\_((PRECOM(P|PO))|(COM(P|PO)))_v/i;
}


function lpad(value, padding) {
    var zeroes = new Array(padding+1).join('0');
    var result = (zeroes + value).slice(-padding);
	return result;
}



//PART 01: FUNCTIONS USED FOR FIRST WINDOW
function readHisto() {
	//is used in first Window to read History to be able to launch script in one of the already known locations
	//alert ('readHisto() is running');
	var histoToRead = histoFile;
	var currentLine;
	if (true) {//dejaVu === 1;
		var txtArray = [];
		}
	histoToRead.open();

	while(!histoToRead.eof) {
		currentLine = histoToRead.readln();
		txtArray.push(currentLine);
		}

	if (txtArray.length === 0) {
		txtArray.push('--History file is empty--')
		return txtArray;
		}
	else{
		return txtArray;
	}
}//end function readHisto()



function writeHisto(chosenFolder, folderPath) {
	//is used in first Window to add to History the specified location
		//-> (therefore, there will be no need to write again this location next time the scrip is launched)
	//alert ('writeHisto is running');

	var histoToWrite = histoFile;		
	var txtArray = readHisto();
	var lineAlreadyPresent ;
	var indexLineAlreadyPresent;
	var txtArray_02 = [];

	for (var i = 0 ; i < txtArray.length; i ++) {
		var thisLine =  txtArray[i];
		//alert ('thisLine : ' + thisLine +'\n\ ' + 'folderPath : ' + folderPath);
		if ((thisLine.indexOf(folderPath)) > -1 || (thisLine.indexOf('--History file is empty--')) > -1) {
			//alert('do nothing because it means that the entered Path is already existing in a line');
			}
		else {
			txtArray_02.push(thisLine);
			txtArray_02.push('\n');
			}
		}

	if (txtArray.length > 0) {
		txtArray_02.unshift(folderPath + '\n');
		}

	else {
		txtArray_02.push(folderPath + '\n');
		}
	histoToWrite.open('e');
	histoToWrite.writeln(txtArray_02.toString().replace(/,/g,''));
	histoToWrite.close();

	//alert ('writeHisto was running');
	return txtArray_02;
} // end of fonction writeHisto(




function getDateString() {
	//is used in first Window to handle some infos	
	// Create a date string with the format YYYY-MM-DD_HH-MM
	var currentDate = new Date();
	var dateString = currentDate.getFullYear() + '.' +
					 lpad(currentDate.getMonth() + 1,2) + '.' +  // Add leading zero to month
					 lpad(currentDate.getDate(),2) + '_' +      // Add leading zero to day
					 lpad(currentDate.getHours(),2) + 'h' +     // Add leading zero to hour
					 lpad(currentDate.getMinutes(),2) + 'm' +         // Add leading zero to minute
					 lpad(currentDate.getSeconds(),2) + 's' ;          // Add leading zero to minute
	return dateString;			 
}


function writeReportFileName() {
	//is used in first Window to handle some infos	
	var reportFileName = thisScriptFileNameWithoutExt + '_result_' + getDateString() + '.txt';	
	return reportFileName ;
}



function getReportFileFullPath() {
	//is used in first Window to handle some infos	
	var modifiedPath = s02_editText01.text.replace(/\\/g,'/')
	return modifiedPath;
}



function  isCheckboxTrueAndValid() {
	//is used in first Window to handle some infos	
	var A = S01_CB_A.value;
	var B = S01_CB_B.value;

	if (A === false && B === false) {
		return [false,'(A === false && B === false',9];
		}
	else if (A === true && B === true) {
		return [false,'(A === true && B === true',9];
		}
	else if (A === true && B === true) {
		return [false,'(A === true && B === true',9];
		}
	else if (A === true && B === false) {
		var thisNewFile = new File (chosenFolder_groupOne);
		if (thisNewFile.exists) {
			return [true , '',0];
			}
		else{
			return [false,'(A === true && B === false, but A is not working :\n\-> this folder adress does not exist on this computer / on the server',9];
			}
		}
	else if (A === false && B === true) {
		var thisNewFile = new File (editText01.text.replace(/\\/g,'/'));
		if (thisNewFile.exists) {
			return [true , '', 1];
			}
		else{
			return [false,'(A === false && B === true, but B is not working :\n\-> this folder adress does not exist on this computer / on the server',9];
			}
		}			
}


function getBatchLoc_02() {
	//is used in first Window to handle some infos	
	if (isCheckboxTrueAndValid()[0] === true && isCheckboxTrueAndValid()[2] != 9) {
		var aOrB = isCheckboxTrueAndValid()[2];
		if (aOrB === 0 ) {
			var result01_folder = new Folder(typeDropDownA.onChange());
			var result01_path = typeDropDownA.onChange();
			return [result01_folder, result01_path];
			}
		else if (aOrB === 1 ) {
			var result01_folder = new Folder(editText01.text.replace(/\\/g,'/'));	
			var result01_path = editText01.text.replace(/\\/g,'/');
			return [result01_folder, result01_path];
			}
		}
}//end of function getBatchLoc_02()






var mainWindow = new Window('palette', thisScriptFileName_02, undefined);
mainWindow.orientation = 'column';

var staticText03 = mainWindow.add('statictext', undefined, 'STEP 01 : select WHERE the script will execute : \n\nThree possibilities to select the folder  : ')

var groupOne = mainWindow.add('group', undefined, 'groupOneNameTest');
groupOne.orientation = 'row';
var g1ST = groupOne.add('statictext', undefined, '     Recent locations');
g1ST.size = [100,50];
var typeDropDownA = groupOne.add('dropdownlist', undefined, readHisto());
typeDropDownA.selection = 0;
typeDropDownA.size = [450,50];
var Action00_ButtonA = groupOne.add('button', undefined, 'Open in Explorer');
Action00_ButtonA.size = [100,45];
var Action00_ButtonB = groupOne.add('button', undefined, '(Open history file)');
Action00_ButtonB.size = [100,45];
var S01_CB_A = groupOne.add( 'checkbox', undefined, '' );

if (typeDropDownA.selection.text === '--History file is empty--') {
	S01_CB_A.value = false;
	}
else {
	S01_CB_A.value = true;
	}
	
Action00_ButtonA.onClick = function() {
	var possibleFolder = new Folder(typeDropDownA.selection.text.replace(/\\/g,'/'));
	if(possibleFolder.exists) {
		possibleFolder.execute();
		}
	else if(!possibleFolder.exists) {
		alert ('this adress was not found :\n' + possibleFolder.toString());
		}
}

Action00_ButtonB.onClick = function() {
	histoFile.execute();	
}


typeDropDownA.onChange = function() {
	var chosenFolder_groupOne_Index = this.selection.index; 
	var chosenFolder_groupOne = readHisto()[this.selection.index];
	return chosenFolder_groupOne;
}


var chosenFolder_groupOne_Index = typeDropDownA.selection.index; 
var chosenFolder_groupOne = typeDropDownA.onChange();

var staticText01 = mainWindow.add('statictext', undefined, '--OR--');

var groupTwo = mainWindow.add('group', undefined, 'groupTwoNameTest');
groupTwo.orientation = 'row';
var g2ST = groupTwo.add('statictext', undefined, 'Type or copy/paste\n            adress here');
g2ST.size = [100,50];
g2ST.alignment = 'center'
var groupTwoA = groupTwo.add('group', undefined, 'groupTwoNameTest');
groupTwoA.orientation = 'column';
var editText01 = groupTwoA.add('edittext', undefined, 'defaultPathValue, please edit code at line 268 to write a location where you often execute script') // '-Please enter a path-'
editText01.size = [450,50];
editText01.alignment = 'center';

var Action02ButtonA = groupTwo.add('button', undefined, 'Open in Explorer');
Action02ButtonA.size = [100,45];
var Action02ButtonB = groupTwo.add('button', undefined, '(Browse...)');
Action02ButtonB.size = [100,45];

var S01_CB_B = groupTwo.add( 'checkbox', undefined, '' );
if (typeDropDownA.selection.text === '--History file is empty--') {
	S01_CB_B.value = true;
	};
else {
	S01_CB_B.value = false;
	}


S01_CB_A.onClick = function() {
	isCheckboxTrueAndValid();
	if (S01_CB_A.value === true) {
		var folderToCheck_groupOne = new Folder(typeDropDownA.onChange());
		var textValue_01 = [folderToCheck_groupOne, typeDropDownA.onChange()];
		return textValue_01;
		}
}

Action02ButtonA.onClick = function() {
	var possibleFolder = new Folder(editText01.text.replace(/\\/g,'/'))    
	if(possibleFolder.exists) {
		possibleFolder.execute() ;
		}
	else if(!possibleFolder.exists) {
	   alert ('this adress was not found :\n' + possibleFolder.toString())
	   }
    }

Action02ButtonB.onClick = function() {
	//This function will describe how to open a 'file dialog' window;
	var targetFolder = Folder.selectDialog('Execute') ;
	if (targetFolder != null) {
		var modifiedPath02 = targetFolder.fsName.replace(/\\/g,'/');
		editText01.text = modifiedPath02;
		}
}



S01_CB_B.onClick = function() {
	isCheckboxTrueAndValid();
	if (S01_CB_B.value === true) {
		var modifiedPath = editText01.text.replace(/\\/g,'/');
		var chosenFolder_groupTwo = new Folder(modifiedPath);
		var textValue_02 = [chosenFolder_groupTwo, modifiedPath];
		return textValue_02;
		}
}



var s02_staticText01 = mainWindow.add('statictext', undefined, '--------------------------------')
var s02_staticText03 = mainWindow.add('statictext', undefined, 'STEP 02 : You can (if you want) change the location where the .txt REPORT FILE  will be saved : ')

var s02_groupTwo = mainWindow.add('group', undefined, 'groupTwoNameTest');
s02_groupTwo.orientation = 'column';
var s02_groupTwo_01 = s02_groupTwo.add('group', undefined, '');
s02_groupTwo_01.orientation = 'row';

var thisSep = '\ ';

var defaultPathForReportFile_02 = '/REPORTS_' + thisScriptFileNameWithoutExt + '/';
var defaultPathForReportFile_03 = writeReportFileName();
var defaultPathForReportFile_04 = LCC_scriptFolder_02 + UTILITARIESF + defaultPathForReportFile_02 + defaultPathForReportFile_03;

var s02_editText01 = s02_groupTwo_01.add('edittext', undefined, defaultPathForReportFile_04) //defaultValue 
s02_editText01.size = [700,50];
var s02_AB_B = s02_groupTwo_01.add('button', undefined, '\'Folder selection window\'');

var s02_groupTwo_02 = s02_groupTwo.add('group', undefined, '');
var s02_staticText02A = s02_groupTwo_02.add('statictext', undefined, '-Please write or pick up a path-') //'Path should be written like this : ')

var groupFour = mainWindow.add('group', undefined, 'groupOneNameTest')
groupFour.orientation = 'row';
var AB_02_C = groupFour.add('button', undefined, 'NEXT ->');
var AB_02_D = groupFour.add('button', undefined, 'CANCEL');



s02_AB_B.onClick = function() {
var targetFolder = Folder.selectDialog(['Please select where the report .txt file will be saved:'],[ '*.txt']) //THIS WORKS
if (targetFolder != null) {
var modifiedReportFilePath = targetFolder.fsName.replace(/\\/g,'/') + '/' + writeReportFileName()+'.txt';
s02_editText01.text = modifiedReportFilePath;
}
//This function will describe how to open a 'file dialog' window;
}


AB_02_C.onClick = function() {
	//This function will describe how to Run the function
	if (isCheckboxTrueAndValid()[0] === false ) {
		alert ('There is an error in STEP 01 checkboxes. ERROR MESSAGE : ' + isCheckboxTrueAndValid()[1]);
		return;
		}
	else{
		mainWindow.close();
		executeScript(getBatchLoc_02()[0], getBatchLoc_02()[1], getReportFileFullPath());
		}
}


AB_02_D.onClick = function() {
	//This function will describe how to Cancel the function
	mainWindow.close();
}


function executeScript(targetFolderForBatch,pathForBatch, reportFileFullPath) {
	//is used to close first window and to open second Window, while using needed infos
	//alert ('executeScript is running');
	mainWindow.close();
	if ((pathForBatch === '-Please enter a path-' ) || (pathForBatch === undefined )) {
		//DO NOTHING BECAUSE PATH IS NOT WORKING	
		}

	else {
		writeHisto(targetFolderForBatch, pathForBatch);
		var reportFileTemplatePath = LCC_scriptFolder_02 + UTILITARIESF + '/doNotTouch_templateForBatchReportFile.txt';
		var reportFileTemplate = new File (reportFileTemplatePath);
		reportFileTemplate.copy(reportFileFullPath);
		displaySecondWindow(targetFolderForBatch,pathForBatch,reportFileFullPath);	
		//alert ('executeScript was running');
		}
}//end of function executeScript


mainWindow.center();
var windowFeatures = 'left=200,top=0,width=600,height=600';
mainWindow.show();



//PART 02: FUNCTIONS USED FOR SECOND WINDOW
function getAepFilesInChosenFolder(chosenFolder, chosenFolderPath, reportFilePath) {
	//is used for the next function just below, writes the first infos in the report + finds all compatible folders in specified location
	//alert('getAepFilesInChosenFolder(chosenFolder, chosenFolderPath, reportFilePath) is running');	
	var usedScriptForCheck_01 = LCC_scriptFolder_02 + UTILITARIESF + '/checkFootageSources_v01_ONLY_CHECK_forBatchUseOnly.jsx';
	var usedScriptForCheck_02 = LCC_scriptFolder_02 + UTILITARIESF + '/collectFiles_v01_forBatchUseOnly.jsx';

	if (reportFilePath === null) {
		//alert('No report file path selected, script will stop.');
		}
	else {
		var txtFile = new File(reportFilePath);
		var reportTextArray = [];
		var dateMessage = 'At ' + getDateString() + ', user started ' + thisScriptFile.name + '. ' ;
		reportTextArray.push(dateMessage);
		reportTextArray.push(thisSep)
		
		txtFile.open('w');
		txtFile.write(convertArrayInText(reportTextArray)); 
		txtFile.close();
		
		if (chosenFolderPath == null) {
			//alert('No folder selected, script will exit.');
			}
		else {
			//alert('TEST: is the script working here ? alert n°002')
			var folderPathMessage = 'This folder was checked : '+ chosenFolderPath;
			
			txtFile.open('w');
			txtFile.write(convertArrayInText(reportTextArray)); 
			txtFile.close();
			
			txtFile.open('w');
			txtFile.write(convertArrayInText(reportTextArray)); 
			txtFile.close();

			txtFile.open('w');
			txtFile.write(convertArrayInText(reportTextArray)); 
			txtFile.close();
			
			
			// Get the list of folders that match the specified pattern
			var folderArray = [];
			var folderObj = Folder(chosenFolderPath);
			var folderFiles_00 = folderObj.getFiles(function(file) {
				return file instanceof Folder;
				});
			var folderFiles = folderFiles_00.sort()

			for (var i = 0; i < folderFiles.length; i++) {
				var folderName = folderFiles[i].name;
				if ( folderName.match(regex_COMP)) {					
					folderArray.push(folderFiles[i]);								
					}			
				var testMessage00 = 'folderName : ' + folderName + ', and \n\ ';
				var testMessage01 = 'folderName.match(' + String(regex_COMP) + ') : ' + String(folderName.match(regex_COMP)) + ' and \n\ ';
				var testMessage02 = 'folderName.match(' + String(regex_COMP_withLetter) + ') : ' + String(folderName.match(regex_COMP_withLetter));
				var testMessage = testMessage00 + testMessage01 + testMessage02;
				//alert('testMessage01 : ' + testMessage01.toString());				
				}			
			var resultBatchScript = 'Number of found relevant folders: ' + folderArray.length + '. More info : \n\ '
			}
		}

return [folderArray, reportTextArray];
}//end of getAepFilesInChosenFolder



var win02 = new Window('palette', 'STEP_03', undefined);

function displaySecondWindow(chosenFolder, chosenFolderPath, reportFilePath) {	
	//THE GOAL OF THIS FUNCTION IS TO DEFINE THEN DISPLAY THE SECOND WINDOW
	 //alert('displaySecondWindow function is running');	
	var thisFolderArray = getAepFilesInChosenFolder(chosenFolder, chosenFolderPath, reportFilePath)[0];
	var reportTextArray = getAepFilesInChosenFolder(chosenFolder, chosenFolderPath, reportFilePath)[1];	
	var txtFile = new File(reportFilePath);
	
	txtFile.open('w');
	txtFile.write(convertArrayInText(reportTextArray));
	txtFile.close();
	
	win02.orientation = 'column';
	var groupOne = win02.add('group', undefined, '');
	groupOne.orientation = 'column';
	var ST01 = groupOne.add('statictext', undefined, 'STEP 03 : search for .AEP files:');
	var ST02 = groupOne.add('statictext', undefined, 'So, in \'folderPath\', will be searched files through two filters : 1/It has to be an .AEP file; ');
	var ST03 = groupOne.add('statictext', undefined, '2/ it must match some \'name conditions\' :');
	var groupOne_B = groupOne.add('group', undefined, '');
	groupOne_B.orientation = 'column';
	var ST03B = groupOne_B.add('statictext', undefined, regex_COMP.toString());
	var ST03F = groupOne_B.add('statictext', undefined, '(Note : here \'\d\' means \'any digit\')');
	var groupTwo = win02.add('group', undefined, 'win02Title');
	groupTwo.orientation = 'column';
	var ST03_B = groupTwo.add('statictext', undefined, '--------------------------------------------------------');
	var ST04 = groupTwo.add('statictext', undefined, 'STEP 04 : How many of these .AEP files will be treated? :');
	var groupTwo_B = groupTwo.add('group', undefined, '');
	groupTwo_B.orientation = 'row';
	var foundAepsNumber = 0;
	var ET04 = groupTwo_B.add('statictext', undefined, thisFolderArray.length);
	var foundRelevantAepLine = 'folders with relevant .AEP files were found in';
	var ST05 = groupTwo_B.add('statictext', undefined, foundRelevantAepLine);
	var ST05B = groupTwo.add('statictext', undefined, chosenFolderPath + ' : ');
	var ST05C = groupTwo.add('statictext', undefined, '------');
	var ST06 = groupTwo.add('statictext', undefined, 'Script will execute in the range between:');
	var groupTwo_C = groupTwo.add('group', undefined, '');
	groupTwo_C.orientation = 'row';
	var ET05 = groupTwo_C.add('edittext', undefined, '1');
	ET05.size = [40,30];
	if (thisFolderArray.length === 0) {
		var ST07A = groupTwo_C.add('statictext', undefined, '(\'NO AEP \'NAME MATCHING\' FOLDER WAS FOUND\' )');
		}
	else if (thisFolderArray.length > 0) {
		var ST07A = groupTwo_C.add('statictext', undefined,'( Folder named \'' + decodeURI(thisFolderArray[ET05.text-1].name) + '\')');
		}
	ST07A.size = [450,50]
	var ST07B = groupTwo.add('statictext', undefined, 'and');
	var groupTwo_D = groupTwo.add('group', undefined, '');
	groupTwo_D.orientation = 'row';
	var ET06 = groupTwo_D.add('edittext', undefined, thisFolderArray.length);
	ET06.size = [40,30];
	var ST08 = groupTwo.add('statictext', undefined, '------');
	var groupTwo_E = groupTwo.add('group', undefined, '');
	groupTwo_E.orientation = 'row';
	var ST09 = groupTwo_E.add('statictext', undefined, 'OPTIONAL : Exclude this(ese) folder(s):');
	var ET07 = groupTwo_E.add('edittext', undefined, );
	var BThelp = groupTwo_E.add('button', undefined, '?');
	BThelp.size = [20,20];
	BThelp.helpTip = 'Exemple  : \'[20-40] , 10 , 50\'  means : \'do NOT process from folder n°20 to folder n°40, and also n°10 and n°50);'
	ET07.size = [100,30];
	if (thisFolderArray.length === 0) {
		var ST10 = groupTwo_D.add('statictext', undefined, '(\'NO AEP \'NAME MATCHING\' FOLDER WAS FOUND\' )');
		}
	else if (thisFolderArray.length > 0) {
		var ST10 = groupTwo_D.add('statictext', undefined, '( Folder named \'' + decodeURI(thisFolderArray[ET06.text-1].name) + '\')');
		}
	ST10.size = [450,50]
	var ST11 = groupTwo.add('statictext', undefined, '--------------------------------------------------------');
	var ST12 = groupTwo.add('statictext', undefined, 'STEP 05 : Do you want to \'copy & replace\' unproper footage locations ?  ');
	var groupThree = win02.add('group', undefined, 'groupOneNameTest')
	groupThree.orientation = 'row';
	var CB01 =  groupThree.add( 'checkbox', undefined, '' );
	CB01.value = 1;
	var ST13 = groupThree.add('statictext', undefined, '(is enabled, MEANS \'YES\')');
	ST13.size = [150,40]
	CB01.onClick = function() {
		if (CB01.value) {
			ST13.text =  '(is enabled. Means \'YES\')'
			}
		else if (!CB01.value) {
			ST13.text =  '(isn\'t enabled. Means \'NO\')'
			}
		}
	var groupFourB = win02.add('group', undefined, 'groupOneNameTest')
	groupFourB.orientation = 'row';
	var BT02 = groupFourB.add('button', undefined, 'RUN SCRIPT');
	var BT03 = groupFourB.add('button', undefined, 'CANCEL');

	ET05.onChanging = function() {
		if (parseInt(ET05.text).toString() === 'NaN')
			{alert ('please write a number')
			ET05.text='';
			}
		else if (parseInt(ET05.text) === 0)
			{alert ('please write a number greater than 0')
			ET05.text='';
			}
	else if (parseInt(ET05.text) > parseInt(ET06.text) ) {
		alert ('this number should be smaller than the second (currently ' + parseInt(ET06.text))
		ET05.text='';
		}
		else{
		ST07A.text = '(\'' + decodeURI(thisFolderArray[ET05.text-1].name) + '\')';
		return ET05.text;
		}
	}//end function ET05.onChanging

	ET06.onChanging = function() {
		if (parseInt(ET06.text).toString() === 'NaN') {
			alert ('please write a number');
			ET06.text='';
			}
		else if (parseInt(ET06.text) === 0) {
			alert ('please write a number greater than 0')
			ET06.text='';
			}
		else if (parseInt(ET06.text) > thisFolderArray.length) {
			alert ('Since ' + thisFolderArray.length +'.AEP files have been found, this number cannot be more than ' + thisFolderArray.length );
			ET06.text=thisFolderArray.length;
			}
		else{
			ST07C.text = '(\'' + decodeURI(thisFolderArray[ET06.text-1].name) + '\')';
			return ET06.text;
			}
	} //end function ET06.onChanging



	BT02.onClick = function() {
	//This function will describe how to RUN SCRIPT
		if (false ) // could be conditions for example to examine the written number
		{
		//DO NOTHING BECAUSE SMTHING IS NOT WORKING	
		}
		else {
			win02.close();
			var startNumber = parseInt(ET05.text) - 1;
			var endNumber =  parseInt(ET06.text) - 1;
			var excludeNumber = ET07.text;
			executeScript_02(chosenFolder,chosenFolderPath,reportFilePath,startNumber, endNumber, excludeNumber, CB01.value,  thisFolderArray, reportTextArray)
			}
	}


	BT03.onClick = function() {
		//This function will describe how to Cancel the function
		win02.close();
	}

	//alert ('displaySecondWindow was running');
	win02.show();
} //end of function displaySecondWindow



//PART 03: FUNCTIONS USED IN 'collectFiles_OnABatch_part_01_v01.jsx'
function GET_EXCLUDE_INFO(text) {
	//this function is to get from a string useful infos about what folders NOT to treat during the process.
	//For example : \'[20-40] , 10 , 50\'  means : \'do NOT process from folder n°20 to folder n°40, and also n°10 and n°50);
	//is used in  'collectFiles_OnABatch_part_01_v01.jsx'
	var arrayWSpace = text.replace(/\s/gi,'');
	var array = arrayWSpace.split(',');
	var resultText_arr = []
	var resultOrder_arr = []
	for (var i = 0; i < array.length ; i ++) {
	var thisData = array[i];
	var foundFigures =  thisData.match(/(\d{4}|\d{3}|\d{2}|\d{1})/g)
	if (String(parseInt(thisData)) != 'NaN' && thisData.match(/(-|_)/g) === null) {
		resultText_arr.push('N.'+lpad(thisData,3) + ' / ');
		resultOrder_arr.push(parseInt(thisData) -1);
		}
	else if (foundFigures.length === 2) {
		var firstTerm = parseInt(foundFigures[0]);
		var secondTerm = parseInt(foundFigures[1]);
		var fromToLine = 'from N.' + String(lpad(firstTerm,3) )+ ' to N.' + String(lpad(secondTerm, 3));
		resultText_arr.push(fromToLine);
		resultOrder_arr.push(firstTerm -1);
		var a = 1;
		while (firstTerm+ a <= secondTerm) {
			resultOrder_arr.push( firstTerm -1 + a);
			a ++  ;
			}
		}
		}//end for loop

	if (resultText_arr.length > 0) {
		var  resultText_str = 'NOT PROCESSED : FOLDERS '+ resultText_arr.join(' / ');
		return [resultText_str, resultOrder_arr];
		}
	else {
		return null;
		}    
    }//end function GET_EXCLUDE_INFO



function executeTxtFile(anyTxtFile) {
	anyTxtFile.open();
	anyTxtFile.execute(); 
	alert(anyTxtFile.name + ' is opened');
	anyTxtFile.close();
	}



function convertArrayInText (array) {
	var thisSep = '\n';
	var modifiedArrayToString = array.join(thisSep);
	//alert( 'convertArrayInText function was running. modifiedArrayToString.toString() : ' + modifiedArrayToString.toString());
	return modifiedArrayToString;
}



function doMyArraySplice(ARRAY_01, spliceIndex, opt, ARRAY_02) {
	//alert ('ARRAY_02.length : ' + ARRAY_02.length);    
	ARRAY_01.splice(spliceIndex, opt);
	
	for (var i = 0; i < ARRAY_02.length ; i ++) {
	ARRAY_01.splice(spliceIndex+i, 0, ARRAY_02[i].toString());
	}
	return ARRAY_01;
}



function displayFinalMessage(textValue, reportFileFullPath, txtFile) {
	// this function will be included at the LAST part of full batch program 
		//->(for the 'collect batch', the function is used at the end of 'collectFiles_OnABatch_part_01_v01.jsx')
	winFinal.orientation = 'column';
	var G01A = winFinal.add('group', undefined, '');
	var thisText = winFinal.add('statictext', undefined, 'Script completed. Below is the report of the script;' );
	var ET04a = winFinal.add('edittext', [10, 40, 700, 540], textValue, { multiline: true });
	ET04a.text = textValue;
	var thisText01 = winFinal.add('statictext', undefined, 'You can also find the report here :' );
	var GP00 = winFinal.add('group', undefined, '');
	GP00.orientation = 'row';
	var ET04b = GP00.add('edittext', undefined, reportFileFullPath);
	var BT02 = GP00.add('button', undefined, 'Open Report');
	var BT03 = winFinal.add('button', undefined, 'OK!');
	
	BT02.onClick = function() {
		//This function will describe how to close the function
		txtFile.execute();
		}

	BT03.onClick = function() {
		//This function will describe how to close the function
		winFinal.close();
		}

	winFinal.center();
	winFinal.show();

}//end of function repairLinks_onABatch()
