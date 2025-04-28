import { useState, useRef } from "react";
function App() {
  const startingBoard = [
    ['5', '3', '', '', '7', '', '', '', ''],
    ['6', '', '', '1', '9', '5', '', '', ''],
    ['', '9', '8', '', '', '', '', '6', ''],
    ['8', '', '', '', '6', '', '', '', '3'],
    ['4', '', '', '8', '', '3', '', '', '1'],
    ['7', '', '', '', '2', '', '', '', '6'],
    ['', '6', '', '', '', '', '2', '8', ''],
    ['', '', '', '4', '1', '9', '', '', '5'],
    ['', '', '', '', '8', '', '', '7', '9']
  ];

  const getInitialBoard = () => startingBoard.map(row => [...row]);

  const [board, setBoard] = useState(getInitialBoard());

  const inputRefs = useRef(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );

  const handleChange = (rowIndex, columnIndex, value) => {
    if (value === '' || /^[1-9]$/.test(value)) {
      const updatedBoard = board.map((row, r) =>
        row.map((cell, c) => (r === rowIndex && c === columnIndex ? value : cell))
      );
      setBoard(updatedBoard);
  
      if (/^[1-9]$/.test(value)) {
        skipCell(rowIndex, columnIndex);
      }
    }
  };

  const skipCell = (rowIndex, columnIndex) => {
    let nextRow = rowIndex;
    let nextCol = columnIndex;
  
    while (true) {
      nextCol++;
      if (nextCol > 8) {
        nextCol = 0;
        nextRow++;
      }
      if (nextRow > 8) {
        break;
      }
  
      const isFixed = startingBoard[nextRow][nextCol] !== '';
      const isFilled = board[nextRow][nextCol] !== '';
  
      if (!isFixed && !isFilled) {
        const nextInput = inputRefs.current[nextRow][nextCol];
        if (nextInput) {
          nextInput.focus();
        }
        break;
      }
    }
  };

  const checkBoard = () => {
    const isValidGroup = (group) => {
      const nums = group.filter(cell => cell !== '');
      const uniqueNums = new Set(nums);
      return nums.length === 9 && uniqueNums.size === 9;
    };

    for (let row = 0; row < 9; row++) {
      if (!isValidGroup(board[row])) {
        alert('Row ' + (row + 1) + ' is invalid.');
        return false;
      }
    }
 
    for (let col = 0; col < 9; col++) {
      const column = board.map(row => row[col]);
      if (!isValidGroup(column)) {
        alert('Column ' + (col + 1) + ' is invalid.');
        return false;
      }
    }
  
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const square = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            square.push(board[boxRow + r][boxCol + c]);
          }
        }
        if (!isValidGroup(square)) {
          alert('3x3 Square starting at Row ' + (boxRow + 1) + ', Column ' + (boxCol + 1) + ' is invalid.');
          return false;
        }
      }
    }
  
    alert('Congratulations! Sudoku is correctly solved! 🎉');
    return true;
  };

  const handleNewGame = () => {
    setBoard(getInitialBoard());
  };

  return(
    <div className="min-h-screen bg-slate-300 flex flex-col p-6">
      <h1 className="text-5xl font-bold  text-slate-800 mb-16 text-center">SUDOKU</h1>

      

      <div className="grid grid-cols-9 gap-[1px] bg-black w-fit mx-60 border-4 border-black">
        {board.map((row, rowIndex) => 
          row.map((cell, columnIndex) => {
          const topBorder = rowIndex % 3 == 0;
          const leftBorder = columnIndex % 3 == 0;
          const isFixed = startingBoard[rowIndex][columnIndex] != '';

          return(
            <div key={`${rowIndex}-${columnIndex}`} className={`w-16 h-16 text-3xl font-medium text-gray-800 text-center leading-[60px] border border-gray-300
            ${topBorder ? 'border-t-2 border-t-gray-800' : ''}
             ${leftBorder ? 'border-l-2 border-l-gray-800' : ''}
             bg-white`}>
            {isFixed ? (<div className="text-gray-600">{cell}</div>) : (
              <input type="text" value={cell} maxLength={1} onChange={(e) => handleChange(rowIndex, columnIndex, e.target.value)} className="w-full h-full text-center outline-none" ref={(el) => (inputRefs.current[rowIndex][columnIndex] = el)}
              />
            )}
             </div>
          )
        }))}
      </div>

      <div className="flex justify-end mr-40 -mt-12">
        <button onClick={handleNewGame} className="px-10 py-3 text-xl bg-slate-800 text-white rounded-lg hover:bg-slate-700">New Game</button>
        <button onClick={checkBoard} className="px-10 py-3 text-xl bg-green-700 text-white rounded-lg hover:bg-green-600 ml-4">Check Solution</button>
      </div>
    </div>
  )
}

export default App;