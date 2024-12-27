import React, { useState } from 'react';
import ScoreHistoryGraph from './ScoreHistoryGraph';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function LeaderboardPage({ scoreHistory, playerXName, playerOName, scores, onBack, darkMode }) {
    const [currentPage, setCurrentPage] = useState(1);
    const textColor = darkMode ? '#fff' : '#000';
    const itemsPerPage = 10;
    const totalPages = Math.ceil(scoreHistory.length / itemsPerPage);

    // Get current page's scores
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScores = scoreHistory.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="leaderboard-container" style={{ color: textColor }}>
            <h1>Leaderboard</h1>

            <div className="overall-scores">
                <h2>Overall Scores</h2>
                <div className="scores-grid">
                    <div className="score-card">
                        <h3>{playerXName}</h3>
                        <p className="score">{scores.X}</p>
                    </div>
                    <div className="score-card">
                        <h3>{playerOName}</h3>
                        <p className="score">{scores.O}</p>
                    </div>
                </div>
            </div>

            <div className="game-history">
                <h2>Game History</h2>
                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Game</th>
                                <th>{playerXName}</th>
                                <th>{playerOName}</th>
                                <th>Winner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentScores.map((game, index) => (
                                <tr key={indexOfFirstItem + index}>
                                    <td>Game {game.game}</td>
                                    <td>{game.playerX}</td>
                                    <td>{game.playerO}</td>
                                    <td>{game.winner === 'X' ? playerXName : playerOName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="page-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="graph-container">
                <h2>Score Progression</h2>
                <ScoreHistoryGraph
                    scoreHistory={scoreHistory}
                    playerXName={playerXName}
                    playerOName={playerOName}
                />
            </div>

            <button className="back-button" onClick={onBack}>
                Back to Game
            </button>
        </div>
    );
}

export default LeaderboardPage;

