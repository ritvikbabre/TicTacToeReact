import React, { useState, useEffect } from 'react';
import './App.css';
import LeaderboardPage from './LeaderboardPage';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase';

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [scoreHistory, setScoreHistory] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const [playerXName, setPlayerXName] = useState('Player X');
    const [playerOName, setPlayerOName] = useState('Player O');
    const [isAIEnabled, setIsAIEnabled] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const winner = calculateWinner(board);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const docRef = doc(db, "leaderboard", "scores");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setScores(docSnap.data().scores);
                setScoreHistory(docSnap.data().scoreHistory);
            }
        };
        fetchLeaderboard();
    }, []);

    useEffect(() => {
        if (winner && !gameOver) {
            setGameOver(true);
            updateLeaderboard(winner.player);
        }
    }, [winner, gameOver]);

    useEffect(() => {
        if (!isXNext && isAIEnabled && !winner && !gameOver) {
            const aiMove = getAIMove(board);
            if (aiMove !== -1) {
                setTimeout(() => handleClick(aiMove), 500);
            }
        }
    }, [isXNext, isAIEnabled, board, winner, gameOver]);

    const updateLeaderboard = async (winningPlayer) => {
        const newScores = { ...scores };
        newScores[winningPlayer]++;

        const newScoreHistory = [
            ...scoreHistory,
            {
                game: scoreHistory.length + 1,
                playerX: newScores.X,
                playerO: newScores.O,
                winner: winningPlayer
            }
        ];

        setScores(newScores);
        setScoreHistory(newScoreHistory);

        await setDoc(doc(db, "leaderboard", "scores"), {
            scores: newScores,
            scoreHistory: newScoreHistory
        });
    };

    const handleClick = (index) => {
        if (board[index] || gameOver) return;

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const getAIMove = (currentBoard) => {
        const emptySquares = currentBoard
            .map((val, index) => (val === null ? index : null))
            .filter((val) => val !== null);

        return emptySquares.length > 0
            ? emptySquares[Math.floor(Math.random() * emptySquares.length)]
            : -1;
    };

    const renderSquare = (index) => {
        const isWinningSquare = winner && winner.line.includes(index);
        return (
            <button
                className={`square ${isWinningSquare ? 'winning-square' : ''}`}
                style={{
                    backgroundColor: isWinningSquare ? '#4CAF50' : 'initial',
                    width: '80px',
                    height: '80px',
                    fontSize: '2em',
                    border: '1px solid #ddd',
                }}
                onClick={() => handleClick(index)}
            >
                {board[index]}
            </button>
        );
    };

    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setGameOver(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.style.backgroundColor = darkMode ? '#fff' : '#000';
        document.body.style.color = darkMode ? '#000' : '#fff';
    };

    const statusTextColor = darkMode ? '#fff' : '#000';
    const status = winner
        ? `Winner: ${winner.player === 'X' ? playerXName : playerOName}`
        : `Next Player: ${isXNext ? playerXName : playerOName}`;

    const resetScores = async () => {
        setScores({ X: 0, O: 0 });
        setScoreHistory([]);
        await setDoc(doc(db, "leaderboard", "scores"), {
            scores: { X: 0, O: 0 },
            scoreHistory: []
        });
    };

    const toggleScreen = () => {
        setShowLeaderboard(!showLeaderboard);
    };

    if (showLeaderboard) {
        return (
            <LeaderboardPage
                scoreHistory={scoreHistory}
                playerXName={playerXName}
                playerOName={playerOName}
                scores={scores}
                onBack={toggleScreen}
                darkMode={darkMode}
            />
        );
    }

    return (
        <div className="game">
            <h1 style={{ color: statusTextColor }}>Tic-Tac-Toe</h1>
            <div className="status" style={{ color: statusTextColor }}>
                {status}
            </div>
            {showLeaderboard ? (
                <LeaderboardPage
                    scoreHistory={scoreHistory}
                    playerXName={playerXName}
                    playerOName={playerOName}
                    scores={scores}
                    onBack={toggleScreen}
                    darkMode={darkMode}
                />
            ) : (
                <>
                    <div className="board">
                        <div className="row">
                            {renderSquare(0)}
                            {renderSquare(1)}
                            {renderSquare(2)}
                        </div>
                        <div className="row">
                            {renderSquare(3)}
                            {renderSquare(4)}
                            {renderSquare(5)}
                        </div>
                        <div className="row">
                            {renderSquare(6)}
                            {renderSquare(7)}
                            {renderSquare(8)}
                        </div>
                    </div>

                    <button className="restart" onClick={restartGame}>
                        Restart Game
                    </button>
                    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                        Toggle Dark Mode
                    </button>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isAIEnabled}
                                onChange={() => setIsAIEnabled(!isAIEnabled)}
                            />
                            Enable AI Opponent
                        </label>
                    </div>
                    <button className="reset-scores" onClick={resetScores}>
                        Reset Scores
                    </button>
                    <button className="toggle-screen" onClick={toggleScreen}>
                        Show Leaderboard
                    </button>
                </>
            )}
        </div>
    );
}

function calculateWinner(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { player: board[a], line: lines[i] };
        }
    }
    return null;
}

export default TicTacToe;

