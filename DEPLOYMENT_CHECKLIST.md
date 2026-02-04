# Habitat Platform - Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Development Setup
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env` file)
- [ ] API keys tested (`npm run test:apis`)
- [ ] Development server runs (`npm run dev`)
- [ ] No console errors in browser
- [ ] All features tested manually

### ✅ Code Quality
- [ ] TypeScript compilation successful
- [ ] No linting errors (`npm run lint`)
- [ ] All tests passing (`npm test`)
- [ ] Code reviewed and documented
- [ ] No sensitive data in code

### ✅ API Configuration
- [ ] OpenWeatherMap API key configured
- [ ] Mapbox token configured (or using default)
- [ ] API rate limits understood
- [ ] Fallback data tested
- [ ] Error handling verified

### ✅ Performance
- [ ] Build size optimized (`npm run build`)
- [ ] Caching strategy implemented
- [ ] Lazy loading configured
- [ ] Images optimized
- [ ] Bundle analyzed

### ✅ Documentation
- [ ] README.md complete
- [ ] SETUP_GUIDE.md reviewed
- [ ] ARCHITECTURE.md accurate
- [ ] QUICK_START.md tested
- [ ] API documentation updated

## 🚀 Deployment Steps

### Step 1: Build Production Bundle

```bash
# Clean previous builds
rm -rf dist

# Create production build
npm run build

# Verify build
npm run preview
```

**Expected Output:**
```
✓ built in 15.2s
dist/index.html                   0.45 kB
dist/assets/index-abc123.css     12.34 kB
dist/assets/index-def456.js     234.56 kB
```

### Step 2: Environment Variables

Set these in your hosting platform:

```env
# Required
VITE_OPENWEATHER_API_KEY=your_production_key

# Optional
VITE_MAPBOX_TOKEN=your_production_token
VITE_SENTINEL_INSTANCE_ID=your_instance_id

# Analytics (if using)
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=your_ga_id
```

### Step 3: Deploy to Hosting Platform

#### Option A: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Settings > Environment Variables
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
# Site settings > Build & deploy > Environment
```

#### Option C: Custom Server

```bash
# Build
npm run build

# Upload dist/ folder to server
scp -r dist/* user@server:/var/www/habitat/

# Configure nginx/apache
# Point document root to dist/
```

### Step 4: Post-Deployment Verification

```bash
# Test production URL
curl https://your-domain.com

# Check API connectivity
# Open browser console and run:
testAPIs()

# Verify features
# - Map loads correctly
# - Regions display
# - Data fetches successfully
# - Simulation mode works
```

## 🔒 Security Checklist

### API Keys
- [ ] Production keys separate from development
- [ ] Keys stored in environment variables only
- [ ] Keys not in git history
- [ ] Keys rotated regularly
- [ ] Rate limiting configured

### HTTPS
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] Mixed content warnings resolved
- [ ] Security headers configured

### CORS
- [ ] CORS policy configured
- [ ] Allowed origins specified
- [ ] Credentials handling secure

### Data Privacy
- [ ] No PII stored in logs
- [ ] User data encrypted
- [ ] Privacy policy updated
- [ ] GDPR compliance checked

## 📊 Monitoring Setup

### Error Tracking
```javascript
// Add to src/main.tsx
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});
```

### Analytics
```javascript
// Add to src/main.tsx
if (import.meta.env.VITE_ENABLE_ANALYTICS) {
  // Initialize analytics
  // Track page views, events
}
```

### Performance Monitoring
```javascript
// Add to src/main.tsx
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Load time:', perfData.loadEventEnd - perfData.fetchStart);
  });
}
```

## 🧪 Production Testing

### Functional Tests
- [ ] All regions load correctly
- [ ] Map interactions work
- [ ] Region details display
- [ ] Simulation mode functions
- [ ] Analytics update
- [ ] Mobile responsive

### Performance Tests
- [ ] Page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] API responses < 2 seconds
- [ ] No memory leaks
- [ ] Smooth animations

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### API Tests
```bash
# Run production API tests
npm run test:apis

# Expected: All services connected
```

## 📱 Mobile Optimization

### Responsive Design
- [ ] Mobile layout tested
- [ ] Touch interactions work
- [ ] Map gestures functional
- [ ] Text readable
- [ ] Buttons accessible

### Performance
- [ ] Images optimized for mobile
- [ ] Lazy loading implemented
- [ ] Reduced data usage
- [ ] Offline fallback (future)

## 🔄 Continuous Deployment

### GitHub Actions (Example)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Post-Deployment Monitoring

### Week 1
- [ ] Monitor error rates
- [ ] Check API usage
- [ ] Review performance metrics
- [ ] Collect user feedback
- [ ] Fix critical bugs

### Month 1
- [ ] Analyze usage patterns
- [ ] Optimize slow queries
- [ ] Update documentation
- [ ] Plan feature updates
- [ ] Review costs

## 🆘 Rollback Plan

### If Deployment Fails

1. **Immediate Rollback**
   ```bash
   # Vercel
   vercel rollback

   # Netlify
   netlify rollback

   # Custom
   # Restore previous dist/ folder
   ```

2. **Investigate Issues**
   - Check error logs
   - Review recent changes
   - Test locally
   - Fix issues

3. **Redeploy**
   - Test thoroughly
   - Deploy to staging first
   - Monitor closely

## 📞 Support Contacts

### API Services
- OpenWeatherMap: support@openweathermap.org
- SoilGrids: info@isric.org
- NASA POWER: power@larc.nasa.gov

### Hosting
- Vercel: support@vercel.com
- Netlify: support@netlify.com

## 🎯 Success Metrics

### Technical Metrics
- Uptime: > 99.9%
- Response time: < 2s
- Error rate: < 0.1%
- API success rate: > 95%

### User Metrics
- Page views
- Active users
- Session duration
- Feature usage

### Business Metrics
- Sites analyzed
- Carbon calculated
- Regions monitored
- User satisfaction

## ✅ Final Checklist

Before going live:

- [ ] All tests passing
- [ ] Documentation complete
- [ ] API keys configured
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup plan ready
- [ ] Team notified
- [ ] Announcement prepared

## 🎉 Launch!

Once all items are checked:

1. Deploy to production
2. Verify all features
3. Monitor for 24 hours
4. Announce launch
5. Celebrate! 🎊

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Production URL:** _____________

**Status:** ⬜ Pending | ⬜ In Progress | ⬜ Complete

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Netlify Deployment Docs](https://docs.netlify.com/)
- [React Production Build](https://react.dev/learn/start-a-new-react-project#deploying-to-production)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
