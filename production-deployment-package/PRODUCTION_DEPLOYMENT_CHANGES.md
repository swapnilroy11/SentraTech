# Production Deployment Changes Required

## Server Information
- **Production Server IP**: 35.57.15.54
- **Production URL**: https://sentratech.net/
- **Current Environment**: Preview server (34.16.56.64) - Changes made here need to be deployed to production

## Changes Made That Need Production Deployment

### 1. ROI Calculator Performance Optimizations
**Files Modified:**
- `/frontend/src/pages/ROICalculatorPage.js` 
- `/frontend/src/components/ROICalculatorRedesigned.js`
- `/frontend/src/index.css`

**Changes:**
- ✅ Replaced expensive Framer Motion `whileInView` animations with CSS-only animations
- ✅ Removed costly `blur-3xl` effects in background accents
- ✅ Optimized transition properties from `transition-all duration-200` to targeted `smooth-hover` classes
- ✅ Added performance-optimized CSS classes: `animate-fade-in`, `animate-slide-up`, `btn-optimized`
- ✅ Reduced animation duration from 0.8s to 0.4s for snappier performance
- ✅ Added hardware acceleration hints and GPU optimizations

**Impact:** Fixes the reported scroll lag and slow transition effects on ROI calculator page

### 2. Investor Relations Page Updates
**File Modified:**
- `/frontend/src/pages/InvestorRelationsPage.js`

**Changes Required:**
- ✅ Update funding amount from `$2.5M` to `$80,000`
- ✅ Update timeline from `Q1 2025` to `Q1 2026`
- ✅ Remove "View Interactive Pitch Deck" button
- ✅ Remove "Contact for Investment" button  
- ✅ Keep only "Schedule Product Demo" button (styled as primary button)
- ✅ Update all milestone timelines from 2025 to 2026
- ✅ Update SEO metadata description with new funding amount

### 3. Floating Hamburger Button Removal
**Files Modified:**
- `/frontend/src/App.js`

**Changes:**
- ✅ Removed FloatingNavScrollable component (blue floating hamburger button)
- ✅ Kept the green hamburger menu in top navigation (Navigation.js unchanged for mobile menu)
- ✅ Cleaned up unused imports for FloatingNavScrollable

**Impact:** Removes the floating blue hamburger button from the middle of screens while preserving the functional green hamburger menu in the navigation bar for mobile users

### 4. Cookie Modal Production Fix
**Issue:** Cookie modal shows on preview but not on production environment

**Investigation Needed:**
- Check localStorage behavior on production
- Verify CookieBanner component is properly deployed
- Clear any cached versions that might prevent modal from showing

## Deployment Steps Required

### Step 1: Copy Files to Production Server
The following files contain the changes and need to be deployed to 35.57.15.54:

```bash
# Frontend files with changes
frontend/src/pages/ROICalculatorPage.js
frontend/src/components/ROICalculatorRedesigned.js  
frontend/src/pages/InvestorRelationsPage.js
frontend/src/components/Navigation.js
frontend/src/App.js
frontend/src/index.css

# Verify CookieBanner is deployed
frontend/src/components/CookieBanner.jsx
```

### Step 2: Restart Services on Production
```bash
sudo supervisorctl restart frontend backend
```

### Step 3: Clear Cache and Test
```bash
# Clear any cached versions
# Test ROI calculator scroll performance
# Test Investor Relations page funding amounts and buttons
# Test cookie modal functionality
```

## Verification Checklist

After deployment to production (35.57.15.54), verify:

### ROI Calculator Performance
- [ ] Scroll through ROI calculator page smoothly without lag
- [ ] Benefits section ("Why Calculate ROI with SentraTech?") scrolls smoothly  
- [ ] All animations are smooth and responsive
- [ ] Calculator functionality works correctly
- [ ] Mobile performance is optimized

### Investor Relations Updates
- [ ] Funding amount shows `$80,000` (not $2.5M)
- [ ] Timeline shows `Q1 2026` (not Q1 2025)
- [ ] Only "Schedule Product Demo" button is visible
- [ ] "View Interactive Pitch Deck" button is removed
- [ ] "Contact for Investment" button is removed
- [ ] All milestone dates updated to 2026

### Cookie Modal
- [ ] Cookie consent modal appears on first visit to production site
- [ ] Modal works correctly on https://sentratech.net/
- [ ] Consent preferences are saved properly

### Floating Hamburger Button Removal
- [ ] FloatingNavScrollable (blue floating button) completely removed from all pages
- [ ] Green hamburger menu in top navigation still functional for mobile users
- [ ] Mobile menu opens/closes correctly with green hamburger button
- [ ] Desktop navigation unaffected and working properly

## Commands for Production Deployment

```bash
# SSH to production server
ssh user@35.57.15.54

# Navigate to application directory  
cd /path/to/sentratech-app

# Pull changes (if using git) or copy updated files
git pull origin main

# Restart services
sudo supervisorctl restart frontend backend

# Verify services are running
sudo supervisorctl status

# Test the changes
curl -I https://sentratech.net/
```

## Critical Notes

1. **Environment Confusion**: Currently working on preview server (34.16.56.64) but changes need to be on production server (35.57.15.54)
2. **DNS**: Ensure https://sentratech.net/ points to 35.57.15.54, not the preview server  
3. **Performance Impact**: The ROI calculator optimizations significantly improve scroll performance
4. **Business Impact**: Investor Relations changes reflect updated funding strategy ($80K vs $2.5M)

## Success Metrics
- ROI Calculator scroll performance improved (no lag reported by users)
- Investor Relations page shows correct funding information
- Cookie modal appears consistently on production environment
- All functionality preserved while performance optimized