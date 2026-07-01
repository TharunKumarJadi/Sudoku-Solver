const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/solve", (req, res) => {
    const board = req.body.board;

    if (!board) {
        return res.status(400).json({ error: "Board not provided" });
    }

    const cppProcess = spawn("./solver.exe");

    // Convert board to string input
    const input = board
        .map(row => row.join(" "))
        .join("\n");

    cppProcess.stdin.write(input);
    cppProcess.stdin.end();

    let output = "";


    cppProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    cppProcess.stderr.on("data", (data) => {
        console.error("C++ Error:", data.toString());
    });

    cppProcess.on("close", (code) => {
        if (output.includes("NO_SOLUTION")) {
            return res.json({ solvedBoard: null });
        }

        try {
            const solvedBoard = output
                .trim()
                .split("\n")
                .map(row =>
                    row.trim().split(" ").map(num => Number(num))
                );

            res.json({ solvedBoard });
        } catch (error) {
            console.error("Parsing error:", error);
            res.status(500).json({ error: "Failed to parse solution" });
        }
    });
});

app.get("/generate", (req,res)=>{

    const difficulty = req.query.level || "medium";

    const cppProcess = spawn("./generator.exe",[difficulty]);

    let output="";

    cppProcess.stdout.on("data",(data)=>{
        output+=data.toString();
    });

    cppProcess.on("close",()=>{

        const board = output
        .trim()
        .split("\n")
        .map(row => row.trim().split(/\s+/).map(Number));        

        res.json({board});
        
    });

});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});