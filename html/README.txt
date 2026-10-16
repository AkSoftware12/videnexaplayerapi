Vidnexa Player — new homepage, Option B (purple). TEST VERSION.

WHAT IS INSIDE
  index-b.html   the new homepage (opens in dark theme first)
  img/v2/        new images (hero, feature images, logo)
  img/tour/      phone tour screenshots
  The live index.html and the old img/ files are NOT touched.

HOW TO TEST WITHOUT TOUCHING THE LIVE SITE
  1. Copy index-b.html into the html/ folder (next to index.html).
  2. Copy the img/v2 and img/tour folders into html/img/
     (so you get html/img/v2/... and html/img/tour/...).
  3. Commit and Push.
  4. Open https://vidnexaplayer.com/index-b.html on your phone.
  5. Run PageSpeed Insights on that URL (mobile + desktop).

STILL USES THESE FILES FROM THE EXISTING img/ FOLDER (do not delete):
  status-hero.webp, status-grid-1.webp ... status-grid-4.webp

WHEN YOU ARE HAPPY
  Rename index.html -> index-old.html, then index-b.html -> index.html.
  Commit and Push. Blog, privacy policy, sitemap and robots stay as they are.
