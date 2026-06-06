# Immediate SEO Action Items

## Step 1: Deploy Latest Changes (NOW)

```bash
# Build with production optimizations
npm run build

# Test locally to verify no errors
npm start
```

Then deploy to production (Hostinger or your hosting).

---

## Step 2: Verify Files Accessible (After Deployment)

Open these URLs in browser and confirm they return content:

1. **Robots.txt**: https://www.don-video.com/robots.txt
2. **Sitemap**: https://www.don-video.com/sitemap.xml
3. **GSC Verification**: https://www.don-video.com/google99e8c3ff88aced5b.html
4. **Homepage Canonical**: https://www.don-video.com/en (view source, check for `<link rel="canonical"`)

---

## Step 3: Google Search Console - Property Setup

1. Go to: https://search.google.com/search-console
2. Click "Add property"
3. Enter: `https://www.don-video.com`
4. Choose verification method:
   - **HTML file upload** (easiest): Upload `google99e8c3ff88aced5b.html` to public folder ✅ Already done
   - **OR HTML tag**: Copy the meta tag from GSC to `src/app/layout.tsx` ✅ Already added
   - **OR DNS record**: Add TXT record to domain DNS

5. Click "Verify" - should complete in seconds

---

## Step 4: Submit Sitemap to Google Search Console

1. In GSC left sidebar, go to: **Sitemaps** (under "Index")
2. Enter URL: `https://www.don-video.com/sitemap.xml`
3. Click "Submit"
4. Wait for GSC to process (status updates on page)

---

## Step 5: Request Indexing for Key Pages

In GSC top search bar, enter and submit:
- `https://www.don-video.com/en`
- `https://www.don-video.com/de`
- `https://www.don-video.com/en/blog`
- `https://www.don-video.com/de/blog`

GSC will show "Inspection result" - note if any errors.

---

## Step 6: Monitor Coverage Report

After 24 hours, check GSC **Coverage** report:
- Should show "Valid" pages increasing
- Any "Excluded" items need investigation
- "Errors" must be fixed before more pages index

---

## Step 7: Check Indexation (2-7 days later)

In Google Search: `site:www.don-video.com`

Should show:
- Homepage (en + de)
- Blog posts
- Other pages

If shows 0 results, pages haven't indexed yet - wait longer or check GSC for issues.

---

## Step 8: Monitor Performance

Once indexed, watch GSC **Performance** report for:
- **Impressions**: How often your site shows in search
- **Clicks**: How many people click through
- **CTR**: Click-through rate (aim for >3%)
- **Position**: Average ranking position

---

## Troubleshooting

### Pages Not Indexing?

1. Check GSC Coverage report for errors
2. Verify `robots.txt` allows page: https://www.don-video.com/robots.txt
3. Check page has proper `<meta name="robots" content="index, follow">`
4. Ensure canonical URL is correct (view page source)
5. Submit URL again in GSC with "Request indexing"

### Canonical Issues?

View page source and verify:
```html
<link rel="canonical" href="https://www.don-video.com/en" />
```

Should always be `www.don-video.com`, never `don-va.com` or `don-video.com`

### Duplicate Content?

If both versions indexed (with/without www), fix in middleware (already done):
- Old domain redirects to www.don-video.com ✅
- Check in GSC Search Console > Settings > Preferred domain ✅

---

## Quick Links

- Google Search Console: https://search.google.com/search-console
- Robots Tester: https://search.google.com/search-console/robots-txt-tester
- URL Inspector: https://search.google.com/search-console/inspect
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Rich Results Test: https://search.google.com/test/rich-results

---

## Expected Timeline

| When | What |
|------|------|
| Now | Deploy & verify files accessible |
| 30 min | Verify GSC HTML file works |
| 1 hour | Add GSC property & submit sitemap |
| 4-24 hours | GSC processes sitemap, crawls first pages |
| 1-7 days | First pages appear in Google search |
| 2-4 weeks | Most content fully indexed |

---

## Success Criteria

✅ All boxes checked = site is SEO-healthy:
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] GSC property verified
- [ ] Sitemap submitted to GSC
- [ ] Pages appear in `site:` search
- [ ] GSC Coverage shows "Valid" pages
- [ ] No crawl errors in GSC
- [ ] Canonical tags correct across all pages

---

## Files Changed This Session

1. ✅ `src/lib/site-url.ts` - Strengthened domain validation
2. ✅ `src/app/layout.tsx` - Enhanced meta tags & JSON-LD
3. ✅ `public/robots.txt` - Created proper robots config
4. ✅ `public/google99e8c3ff88aced5b.html` - GSC verification file
5. ✅ `SEO_IMPLEMENTATION_CHECKLIST.md` - Full documentation

**Total Impact**: Site now compliant with SEO best practices and ready for indexing.
