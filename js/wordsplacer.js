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
	
	var ROTATION = {
			HOR: {value: 0, name : "Horizontal"},
			VERT: {value: 1, name : "Vertical"},
			DIAG: {value: 2, name : "Diagonal"},
	};
	
	Object.freeze(ROTATION);
	
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
	var placedWords, notplacesWords, positions = [];
	
	// for each word
	for( var oneWord of wordsArray )
	{
		// for each rotation
		for (let oneRotation of Rotations )
		{
			// running through the matrix and trying to place
			for(var idx = 0; idx < matrix.length; idx++)
			{
				for(var idy = 0; idy < matrix[idx].length; idx++)
				{
					var posX = idx;
					var posY = idy;

                    //TODO: Optimize check
                    // check if word can fit rest of cells
                    if( rotation == Rotations.HOR &&
                        (posX + oneWord.length) > MATRIX_SIZE )
                    {
                        continue;
                    }
                    if( rotation == Rotations.VERT &&
                        (posY + oneWord.length) > MATRIX_SIZE )
                    {
                        continue;
                    }

                    if( rotation == Rotations.DIAG &&
                        ((posX + oneWord.length) > MATRIX_SIZE ||
                         (posY + oneWord.length) > MATRIX_SIZE) )
                    {
                        continue;
                    }

					// walk through all word letters and check if they can be placed in the matrix
                    var canBePlaced = true;
					for( var idxLetter = 0; idxLetter < oneWord.length; idxLetter++ )
					{
                        const matrixCell = matrixp[posX][posY];

                        if( matrixCell != "" &&
                            matrixCell != oneWord[idxLetter] )
                        {
                            canBePlaced = false;
                            break;
                        }

                        // increase matrix coords
                        posX += 1 * (oneRotation == Rotations.HOR_ROTATION || oneRotation == Rotations.DIAG_ROTATION) ? 1:0;
                        posY += 1 * (oneRotation == Rotations.VERT_ROTATION || oneRotation == Rotations.DIAG_ROTATION) ? 1:0;
					}

                    // if no obstacles were found, add position to available positions array and continue
                    if( canBePlaced )
                    {
                        var position = new Position();
                        position.startX = idx;
                        position.startY = idy;
                        position.rotation = oneRotation;
                        position.length = oneWord.length;

                        positions.push(position)
                    }
				} //for vary
			} //for(var idx = 0; idx < matrix.length; idx++)
		} //for (let oneRotation of Rotations )
	} //for( var oneWord of wordsArray )

    // if we have positions available, choose one and place word there
    if(positions.length > 0){

    }
}
