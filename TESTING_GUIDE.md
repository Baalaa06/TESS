# 🧪 TESS Testing Guide

## 🚀 **Quick Start**
```bash
cd "d:\google hack 1\Gensafe"
npm install
npx expo start
```

## 📱 **Complete Feature Testing**

### **1️⃣ Trust Status Dashboard**
**What to Test:**
- System trust calculation
- Real-time health monitoring
- Visual trust indicators

**How to Test:**
1. Open app → See trust status (initially empty)
2. Press SOS → Watch trust calculation appear
3. Check battery, network, location, sensor status
4. Note trust score changes based on system health

**Expected Results:**
- Trust score: 0-100% with color coding
- Green (75%+), Orange (45-74%), Red (<45%)
- Real battery/network status displayed

---

### **2️⃣ Emergency Trigger & AI Confidence**
**What to Test:**
- SOS button functionality
- AI confidence generation
- System health evaluation

**How to Test:**
1. Press SOS button multiple times
2. Observe AI confidence scores (varies each time)
3. Check processing states and alerts
4. Test during different times of day

**Expected Results:**
- AI confidence: 50-90% (randomized)
- Higher confidence at night (22:00-06:00)
- Processing indicator during evaluation

---

### **3️⃣ Trust-Aware Decision Engine**
**What to Test:**
- Three escalation levels
- Rule-based decision making
- Clear explanations

**Testing Scenarios:**

**HIGH TRUST (75%+):**
- Ensure good battery (>20%)
- Connect to WiFi
- Press SOS
- **Expected:** "⚡ Instant Alert" - immediate response

**MEDIUM TRUST (45-74%):**
- Disconnect WiFi OR lower battery
- Press SOS
- **Expected:** "⏱️ Confirmation Required" - 5-second countdown
- Test "Cancel" and "Send Now" options

**LOW TRUST (<45%):**
- Disconnect WiFi AND simulate low battery
- Press SOS
- **Expected:** "📱 Fallback Mode" - SMS backup message

---

### **4️⃣ Context-Aware False Alarm Filter**
**What to Test:**
- Pattern recognition
- False alarm detection
- Sensitivity reduction

**How to Test:**
1. **Create Pattern:** Press SOS 3+ times within same hour
2. **Check Logs:** Go to "Incident Logs" tab
3. **Repeat Pattern:** Press SOS again in same context
4. **Observe:** Lower trust scores for repeated patterns

**Expected Results:**
- First few triggers: Normal trust scores
- After 3+ similar contexts: "⚠️ Possible false alarm context detected"
- Reduced sensitivity (lower trust scores)

---

### **5️⃣ Incident Timeline**
**What to Test:**
- Complete data logging
- Firebase/Local storage
- Timeline display

**How to Test:**
1. Press SOS multiple times in different scenarios
2. Go to "Incident Logs" tab
3. Check incident details:
   - Timestamp
   - Trust score
   - Battery level
   - Network status
   - Location (if available)
   - AI confidence
   - Action taken
   - Context info

**Expected Results:**
- All incidents logged chronologically
- Complete system state captured
- Firebase sync indicator (if configured)

---

## 🎯 **Advanced Testing Scenarios**

### **Scenario A: High-Trust Emergency**
1. Charge device >50%
2. Connect to strong WiFi
3. Enable location services
4. Press SOS at night (after 22:00)
5. **Expected:** Instant alert, high trust score

### **Scenario B: Medium-Trust Situation**
1. Disconnect WiFi (use mobile data)
2. Press SOS during day hours
3. **Expected:** 5-second confirmation window
4. Test both "Cancel" and "Send Now"

### **Scenario C: Low-Trust Fallback**
1. Turn on airplane mode
2. Simulate low battery scenario
3. Press SOS
4. **Expected:** Fallback mode activation

### **Scenario D: False Alarm Detection**
1. Press SOS 4 times within same hour
2. Check logs for pattern recognition
3. Press SOS again in same context
4. **Expected:** Reduced trust score, warning message

### **Scenario E: Location Context**
1. Enable location permissions
2. Press SOS in same location multiple times
3. Move to different location
4. Press SOS again
5. **Expected:** Different context analysis

---

## 🔍 **What to Look For**

### **Visual Indicators:**
- ✅ Trust score colors (Green/Orange/Red)
- ✅ System health grid with icons
- ✅ AI confidence percentage
- ✅ Database status (Firebase/Local)
- ✅ Countdown timer for medium trust

### **Functional Tests:**
- ✅ All three escalation paths work
- ✅ Incident logging captures all data
- ✅ False alarm detection activates
- ✅ Context analysis includes time/movement/location
- ✅ Firebase fallback to local storage

### **Edge Cases:**
- ✅ No internet connection
- ✅ Location permission denied
- ✅ Low battery scenarios
- ✅ Rapid SOS button presses
- ✅ App backgrounding during countdown

---

## 🐛 **Troubleshooting**

**Firebase Issues:**
- Check Firestore security rules
- Verify config in `src/config/firebase.js`
- App falls back to local storage automatically

**Location Not Working:**
- Grant location permissions in device settings
- App works without location (reduced context)

**Trust Score Always Low:**
- Check battery level >20%
- Ensure network connectivity
- Verify sensor availability

---

## 📊 **Success Metrics**

**Core Innovation Demonstrated:**
- ✅ System evaluates its own trustworthiness
- ✅ Adapts response based on reliability
- ✅ Learns from usage patterns
- ✅ Provides clear explanations for decisions
- ✅ Maintains safety through fallbacks

**Technical Excellence:**
- ✅ Real-time system monitoring
- ✅ Multi-factor trust calculation
- ✅ Context-aware false alarm filtering
- ✅ Complete incident logging
- ✅ Offline-first architecture

This testing guide ensures you can demonstrate every aspect of TESS's trust-first emergency response system!