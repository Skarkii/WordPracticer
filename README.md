# Word Practicer

A lightweight, no-backend web app to practice vocabulary with instant feedback, TTS, and simple language packs.

Live app: https://skarkii.github.io/WordPracticer/

## Features

- Practice loop
    - Shows a word or its translation, you type the answer.
    - Immediate correctness feedback (with optional spelling warnings).
    - Reveal the answer, or skip to the next word.
    - Randomized next word with protection against repeats.

- Language packs
    - Built-in languages available from the “Words” modal.
    - Load from a local `.wp` file (Upload your own File).
    - Load from a custom URL (Enter URL for file).
    - Remembers your last choice across reloads.

- Options
    - Reverse Translation: swap prompt/answer directions.
    - Warn on invalid spelling: red border if a typed character doesn’t match.
    - Text to Speech (TTS): hear the prompt pronounced (uses browser SpeechSynthesis).
    - Hide Text: hide prompt text when TTS is enabled for listening-only practice.

- Mobile-friendly
    - Keeps the on-screen keyboard visible after a correct answer on phones.
    - Optimized modal layout and top bar for small screens.

- Statistics
    - Tracks Correct, Skips, Reveals, and Mistakes for your session.

- Persistence
    - Saves options and last load method in `localStorage` so the app resumes your preferences.

## Getting Started

1. Open the app:
    - Live: https://skarkii.github.io/WordPracticer/
    - Locally: open `index.html` in a browser (or via a simple static server).

2. Load words (open the “Words” modal from the top bar):
    - Use an existing Language (pre-bundled).
    - Upload your own `.wp` file.
    - Enter a direct URL to a `.wp` file and load it.

3. Practice flow:
    - The main card shows the prompt.
    - Type the translation into the input field.
    - Use “Reveal!” to see the answer, “Skip” to move on, “Play Audio” to hear TTS (when enabled).

## Language File Format (.wp)

A `.wp` file is a plain text file with the following structure:

- Line 1: Language display name (shown in the top bar).
- Line 2: Language codes for TTS as `sourceLangCode:targetLangCode` (e.g. `en-US:ko-KP`).
- Lines 3+: Word pairs as `prompt:translation`.

Example:
```
Korean
en-US:ko-KP
hello:안녕하세요
tea:차
rice:밥
```

Notes:
- The app lowercases both sides internally for comparisons.
- For TTS, the app uses the “prompt” side language code depending on Reverse Translation.

## Options Explained

- Reverse Translation
    - If enabled, the translation becomes the prompt and vice versa.

- Warn on invalid spelling
    - Highlights the input in red as soon as a character doesn’t match the expected answer at that position.

- Text to Speech
    - Enables a “Play Audio” button. When on, “Hide Text” can be enabled to practice listening-only.
    - Uses `window.speechSynthesis` with the language codes specified on line 2 of the `.wp` file.
    - Actual voice availability depends on the platform/browser.

- Hide Text
    - Hides the prompt text (useful with TTS on).

## Statistics

Open “Statistics” in the top bar to view:
- Correct: number of correctly answered prompts.
- Skips: how many times you skipped.
- Reveals: how many answers you revealed.
- Mistakes: accumulated incorrect character attempts.

Stats currently reset on page reload.

## Development

- Tech stack: Vanilla HTML/CSS/JavaScript (no build step).
- Project structure:
    - `index.html` — main page
    - `script.js` — app logic (options, practice loop, TTS, loading)
    - `style.css` — styling
    - `languages/` — sample and built-in language files
- Run locally:
    - Option 1: just open `index.html` directly in your browser.
    - Option 2: serve the folder with any static server (e.g., `python -m http.server`).

## Creating and Sharing Languages

- Create a `.wp` file using the format above.
- You can:
    - Upload it locally via the “Words” modal.
    - Host it somewhere and use “Enter URL for file” to load it by URL.
    - 
Uploading to this repository is higly appreciated!

## Persistence and Privacy

- The app stores only your options and last load method in `localStorage` on your device.
- No server or analytics are used by default; everything runs in your browser.

## Known Limitations

- Reloading a previously uploaded local file on page refresh isn’t automatic (for security, browsers restrict file access). You’ll need to upload it again or provide a URL.
- TTS voices vary by device/browser; not all language codes will have a matching high-quality voice.
- If a custom URL points to a domain blocking cross-origin requests, it may fail to load due to CORS.

## Roadmap Ideas

- Hotkeys for common actions (Reveal, Skip).
- Progress tracking per word, spaced repetition.
- Import/export of statistics.
- Theme toggle (light/dark/system).
- Multi-language practice sessions.

## Contributing

Contributions are welcome!
- Open an issue for bugs, feature ideas, or questions.
- Submit a PR with a brief description of your changes.

## License

This project is licensed under the terms in `LICENSE.md`.

---

Made to help you practice words faster — try it here: https://skarkii.github.io/WordPracticer/
