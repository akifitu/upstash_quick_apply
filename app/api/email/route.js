import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { calculateScore } from '../../lib/calculateScore';

import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive'],
    credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
});

const readjson = async () => {
    const drive = google.drive({ version: 'v3', auth: auth });

    // Read the file content
    const response = await drive.files.get({
        fileId: process.env.CONFIG_FILE_ID,
        alt: 'media'
    });

    return response.data
    //let data = await readFile(process.cwd() + '/job-config.json', { encoding: 'utf8' });
    //return data;
};
let data = await readjson();
let jsonData = data;
let endmessage = jsonData["goodbye-message"];
let email = jsonData["hiring-manager-email"];
export async function POST(req, res) {
    if (req.method === 'POST') {
        try {
            const data = await req.json();
            const answers = data.answers;
            const uuid = data.uuid;
            const type = data.type;
            const questions = data.questions;
            const email_receiver = email;
            const user_email = data.user_email;
            const user_content = endmessage;
            var transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                }
            });
            if (type == 1) {
                // Compute score and extract parsed Q&A
                const { totalScore, breakdown, qaPairs } = calculateScore(answers, jsonData.score_config);

                // Try to extract candidate name and email from raw text
                const nameMatch = answers.match(/name\s*[:\-–]?\s*(.+)/i);
                const emailMatch = answers.match(/email\s*[:\-–]?\s*(.+)/i);
                const fullName = nameMatch?.[1] ?? 'Unknown';
                const emailAddress = emailMatch?.[1] ?? 'Unknown';

                // Build email body with answers and scoring details
                let fullText = `${fullName} <${emailAddress}>\n\nCandidate Score: ${totalScore}/100\n\nAll Questions & Answers:\n`;

                qaPairs.forEach((item, idx) => {
                    fullText += `${idx + 1}. ${item.question}\n   - ${item.answer}\n\n`;
                });

                fullText += `Score Breakdown:\n`;
                breakdown.forEach(item => {
                    fullText += `${item.question}: ${item.score.toFixed(2)}/${item.max.toFixed(2)}\n`;
                });

                // Send email to hiring manager
                var mailOptions1 = {
                    from: process.env.EMAIL,
                    to: email_receiver,
                    subject: `${uuid}`,
                    text: fullText,
                };
                transporter.sendMail(mailOptions1, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email1 sent: ' + info.response);
                    }
                });
            } else if (type == 2) {
                var mailOptions2 = {
                    from: process.env.EMAIL,
                    to: user_email,
                    subject: `Your application is submitted with ID: ${uuid}`,
                    text: user_content,
                };


                transporter.sendMail(mailOptions2, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email2 sent: ' + info.response);
                    }
                });
            }
            return NextResponse.json({ Message: "Success", status: 201 });
        } catch (error) {
            console.log("Error occurred ", error);
            return NextResponse.json({ Message: "Failed", status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 })
    }
}