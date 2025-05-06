import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { calculateScore } from '../../lib/calculateScore';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly'
    ],
    credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
});

const readjson = async () => {
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.get({
        fileId: process.env.CONFIG_FILE_ID,
        alt: 'media'
    });
    return response.data;
};

async function writeToSheet(values) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const emptyRow = await findFirstEmptyRow(sheets, spreadsheetId, 'A');

    const range = `Sayfa1!A${emptyRow}`;
    const valueInputOption = 'USER_ENTERED';

    const resource = { values };

    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId, range, valueInputOption, resource
        })
        return res;
    } catch (error) {
        console.error('Google Sheets write error:', error.response?.data || error.message || error);
        throw error;
    }

}
async function findFirstEmptyRow(sheets, sheetId, column) {
    const range = `${column}1:${column}`;
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });
    const values = response.data.values;
    let emptyRow = 1;
    if (values) {
        emptyRow = values.findIndex(row => !row[0]) + 1;
        if (emptyRow === 0) {
            emptyRow = values.length + 1;
        }
    }
    return emptyRow;
}


export async function POST(req, res) {
    if (req.method === 'POST') {
        try {
            // Read config from Google Drive
            const jsonData = await readjson();

            // Parse request body
            const data = await req.json();
            const uuid = data.uuid;
            let answers = data.answers;

            // If data is not properly formatted, attempt to reformat
            if (!answers.includes('\n') && answers.match(/\d+\.\s/g)) {
                answers = answers.replace(/(\d+\.\s)/g, '\n$1');
                answers = answers.replace(/\s+-/g, '\n-');
            }

            // Extract lines, remove blanks
            let lines = answers.split('\n').filter(line => line.trim() !== '');
            let name = '';
            let email = '';
            let qaMap = {};

            // Parse name, email and Q&A pairs from lines
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.toLowerCase().startsWith('name')) {
                    name = line.split(/[:\-–]/)[1]?.trim() || '';
                } else if (line.toLowerCase().startsWith('email')) {
                    email = line.split(/[:\-–]/)[1]?.trim() || '';
                } else if (/^\d+\.\s*/.test(line)) {
                    const question = line.replace(/^\d+\.\s*/, '').trim();
                    const answerLine = lines[i + 1] || '';
                    const answer = answerLine.replace(/^[-\s]+/, '').trim();
                    qaMap[question] = answer;
                    i++;
                }
            }

            const questionList = jsonData.questions;
            let row = [uuid, '', name, email]; // UUID, score, name, email

            // Calculate total score using scoring config
            const { totalScore, breakdown } = calculateScore(answers, jsonData.score_config);
            row[1] = totalScore;

            // Match answers to questions based on config
            questionList.forEach(q => {
                const found = Object.entries(qaMap).find(([k]) => k.toLowerCase().includes(q.toLowerCase()));
                row.push(found ? found[1] : '');
            });

            // Save to Google Sheets if enabled
            if (process.env.USE_SHEETS.toLowerCase() === 'true') {
                const writer = await writeToSheet([row]);
            }

            return NextResponse.json({ Message: "Success", status: 201 });
        } catch (error) {
            console.log("Error occurred:", error);
            return NextResponse.json({ Message: "Failed", error: error.message || error.toString(), status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 })
    }
}
