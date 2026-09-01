# دعوة زفاف طه ورؤى — Angular Wedding Invitation

A single-page Arabic (RTL) wedding invitation built with Angular 18 standalone components.

## Features

- Full Arabic / RTL layout (Aref Ruqaa + Cairo fonts)
- Animated botanical hero section with inline SVG artwork
- Quran verse section (Surah Ar-Rum 30:21)
- Live countdown timer to the wedding date/time
- Event details, day-of schedule, and couple photo
- Venue location with a "Open in Google Maps" button and a scannable QR code
- RSVP form that submits directly to a Google Form (no backend required)

## Run locally

```bash
npm install
ng serve
```

Then open the local dev server URL (usually `http://localhost:4200`).

## Customize the wedding details

Open `src/app/app.component.ts` and edit:

```ts
groom = 'طه';
bride = 'رؤى';
weddingDate = '11 سبتمبر 2026';
day = 'الجمعة';
time = '7:00 مساءً';
venue = 'قاعة الرحمن الرحيم';
```

### Countdown timer

The countdown target is set separately and includes a timezone offset:

```ts
private readonly targetTime = new Date('2026-09-11T19:00:00+03:00').getTime();
```

Update the date/time and the `+03:00` offset if the ceremony is in a different timezone.

### Quran verse

```ts
basmallah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
quranVerse = '...';
quranReference = 'سورة الروم، الآية ٢١';
```

Swap in a different verse and reference if you'd prefer.

## Location & QR code

```ts
mapUrl = 'https://maps.app.goo.gl/RsYURwsGNeRtH4ZZ9';
qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(this.mapUrl)}`;
```

The QR code is generated on the fly from `mapUrl` via a free QR image API — no need to generate or upload a QR image yourself. Just update `mapUrl` and the QR code updates automatically.

## Couple photo

Photos are served from the `public/` folder (Angular's default static assets directory) and referenced with a root-relative path.

- File location: `public/assets/couple.jpg`
- Referenced in `app.component.html` as: `src="assets/couple.jpg"`

To change the photo, replace `public/assets/couple.jpg` with your own image (same filename), or update the `src` path in the template if you use a different filename.

## RSVP → Google Forms

The RSVP form posts directly to a Google Form using its hidden `formResponse` endpoint — guest responses land in your Form's response sheet automatically, with no backend needed.

**Setup:**

1. Create a Google Form with two questions matching the site's fields: a short-answer **الاسم** (Name) question, and a paragraph **رسالة** (Message) question.
2. Open the form's overflow menu (⋮) → **Get pre-filled link**.
3. Fill in placeholder answers for both fields and click **Get link**, then copy it. It'll look like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxxxxxxxxxxxxxxxx/viewform?entry.111111111=test&entry.222222222=test+message
   ```
4. In `src/app/app.component.ts`, update these three values:
   ```ts
   private readonly googleFormActionUrl =
     'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // same FORM_ID, but .../formResponse instead of .../viewform
   private readonly googleFormEntryIds = {
     name: 'entry.111111111',   // your Name field's entry id
     message: 'entry.222222222' // your Message field's entry id
   };
   ```

**Notes:**

- The request uses `mode: 'no-cors'`, which Google Forms requires for cross-origin submissions from a custom site. Because of this, the browser can't read whether the submission actually succeeded (the response is opaque) — the form optimistically shows a thank-you message once the request completes without a network error. Test it end-to-end by checking your Form's **Responses** tab after submitting.
- Every response (name + message) will appear as a new row in the Form's linked Google Sheet, if you've linked one (Responses tab → Sheets icon).
- Add more fields (e.g. number of guests) the same way: add a question to the Google Form, grab its `entry.XXXXXXX` id, and append it to both the template and `googleFormEntryIds`.

## Build for production

```bash
ng build
```

Output goes to `dist/wedding-invitation/`. Deploy that folder to any static host (Netlify, Vercel, Firebase Hosting, GitHub Pages, etc.).
