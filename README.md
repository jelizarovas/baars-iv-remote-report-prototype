# BAARS-IV remote-report questionnaire

A mobile-first English and Lithuanian interface for the BAARS-IV Other-Report forms. A respondent answers 61 questions, reviews missing answers, and downloads a completed copy of the original seven-page PDF.

The site does not score answers, interpret results, or provide a diagnosis. Fields marked "Office Use Only" remain blank.

## What the site does

The welcome page offers two routes:

- Fill out the questionnaire on this device.
- Create a link for another person to fill it out.

An invitation contains the rated person's name, the respondent's name, their relationship, a return email address, the display language, and an optional session name. The respondent can download the finished PDF and open a pre-addressed email. Browsers cannot attach the PDF automatically.

## Data handling

There is no account, database, analytics service, or form submission endpoint.

- Invitation details are encoded after `#invite=` in the URL.
- GitHub Pages does not receive URL fragments.
- Anyone who has an invitation link can decode its contents.
- Unfinished answers are saved in the browser's `localStorage` on the respondent's device.
- Answers leave the device only when the respondent downloads or sends a file.
- Clearing the saved session or the browser's site data removes the local copy.

The repository contains no real respondent names, email addresses, answers, or machine-specific paths. Test fixtures use fictional labels and the reserved `.test` email domain.

## Relationship handling

The relationship is free text. The source PDF has printed choices for Mother, Father, Brother/sister, Spouse/partner, and Friend. The PDF generator selects a matching choice when possible. Any other value selects `Other (specify)` and writes the supplied relationship on the line.

No relationship type is limited to a particular family member.

## Languages

English is the default. The flag menu switches the entire interface between English and Lithuanian, with only one language displayed at a time. Interface strings live in `src/i18n/locales/lt.json` and `src/i18n/locales/en.json`. Question records accept a `translations` map for more languages.

To add a language, add its locale file, register it in `src/i18n/index.ts`, add it to the invitation form, and supply translated question text.

## Run locally

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

For the production build:

```bash
npm test
npm run build
npm run preview
```

Open the HTTP address printed by Vite. Do not open `dist/index.html` with a `file:///` URL. Browsers block Vite's JavaScript modules and PDF assets from local-file origins.

On Windows, `open-production-app.cmd` builds the app when needed, starts the preview server, and opens `http://127.0.0.1:4173`.

## Invitation URL

The encoded payload contains these fields:

```json
{
  "version": 2,
  "from": "Rated Person",
  "to": "Respondent",
  "relationship": "Friend",
  "returnEmail": "results@example.test",
  "language": "en",
  "sessionName": ""
}
```

`from` fills "Name of person to be rated" in the PDF. `to` fills "Your name". `relationship` selects or fills the PDF relationship field.

The invitation does not contain questionnaire answers.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` tests, builds, and deploys `dist` after a push to `main` or `master`.

Tests and the production build run on every push. Pages deployment runs only when the repository variable `ENABLE_PAGES` is set to `true`. Leave it unset while the repository is private on a plan without private Pages support.

The production build is locked unless `VITE_REVIEW_PIN_HASH` contains a valid SHA-256 hash. Development mode stays open when no hash is configured.

Create the hash locally:

```bash
npm run hash:review-pin
```

Copy the resulting hash into a GitHub Actions repository secret named `REVIEW_PIN_HASH`. Do not store the PIN itself in the repository. Use a long password instead of a short numeric PIN when possible.

In the repository settings, open Pages and set the source to GitHub Actions. The Vite build uses relative asset paths, so it works from a GitHub project page. Fragment links do not need server redirects.

The review gate blocks ordinary navigation, but it is not server-side access control. A determined visitor can inspect or bypass client-side code and request static assets directly. Use it only for a limited publisher review, not for patient records or other sensitive information.

## Rights and distribution

BAARS-IV is a published assessment. This project includes a copy of the form and its item wording. Guilford says purchasers receive a limited license to reproduce forms for repeated use. That statement does not grant a general right to publish the form in a public source repository.

Keep the GitHub repository private unless you have permission to redistribute and host the form and question text. The application code can be separated from the protected form content if a public repository is needed.

`PERMISSION_REQUEST.md` contains a request draft for electronic display, Lithuanian translation, remote family participation, downloadable completed forms, and possible future use by licensed professionals. Add the review URL and your contact details only when submitting it.

## Questionnaire behavior

- Frequency answers use the original 1 to 4 scale and do not advance automatically.
- Current question 28, childhood question 19, and SCT question 10 show a suggestion based on earlier 3 or 4 answers. The respondent must confirm it.
- A confirmed No marks dependent follow-up questions as not applicable. Changing it to Yes restores them.
- Narrative answers can contain Lithuanian text and an optional English translation.
- The review page lists missing items, answers rated 3 or 4, and narrative responses.

## PDF generation

`src/pdf/generatePdf.ts` loads `public/BAARS-IV-original.pdf`, embeds `public/fonts/Arial.ttf`, and draws respondent-entered values at coordinates defined in `src/pdf/fieldMap.ts`.

The generator preserves all seven source pages. Long narrative text continues in an appendix using the selected language instead of being cut off.

PDF calibration is available during development:

```powershell
$env:VITE_ENABLE_PDF_CALIBRATION='true'
npm run dev
```

Open `http://localhost:5173/#calibrate`. If the source PDF changes, check every coordinate again.

## Keyboard controls

- `1` to `4` selects a frequency answer.
- `Enter`, `Space`, or `Right Arrow` moves forward.
- `Shift+Space` or `Left Arrow` moves back.
- `Escape` closes the contents drawer.

Shortcuts do not run while the cursor is in an input, textarea, select, or editable element.

## Project map

```text
src/data/questions.ts       questionnaire text and labels
src/lib/                    invitation, storage, branching, and file helpers
src/pdf/                    PDF coordinates and generator
src/components/             welcome, setup, questions, review, and calibration
src/i18n/                   interface locale files
src/test/                   interaction, logic, invitation, and PDF tests
public/                     source PDF, font, and calibration images
```
