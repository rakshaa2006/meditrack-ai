const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../config/db');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeHealthHistory(userId) {
  const visits = await pool.query(
    'SELECT * FROM visits WHERE user_id=$1 ORDER BY visit_date DESC LIMIT 10',
    [userId]
  );
  const meds = await pool.query(
    'SELECT * FROM medications WHERE user_id=$1 AND is_active=true',
    [userId]
  );
  const labs = await pool.query(
    'SELECT * FROM lab_results WHERE user_id=$1 ORDER BY test_date DESC LIMIT 10',
    [userId]
  );

  const prompt = `
    You are a helpful health assistant. Summarize the following patient 
    health records in plain English for the patient themselves.
    
    Recent Visits: ${JSON.stringify(visits.rows)}
    Active Medications: ${JSON.stringify(meds.rows)}
    Recent Lab Results: ${JSON.stringify(labs.rows)}
    
    Format your response in exactly 3 short sections:
    1. Overall Health Summary
    2. Anything Worth Discussing With Your Doctor
    3. Your Active Medications
    
    Use plain language, no medical jargon.
  `;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { summarizeHealthHistory };