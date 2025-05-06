export function calculateScore(rawAnswers, config) {
    // Split answers by line and remove empty lines
    const lines = rawAnswers.split('\n').filter(line => line.trim() !== '');
    const qaPairs = [];
    let startIndex = 0;

    // Skip name/email if included
    if (lines[startIndex]?.toLowerCase().startsWith("name")) startIndex++;
    if (lines[startIndex]?.toLowerCase().startsWith("email")) startIndex++;

    // Extract question-answer pairs
    for (let i = startIndex; i < lines.length; i += 2) {
        const question = lines[i].replace(/^\d+\.\s*/, '').trim();
        const answer = (lines[i + 1] || '').replace(/^[-\s]+/, '').trim();
        qaPairs.push({ question, answer });
    }

    let scoreBreakdown = [];
    let totalScore = 0;
    let totalMax = 0;

    // Evaluate each answer based on config
    for (let i = 0; i < config.length; i++) {
        const answerObj = qaPairs[i];
        const conf = config[i];
        let score = 0;

        if (!answerObj) continue;

        // Handle string-based answers using substring matching
        if (conf.expected_format === 'string') {
            const val = answerObj.answer.toLowerCase();
            for (let key in conf.score_map) {
                if (val.includes(key.toLowerCase())) {
                    score = conf.score_map[key];
                    break;
                }
            }
        }
        // Handle exact number matches
        else if (conf.expected_format === 'number') {
            score = conf.score_map[answerObj.answer] || 0;
        }

        scoreBreakdown.push({
            question: answerObj.question,
            score,
            max: conf.max_score
        });

        totalScore += score;
        totalMax += conf.max_score;
    }

    // Calculate total percentage score
    const totalPercentage = Math.round((totalScore / totalMax) * 100);
    return { totalScore: totalPercentage, breakdown: scoreBreakdown, qaPairs };
}
