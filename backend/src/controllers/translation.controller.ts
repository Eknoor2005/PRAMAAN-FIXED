import { Request, Response } from 'express';
import axios from 'axios';

// Language mapping for Google Translate
const SUPPORTED_LANGUAGES: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese (Simplified)',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'tr': 'Turkish',
  'pl': 'Polish',
  'nl': 'Dutch',
};

export const translateText = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'auto' } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Text and target language are required'
      });
    }

    // Validate language codes
    if (targetLanguage !== 'auto' && !SUPPORTED_LANGUAGES[targetLanguage]) {
      return res.status(400).json({
        success: false,
        message: `Unsupported target language: ${targetLanguage}`
      });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Translation service not configured'
      });
    }

    // Use Google Translate API
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLanguage,
        source: sourceLanguage !== 'auto' ? sourceLanguage : undefined,
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    const detectedLanguage = response.data.data.translations[0].detectedSourceLanguage;

    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        targetLanguage,
        sourceLanguage: detectedLanguage || sourceLanguage,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Translation failed'
    });
  }
};

export const detectLanguage = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Translation service not configured'
      });
    }

    // Use Google Translate API to detect language
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`,
      { q: text }
    );

    const language = response.data.data.detections[0][0].language;
    const confidence = response.data.data.detections[0][0].confidence;

    res.json({
      success: true,
      data: {
        language,
        languageName: SUPPORTED_LANGUAGES[language] || language,
        confidence,
        text
      }
    });
  } catch (error: any) {
    console.error('Language detection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Language detection failed'
    });
  }
};

export const getSupportedLanguages = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      languages: Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({
        code,
        name
      }))
    }
  });
};
