//Function to rewrite on a shorter form for an Array;

// what is the goal of that function :

/*
Séparer une array en prenant en compte le résultat et l'index.

Exemple resultat 1 et resultat 2;
Ensuite pour chaque résultat il faut gerer les index de cette façon;
"La situation dite 'resultat 1' concerne tel nombre de plans:
Répartis de cette façon :
du plan x inclus au plan y inclus;
le plan x,
les plans x, y et z,
du plan x inclus au plan y inclus;


[ [i1, i2] [r1, r2]]

write me a javascript for after effects please.
I need a function that will handle a array.
Description of the needed array in function parameter:
the array is made out of two arrays. the two arrays within have the same length. the first array contains only integers. the second arrays contains only string
during the function:
a empty array variable is created, called resultsArray.
Empty array variables are created : 15 empty arr var, named with this logic: "metElement_01", "metElement_02"...
a for loop (with var i)loops through the "strings" array.
Each time a string is encountered, it is compared to the previous strings met.
If if is the first time the string is found, the resultsArray.push() another new array that is made like this ["new string encoutered" , [integers Array [i]] ]

If this string has already been seen:
First it then must be located in resultsArray : for example it could be located a this point : resultsArray[j][0].
Then the value of integers Array [i] must be pushed with .push() in resultsArray[j][1]

Then a string variable must be created from resultsArray with this logic : for each element in the array resultsArray, a sentence must be written like this, for example:" for this result " + value of  resultsArray[k][0] + ", " + resultsArray[k][1].length + "folders or shots were concerned";

These sentences should be sorted according the ranking of respective resultsArray[k][1].length : the string that has the biggest resultsArray[k][1].length should be written in first.
The final string must be returned as the result of the whole function.
At the end please alert the result of the function.

*/


//alert ("2");


// 1/ Padding function for formatting numbers
function lpad(value, padding) {
    var zeroes = new Array(padding + 1).join("0");
    var result = (zeroes + value).slice(-padding);
    return result;
}

		var thisSep_01 = "\
"

  // 2/ New function to analyze number sequences
function getMsg_fromIntArray(numArray) {
	var stringArray = numArray[1];  // Array of strings
    var intArray = numArray[0];  // Array of integers
	//alert ("numArray.toString() : "+ numArray.toString());
    //var sorted = intArray.slice().sort(function(a, b) { return a - b; });
    var messageArr = [];

    var start = intArray[0];
    var tempSeqInt = [start];
	var tempSeqString = [stringArray[0]];

    for (var i = 1; i <= intArray.length; i++) {
        if (intArray[i] === intArray[i - 1] + 1) {
            tempSeqInt.push(intArray[i]);
			tempSeqString.push(stringArray[i]);
        } else {
            if (tempSeqInt.length === 1) {
                messageArr.push("n." + lpad(tempSeqInt[0], 3) + " ('" + tempSeqString[0] + "') / ");

            }
			else if (tempSeqInt.length === 2 || tempSeqInt.length === 3) {
                var group = "";
                for (var k = 0; k < tempSeqInt.length; k++) {
                    group += "n." + lpad(tempSeqInt[k], 3) + " ('" + tempSeqString[k] + "') / "; //+ thisSep_01; //(k < tempSeqInt.length - 1 ? ", " : "")
                }
                messageArr.push(group);
            } else if (tempSeqInt.length > 3) {
                messageArr.push("from n." + lpad(tempSeqInt[0], 3) + " ('" + tempSeqString[0] + "')" + "-included," + thisSep_01 + ". . . .  to n." + lpad(tempSeqInt[tempSeqInt.length - 1], 3) + " ('" + tempSeqString[tempSeqString.length - 1] + "')" + "-included /");
            }

            if (i < intArray.length) {
                tempSeqInt = [intArray[i]];
				tempSeqString = [stringArray[i]];
            }
        }
    }

    // Now merge non-"included" lines together
    var mergedArr = [];
    var tempMerge = [];

    for (var m = 0; m < messageArr.length; m++) {
        var msg = messageArr[m];
        if (msg.indexOf("included") === -1) {
            // Extract numbers only and store
            var numbers = msg.match(/n.\d{3}/g);
            if (numbers) {
                tempMerge = tempMerge.concat(numbers);
            }
        } else {
            // If we have collected numbers, flush them before pushing "included" message
            if (tempMerge.length > 0) {
                var mergedStr = (tempMerge.length === 1 ? "" : "the items ") + tempMerge.join(", ");
                mergedArr.push(mergedStr);
                tempMerge = [];
            }
            mergedArr.push(msg);
        }
    }

    // Final flush if needed
    if (tempMerge.length > 0) {
        var finalMergedStr = (tempMerge.length === 1 ? "" : "the items ") + tempMerge.join(", ");
        mergedArr.push(finalMergedStr);
    }

    // Define separator if not already defined


    return messageArr.join("");
	//return mergedArr.join(";" + thisSep_01);
}



var testArray = [["b","c","c","a","c","b","b","b","b", "a"],[0,1,2,3,4,5,6,7,8,9], ["name00","name01","name02","name03","name04","name05","name06","name07","name08","name09"]]
var testIntArr = [0,1,2,4,6,7,8,9]

//getMsg_fromIntArray(testIntArr);

function getShorterArray(dataArrays) {
	var stringArray = dataArrays[0];  // Array of strings
    var intArray = dataArrays[1];  // Array of integers
	var nameArray = dataArrays[2];
    var resultsArray = [];
    var alinea = "  "

    // Create 15 empty arrays named metElement_01 to metElement_15
    var metElements = {};
    for (var m = 1; m <= 15; m++) {
        var name = "metElement_" + ("0" + m).slice(-2);
        metElements[name] = [];
    }

    for (var i = 0; i < stringArray.length; i++) {
        var str = stringArray[i];
        var intVal = intArray[i];
		var itemName = nameArray[i];
        var found = false;

        // Check if the string already exists in resultsArray
        for (var j = 0; j < resultsArray.length; j++) {
            if (resultsArray[j][0] === str) {

			   resultsArray[j][1].push(intVal);
                found = true;
				resultsArray[j][2].push(itemName);
                break;
            }
        }

        // If not found, add new entry
        if (!found) {
            resultsArray.push([str, [intVal], [itemName]]);
        }
    }
	//alert (resultsArray.join("\n\ "));










    //3/ Create summary strings
    var summaryStrings = [];
    for (var k = 0; k < resultsArray.length; k++) {
        var label = resultsArray[k][0];
        var count = resultsArray[k][1].length;
		var detailsToProcess = [resultsArray[k][1],resultsArray[k][2]];
		//alert (detailsToProcess.toString());
		var details = getMsg_fromIntArray(detailsToProcess);
        if (count < 2){
            var aepWord = ".AEP file"
            }
         if (count >= 2){
            var aepWord = ".AEP files"
            }
        summaryStrings.push({
            label: label,
            sentence:  count + " " + aepWord + " : --------> " + "\"" + label + "\"" + thisSep_01 + alinea + "LIST: " + details,
            count: count
        });
    }

	//alert ("01 : " + summaryStrings[0].count.toString());
    // Sort by count descending
    summaryStrings.sort(function(a, b) {
		//alert ("a.count = :" + a.count + " and b.count = " + b.count + " ; b.count - a.count = " + (b.count - a.count) );
		/* explanation of this one:
		Return greater than 0 if a is greater than b
		Return 0 if a equals b
		Return less than 0 if a is less than b
		*/
        return b.count - a.count;
    });
		//alert ("02 : " + summaryStrings.values());

    // Combine into one final string
    var finalArray = [];
    for (var s = 0; s < summaryStrings.length; s++) {
        finalArray.push(summaryStrings[s].sentence + thisSep_01 + thisSep_01) // + thisSep_01;
    }

    // Alert the result
    //alert("finalArray.length : "+ finalArray.length + "\n\ " + "finalArray : "+ finalArray.join(thisSep_01));

    return finalArray;
}

//alert (getShorterArray(testArray));
