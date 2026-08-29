# ✈️ Travel Saathi (Travel-Saathi)

> **AI-Powered Smart Travel Companion & Local Culinary Guide**  
> Built with **Angular 21 (Standalone Components & Signals)**, **Web Speech API**, **Web Audio API**, and **Vitest**.

---

## 🌟 Overview

**Travel Saathi** is an intelligent, voice-interactive travel assistant and trip planner web application designed to elevate every aspect of trip planning—from budget estimation and itinerary curation to local food discovery. 

Featuring **"Maya"**, a built-in AI Voice Concierge, users can speak directly with their travel companion to get real-time recommendations, customize trip preferences, and seamlessly add local dishes to their food cart using natural voice commands.

---

## 🔥 Key Features

- 🤖 **Maya AI Voice Concierge**
  - **Voice Control & Speech Synthesis**: Integrated with Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) for hands-free interaction.
  - **Audio Synthesis**: Native Web Audio API chime feedback on wake-word recognition ("Hey Maya").
  - **Context-Aware Recommendations**: Analyzes duration, budget style, and travel group size in real time to suggest tailored itineraries and food items.
  - **Persona Selector**: Switch seamlessly between *Friendly Guide*, *Budget Optimizer*, and *Luxury Specialist*.

- 💰 **Interactive Budget & Trip Configurator**
  - Instant budget calculation across **Stay, Food, Transit, and Sightseeing**.
  - Adjust trip length, traveler count, and travel style (*Budget*, *Comfort*, *Luxury*) with reactive Signal-driven state updates.

- 🗺️ **Destination Exploration & Local Discovery**
  - Curated attraction cards, weather forecast integration, and activity suggestions.

- 🍽️ **Smart Culinary Marketplace & Cart**
  - Explore authentic local cuisine with rich metadata (ratings, veg/non-veg tags, prep time).
  - Add items directly to cart from AI concierge recommendations.
  - Slide-over cart drawer with total calculations and item management.

- 🎨 **Glassmorphism UI & Dynamic Theme Switcher**
  - Includes multi-theme support (**Emerald Oasis**, **Cyber Neon**, **Amber Glow**).
  - Modern typography, sleek glassmorphism, responsive mobile-first layouts, and smooth CSS micro-animations.

---

## 🛠️ Tech Stack & Technical Highlights

| Technology | Purpose |
| :--- | :--- |
| **Angular 21** | Modern Frontend Framework with Standalone Components & Signal Reactivity (`signal`, `computed`) |
| **TypeScript 5.9** | Type Safety & Clean Object Models |
| **Web Speech API** | Voice Query Recognition (`webkitSpeechRecognition`) & Text-to-Speech (`SpeechSynthesisUtterance`) |
| **Web Audio API** | Dynamic Web Audio Synthesizer for UI sound effects & wake-word chimes |
| **RxJS 7.8** | Reactive Event Streaming & Async Subscriptions |
| **Vitest 4** | Ultra-fast Unit Testing framework |
| **Vanilla CSS3** | Custom Design System, Dynamic HSL Themes, CSS Variables & Glassmorphism |

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LAXMINARASIMHA0705/Travel-Saathi.git
   cd Travel-Saathi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/` in your browser.

4. **Run Unit Tests:**
   ```bash
   npm test
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
Travel-Saathi/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/          # User Authentication UI & Forms
│   │   │   ├── explore/       # Destination Discovery & Attractions
│   │   │   └── food/          # Culinary Marketplace & Ordering
│   │   ├── services/
│   │   │   ├── ai.service.ts  # Maya AI Logic & Speech Synthesis
│   │   │   ├── auth.service.ts# User Auth State Management
│   │   │   ├── cart.service.ts# Culinary Cart Management (Signals)
│   │   │   ├── speech.service.ts# Web Speech API Integration
│   │   │   └── weather.service.ts# Live Weather Integration
│   │   ├── app.ts             # Main Container Component with Signals
│   │   ├── app.html           # Main Template & Navigation Drawers
│   │   └── app.css            # Custom Design System & Glassmorphism Themes
├── vitest.config.ts           # Vitest Test Runner Configuration
└── angular.json               # Angular CLI Workspace Configuration
```

---

## 👨‍💻 Note for Recruiters & Interviewers

This project highlights key software engineering practices:
1. **Modern Angular Architecture**: Leverages Angular 21 Signal-based state management (`signal`, `computed`, `update`) for granular reactivity without unnecessary re-renders.
2. **Browser APIs Integration**: Seamless integration of native Web Speech API and Web Audio API for an interactive multi-sensory user experience.
3. **Scalable Component Design**: Modular architecture using Angular Standalone Components and lazy-loaded routes.
4. **Clean Code & Unit Testing**: Full suite of unit tests powered by Vitest.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
