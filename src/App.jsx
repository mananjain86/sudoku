import { useState, useRef, useEffect } from "react";
function App() {
  // const startingBoard = [
  //   ['5', '3', '', '', '7', '', '', '', ''],
  //   ['6', '', '', '1', '9', '5', '', '', ''],
  //   ['', '9', '8', '', '', '', '', '6', ''],
  //   ['8', '', '', '', '6', '', '', '', '3'],
  //   ['4', '', '', '8', '', '3', '', '', '1'],
  //   ['7', '', '', '', '2', '', '', '', '6'],
  //   ['', '6', '', '', '', '', '2', '8', ''],
  //   ['', '', '', '4', '1', '9', '', '', '5'],
  //   ['', '', '', '', '8', '', '', '7', '9']
  // ];

  // const getInitialBoard = () => startingBoard.map(row => [...row]);
  
  const [startingBoard, setStartingBoard] = useState([]);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solutionBoard, setSolutionBoard] = useState([]);

  const inputRefs = useRef(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );

  useEffect(() => {
    fetchBoard();
  }, []);


  const fetchBoard = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      const data = await response.json();
      const rawPuzzle = data.newboard.grids[0].value;
      const rawSolution = data.newboard.grids[0].solution;
  
      const newPuzzle = rawPuzzle.map(row =>
        row.map(cell => cell === 0 ? '' : String(cell))
      );
  
      const solutionPuzzle = rawSolution.map(row =>
        row.map(cell => String(cell))
      );
  
      setStartingBoard(newPuzzle);
      setBoard(newPuzzle.map(row => [...row])); 
      setSolutionBoard(solutionPuzzle);
    } catch (error) {
      console.error('Error fetching Sudoku board:', error);
      alert('Failed to fetch puzzle!');
    } finally {
      setLoading(false);
    }
  };

  const checkBoardWithSolution = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solutionBoard[row][col]) {
          alert('Incorrect Solution');
          return false;
        }
      }
    }
    alert('Congratulations! Correct Solution');
    return true;
  };

  const solveBoard = () => {
    setBoard(solutionBoard.map(row => [...row]));
  };

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
    fetchBoard();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-300">
        <h1 className="text-4xl font-bold text-slate-800">Loading Puzzle...</h1>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-slate-300 flex flex-col p-6">
      <h1 className="text-5xl font-bold text-slate-800 mb-16 text-center">SUDOKU</h1>
  
      <div className="flex flex-row justify-center items-start gap-16">
    
        <div className="grid grid-cols-9 gap-[1px] bg-black border-4 border-black">
          {board.map((row, rowIndex) =>
            row.map((cell, columnIndex) => {
              const topBorder = rowIndex % 3 === 0;
              const leftBorder = columnIndex % 3 === 0;
              const isFixed = startingBoard[rowIndex][columnIndex] !== '';
  
              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={`w-16 h-16 text-3xl font-medium text-gray-800 text-center leading-[60px] border border-gray-300
                  ${topBorder ? 'border-t-2 border-t-gray-800' : ''}
                  ${leftBorder ? 'border-l-2 border-l-gray-800' : ''} bg-white`}>
                  {isFixed ? (
                    <div className="text-gray-600">{cell}</div>
                  ) : (
                    <input
                      type="text"
                      value={cell}
                      maxLength={1}
                      onChange={(e) => handleChange(rowIndex, columnIndex, e.target.value)}
                      ref={(el) => (inputRefs.current[rowIndex][columnIndex] = el)}
                      className="w-full h-full text-center outline-none"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
  
        <div className="flex flex-col gap-4 mt-96 pl-4">
          <button onClick={handleNewGame} className="px-64 py-3 text-xl bg-slate-800 text-white rounded-lg hover:bg-slate-700">New Game</button>
  
          <button onClick={checkBoardWithSolution} className="px-10 py-3 text-xl bg-slate-800 text-white rounded-lg hover:bg-slate-700">Check Board</button>
  
          <button onClick={solveBoard} className="px-10 py-3 text-xl bg-slate-800 text-white rounded-lg hover:bg-slate-700">Solve Puzzle</button>
        </div>
      </div>
    </div>
  );
}

export default App;
