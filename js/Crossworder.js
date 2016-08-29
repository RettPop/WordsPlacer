/**
 * 
 */

var Crossworder = (function()
{
	"use strict";
	
	var Rotations = {
			HOR: 		{value: 0, name : "Horizontal", 				icon:"➡", deltaV : 1,  deltaH : 0},
			RHOR: 		{value: 1, name : "Reverse Horizontal", 		icon:"⬅", deltaV : -1, deltaH : 0},
			VERT: 		{value: 2, name : "Vertical", 					icon:"⬇", deltaV : 0,  deltaH : 1},
			RVERT: 		{value: 3, name : "Reverse Vertical", 			icon:"⬆", deltaV : 0,  deltaH : -1},
			DIAG_DEGR: 	{value: 4, name : "Diagonal Degrading", 		icon:"↘", deltaV : 1,  deltaH : 1},
			RDIAG_DEGR: {value: 5, name : "Reverse Diagonal Degrading", icon:"↖", deltaV : -1, deltaH : -1},
			DIAG_GROW: 	{value: 6, name : "Diagonal Growing", 			icon:"↗", deltaV : 1,  deltaH : -1},
			RDIAG_GROW: {value: 7, name : "Reverse Diagonal Growing", 	icon:"↙", deltaV : -1, deltaH : 1}
	};
	
	Object.freeze(Rotations);

	//=============================================================================	
	// utility function
	function shuffle(array) 
	{
	    var counter = array.length;
	    var newArr = array.slice();

	    // While there are elements in the array
	    while (counter > 0) 
	    {
	        // Pick a random index
	        let index = Math.floor(Math.random() * counter);

	        // Decrease counter by 1
	        counter--;

	        // And swap the last element with it
	        let temp = newArr[counter];
	        newArr[counter] = newArr[index];
	        newArr[index] = temp;
	    }

	    return newArr;
	}
	
	
	function fillGaps(targetMatrix, alphabet) {
		// fill matrix gaps with arbitrary letters
		for( let idx=0; idx < targetMatrix.length; idx++ ) {
			for( let idy=0; idy < targetMatrix[idx].length; idy++ ) {
				if( targetMatrix[idx][idy] == "" ) {
					targetMatrix[idx][idy] = alphabet[ Math.floor(Math.random() * alphabet.length + 1)-1 ];
				}
				else {
					targetMatrix[idx][idy] = "<b>" + targetMatrix[idx][idy] + "</b>";
				}
			}
		}

	}
	
	function prepareWordsList(wordsList)
	{
		var targetArr = []
		wordsList.split(/[^a-zA-Zа-яА-Я]/).forEach( function (item, idx, arr){
			// word length starts from 3 characters
			if( (item.trim().length > 2) && (-1 == targetArr.indexOf(item.toUpperCase())) ) {
				targetArr.push(item.toUpperCase().trim());
			}
		} )
		
		return targetArr;
	}
	

	//=============================================================================	
	function placeWords (inWordsList, rotationsArr, matrixSize)
	{
		/*
		 * Build 8x8 matrix
		 * Take one word
		 * 
	    Create array of words objects
	    Create array of unplaced words
	    Create array of placed words
	    Build matrix 8x8
	    Take word from provided list regarding fetching rules
	    Run through the matrix beginning from 0,0:
	        Inspect all cells of the matrix, corresponding to current word's letters.
	        If the cell is empty or contain same letter that placed in current word on same index, move to next cell.
	        If last word's letter was placed successfully new Position object is created and placed to available positions array. Searching started from next cell from the beginning of word.
	        If the cell is not empty and contains letter different from those in word, OR next word's letter is out of matrix bounds, searching starting from next cell for the beginning of word.
	        Matrix inspecting is repeated one time for each possible rotation.
	    If no positions were found for current word, it is placed to Not placed words array.
	    If current word was placed:
	    random position is selected from Positions array
	    Position object is assigned to the Word object
	    word is moved to Placed words array
	    Word's letters placed to the matrix to corresponding positions
	    Filled matrix, placed and unplaced words arrays are returned to receiver
	
		 */
			
		var Position = function () { return {
				startX:-1,
				startY:-1,
				length:0,
				rotation: undefined
			};
		};
		
		var Word = function (wordText){
			return {
				text: wordText,
				length: wordText.length,
				position: new Position()
			};
		};
		
		const MATRIX_SIZE = matrixSize || 8;
		
		//================================================================================
		// Create array of words objects
		// Remove duplicates
		// Shuffle randomly
		var shuffledWords = [];
		if( typeof inWordsList == "string" ) {
			shuffledWords = shuffle( prepareWordsList(inWordsList) );
		}
		else if( inWordsList.length > 0 ) {
			shuffledWords = shuffle( inWordsList );
		}

		var wordsArray = [];
		for (let oneText of shuffledWords) {
			wordsArray.push(new Word(oneText.toUpperCase()));
		}
		
		shuffledWords.length = 0;
		
	    // Build matrix 8x8
		var matrix = new Array(MATRIX_SIZE);
		for(var idx = 0; idx < matrix.length; idx++) {
			matrix[idx] = new Array(MATRIX_SIZE).fill("");
		}
	
	    // Create array of unplaced words
	    // Create array of placed words
		var placedWords = []; 
		var notplacedWords = [];
		var positions = new Map();
		
		var rotationsAvailable = []; 
		if( rotationsArr == undefined || 0 == rotationsArr.length ) 
		{
			Object.keys(Rotations).forEach( function(item, index, array) { 
				rotationsAvailable.push( Rotations[item] ); 
			} );
		}
		else
		{
			rotationsArr.forEach(function(item, index, array) { 
					rotationsAvailable.push( Rotations[item] );
				} 
			);
		}
			
		
		// for each word
		for( var oneWord of wordsArray )
		{
			// reset rotations map with empty arrays
			rotationsAvailable.forEach( function(item, index, array) { 
					positions.set( item, [] ); 
				} 
			);
			
			// for each rotation
			for (let oneRotation of positions.keys() )
			{
				// running through the matrix and trying to place
				for(let idx = 0; idx < matrix.length; idx++)
				{
					for(let idy = 0; idy < matrix[idx].length; idy++)
					{
						let posX = idx;
						let posY = idy;
	
	                    //TODO: Optimize check
	                    // check if word can fit rest of cells
						if( posX + oneRotation.deltaH * (oneWord.length) < -1 ||
							posX + oneRotation.deltaH * (oneWord.length) > MATRIX_SIZE ) 
						{
							continue
						}
							
						if( posY + oneRotation.deltaV * (oneWord.length) < -1 ||
							posY + oneRotation.deltaV * (oneWord.length) > MATRIX_SIZE ) 
						{
							continue
						}
	
	
						// walk through all word letters and check if they can be placed in the matrix
	                    var canBePlaced = true;
						for( let idxLetter = 0; idxLetter < oneWord.length; idxLetter++ )
						{
	                        const matrixCell = matrix[posX][posY];
	
	                        if( matrixCell != "" &&
	                            matrixCell != oneWord.text.charAt(idxLetter) )
	                        {
	                            canBePlaced = false;
	                            break;
	                        }
	
	                        // increase matrix coords
 	                        posY += oneRotation.deltaV;
 	                        posX += oneRotation.deltaH;
						}
	
	                    // if no obstacles were found, add position to available positions array and continue
	                    if( canBePlaced )
	                    {
	                        var position = new Position();
	                        position.startX = idx;
	                        position.startY = idy;
	                        position.rotation = oneRotation;
	                        position.length = oneWord.length;
	
	                        positions.get(oneRotation).push(position);
	                    }
					} //for vary
				} //for(var idx = 0; idx < matrix.length; idx++)
			} //for (let oneRotation of positions.keys() )
	
			// if we have positions available, choose one and place word there
			let posArr = [];
			positions.forEach( function (oneRotationArr, oneRotation, map) {
				if( oneRotationArr.length > 0 ) {
					posArr.push(oneRotationArr);
				}
			} );
				
			//if we have at least one position... 
		    if( 0 == posArr.length ) {
		    	notplacedWords.push(oneWord);
		    }
		    else
		    {
		    	// choose one of available rotations.
		    	// need as, i.e., DIAG rotation has less amount and being selected less than others
				let selRotationIdx = Math.floor(Math.random() * posArr.length + 1); 
	
		    	// from rotation chosen select one of positions 
		        let randIdx = Math.floor(Math.random() * posArr[selRotationIdx - 1].length + 1);
		        oneWord.position = posArr[selRotationIdx - 1][randIdx - 1];
		        placedWords.push(oneWord);
		        
		        // fill the matrix with current word
	        	let posX = oneWord.position.startX;
	        	let posY = oneWord.position.startY;
		        for( let idx = 0; idx < oneWord.length; idx++ ) 
		        {
		        	matrix[posX][posY] = oneWord.text.charAt(idx);
	
	                // increase matrix coords
	                posX += oneWord.position.rotation.deltaH;
	                posY += oneWord.position.rotation.deltaV;
		        }
		    }
		} //for( var oneWord of wordsArray )
		
//		console.log("Words placed: " + placedWords.length);
//		alert("Words notplaced: " + notplacedWords.length);
//		fillGaps(matrix, "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split(""));
				
		return {
			id: Math.floor(Math.random() * 1024 + 1),
			matrix: matrix,
			placed: placedWords.map( function(word){ return word.text; } ), 
			notPlaced: notplacedWords.map( function(word){ return word.text; } ),
		}
	}//function placeWords
	
	//=============================================================================	
	return {
		placeWords: placeWords,
		Rotations: Rotations,
		fillGaps: fillGaps,
		prepareWordsList: prepareWordsList
	};
}) ();
