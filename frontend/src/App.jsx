import Grid from "./Grid.jsx"
import React, { useEffect, useState } from "react"

function App(){

  const [darkMode, setDarkMode] = useState(false);


  return(

    <div className="app">
      <h1 className="title" >Sudoku Solver</h1>
      <Grid/>

    </div>

    
  )
}

export default App