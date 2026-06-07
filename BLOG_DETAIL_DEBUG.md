# 🔧 BLOG DETAIL PAGE - DEBUGGING GUIDE

**Issue**: Blog detail page not opening at:
`http://localhost:3000/en/blog/color-grading-for-creators-match-brand-and-mood-3`

**Status**: Investigating blog post fetch logic

---

## 🔍 ROOT CAUSE ANALYSIS

### Possible Issues:

1. **API Not Returning Blog Posts**
   - Blog API endpoint `/api/blogs` not accessible
   - API returns empty array or null
   - Tenant ID mismatch

2. **Slug Matching Failed**
   - Slug format doesn't match post format
   - Post ID extraction failing
   - Title slugification not matching

3. **Post Not Found**
   - Page triggers `notFound()` (404 error)
   - Blog post with this ID doesn't exist in API

---

## ✅ QUICK FIXES TO TRY

### Fix 1: Check Blog Listing Page First
**Try**: `http://localhost:3000/en/blog`

- ✅ If blog listing works → Blog API is working
- ❌ If blog listing doesn't work → Blog API issue

### Fix 2: Check Browser Console
**Do**:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors related to:
   - `fetchApiData`
   - `API` requests
   - `notFound()` 404

### Fix 3: Check Network Tab
**Do**:
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for API request to `/api/blogs`
5. Check response status (200 vs 404 vs 500)

---

## 🔧 TECHNICAL DEBUGGING

### The Blog Post Slug Format

Your slug: `color-grading-for-creators-match-brand-and-mood-3`

**Expected format**:
```
{slugified-title}-{postId}
```

**Parsing logic**:
1. Extract last number: `3` (post ID)
2. Match against `blogId` or `id` in API response
3. If not found, fallback to title matching

### Debug Checklist

```typescript
// Check if blog posts are fetched
const posts = await fetchApiData(API_ENDPOINTS.BLOGS, 'en');
console.log('Blog posts:', posts);  // Should show array of posts

// Extract ID from slug
const slug = 'color-grading-for-creators-match-brand-and-mood-3';
const postId = Number(slug.split('-').pop());
console.log('Extracted ID:', postId);  // Should be 3

// Check if post exists
const post = posts.find(p => p.blogId === postId);
console.log('Found post:', post);  // Should find the post
```

---

## 🚀 SOLUTIONS

### Solution 1: Ensure Blog API is Working
**Check**: `http://localhost:3000/api/blogs?lang=en`

**Expected response**:
```json
{
  "blogs": [
    {
      "blogId": 3,
      "title": "Color Grading for Creators: Match Brand and Mood",
      "excerpt": "...",
      "content": "...",
      "author": "...",
      "date": "...",
      "slug": "color-grading-for-creators-match-brand-and-mood-3"
    }
  ]
}
```

If empty: Check API backend configuration

### Solution 2: Verify Environment Variables
**File**: `.env.local`

```
NEXT_PUBLIC_API_BASE=https://api.don-va.com
NEXT_PUBLIC_TENANT_ID=video-editing
```

**If incorrect**: Update and restart dev server

### Solution 3: Check Next.js Build
```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build

# Test
npm run dev
```

---

## 📋 STEP-BY-STEP TROUBLESHOOTING

### Step 1: Verify API Connection
```bash
# In browser console or curl:
fetch('http://localhost:3000/api/blogs?lang=en')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Expected**: Array of blog posts with `blogId`, `title`, `slug`, etc.

### Step 2: Check Blog Listing
Visit: `http://localhost:3000/en/blog`

**Expected**: See list of blog posts

**If empty**: API not returning data

### Step 3: Manually Access Post
If blog listing shows a post, click it to test slug routing

**Expected**: Blog detail page loads

### Step 4: Check Specific Slug
URL structure for manual testing:
```
http://localhost:3000/en/blog/{slug}
```

**Examples**:
- `http://localhost:3000/en/blog/color-grading-for-creators-match-brand-and-mood-3`
- `http://localhost:3000/en/blog/getting-started-with-video-editing-1`

---

## 🎯 COMMON ISSUES & FIXES

### Issue: "Page not found" (404)
**Cause**: Slug doesn't match any post

**Fix**:
1. Check API has blog posts
2. Verify slug format matches post
3. Ensure post ID is numeric

### Issue: "API returns null"
**Cause**: API connection problem

**Fix**:
1. Check NEXT_PUBLIC_API_BASE in `.env.local`
2. Verify API server is running
3. Check CORS headers

### Issue: "Blank page with no error"
**Cause**: Post data exists but component not rendering

**Fix**:
1. Check `BlogPostClient` component
2. Verify post object has required fields
3. Check console for component errors

---

## 🔗 RELATED FILES

- **Page**: `src/app/[lang]/blog/[slug]/page.tsx`
- **Component**: `src/app/[lang]/blog/[slug]/BlogPostClient.tsx`
- **API**: `src/lib/api.ts`
- **Blog Listing**: `src/app/[lang]/blog/page.tsx`

---

## 📞 SUPPORT

If issue persists:

1. **Check error logs**:
   - Browser console (F12)
   - Network tab (API responses)
   - Server terminal (build errors)

2. **Verify environment**:
   - `.env.local` has correct API base
   - API server is running
   - Blog posts exist in API

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

---

## ✅ VERIFICATION

Once fixed, verify:
- [ ] Blog listing page works
- [ ] Blog detail page loads
- [ ] Canonical tags correct
- [ ] Meta tags present
- [ ] Schema markup valid

---

**Status**: 🟡 INVESTIGATING - FOLLOW STEPS ABOVE
