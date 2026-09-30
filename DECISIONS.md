# Design Decisions

1. **Safety First (UV Interlock):**
   UV scanning degrades organic material rapidly. We enforced a strict software interlock (`SafetyGuard`) backed by a supervisor PIN. UV exposure is capped at a strict 3-second hard limit, which runs in an async loop independent of the main app thread.

2. **Honesty Rules for AI/Mock Data:**
   Because the system uses machine-read HTR (and mock data during dev), we enforce clear "DEMO DATA" chips. Any unverified text is strictly marked "Unverified" (Amber/Red tint) until explicitly tapped and "Confirmed" by a human user, whereupon it turns green.

3. **Motion Profile (60fps Kiosk):**
   Framer Motion is heavily used but constrained exclusively to `transform` and `opacity` properties (plus SVG `stroke-dashoffset` and `clip-path`) to avoid triggering browser layout thrashing. This guarantees a smooth 60fps even on a Raspberry Pi 5.

4. **Private-by-Default / Offline-first:**
   To respect custodians' privacy, no data leaves the device unless explicitly permitted by an NFC tag read. The entire UI stack (including WebGL and self-hosted fonts) runs completely offline via local FastAPI servers and SQLite.

5. **Showcase Export:**
   Instead of complex hosting, public showcase exports are generated as single-file HTML pages with base64 embedded images, making them completely portable via USB drives in rural areas.
