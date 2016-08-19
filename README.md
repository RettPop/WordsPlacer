# WordsPlacer
JS application to place words to matrix a-la crossword
# Requirements 
1. It is needed to deploy set of provided words to 8x8 table.  
2. Words length: 3-8 letters 
3. Words placement can have following directions:  
  1. horizontal left to right 
  2. vertical top to bottom 
  3. diagonal top left to bottom right. Rotation angle == 45oC 
4. Rest of space should be filled with arbitrary letters 
5. Words are provided as array by user 
6. Words should be placed beginning from first provided.  
7. If word can't be placed due lack of space, it should be marked unplaced and listed in corresponding list to user 
8. Layout process should be stopped once all words from the list was tried to be placed.  
 
# Algo 
1. Create array of words objects 
2. Create array of unplaced words 
3. Create array of placed words 
4. Build matrix 8x8 
5. Take word from provided list regarding fetching rules 
6. Run through the matrix beginning from 0,0: 
  1. Inspect all cells of the matrix, corresponding to current word's letters.  
  2. If the cell is empty or contain same letter that placed in current word on same index, move to next cell. 
  3. If last word's letter was placed successfully new Position object is created and placed to available positions array. Searching started from next cell from the beginning of word. 
  4. If the cell is not empty and contains letter different from those in word, OR next word's letter is out of matrix bounds, searching starting from next cell for the beginning of word. 
  5. Matrix inspecting is repeated one time for each possible rotation.  
7. If no positions were found for current word, it is placed to Not placed words array. 
8. If current word was placed: 
9. random position is selected from Positions array 
10. Position object is assigned to the Word object 
11. word is moved to Placed words array 
12. Word's letters placed to the matrix to corresponding positions 
13. Filled matrix, placed and unplaced words arrays are returned to receiver 
 
In future versions it is possible to create Letter object that will have following properties: 
1. Letter 
2. Words array 
3. Index of letter in the word, 
to perform some operations like words erasure from the matrix. 
 
## Word object
1. Text
2. Length
3. First letter X position: -1 default 
4. First letter Y position: -1 default 
5. Rotation: 
  1. Horizontal 
  2. Vertical 
  3. Diagonal 
 
## Position object 
1. Start X 
2. Start Y 
3. Length 
4. Rotation: 
  1. Horizontal 
  2. Vertical 
  3. Diagonal 
 
