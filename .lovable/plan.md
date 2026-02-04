

# Habitat – Adaptive Reforestation Management Platform

A premium climate-tech dashboard that transforms reforestation into a decades-long adaptive ecosystem management system.

---

## Design Foundation

### Visual Language
- **Palette**: Light sage/pale mint background (#E8F0EB), natural forest green accents (#2D7A4F), muted blues for data, soft earth tones for soil indicators
- **Typography**: Inter font family with large headings and generous spacing
- **Cards**: Large border radius (16-20px), soft shadows, subtle glassmorphism effects
- **Animations**: Smooth fade/slide transitions, hover elevation, fluid map interactions

---

## Core Dashboard Layout

### 1. Top Navigation Bar
- Habitat logo with leaf/tree icon on the left
- Page title "Explore Restoration Regions"
- User profile avatar with dropdown on the right

### 2. Left Sidebar – Region Cards
Scrollable panel featuring global restoration regions:
- **Africa**: Uganda, Kenya, Ghana
- **Asia**: Indonesia, India, Vietnam
- **South America**: Brazil, Colombia, Peru

Each card includes:
- Background nature image
- Country name with flag
- Number of plots & planting initiatives
- Glowing "Explore" button
- Hover: subtle zoom, card lift, button glow intensifies

### 3. Center – Interactive Mapbox Map
- Beautiful world map with Mapbox GL styling
- Soft green overlays on restoration regions
- Tree icons marking active zones
- Smooth zoom animations when clicking regions
- Toggleable map layers:
  - Vegetation health (green → yellow → red gradient)
  - Soil quality overlay
  - Risk zones (drought/stress indicators)

### 4. Bottom Analytics Strip
Three glassmorphism cards with real-time metrics:

**Carbon Sequestration Card**
- Animated line chart showing CO₂ captured over years
- Large metric: "102,304 t CO₂ bound"
- Growth indicator: "+30.45%"

**Ecological Composition Card**
- Elegant donut chart breakdown:
  - Native forest
  - Mixed plantation
  - Agroforestry
- Total reforested land in hectares

**Social Impact Card**
- Smallholder farmers count with animated counter
- Average income increase
- Timber value metrics
- Clean iconography

---

## Feature Modules

### 1. Region Detail View
When clicking "Explore" on a region:
- Smooth panel slide-in
- Land Suitability Score (0-100) with color indicator
- Climate data: rainfall, temperature, seasonality
- Recommended native species cards with:
  - Tree name & image
  - Survival probability percentage
  - Reason for recommendation

### 2. Soil & Mineral Intelligence Panel
- pH level gauge (acidic to alkaline)
- Nutrient status indicators (N, P, K)
- Moisture level meter
- Suggested soil treatments as action cards

### 3. Predictive Risk & Early Warning System
- Timeline showing upcoming risk events
- Warning cards with calm styling:
  - Drought risk probability
  - Heat stress indicators
  - Pest/disease alerts
- Color-coded severity (green → amber → soft red)

### 4. Health & Growth Analytics
- Vegetation health trend chart
- Survival rate indicator with progress ring
- Dynamic carbon sequestration projection
- Interactive time slider (Year 1 → Year 10)

### 5. Collaborative Decision Support
Action recommendation cards suggesting:
- "Increase irrigation by 20%"
- "Apply nitrogen-rich compost"
- "Switch to drought-resistant species"

Each action shows:
- Clear reasoning
- Expected impact
- Confidence indicator

---

## Simulation Mode

Toggle switch in the top bar enabling hackathon demo scenarios:
- **Trigger drought**: Map updates, risk alerts appear
- **Reduce rainfall**: Recommendations adapt
- **Increase temperature**: Species suggestions change

Real-time dashboard updates to show adaptive responses.

---

## Technical Approach

- **Frontend**: React + TypeScript + Tailwind CSS
- **Map**: Mapbox GL JS with custom styling
- **Charts**: Recharts for all data visualizations
- **Animations**: CSS transitions + Framer Motion for complex interactions
- **Data**: Realistic mock data simulating real restoration projects
- **State**: React Query for data management

---

## Deliverables Summary

1. Polished dashboard homepage with all core components
2. Interactive Mapbox world map with region overlays
3. Region detail panels with species recommendations
4. Soil intelligence dashboard
5. Risk prediction & alerts system
6. Growth analytics with time-based projections
7. Decision support action cards
8. Simulation mode toggle
9. Responsive design for tablet/desktop
10. Smooth micro-interactions throughout

