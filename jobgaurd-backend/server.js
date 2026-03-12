require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Gemini Client ───────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ── Scrape Job URL ──────────────────────────────────────────
async function scrapeJobPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    const $ = cheerio.load(response.data);
    $('script, style, nav, footer, header, iframe, noscript').remove();

    const selectors = [
      'main', 'article',
      '[class*="job-description"]', '[class*="jobDescription"]',
      '[class*="job_description"]', '[class*="description"]',
      '[id*="job"]', '[id*="description"]',
      '.content', '#content', 'body'
    ];

    let text = '';
    for (const selector of selectors) {
      const el = $(selector).first();
      if (el.length && el.text().trim().length > 200) {
        text = el.text().trim();
        break;
      }
    }

    text = text.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    if (text.length > 4000) text = text.substring(0, 4000) + '...';

    const title = $('title').text().trim() || '';
    return { text, title, success: true };
  } catch (err) {
    console.error('Scrape error:', err.message);
    return { text: '', title: '', success: false, error: err.message };
  }
}

// ── Analyze with Gemini ─────────────────────────────────────
async function analyzeWithGemini(jobText, jobUrl) {
  const prompt = `You are a job fraud detection expert. Analyze the following job posting and return a fraud risk assessment.

Job URL: ${jobUrl || 'Not provided'}

Job Posting Content:
${jobText}

Analyze this job posting for fraud indicators such as:
- Unrealistic salary promises
- Vague or missing company information
- Requests for personal or financial info upfront
- Poor grammar and spelling
- Generic greetings like "Dear Candidate"
- Gmail or Yahoo contact emails instead of company domains
- Upfront fees or equipment deposits required
- Too-good-to-be-true benefits
- Pressure tactics like "Act now" or "Limited positions"
- Work from home data entry or payment processing scams
- Lack of specific job requirements
- Suspicious domain names in URL or email
- AI-generated or templated language

Also look for legitimacy signals:
- Known company name and brand
- Professional writing
- Realistic salary for the role
- Clear job requirements and responsibilities
- Official company domain in URL or email
- Specific location or remote policy
- Standard benefits package

Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown backticks:
{
  "trust_score": <number 0-100>,
  "risk_level": "<Low|Medium|High>",
  "company_name": "<detected company name or Unknown>",
  "job_title": "<detected job title or Unknown>",
  "location": "<detected location or Not specified>",
  "salary_range": "<detected salary or Not specified>",
  "flags": [<array of red flag strings, empty array if none>],
  "positive_signals": [<array of legitimacy signal strings>],
  "summary": "<2-3 sentence summary of your assessment>",
  "recommendation": "<Apply Safely|Apply with Caution|Avoid>"
}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── Main Route ──────────────────────────────────────────────
app.post('/analyze-job', async (req, res) => {
  const { job_url, job_text } = req.body;

  if (!job_url && !job_text) {
    return res.status(400).json({ error: 'Please provide a job URL or job description text.' });
  }

  try {
    let textToAnalyze = job_text || '';
    let scrapeInfo = { title: '', success: false };

    if (job_url) {
      console.log(`\n🔍 Scraping: ${job_url}`);
      scrapeInfo = await scrapeJobPage(job_url);

      if (scrapeInfo.success && scrapeInfo.text) {
        console.log(`✅ Scraped ${scrapeInfo.text.length} characters`);
        textToAnalyze = scrapeInfo.text + (job_text ? '\n\n' + job_text : '');
      } else {
        console.log(`⚠️  Scrape failed: ${scrapeInfo.error}`);
        if (!job_text) {
          return res.status(422).json({
            error: 'Could not access this URL. The site may block automated access. Try pasting the job description manually.',
          });
        }
      }
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 30) {
      return res.status(400).json({ error: 'Not enough content to analyze. Please paste the job description.' });
    }

    console.log(`🤖 Sending to Gemini for analysis...`);
    const analysis = await analyzeWithGemini(textToAnalyze, job_url);
    console.log(`✅ Trust Score: ${analysis.trust_score} | Risk: ${analysis.risk_level}`);

    return res.json({
      ...analysis,
      scraped: scrapeInfo.success,
      page_title: scrapeInfo.title || null,
    });

  } catch (err) {
    console.error('Analysis error:', err.message);

    if (err.message?.includes('API key') || err.message?.includes('API_KEY')) {
      return res.status(401).json({ error: 'Invalid Gemini API key. Check your .env file.' });
    }

    return res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// ── Health Check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'JobGuard AI backend is running ✅', port: PORT });
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛡️  JobGuard AI Backend`);
  console.log(`✅ Running at http://localhost:${PORT}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Loaded ✅' : 'MISSING ❌  Add it to .env file!'}\n`);
});
