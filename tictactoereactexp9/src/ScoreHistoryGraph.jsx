import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ScoreHistoryGraph({ scoreHistory }) {
    const chartData = {
        labels: scoreHistory.map(entry => `Game ${entry.game}`),
        datasets: [
            {
                label: 'Player X Score',
                data: scoreHistory.map(entry => entry.playerX),
                borderColor: 'blue',
                backgroundColor: 'blue',
                fill: false,
            },
            {
                label: 'Player O Score',
                data: scoreHistory.map(entry => entry.playerO),
                borderColor: 'red',
                backgroundColor: 'red',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <h2>Score History</h2>
            <Line data={chartData} />
        </div>
    );
}

export default ScoreHistoryGraph;
