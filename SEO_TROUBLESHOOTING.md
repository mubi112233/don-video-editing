# SEO Troubleshooting Guide

## Problem: Pages Not Indexing After 1 Week

### Check 1: Verify robots.txt Allows the Page
```bash
# Visit this URL and check status
https://www.don-video.com/robots.txt
```

Should NOT have `Disallow: /` or your page path.

**Fix**: Check `public/robots.txt` - ensure `Allow: /` is present for main content.

---

## Problem: Canonical Tag Points to Wrong Domain

### Check 1: View Page Source
1. Go to: https://www.don-video.com/en
2. Press `Ctrl+U` (or `Cmd+Option+U` on Mac)
3. Search for: `canonical`

Should see:
```html
<link rel="canonical" href="https://www.don-video.com/en" />
```

NOT:
- `don-va.com` ❌
- `don-video-editing.com` ❌
- `localhost` ❌

### Fix 1: Check Environment Variables
```bash
# Check .env.local and .env.production
NEXT_PUBLIC_SITE_URL=https://www.don-video.com
```

Must include `www` and `https://`.

### Fix 2: Rebuild and Redeploy
```bash
npm run build
# Then deploy to production
```

---

## Problem: GSC Says "Page Discovered - Not Indexed"

### Cause: Google hasn't crawled it yet OR there's an error

### Check 1: Use URL Inspection in GSC
1. Go to Google Search Console
2. Paste URL in top search bar: `https://www.don-video.com/en`
3. Click "Inspect" or "Request Indexing"

Look for errors like:
- `Noindex tag` - CRITICAL
- `Redirect` - Check if redirecting to wrong page
- `Unauthorized` - Check if robots.txt blocking
- `Not found` - 404 error

### Fix 1: Remove Any Noindex Tags
Check page source - should NOT have:
```html
<meta name="robots" content="noindex">
```

Our config has `index: true` - if missing, add to `src/app/layout.tsx`.

### Fix 2: Check for Redirects
Page should NOT redirect. If redirecting to wrong domain, check middleware.

### Fix 3: Manual Request Indexing
1. In GSC, paste URL in search bar
2. Click "Request Indexing"
3. Google will recrawl within 24 hours

---

## Problem: Sitemap Shows Errors in GSC

### Check 1: Validate Sitemap XML
1. Go to: https://search.google.com/search-console/sitemaps
2. Paste: `https://www.don-video.com/sitemap.xml`
3. Check for errors

### Common Errors:

**Error**: "Page returns 404"
- **Cause**: A URL in sitemap doesn't exist
- **Fix**: Check `src/app/sitemap.ts` - remove dead URLs

**Error**: "Invalid XML"
- **Cause**: Sitemap has malformed XML
- **Fix**: Test locally: `curl http://localhost:3000/sitemap.xml`

**Error**: "Too many URLs"
- **Cause**: Sitemap has 50k+ URLs
- **Fix**: Split into multiple sitemaps (shouldn't be issue for your site)

---

## Problem: Duplicate Content Issues

### Check 1: Are multiple versions indexed?
Search: `site:don-va.com` or `site:don-video-editing.com`

If results show, old domains still indexed.

### Fix 1: Create 301 Redirects
Add to `next.config.js`:
```javascript
async redirects() {
  return [
    {
      source: '/:path*',
      destination: 'https://www.don-video.com/:path*',
      permanent: true, // 301 redirect
      basePath: false,
    },
  ];
}
```

Then deploy that version to old domain.

### Fix 2: Remove Old Property from GSC
1. If old domain still has GSC property
2. Remove the property
3. Add new URL parameters in new property settings

---

## Problem: Core Web Vitals Failing

### Check 1: Test Page
Go to: https://search.google.com/test/mobile-friendly

Paste your page URL.

### Common Issues:

**LCP (Largest Contentful Paint)**: >2.5s
- **Fix**: Optimize hero image size, preload fonts

**FID (First Input Delay)**: >100ms
- **Fix**: Check for heavy JavaScript, reduce third-party scripts

**CLS (Cumulative Layout Shift)**: >0.1
- **Fix**: Ensure images have explicit width/height

### Quick Fixes:
Already optimized:
- ✅ Images using WebP/AVIF
- ✅ Fonts preconnected
- ✅ CSS inline in layout
- ✅ JavaScript deferred

---

## Problem: Rich Results Not Showing

### Check 1: Test Schema
Go to: https://search.google.com/test/rich-results

Paste your URL.

### Issues:

**"Not eligible for rich results"**
- **Cause**: Schema missing or invalid
- **Fix**: Our schemas are valid - wait for indexing

**"Schema structured data errors"**
- **Cause**: Invalid JSON-LD
- **Fix**: Check `src/app/layout.tsx` - JSON must be valid

### Verify Schemas Present
View page source, search for:
- `"@type":"Organization"` ✅
- `"@type":"Service"` ✅
- `"@type":"LocalBusiness"` ✅

---

## Problem: Hreflang Issues

### Check 1: Verify Hreflang Tags
1. Go to: https://www.don-video.com/en
2. View source (Ctrl+U)
3. Search for: `hreflang`

Should see:
```html
<link rel="alternate" hreflang="en" href="https://www.don-video.com/en" />
<link rel="alternate" hreflang="de" href="https://www.don-video.com/de" />
<link rel="alternate" hreflang="x-default" href="https://www.don-video.com/en" />
```

### Fix 1: Check Sitemap Hreflang
Sitemap should have alternates:
```xml
<url>
  <loc>https://www.don-video.com/en</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.don-video.com/en" />
  <xhtml:link rel="alternate" hreflang="de" href="https://www.don-video.com/de" />
</url>
```

Verify in: https://www.don-video.com/sitemap.xml

---

## Problem: Robots.txt Blocking Pages

### Check 1: Test with Google's Tester
Go to: https://search.google.com/search-console/robots-txt-tester

1. Select property: `www.don-video.com`
2. Enter URL path: `/en` or `/blog`
3. Should show: `✓ Allowed`

### Fix 1: Review robots.txt
```bash
curl https://www.don-video.com/robots.txt
```

Should have:
```
User-agent: *
Allow: /
Disallow: /api/ /admin/ /_next/
```

---

## Problem: Google Can't Reach Your Site

### Check 1: Site Accessibility
```bash
# From Google's perspective
curl -H "User-Agent: Googlebot" https://www.don-video.com/en
```

Should return HTML without 403/401 errors.

### Check 2: CDN/Firewall
If using Cloudflare or WAF, ensure it's not blocking Googlebot.

### Fix 1: Whitelist Googlebot
If behind firewall/WAF, add Google IP ranges:
- Go to Google's documentation for current IPs
- Whitelist in your host firewall settings

---

## Problem: Search Console Shows Errors

### Most Common Errors:

| Error | Cause | Fix |
|-------|-------|-----|
| `Mobile Usability: Text too small` | Font size <12px | Already fixed (Poppins 16px+) |
| `Mobile Usability: Tap targets too close` | Buttons <48px | Already fixed (UI components 48px+) |
| `Redirect mismatch` | HTTPS→HTTP or trailing slash | Already fixed (HTTPS redirect) |
| `Noindex tag` | Page has `noindex` | Check HTML source |
| `404 error` | Page not found | Remove URL from sitemap |
| `Blocked by robots.txt` | robots.txt disallowing page | Check `public/robots.txt` |

---

## Quick Diagnostic Checklist

Run these checks if pages aren't indexing:

```
□ robots.txt accessible (https://www.don-video.com/robots.txt)
□ Canonical correct (<link rel="canonical" href="https://www.don-video.com/...">)
□ No meta noindex tags present
□ Page returns 200 OK (not 301/302/404)
□ Sitemap submitted to GSC
□ No 403/401 errors in GSC crawl stats
□ Mobile-friendly test passes
□ Rich results test shows valid schema
□ hreflang tags present and correct
□ Page has unique, descriptive title
□ Meta description under 160 characters
```

---

## When to Contact Google Support

If you've checked everything above and still have issues:

1. **In GSC**: Click "Help" → "Contact support"
2. **Provide**: URL, what you've checked, screenshot of error
3. **They will**: Debug indexing issues specific to your site

**Note**: Google typically responds in 1-3 business days for GSC support.

---

## Prevention Going Forward

### Daily (5 min)
- Check GSC Coverage report for new errors
- Monitor Performance for traffic trends

### Weekly (15 min)
- Check top pages' rankings
- Review CTR (aiming for >3%)

### Monthly (30 min)
- Full audit in Lighthouse
- Check Core Web Vitals
- Review new crawl errors

### Quarterly
- Comprehensive SEO audit
- Competitor keyword analysis
- Update blog content for freshness

---

## Success Indicators

✅ Everything working when you see:
- GSC shows "Valid" pages increasing daily
- Impressions showing in GSC Performance
- Pages appearing in Google search (site:)
- Organic traffic visible in analytics
- Rankings improving for target keywords

---

## Quick Reference Links

- **GSC Coverage Errors**: https://support.google.com/webmasters/answer/6089337
- **Rich Results Guidelines**: https://developers.google.com/search/docs/appearance/structured-data
- **Core Web Vitals**: https://support.google.com/webmasters/answer/9205520
- **Mobile Friendly Guide**: https://support.google.com/webmasters/answer/9008080
- **Robots.txt Guide**: https://developers.google.com/search/docs/advanced/robots/robots_txt

---

**Remember**: Most indexing issues resolve within 2-7 days. Be patient and keep monitoring GSC!
