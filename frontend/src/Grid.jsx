import React, { useEffect, useState } from "react"

function Grid(){

    const initialBoard = [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]

    ]

    

    const solveSudoku = async () => {
        try {
            const response = await fetch("http://localhost:5000/solve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ board }),
            });

            const data = await response.json();

            if (data.solvedBoard) {
            setBoard(data.solvedBoard);
            } else {
            alert("No solution found");
            }
        } catch (error) {
            console.error("Error solving sudoku:", error);
        }
    };

    const generateBoard = async () => {
        try {

            const response = await fetch(
                `http://localhost:5000/generate?level=${difficulty}`
            );

            const data = await response.json();
            setBoard(data.board);

            setInitialPuzzle(data.board.map(row => [...row]));

        } catch (error) {
            console.error("Error generating board:", error);
        }
    };

    const [board, setBoard] = useState(initialBoard);
    const [selectedCell, setSelectedCell] = useState(null);
    const [difficulty,setDifficulty] = useState("medium");

    const [initialPuzzle, setInitialPuzzle] = useState(initialBoard);

    
    

    useEffect(() => {
        const handleKeyDown = (e) => {
            if(!selectedCell) return;

            if (initialPuzzle[selectedCell.row][selectedCell.col] !== 0)
                return;

            const key = e.key;

            if(key>="1" && key<="9"){
                const newBoard = board.map(row => [...row]);
                newBoard[selectedCell.row][selectedCell.col] = Number(key);
                setBoard(newBoard);
            }

            if(key==="Delete" || key==="Backspace"){
                const newBoard = board.map(row => [...row]);
                newBoard[selectedCell.row][selectedCell.col] = 0;
                setBoard(newBoard);
            }
            
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }

    }, [selectedCell, board]);

    useEffect(()=>{
        generateBoard();
    },[]);

    function isBoardComplete() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0 || !isValid(board[r][c], r, c)) {
                    return false;
                }
            }
        }

        return true;
    }

    function isValid(value, row, col){
        if(value===0) return true;

        for(let i=0;i<9;i++){
            if(board[row][i] === value && i!==col){
                return false;
            }

            if(board[i][col] === value && i!==row){
                return false;
            }
        }

        const rs=Math.floor(row / 3) * 3;
        const cs=Math.floor(col / 3) * 3;

        for(let i=rs;i<rs+3;i++){
            for(let j=cs;j<cs+3;j++){
                if(board[i][j] === value && (i !== row || j !== col)){
                    return false;
                }
            }
        }

        return true;
    }

    return(
        <div className="container">

            <div className="controls">
                <select
                    value={difficulty}
                    onChange={(e)=>{
                        const newLevel = e.target.value;
                        setDifficulty(newLevel);
                        generateBoard(newLevel);
                    }}
                    className="difficulty-select"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <button onClick={generateBoard} className="newgame-btn">New Game 🎲</button>

            </div>

            

            <div className="grid">
                {
                    board.map((row,rowIndex) => {
                        return row.map((cell,colIndex) => {
                            const rightBorder = (colIndex+1)%3===0 && colIndex !== 8 ;
                            const bottomBorder = (rowIndex+1)%3===0 && rowIndex !== 8

                            const isFixed = initialPuzzle[rowIndex][colIndex] !== 0;
                            const hasError = cell !== 0 && !isValid(cell,rowIndex,colIndex);
                            const isSameRow = selectedCell?.row === rowIndex;
                            const isSameCol = selectedCell?.col === colIndex;
                            const isSameBox =
                                        selectedCell &&
                                        Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                                        Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);

                            return(
                                <button 
                                    className={`cell
                                        ${rightBorder?"thick-right":""}
                                        ${bottomBorder?"thick-bottom":""}
                                        ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "selected":""}
                                        ${isFixed?"fixed":""}
                                        ${hasError?"error":""}
                                        ${isSameRow || isSameCol ? "highlight" : ""}
                                        ${isSameBox ? "highlight-box" : ""}
                                    `}
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => 
                                        setSelectedCell({row: rowIndex,col: colIndex})
                                    }
                                >
                                    {cell !== 0 ? cell:""}
                                </button>
                            )
                        })
                    })
                }
            </div>

            {isBoardComplete() && 
                (
                    <div className="completed">🎉 Sudoku Completed!</div>
                )
            }

            {!isBoardComplete() && 
                (
                    <button onClick={solveSudoku} className="solve-btn">Solve</button>
                )
            }

            

            

        </div>
    )
}

export default Grid