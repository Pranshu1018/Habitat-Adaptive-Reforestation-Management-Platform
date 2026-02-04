# Site Analysis - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### What You'll Learn
- How to analyze a reforestation site
- Understanding the suitability score
- Reading real-time data
- Making informed decisions

## Step 1: Start the Application (30 seconds)

```bash
# Windows
start.bat

# Mac/Linux
./start.sh
```

Wait for:
- ✅ Backend running on port 3001
- ✅ Frontend running on port 5173
- ✅ Browser opens automatically

## Step 2: Navigate to Site Analysis (10 seconds)

1. You'll see the landing page
2. Click the big green button: **"Analyze Your Site"**
3. You're now on the Site Analysis page!

## Step 3: Try a Quick Location (30 seconds)

On the left panel, click any **Quick Location**:
- 📍 Western Ghats, India
- 📍 Amazon Basin, Brazil
- 📍 Mount Elgon, Uganda
- 📍 Kalimantan, Indonesia

The form will auto-fill with coordinates!

## Step 4: Analyze! (10 seconds)

Click the big **"Analyze Site"** button.

Watch the magic happen:
- 🔄 Fetching weather data...
- 🔄 Retrieving soil properties...
- 🔄 Analyzing satellite imagery...
- ✅ Done!

## Step 5: Understand Your Results (2 minutes)

### The Big Number (Suitability Score)

```
85-100 = 🟢 Excellent (Go for it!)
70-84  = 🔵 Good (Standard care needed)
50-69  = 🟡 Moderate (Extra attention required)
0-49   = 🔴 Poor (Consider alternatives)
```

### The Four Tabs

**1. Overview** - Quick summary
- See temperature, moisture, vegetation at a glance
- Read automated recommendations

**2. Weather** - Current conditions
- Temperature, humidity, precipitation, wind
- All real-time data!

**3. Soil** - Ground analysis
- pH level (6.0-7.0 is ideal)
- Nutrients: N, P, K
- Moisture percentage

**4. Vegetation** - Satellite view
- NDVI (higher = more vegetation)
- Health score
- Coverage percentage

## 🎯 Your First Analysis

### Example: Western Ghats

1. Click "Western Ghats, India" quick location
2. Click "Analyze Site"
3. Wait 3 seconds
4. See results:
   - Score: ~78 (Good!)
   - Temp: ~24°C (Perfect)
   - Soil pH: ~6.2 (Ideal)
   - NDVI: ~0.65 (Healthy vegetation)

**Interpretation:**
✅ This site is suitable for reforestation!
✅ Standard care protocols will work
✅ Native species should thrive

### Try Your Own Location

1. Find your coordinates (Google Maps: right-click → coordinates)
2. Enter in the form:
   - Site Name: "My Project"
   - Latitude: (your lat)
   - Longitude: (your lon)
   - Hectares: 1000
3. Click "Analyze Site"
4. Review results!

## 🔄 Real-Time Updates

Want live updates?

1. After analyzing, find "Auto-refresh" toggle
2. Click to turn ON
3. Data updates every 60 seconds
4. Watch conditions change in real-time!

**Perfect for:**
- Monitoring weather changes
- Tracking storm systems
- Critical decision periods

## 💡 Pro Tips

### Tip 1: Compare Multiple Sites
```
Analyze 3-5 locations
→ Compare scores
→ Pick the highest
→ Success! 🎉
```

### Tip 2: Check All Tabs
```
Don't just look at the score!
→ Check weather (storms coming?)
→ Check soil (amendments needed?)
→ Check vegetation (existing cover?)
```

### Tip 3: Screenshot Results
```
Take screenshots for:
→ Team meetings
→ Stakeholder reports
→ Funding proposals
→ Historical records
```

## 🎓 Quick Reference

### Good Signs ✅
- Score > 70
- Temperature 20-28°C
- Soil pH 6.0-7.0
- Moisture 50-70%
- NDVI > 0.4

### Warning Signs ⚠️
- Score 50-69
- Extreme temperatures
- pH < 5.5 or > 7.5
- Very low moisture
- NDVI < 0.2

### Red Flags 🚩
- Score < 50
- No recent precipitation
- Extreme pH levels
- Bare land (NDVI near 0)

## 🐛 Troubleshooting

### "Failed to analyze site"
**Fix:** Check backend is running
```bash
# Check if backend is up
curl http://localhost:3001/health
```

### Data looks wrong
**Remember:** 
- Data is from global datasets
- Local conditions may vary
- Always verify on ground
- Use as a guide, not gospel

### Slow loading
**Causes:**
- Slow internet
- API rate limits
- Server load

**Fix:** Wait 30 seconds and try again

## 🎯 What's Next?

After your first analysis:

1. ✅ **Understand the score** - Is it suitable?
2. ✅ **Review recommendations** - What actions needed?
3. ✅ **Check soil data** - Amendments required?
4. ✅ **Monitor weather** - Any risks coming?
5. ✅ **Plan next steps** - Species selection, timeline, etc.

## 📚 Learn More

- **Full User Guide**: [USER_GUIDE.md](./USER_GUIDE.md)
- **Setup Help**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Technical Docs**: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🎉 You're Ready!

You now know how to:
- ✅ Analyze any site globally
- ✅ Understand suitability scores
- ✅ Read real-time data
- ✅ Make informed decisions

**Start analyzing and make data-driven reforestation decisions!**

---

**Need Help?**
- Check browser console (F12)
- Review error messages
- Read the full User Guide
- Test API: `npm run test:apis`

**Happy Analyzing! 🌳📊**
