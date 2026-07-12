# PRAMAAN Utilities Guide

## Overview

The Utilities & Tools section of PRAMAAN provides survivors with powerful tools to record their testimony and translate it into multiple languages. This section includes three main features:

1. **Camera Recorder** - Record video testimony with audio
2. **Microphone Recorder** - Record audio-only testimony
3. **Translator** - Translate testimony into 15+ languages

## Features

### 1. Camera Recorder

**Purpose:** Record video testimony with synchronized audio, perfect for visual documentation of your statement.

**Features:**
- Real-time video preview
- Audio synchronization
- Recording duration tracking
- Download capability
- Local processing with encryption support
- Professional quality (up to 1280x720)

**How to Use:**
1. Navigate to Dashboard > Utilities > Camera tab
2. Click "Start Camera" to request camera permissions
3. Allow browser camera access when prompted
4. Click "Start Recording" when ready
5. Speak your testimony clearly
6. Click "Stop Recording" when finished
7. Preview your video in the player
8. Click "Download Video" to save locally or upload to Evidence Vault

**Browser Compatibility:**
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14.5+)
- Mobile: Supported on modern devices

**Tips:**
- Ensure good lighting for best video quality
- Speak clearly and at a normal pace
- Find a quiet location to minimize background noise
- Test your camera/microphone before recording
- Position yourself in the center of the frame

### 2. Microphone Recorder

**Purpose:** Record audio-only testimony for quick voice notes or when video is not practical.

**Features:**
- High-quality audio recording
- Real-time recording timer
- Audio playback with controls
- Duration tracking
- Download capability
- Noise-tolerant recording

**How to Use:**
1. Navigate to Dashboard > Utilities > Microphone tab
2. Click "Start Recording" to request microphone permissions
3. Allow browser microphone access when prompted
4. Recording will begin - speak your testimony
5. Watch the timer to track your recording length
6. Click "Stop Recording" when finished
7. Play back your recording to verify
8. Click "Download" to save locally or upload to Evidence Vault
9. Click "Clear" to start over if needed

**Audio Format:**
- Format: WebM (Opus codec)
- Quality: High (128kbps default)
- Sample Rate: 48kHz
- Mono: Yes

**Tips:**
- Find a quiet environment
- Speak at a consistent volume
- Pause between thoughts for clarity
- Keep recordings between 5-30 minutes for optimal processing
- Test audio levels before important recordings

### 3. Translator

**Purpose:** Translate your testimony into different languages to make it accessible to a wider audience.

**Features:**
- Support for 15+ languages
- Auto-language detection
- Side-by-side translation view
- Copy-to-clipboard functionality
- Swap languages for verification
- Real-time character counting

**Supported Languages:**
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese Simplified (zh)
- Hindi (hi)
- Arabic (ar)
- Turkish (tr)
- Polish (pl)
- Dutch (nl)

**How to Use:**
1. Navigate to Dashboard > Utilities > Translator tab
2. Enter or paste your text in the left textarea
3. Select source language (auto-detect recommended)
4. Choose your target language from the dropdown
5. Click "Translate" button
6. View the translation in the right textarea
7. Click "Copy Translation" to copy to clipboard
8. Use "Swap" button to swap source/target languages

**API Integration:**
- Uses Google Translate API
- Requires API key in backend .env file
- Requires authentication token for use

**Tips:**
- Use auto-detect for unknown languages
- Verify translations by swapping languages
- Keep text under 5000 characters per request
- Use formal language for legal documentation
- Consider professional translation for official cases

## Setup Requirements

### Frontend Setup
No additional setup required. The utilities are built into the dashboard.

### Backend Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Get Google Translate API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Cloud Translation API
   - Create an API key (Server-side)
   - Copy the API key

3. **Update Environment Variables:**
   ```bash
   # backend/.env
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

4. **Start Backend Server:**
   ```bash
   npm run dev
   ```

## Security & Privacy

### Data Protection
- All recordings are processed locally on your device
- Audio/video files are stored with encryption
- Translations are sent securely to Google Translate
- No data is stored in translation logs
- Your testimony remains under your control

### Browser Permissions
- Camera access: Only during recording
- Microphone access: Only during recording
- Permission revoked automatically after session
- Can be disabled in browser settings anytime

### Encryption
- All files encrypted before upload
- AES-256-CBC encryption standard
- End-to-end encryption support
- Keys managed by PRAMAAN

## Troubleshooting

### Camera Issues
**Problem:** Camera not working
- Check browser permissions
- Restart browser
- Try different browser
- Ensure camera is not in use by another app

**Problem:** No audio with video
- Check microphone permissions
- Ensure microphone is connected
- Test microphone in system settings

### Microphone Issues
**Problem:** Microphone not detected
- Check browser permissions
- Test microphone in system settings
- Restart browser
- Try headset microphone

**Problem:** Background noise
- Move to quieter location
- Close other applications
- Disable browser plugins

### Translation Issues
**Problem:** Translation fails
- Check internet connection
- Verify API key is configured
- Check text length (max 5000 chars)
- Try with auto-detect language

**Problem:** Slow translation
- Check internet speed
- Reduce text length
- Wait for API response
- Try again in a few seconds

## Performance Optimization

### Recording Tips
- Close unnecessary browser tabs
- Disable browser extensions during recording
- Ensure adequate free disk space
- Use wired microphone for better quality
- Record in good lighting conditions

### Upload Tips
- Use high-speed internet connection
- Upload during off-peak hours
- Don't close browser during upload
- Verify upload completion

## Accessibility

- Full keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Adjustable text sizes
- Clear error messages

## API Endpoints

### Translation Endpoints

**POST /api/translation/translate**
```json
{
  "text": "Your text here",
  "targetLanguage": "es",
  "sourceLanguage": "auto"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "originalText": "Your text here",
    "translatedText": "Tu texto aquí",
    "targetLanguage": "es",
    "sourceLanguage": "en",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**POST /api/translation/detect**
```json
{
  "text": "Your text here"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "language": "en",
    "languageName": "English",
    "confidence": 0.95,
    "text": "Your text here"
  }
}
```

## Best Practices

1. **Before Recording:**
   - Test equipment beforehand
   - Prepare what you want to say
   - Find quiet location
   - Ensure good lighting (for video)
   - Have backup power/internet

2. **During Recording:**
   - Speak clearly and naturally
   - Maintain consistent volume
   - Avoid background noise
   - Use formal language
   - Include relevant details

3. **After Recording:**
   - Review recording quality
   - Make translations if needed
   - Upload to Evidence Vault
   - Keep backup copies
   - Verify encryption status

## Support

For issues or feature requests:
- Email: support@pramaan.org
- Emergency: 1-800-XXX-XXXX
- Chat: Available in Support Hub

## Privacy Policy

For information about data processing, visit our [Privacy Policy](https://pramaan.org/privacy).
