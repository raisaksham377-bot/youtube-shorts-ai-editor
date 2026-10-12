# Quickstart (हिन्दी / Hinglish)

यह repo आपके लिए **YouTube Shorts / Reels** बनाता है: नीचे आधे हिस्से में आप (या आपका AI avatar), ऊपर आधे हिस्से में असली photos और
screenshots वाली B-roll, हर शब्द पर चलते captions, sound effects और हल्का background music। Video editor की ज़रूरत नहीं। सब कुछ
**Claude Code** बनाता है।

पूरी English guide: [README](../README.md) · detail setup: [SETUP.md](SETUP.md)

## ज़रूरी चीज़ें

- [Claude Code](https://claude.com/claude-code)
- Python 3.10+ , Node.js 18+ , Git
- `ffmpeg` (Windows: `winget install Gyan.FFmpeg` · Mac: `brew install ffmpeg`)
- AssemblyAI का API key (transcription के लिए। free tier से शुरू कर सकते हैं)

## Install (एक बार)

Terminal खोलकर repo के folder में चलाइए:

```bash
git clone https://github.com/raisaksham377-bot/youtube-shorts-ai-editor
cd youtube-shorts-ai-editor

python -m venv venv
venv/Scripts/python -m pip install -r requirements.txt        # Windows  (Mac/Linux: ./venv/bin/pip)
venv/Scripts/python -m playwright install chromium            # असली websites के screenshots के लिए

cd remotion
npm install
npm run gen
cd ..
```

## API keys

`.env.example` की copy बनाकर नाम `.env` रखिए, फिर उसे Notepad में खोलकर अपना key भरिए:

```
ASSEMBLYAI_API_KEY=यहाँ_अपना_key
```

> ⚠️ **अपना key कभी chat में paste मत कीजिए, और `.env` को GitHub पर कभी upload मत कीजिए।** File आप खुद edit करें, फिर Claude को
> बस बता दें "key डाल दी"। (ElevenLabs का key सिर्फ़ *नई* sounds बनाने के लिए चाहिए; पहले से 36 sounds और 6 music beds repo में हैं।)

## Check कीजिए कि सब चल रहा है

```bash
cd remotion
npx tsc --noEmit            # कुछ print न हो तो सब ठीक
npm run studio              # browser में "ShortsFormatDemo" खोलिए
```

ऊपर आधे में navy रंग का "REAL PHOTO" placeholder और नीचे आधे में सलेटी आकृति के साथ एक caption word दिखे, तो setup पूरा है।

## पहली Short

1. Repo के folder में `claude` चलाइए।
2. सबसे पहले बोलिए: **`set up my brand`** (आपका नाम और रंग सेट होंगे)।
3. अपनी footage `videos/video-1/` में रखिए (कैमरे की clip या AI avatar वाला video)।
4. फिर यह prompt दीजिए (brackets भर दीजिए):

```text
इस repo से एक YouTube Short बनाओ। पूरा Shorts pipeline चलाओ और हर audit gate पर रुककर मुझे दिखाओ।

FOOTAGE: videos/video-1/avatar.mp4
TOPIC: [video किस बारे में है]
AUDIENCE: [कौन देखेगा]
GOAL: [अंत में दर्शक क्या सोचे या करे]
LENGTH: 60 से 90 सेकंड

B-ROLL: मैं जिस भी company, जगह, app, व्यक्ति या job posting का नाम लूँ, उसकी असली photo या असली screenshot
लगाओ (web search और tools/capture_web.py से)। Photos पर हल्का zoom (Ken Burns) चाहिए। Icons सिर्फ़ abstract बातों के लिए।
हर असली photo/screenshot आने पर camera-snap sound लगाओ।

SOUND: पहले sound effects का cue sheet मुझे दिखाओ, मेरे approve करने के बाद mix करो।
फिर /assemble: दो music beds सुनाओ, मैं चुनूँगा। अंत में -14 LUFS पर final करो।

नियम: हर beat का still render करके खुद देखो। कुछ fail हो तो मुझे बताओ। बिना पूछे credits खर्च मत करना।
```

पूरी prompts की list: [PROMPTS.md](PROMPTS.md)

## ऐसा क्यों होता है कि reels के पीछे हल्का music चलता है?

वह original audio का हिस्सा **नहीं** होता। Creator एक instrumental background music लगाते हैं और जब वे बोलते हैं तब उसकी
volume अपने-आप कम (duck) हो जाती है, इसलिए वह सुनाई कम देता है, महसूस ज़्यादा होता है। इस repo का `/assemble` step ठीक यही
करता है। [SOUND-AND-MUSIC.md](SOUND-AND-MUSIC.md)

## अटक जाएँ तो

[TROUBLESHOOTING.md](TROUBLESHOOTING.md) देखिए। उसमें हमने खुद जो-जो errors झेले, वे सब हैं।
