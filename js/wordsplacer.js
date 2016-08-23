/**
 * 
 */

function placeWords(inWordsArr)
{
	"use strict";
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
	
	var Rotations = {
			HOR: {value: 0, name : "Horizontal"},
			VERT: {value: 1, name : "Vertical"},
			DIAG: {value: 2, name : "Diagonal"}
	};
	
	Object.freeze(Rotations);
	
	var Position = function () { return {
			startX:-1,
			startY:-1,
			length:0,
			rotation: undefined
		}
	};
	
	var Word = function (wordText){
		return {
			text: wordText,
			length: wordText.length,
			position: new Position()
		}
	};
	
	let MATRIX_SIZE = 8;
	
	// Create array of words objects
	var wordsArray = [];
	for (let oneText of inWordsArr) {
		wordsArray.push(new Word(oneText));
	}
	
    // Build matrix 8x8
	var matrix = new Array(MATRIX_SIZE);
	for(var idx = 0; idx < matrix.length; idx++) {
		matrix[idx] = new Array(MATRIX_SIZE).fill("");
	}

    // Create array of unplaced words
    // Create array of placed words
	var placedWords = []; 
	var notplacesWords = [];
	var positions = new Map();
	
	// for each word
	for( var oneWord of wordsArray )
	{
		positions.set(Rotations.HOR, []);
		positions.set(Rotations.VERT, []);
		positions.set(Rotations.DIAG, []);
		// for each rotation
		for (let oneRotation of [Rotations.HOR, Rotations.VERT, Rotations.DIAG] )
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
                    if( oneRotation == Rotations.HOR &&
                        (posX + oneWord.length) > MATRIX_SIZE )
                    {
                        continue;
                    }
                    if( oneRotation == Rotations.VERT &&
                        (posY + oneWord.length) > MATRIX_SIZE )
                    {
                        continue;
                    }

                    if( oneRotation == Rotations.DIAG &&
                        ((posX + oneWord.length) > MATRIX_SIZE ||
                         (posY + oneWord.length) > MATRIX_SIZE) )
                    {
                        continue;
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
                        posX += 1 * (oneRotation == Rotations.HOR || oneRotation == Rotations.DIAG) ? 1:0;
                        posY += 1 * (oneRotation == Rotations.VERT || oneRotation == Rotations.DIAG) ? 1:0;
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
		} //for (let oneRotation of Rotations )

		//TODO: move to variable rotations amount 
		// if we have positions available, choose one and place word there
		let cntHor = positions.get(Rotations.HOR).length;
		let cntVert = positions.get(Rotations.VERT).length;
		let cntDiag = positions.get(Rotations.DIAG).length;
			
		//if we have at least one position... 
	    if( (cntHor + cntVert + cntDiag) > 0 )
	    {
	    	// choose one of available rotations.
	    	// need as, i.e., DIAG rotation has less amount and being selected less than others
			let posArr = [];
			if ( positions.get(Rotations.HOR).length > 0 ) {
				posArr.push(positions.get(Rotations.HOR));
			}
			if ( positions.get(Rotations.VERT).length > 0 ) {
				posArr.push(positions.get(Rotations.VERT));
			}
			if ( positions.get(Rotations.DIAG).length > 0 ) {
				posArr.push(positions.get(Rotations.DIAG));
			}

			let selRotationIdx = Math.floor(Math.random() * posArr.length + 1); 

	    	// from rotation choosen select one of positions 
	        let randIdx = Math.floor(Math.random() * posArr[selRotationIdx - 1].length + 1);
	        oneWord.position = posArr[selRotationIdx - 1][randIdx - 1];
	        placedWords.push(oneWord);
	        
	        // fill the matrix with current word
        	let posX = oneWord.position.startX;
        	let posY = oneWord.position.startY;
	        for( let idx = 0; idx < oneWord.length; idx++ ) 
	        {
	        	matrix[posX][posY] = oneWord.text.charAt(idx);

	        	//TODO: Refactor
                // increase matrix coords
                posX += 1 * (oneWord.position.rotation == Rotations.HOR || oneWord.position.rotation == Rotations.DIAG) ? 1:0;
                posY += 1 * (oneWord.position.rotation == Rotations.VERT || oneWord.position.rotation == Rotations.DIAG) ? 1:0;
	        }
	    }
	    else
	    {
	    	notplacesWords.push(oneWord);
	    }
	} //for( var oneWord of wordsArray )
	
	console.log("Words placed: " + placedWords.length);
	alert("Words notplaced: " + notplacesWords.length);
	let alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split(""); 
	
	// fill matrix gaps with arbitrary letters
	for( let idx=0; idx < MATRIX_SIZE; idx++ ) {
		for( let idy=0; idy < MATRIX_SIZE; idy++ ) {
			if( matrix[idx][idy] == "" ) {
				matrix[idx][idy] = alphabet[ Math.floor(Math.random() * alphabet.length + 1)-1 ];
			}
			else {
				matrix[idx][idy] = "<b>" + matrix[idx][idy] + "</b>";
			}
		}
	}
	
	// print result matrix for debug purposes
	document.write("<table>");
	for( let idx=0; idx < MATRIX_SIZE; idx++ ) 
	{
		document.write("<tr>");

		for( let idy=0; idy < MATRIX_SIZE; idy++ ) 
		{
			document.write("<td>" + matrix[idx][idy] + "</td>");
		}
		document.write("</tr>");
	}
	document.write("</table>");
}


//( placeWords(["АЛЬКОР", "ТРУБА", "ОСЬМИЗНАК", "ВЕНТИЛЯТ", "ГРЫМЗА", "ДВА", "КРЫША", "СЕМЕНЫЧ", "ЯБЛОКО", "НЕМЕЦ"]) )();



