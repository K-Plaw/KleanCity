`
# ♻️ KleanCity

<div align="center">
  <h3>Cleaner Cities, Smarter Waste Pickup.</h3>
  <p>A premium climate-tech web application that enables Lagos households to schedule on-demand waste pickups, locate nearby recycling centers, and earn rewards for responsible waste disposal.</p>
  <p><em>Built for the TS Academy PM Capstone 2026.</em></p>

  <p>
    <a href="https://klean-city.vercel.app"><strong>🌐 Live Demo</strong></a> •
    <a href="https://github.com/K-Plaw/KleanCity"><strong>📦 GitHub Repository</strong></a>
  </p>
</div>

---

## 🌍 Overview
KleanCity is a modern waste management and recycling platform designed specifically for urban Lagos households.

The platform solves two major environmental problems:
1. Unreliable waste pickup
2. Lack of accessible recycling points

**Users can:**
* Schedule waste pickups and track pickup status
* Locate recycling centers
* Earn and redeem **KleanPoints** rewards
* Fund wallets
* Raise disputes

KleanCity combines sustainability, accessibility, and smart-city convenience into a polished digital experience.

---

## 📊 Problem Statement
Urban Lagos households struggle with missed or irregular waste collection, difficulty finding recycling drop-off locations, poor recycling awareness, and resulting waste accumulation and environmental pollution.

A Lagos-based survey conducted for this project revealed:
* **77%** would use a waste management app.
* **41%** cited a lack of nearby recycling points as their biggest frustration.
* **31%** complained about unreliable waste pickup.
* **56%** would abandon an app that is slow or over-notifies them.

*KleanCity was built to directly address these issues.*

---

## ✨ Core Features

### 🚛 On-Demand Waste Pickup
* Schedule waste pickups.
* Select pickup address and waste type.
* Choose pickup date/time.
* Track pickup status seamlessly (Pickup flow: `Pending` ➔ `Accepted` ➔ `Completed`).

### ♻️ Recycling Drop-Off Locator
* Interactive recycling map featuring Lagos recycling locations.
* Drop-off logging and recycling rewards.
* **Seeded Lagos locations include:** Lekki, Yaba, Surulere, Ikeja, and Victoria Island.

### 🪙 KleanPoints Rewards System
* **Earn:** `+5 KleanPoints` for completed pickups, `+10 KleanPoints` for recyclable drop-offs.
* **Redeem:** Points can be redeemed for Airtime, Partner vouchers, and Future rewards.

### 💳 Wallet System
* Fund wallet and view saved cards.
* Access transaction history.
* Simulated payment flows.

### 🛠️ Disputes Management
* Raise pickup disputes and upload evidence.
* Track dispute status and view ticket timeline.

### 🔐 Authentication
* User registration, secure login, and password recovery.
* Powered by Firebase Authentication with protected routes.

---

## 🎨 Design Philosophy
KleanCity combines eco-conscious aesthetics, a premium fintech-inspired UI, smooth modern animations, mobile-first responsiveness, and accessible design principles.

**Visual Identity:**
* Deep navy & Eco green
* Soft pink background (`#ffc9c9`)
* White cards & Soft glows
* Glassmorphism accents
* Animated recycle elements

---

## 🖼️ Screens

### Main Screens
1. Homepage
2. Signup
3. Signin
4. Dashboard
5. Schedule Pickup Flow
6. Rewards
7. Wallet
8. Disputes

---

## 🏗️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15+, TypeScript, TailwindCSS, Framer Motion, Zustand, React Query, React Hook Form, Zod, Axios |
| **Backend** | Firebase Authentication, Firebase Firestore, Firebase Storage, Firebase Cloud Functions |
| **APIs & Services**| Google Maps API, OpenStreetMap Fallback, Gemini API |
| **Deployment** | Vercel |

---

## 📂 Project Structure
```text
/app
/components
/features
/services
/store
/hooks
/utils
/types
/lib
/firebase
/styles

```
## 🚀 Getting Started
### Prerequisites
 * Node.js
 * npm or yarn
 * Firebase Project
 * Google Maps API Key
 * Gemini API Key
### ⚡ Installation
 1. **Clone Repository:**
```bash
   git clone <repository-url>

```
 2. **Navigate Into Project:**
```bash
   cd kleancity

```
 3. **Install Dependencies:**
```bash
   npm install

```
### 🔑 Environment Variables
Create a .env.local file in the root directory.
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

GEMINI_API_KEY=

```
### 🔥 Firebase Setup
 1. Create a Firebase Project.
 2. Enable Authentication.
 3. Enable Firestore Database.
 4. Enable Firebase Storage.
 5. Add a Web App.
 6. Copy Firebase credentials.
 7. Paste credentials into .env.local.
### ▶️ Running Locally
Start the development server:
```bash
npm run dev

```
Open: http://localhost:3000
## 🤖 AI-Assisted Development
KleanCity was developed using a combination of Google AI Studio, Gemini AI, AI-assisted prototyping, fullstack engineering workflows, and human-guided UI refinement. This accelerated rapid development while maintaining production-quality architecture and user experience.
## 📈 Success Metrics
Key metrics tracked:
 * Completed waste pickups
 * Recycling participation
 * KleanPoints earned
 * User retention
 * Fast page load performance
## 📱 Performance Goals
The application is optimized for:
 * Mid-range Android devices
 * Fast 4G connections
 * Mobile responsiveness
 * Lightweight animations
 * Fast page rendering
**Target:** < 3 second homepage load time
## 🔐 Security & Privacy
KleanCity prioritizes secure authentication, protected user data, encrypted Firebase authentication, secure Firestore rules, and safe address handling. **No passwords are stored in plaintext.**
## ⚠️ Validation Rules
Implemented validation states:
 * *Please confirm address for pickup.*
 * *Please specify number of bags.*
 * *Please enter minimum number of bags (4).*
 * *Please fill in necessary fields.*
 * *Pickups scheduled can only be cancelled after 15 minutes, please contact customer care to settle the dispute.*
## 🌱 Business Model
KleanCity earns revenue through a **15% commission on completed pickups**.
**Future opportunities:**
Brand partnerships, Reward sponsorships, Recycling data insights, and Sustainability partnerships.
## 👥 Team
**TS Academy PM Capstone 2026**
*Group 13 — Climate / Sustainability*
**Team Members:**
 * **Esther Amos** — UI/UX
 * **Norbert Ezinne** — Research Lead
 * **Blessing Ogar** — Documentation
 * **Obiwenite Amarachi** — Documentation
 * **Nwude Mimi** — Documentation
 * **Ojobo-Charlie Precious B.** — Documentation
## 🚀 Deployment
**Build the application:**
```bash
npm run build

```
**Deploy using:**
 * Vercel
 * Firebase Hosting
 * Netlify (optional)
## 📄 License
This project was developed for educational and demonstration purposes.
<div align="center">
<h3>♻️ KleanCity</h3>
<p><em>Building cleaner cities through smarter waste management.</em></p>
