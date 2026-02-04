# 🚀 QUICK REFERENCE CARD

## ⚡ **START SYSTEM (2 COMMANDS)**

```bash
kill-node.bat
start.bat
```

**URL**: http://localhost:8083/

---

## 📚 **DOCUMENTATION QUICK LINKS**

| What You Need | Read This |
|---------------|-----------|
| Quick start | 🚀_START_HERE_FIRST.md |
| Demo script | DEMO_CHECKLIST.md |
| Species matching | SPECIES_MATCHING_EXPLAINED.md |
| Custom soil data | CUSTOM_SOILGRIDS_DATA.md |
| Recent fixes | FIXES_APPLIED.md |
| System overview | SYSTEM_STATUS_COMPLETE.md |
| Technical details | HOW_SYSTEM_ACTUALLY_WORKS.md |

---

## 🎬 **5-MINUTE DEMO**

1. **Landing** (30s) → http://localhost:8083/
2. **Site Analysis** (2min) → Select Western Ghats
3. **Monitoring** (1min) → Show health tracking
4. **Prediction** (1min) → Show risk alerts
5. **Wrap Up** (30s) → Explain lifecycle

---

## 💡 **KEY TALKING POINTS**

- "Real Sentinel-2 satellite data"
- "Predict drought 14 days in advance"
- "Explainable AI with 'Why?' for each species"
- "Complete lifecycle: Planning → Intervention"
- "Cost: $0 demo, $50/month production"

---

## 🔧 **TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| Port 3001 in use | `kill-node.bat` |
| Backend won't start | `cd backend && npm run dev` |
| Frontend won't load | `npm run dev` |
| Test APIs | `test-simple.bat` |

---

## 📊 **SYSTEM STATUS**

- Backend: Port 3001 ✅
- Frontend: Port 8083 ✅
- APIs: 6/6 configured ✅
- Database: Firebase connected ✅
- Documentation: Complete ✅

---

## 🎯 **DEMO URLS**

- Landing: http://localhost:8083/
- Site Analysis: http://localhost:8083/site-analysis
- Planning: http://localhost:8083/planning
- Monitoring: http://localhost:8083/monitoring
- Prediction: http://localhost:8083/prediction
- Backend Health: http://localhost:3001/health

---

## 🌳 **SPECIES MATCHING**

**How it works**:
```
Base Score: 70
+ Climate match: +15
+ pH suitable: +10
+ Drought tolerance: +15
+ Good nutrients: +5
= Score: 115 → 100 (capped)
```

**14 species in database**  
**Top 5 recommended per site**  
**Every recommendation has "Why?" explanation**

---

## 🌍 **SOIL DATA**

**3 Options**:
1. SoilGrids API (FREE, automatic) ✅
2. Custom dataset (your data)
3. Intelligent fallback (always works)

**See**: CUSTOM_SOILGRIDS_DATA.md

---

## 🆘 **EMERGENCY FIXES**

### **Syntax Error?**
Fixed in `backend/src/routes/realtime.js`

### **Port Conflict?**
```bash
kill-node.bat
```

### **APIs Not Working?**
Check `.env` and `backend/.env` files

---

## 📞 **COMMANDS**

```bash
# Start
start.bat

# Stop
kill-node.bat

# Test
test-simple.bat

# Backend only
cd backend
npm run dev

# Frontend only
npm run dev
```

---

## 🎉 **YOU'RE READY!**

✅ All fixes applied  
✅ All questions answered  
✅ Complete documentation  
✅ Ready to demo  

**GO SHOW IT TO THE JUDGES!** 🌳🛰️🔥
