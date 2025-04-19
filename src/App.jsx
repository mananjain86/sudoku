import { useState } from "react";
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
  const [board, setBoard] = useState(startingBoard);

  const handleChange = (rowIndex, columnIndex, value) => {
        if (value == '' || /^[1-9]$/.test(value)) {
          const updatedBoard = board.map((row, r) =>
            row.map((cell, c) => (r == rowIndex && c == columnIndex ? value : cell))
          );
          setBoard(updatedBoard);
        }
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
              <input type="text" value={cell} maxLength={1} onChange={(e) => handleChange(rowIndex, columnIndex, e.target.value)} className="w-full h-full text-center outline-none"
              />
            )}
             </div>
          )
        }))}
      </div>
    </div>
  )
}

export default App;