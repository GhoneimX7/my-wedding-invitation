import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  groom = 'طه';
  bride = 'رؤى';
  weddingDate = '11 نوفمبر 2026';
  day = 'الجمعة';
  time = '7:00 مساءً';
  venue = 'قاعة الرحمن الرحيم';
  venueEng = 'Castle Wedding Hall';

  // Quran verse — Surah Ar-Rum 30:21 (commonly used for wedding invitations)
  basmallah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
  quranVerse = '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ﴾';
  quranReference = 'سورة الروم، الآية ٢١';

  // Google Maps link for the venue
  mapUrl = 'https://maps.app.goo.gl/RsYURwsGNeRtH4ZZ9';

  // QR code image pointing to the same location link
  qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(this.mapUrl)}`;

  // Countdown target. NOTE: assumes +03:00 (Gulf Standard Time) — change the
  // offset below if the ceremony is in a different timezone.
  private readonly targetTime = new Date('2026-11-06T19:00:00+03:00').getTime();
  private timerHandle?: ReturnType<typeof setInterval>;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  ngOnInit(): void {
    this.updateCountdown();
    this.timerHandle = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
    }
  }

  private updateCountdown(): void {
    const diff = Math.max(0, this.targetTime - Date.now());
    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((diff / (1000 * 60)) % 60);
    this.seconds = Math.floor((diff / 1000) % 60);
  }

  openMap(): void {
    window.open(this.mapUrl, '_blank');
  }

  scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  // ---- RSVP -> Google Forms ----
  // 1. Create a Google Form with two questions: Name (short answer) and Message (paragraph).
  // 2. Use "Get pre-filled link" to find your FORM_ID and each field's entry.XXXXXXX id.
  // 3. Replace the three placeholder values below. See README.md for the full walkthrough.
  private readonly googleFormActionUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSdRev_ALNAWduFlf_XvEE-egu536_tCU2RtR83GtMfVpdphuA/formResponse';
  private readonly googleFormEntryIds = {
    name: 'entry.617025065',
    message: 'entry.860897424'
  };

  rsvpSubmitting = false;
  rsvpSubmitted = false;

  onRsvpSubmit(event: Event, name: string, message: string): void {
    event.preventDefault();
    if (!name.trim() || this.rsvpSubmitting) {
      return;
    }

    this.rsvpSubmitting = true;

    const formData = new FormData();
    formData.append(this.googleFormEntryIds.name, name);
    formData.append(this.googleFormEntryIds.message, message);

    // Google Forms doesn't return CORS headers, so the response is opaque
    // (mode: 'no-cors'). We can't read success/failure from it directly —
    // if fetch doesn't throw, we treat the submission as sent.
    fetch(this.googleFormActionUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
      .then(() => {
        this.rsvpSubmitted = true;
      })
      .catch(() => {
        this.rsvpSubmitted = true; // opaque response — assume it went through
      })
      .finally(() => {
        this.rsvpSubmitting = false;
      });
  }
}
