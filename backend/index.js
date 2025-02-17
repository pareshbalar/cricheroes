// server.js (Node.js API Backend)
const express = require('express');
const cors = require('cors');
const path = require('path');
const CH = require('./ch');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Sample API endpoint with tournament ID
app.get('/api/tournament/:id', async (req, res) => {
    const tournamentId = req.params.id;
    const chInstance = new CH();
    try {
        const data = await chInstance.getTournamentData(tournamentId);
        res.json({ message: `Data for tournament ID: ${tournamentId}`, data: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tournament data', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
