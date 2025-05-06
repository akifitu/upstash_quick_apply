## Contents

- [Project Description](#project-description)
- [Prerequisites](#prerequisities)
- [How to Install](#how-to-install)
- [How to Use](#how-to-use)

## Project Description

The tool is a chatbot that collects job applications through a conversational interface. It begins by greeting the candidate and sequentially asking customized prescreening questions defined by the recruiter.  

Candidate answers are evaluated in real-time. A scoring system, configurable via `job-config.json`, allows recruiters to assign point values to specific answers. Based on this, a candidate score out of 100 is calculated and included in both the recruiter email and the Google Sheet entry.  

After the questions, the candidate is prompted to upload their CV in PDF format, which is then stored in a designated Google Drive folder.  

The assistant also supports candidate queries about the company or position by referencing provided documents. If an answer cannot be derived from the documents or context, the assistant notifies the recruiter instead of fabricating a response.  

All conversations are saved to Upstash Redis for session memory, and document content is indexed using Upstash Vector to support contextual retrieval during chats.  

Candidate answers are stored in a Google Sheet file.  
Company documents are stored in Upstash Vector.  
Chat history is stored in Upstash Redis.  
The users need to provide a JSON to configure the chatbot. (job-config.json)  

A Dark Mode feature is also available, allowing users to toggle between light and dark themes during the interaction. The user interface is mobile responsive and adapts gracefully to small screens.  

Feel free to create issues on the repository.

## Prerequisities

1. Create an Upstash Vector Index.
2. Create an Upstash Redis Database.
3. Get an OpenAI API Key.
4. Get an email address and a password. (Provide the email address, password, and email service type while creating the .env file.)
5. Create a Google service account and enable Google Sheets and Google Drive API. (Provide service account email to GOOGLE_CLIENT_EMAIL and private key to GOOGLE_PRIVATE_KEY while creating the .env file.)
6. Fill and upload the job-config.json file to Google Drive.
7. Create a folder on Google Drive to receive uploaded CVs.
8. Create a Google Sheets document to store applicant answers

## How to Install

To install the project on your local device in order to make changes or run it, you can follow these steps:

1. Install the source code to your device

```bash
git clone git@github.com:upstash/QuickApply.git
```

2. Go to the project folder

```bash
cd QuickApply
```

3. Install `next` if not installed already

```bash
npm install next
```

4. Create a `.env` file and fill it with your API keys.

```bash
# .env

UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
OPEN_AI_API_KEY="..."
UPSTASH_VECTOR_REST_URL="..."
UPSTASH_VECTOR_REST_TOKEN="..."
EMAIL="..."
EMAIL_PASSWORD="..."
EMAIL_SERVICE="gmail"
GOOGLE_PRIVATE_KEY="..."
GOOGLE_CLIENT_EMAIL="..."
GOOGLE_SHEET_ID="..."
GOOGLE_DRIVE_ID="..."
MODEL_NAME="..."
CONFIG_FILE_ID="..."
```

5. Run the project

```bash
npm run dev
```

6. Go to `https://localhost:3000/`

## How to Use

Once the program is running, the AI assistant greets the user and sequentially asks predefined prescreening questions. Afterward, the user is prompted to upload their CV.  

Based on the answers, a score out of 100 is calculated by comparing the responses against the configured scoring rules in the `job-config.json`. This score, along with the answers, is sent via email to the hiring manager and saved to a Google Sheet.  



https://github.com/user-attachments/assets/ccd383c0-a12d-4963-a806-95e3d001283b



![Adsız tasarım](https://github.com/user-attachments/assets/4acd2979-21e4-4403-9092-e5c7c871b60f)


![Sheet](https://github.com/user-attachments/assets/fdec6dcd-c69e-4a46-94a2-ee666c2cbf67)


After the CV is uploaded, the user may ask follow-up questions about the job. The assistant answers based on the provided documents and context, or escalates to the manager if needed. The application process is completed when the user confirms there are no further questions.  

A Dark Mode feature is also available, allowing users to toggle between light and dark themes during the interaction.  
