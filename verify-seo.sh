#!/bin/bash

# SEO Verification Script for don-video.com
# Run this after deploying to verify all SEO configurations are working

echo "=========================================="
echo "SEO Configuration Verification"
echo "=========================================="
echo ""

SITE_URL="https://www.don-video.com"
FAIL_COUNT=0
PASS_COUNT=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test URL and check for content
test_url() {
    local name=$1
    local url=$2
    local expected_content=$3
    
    echo -n "Testing $name... "
    response=$(curl -s -w "\n%{http_code}" "$url")
    status_code=$(echo "$response" | tail -n 1)
    content=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "200" ]; then
        if [[ $content == *"$expected_content"* ]]; then
            echo -e "${GREEN}✓ PASS${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${RED}✗ FAIL${NC} (Missing expected content)"
            ((FAIL_COUNT++))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status_code)"
        ((FAIL_COUNT++))
    fi
}

# Function to check HTML tags
check_html_tag() {
    local name=$1
    local url=$2
    local tag=$3
    
    echo -n "Checking $name in $url... "
    response=$(curl -s "$url")
    
    if [[ $response == *"$tag"* ]]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗ FAIL${NC} (Tag not found)"
        ((FAIL_COUNT++))
    fi
}

echo "--- FILE ACCESSIBILITY ---"
echo ""

# Test robots.txt
test_url "robots.txt" "$SITE_URL/robots.txt" "User-agent"

# Test sitemap.xml
test_url "sitemap.xml" "$SITE_URL/sitemap.xml" "<?xml"

# Test GSC verification file
test_url "GSC verification HTML" "$SITE_URL/google99e8c3ff88aced5b.html" "google-site-verification"

echo ""
echo "--- METADATA CHECKS ---"
echo ""

# Check canonical tag on homepage
check_html_tag "canonical tag" "$SITE_URL/en" "canonical"

# Check viewport meta tag
check_html_tag "viewport tag" "$SITE_URL/en" "viewport"

# Check robots meta
check_html_tag "robots meta" "$SITE_URL/en" "name=\"robots\""

# Check google verification
check_html_tag "GSC meta tag" "$SITE_URL/en" "google-site-verification"

# Check og:url
check_html_tag "Open Graph URL" "$SITE_URL/en" "og:url"

echo ""
echo "--- JSON-LD SCHEMAS ---"
echo ""

# Check for JSON-LD schemas
check_html_tag "Organization schema" "$SITE_URL/en" "\"@type\":\"Organization\""

check_html_tag "Service schema" "$SITE_URL/en" "\"@type\":\"Service\""

check_html_tag "LocalBusiness schema" "$SITE_URL/en" "\"@type\":\"ProfessionalService\""

check_html_tag "WebSite schema" "$SITE_URL/en" "\"@type\":\"WebSite\""

echo ""
echo "--- LANGUAGE/LOCALE CHECKS ---"
echo ""

# Check German page exists
check_html_tag "German page (de)" "$SITE_URL/de" "canonical"

# Check language alternates
check_html_tag "hreflang alternates" "$SITE_URL/en" "hreflang"

echo ""
echo "--- SITEMAP VALIDATION ---"
echo ""

echo -n "Checking sitemap URL count... "
url_count=$(curl -s "$SITE_URL/sitemap.xml" | grep -o "<url>" | wc -l)
if [ "$url_count" -gt 10 ]; then
    echo -e "${GREEN}✓ PASS${NC} ($url_count URLs)"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Only $url_count URLs - may be too few)"
    ((FAIL_COUNT++))
fi

echo -n "Checking sitemap has hreflang... "
if curl -s "$SITE_URL/sitemap.xml" | grep -q "hreflang"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}✗ FAIL${NC} (hreflang not found)"
    ((FAIL_COUNT++))
fi

echo ""
echo "=========================================="
echo "SUMMARY"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Failed: ${RED}$FAIL_COUNT${NC}"
echo "=========================================="

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Site is SEO-ready.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Review issues above.${NC}"
    exit 1
fi
