# ✅ Final Deployment Checklist

## Pre-Deployment Verification (Local)

### Code Review
- [x] `src/lib/site-url.ts` - Domain validation hardened
- [x] `src/app/layout.tsx` - Schemas and metadata enhanced
- [x] No breaking changes introduced
- [x] All imports resolved

### Build Test
- [ ] Run: `npm run build`
- [ ] No build errors
- [ ] Output folder created successfully
- [ ] No console warnings (except next warnings)

### Local Testing
- [ ] Run: `npm start`
- [ ] Visit: `http://localhost:3000/en`
- [ ] View source and verify canonical tag present
- [ ] Check for JSON-LD schemas in source
- [ ] Visit: `http://localhost:3000/robots.txt` (returns content)
- [ ] Visit: `http://localhost:3000/sitemap.xml` (returns XML)

---

## Deployment Phase

### Deployment Steps
- [ ] Build: `npm run build`
- [ ] Deploy to production server
- [ ] Verify deployment successful (no errors)
- [ ] Verify site is accessible

### Post-Deployment Verification (Production)

**Files Accessible?**
- [ ] https://www.don-video.com/robots.txt (returns 200)
- [ ] https://www.don-video.com/sitemap.xml (returns 200)
- [ ] https://www.don-video.com/google99e8c3ff88aced5b.html (returns 200)

**Canonical Tags Correct?**
- [ ] Open: https://www.don-video.com/en
- [ ] View source (Ctrl+U / Cmd+Option+U)
- [ ] Search for: `<link rel="canonical"`
- [ ] Verify URL is: `https://www.don-video.com/en`
- [ ] NOT: `don-va.com` or `don-video.com` or `localhost`

**German Page?**
- [ ] Visit: https://www.don-video.com/de
- [ ] Canonical should be: `https://www.don-video.com/de`
- [ ] Has German content/lang attributes

**Other Pages?**
- [ ] Visit: https://www.don-video.com/en/blog
- [ ] Canonical present and correct
- [ ] Visit: https://www.don-video.com/en/contact
- [ ] Canonical present and correct

---

## Google Search Console Setup (Within 24 Hours)

### Property Creation
- [ ] Go to: https://search.google.com/search-console
- [ ] Click: "Go to Search Console" or "Add property"
- [ ] Enter: `https://www.don-video.com`
- [ ] Verify it's HTTPS (not HTTP)
- [ ] Verify it has www (not bare domain)

### Ownership Verification (Choose One Method)
- [ ] Method 1: HTML file
  - [ ] HTML file exists: `public/google99e8c3ff88aced5b.html`
  - [ ] File is deployed and accessible
  - [ ] File contains verification code
  - [ ] Click "Verify" in GSC
  
OR

- [ ] Method 2: Meta tag
  - [ ] Meta tag in `src/app/layout.tsx`
  - [ ] Code is deployed
  - [ ] View source confirms meta tag present
  - [ ] Click "Verify" in GSC
  
OR

- [ ] Method 3: DNS record (if available)
  - [ ] Add TXT record to domain DNS
  - [ ] Wait for DNS to propagate
  - [ ] Click "Verify" in GSC

**Expected Result**: Property verified ✅

### Sitemap Submission
- [ ] Verification complete
- [ ] Go to: Sitemaps (left sidebar under "Index")
- [ ] Click: "Add/test sitemap"
- [ ] Enter: `https://www.don-video.com/sitemap.xml`
- [ ] Click: "Submit"
- [ ] Status appears: "Submitted" or "Success"

**Watch for 24-48 hours**: Should process and show URL count

### Manual URL Submission (Quick Indexing)
- [ ] Still in GSC
- [ ] Top search bar in GSC
- [ ] Enter: `https://www.don-video.com/en`
- [ ] Click: "Request Indexing" or "Inspect"
- [ ] Wait for inspection to complete
- [ ] Google will recrawl within 24 hours

**Repeat for**:
- [ ] `https://www.don-video.com/de`
- [ ] `https://www.don-video.com/en/blog` (or first blog post)
- [ ] `https://www.don-video.com/en/contact`

---

## Monitoring Phase (First 2 Weeks)

### Daily Checks (5 min)
- [ ] Check GSC Coverage tab
- [ ] Look for: "Valid" count increasing
- [ ] Flag any new "Excluded" or "Error" pages
- [ ] Note crawl errors

### Specific Metrics to Watch

**Coverage Report**
- [ ] Valid pages increasing daily
- [ ] Excluded pages stable (no increases)
- [ ] Errors zero (or very few)

**Crawl Stats**
- [ ] Requests per day: 100-500 (normal)
- [ ] KB downloaded per day: increasing
- [ ] Top crawl errors: none or <5

**Sitemaps**
- [ ] Status: "Success"
- [ ] Entries: 50+ (all your URLs)
- [ ] Last read: within 24-48 hours

### Weekly Checks (15 min)
- [ ] Check indexation: `site:www.don-video.com`
- [ ] Should show pages appearing in search
- [ ] Count should increase each week

---

## Success Criteria (After 2-4 Weeks)

### Indexation
- [ ] Homepage indexed: `site:www.don-video.com` shows /en and /de
- [ ] Blog posts indexed: Several blog URLs visible
- [ ] Other pages indexed: Contact, book-meeting visible
- [ ] Total indexed pages: 50+

### Search Console
- [ ] Coverage: 50+ "Valid" pages
- [ ] Errors: 0 or minimal (<5)
- [ ] Performance: Showing impressions/clicks
- [ ] CTR: >1% (target 3%+)

### Search Results
- [ ] Pages appearing in Google search
- [ ] Titles and meta descriptions correct
- [ ] Rich results showing (Organization schema)
- [ ] Snippets length appropriate

### Technical Metrics
- [ ] Canonical tags: All pointing to www.don-video.com
- [ ] Mobile-friendly: All pages responsive
- [ ] Core Web Vitals: Green (or mostly green)
- [ ] Crawl efficiency: No robots.txt blocking

---

## Troubleshooting Quick Reference

### Pages Not Indexing?
- [ ] Check GSC Coverage for specific errors
- [ ] Check robots.txt doesn't block page
- [ ] Verify canonical is correct
- [ ] Resubmit via "Request Indexing"
- [ ] Wait 48 hours before escalating

### Canonical Issues?
- [ ] View page source
- [ ] Search for `rel="canonical"`
- [ ] Verify URL points to www.don-video.com
- [ ] Check environment variables
- [ ] Rebuild and redeploy if needed

### Robots.txt Issues?
- [ ] Visit: https://www.don-video.com/robots.txt
- [ ] Should return valid text
- [ ] Use GSC Robots Tester to validate
- [ ] Check `public/robots.txt` in project

### Sitemap Issues?
- [ ] Visit: https://www.don-video.com/sitemap.xml
- [ ] Should return valid XML
- [ ] Should contain your URLs
- [ ] Check `src/app/sitemap.ts` in project

---

## FAQ Quick Answers

**Q: How long until pages index?**
A: 2-7 days typically. Submit sitemap to speed up.

**Q: Will we rank immediately?**
A: No. 2-4 weeks for indexing, then ranking builds.

**Q: Why pages not showing in search?**
A: Check GSC Coverage report for errors first.

**Q: Is www or non-www better?**
A: Www is chosen. Middleware enforces redirect.

**Q: Can I use different domain?**
A: No. Production locked to www.don-video.com only.

**Q: When do rich results show?**
A: 1-2 weeks after indexing starts.

---

## File Reference

### Keep Handy
- **Quick Start**: SEO_QUICK_REFERENCE.md
- **Setup Steps**: GSC_SUBMISSION_GUIDE.md
- **Problems**: SEO_TROUBLESHOOTING.md
- **Verification**: verify-seo.sh script

### Reference Later
- **Technical Details**: SEO_IMPLEMENTATION_CHECKLIST.md
- **Full Summary**: SEO_IMPROVEMENT_SUMMARY.md
- **All Info**: README_SEO_DELIVERY.md

---

## Key Contacts & Links

- **Google Search Console**: https://search.google.com/search-console
- **URL Inspection Tool**: https://search.google.com/test/inspect
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Mobile Friendly Test**: https://search.google.com/test/mobile-friendly
- **Core Web Vitals**: PageSpeed Insights (https://pagespeed.web.dev/)

---

## Final Sign-Off

When all items checked above ✅:

- **Code Status**: Ready for production
- **Configuration**: Verified and tested
- **Documentation**: Complete and accessible
- **Timeline**: On track for indexing

**Your site is now SEO-optimized and ready for search engine indexing.**

---

## Deployment Sign-Off

```
Deployed by: ________________     Date: ________

GSC Setup by: ________________   Date: ________

Verification Complete: ________________   Date: ________

All Checks Passed: ________________   Date: ________
```

---

**Next Action**: Deploy to production and follow GSC_SUBMISSION_GUIDE.md
