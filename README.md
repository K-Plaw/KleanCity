♻️ KleanCity

<div align="center">

Cleaner Cities, Smarter Waste Pickup.

A premium climate-tech web application that enables Lagos households to schedule on-demand waste pickups, locate nearby recycling centers, and earn rewards for responsible waste disposal.

Built for the TS Academy PM Capstone 2026.

</div>
---

🌍 Overview

KleanCity is a modern waste management and recycling platform designed specifically for urban Lagos households.

The platform solves two major environmental problems:

Unreliable waste pickup

Lack of accessible recycling points


Users can:

Schedule waste pickups

Track pickup status

Locate recycling centers

Earn KleanPoints rewards

Redeem rewards

Fund wallets

Raise disputes


KleanCity combines sustainability, accessibility, and smart-city convenience into a polished digital experience.


---

📊 Problem Statement

Urban Lagos households struggle with:

Missed or irregular waste collection

Difficulty finding recycling drop-off locations

Poor recycling awareness

Waste accumulation and environmental pollution


A Lagos-based survey conducted for this project revealed:

77% would use a waste management app

41% cited lack of nearby recycling points as their biggest frustration

31% complained about unreliable waste pickup

56% would abandon an app that is slow or over-notifies them


KleanCity was built to directly address these issues.


---

✨ Core Features

🚛 On-Demand Waste Pickup

Schedule waste pickups

Select pickup address

Choose waste type

Select pickup date/time

Track pickup status


Pickup flow:

Pending → Accepted → Completed


---

♻️ Recycling Drop-Off Locator

Interactive recycling map

Lagos recycling locations

Drop-off logging

Recycling rewards


Seeded Lagos locations include:

Lekki

Yaba

Surulere

Ikeja

Victoria Island



---

🪙 KleanPoints Rewards System

Users earn:

+5 KleanPoints for completed pickups

+10 KleanPoints for recyclable drop-offs


Points can be redeemed for:

Airtime

Partner vouchers

Future rewards



---

💳 Wallet System

Fund wallet

View saved cards

Transaction history

Simulated payment flows



---

🛠️ Disputes Management

Raise pickup disputes

Upload evidence

Track dispute status

View ticket timeline



---

🔐 Authentication

User registration

Secure login

Password recovery

Firebase Authentication

Protected routes



---

🎨 Design Philosophy

KleanCity combines:

Eco-conscious aesthetics

Premium fintech-inspired UI

Smooth modern animations

Mobile-first responsiveness

Accessible design principles


Visual identity:

Deep navy

Eco green

Soft pink background (#ffc9c9)

White cards

Soft glows

Glassmorphism accents

Animated recycle elements



---

🖼️ Screens

Main Screens

1. Homepage


2. Signup


3. Signin


4. Dashboard


5. Schedule Pickup Flow


6. Rewards


7. Wallet


8. Disputes




---

🏗️ Tech Stack

Frontend

Next.js 15+

TypeScript

TailwindCSS

Framer Motion

Zustand

React Query

React Hook Form

Zod

Axios



---

Backend

Firebase Authentication

Firebase Firestore

Firebase Storage

Firebase Cloud Functions



---

APIs & Services

Google Maps API

OpenStreetMap Fallback

Gemini API



---

Deployment

Vercel



---

📂 Project Structure

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


---

🚀 Getting Started

Prerequisites

Node.js

npm or yarn

Firebase Project

Google Maps API Key

Gemini API Key



---

⚡ Installation

Clone Repository

git clone <repository-url>


---

Navigate Into Project

cd kleancity


---

Install Dependencies

npm install


---

🔑 Environment Variables

Create a .env.local file in the root directory.

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

GEMINI_API_KEY=


---

🔥 Firebase Setup

1. Create a Firebase Project


2. Enable Authentication


3. Enable Firestore Database


4. Enable Firebase Storage


5. Add a Web App


6. Copy Firebase credentials


7. Paste credentials into .env.local




---

▶️ Running Locally

Start the development server:

npm run dev

Open:

http://localhost:3000


---

🤖 AI-Assisted Development

KleanCity was developed using a combination of:

Google AI Studio

Gemini AI

AI-assisted prototyping

Fullstack engineering workflows

Human-guided UI refinement


This accelerated rapid development while maintaining production-quality architecture and user experience.


---

📈 Success Metrics

Key metrics tracked:

Completed waste pickups

Recycling participation

KleanPoints earned

User retention

Fast page load performance



---

📱 Performance Goals

The application is optimized for:

Mid-range Android devices

Fast 4G connections

Mobile responsiveness

Lightweight animations

Fast page rendering


Target:

< 3 second homepage load time


---

🔐 Security & Privacy

KleanCity prioritizes:

Secure authentication

Protected user data

Encrypted Firebase authentication

Secure Firestore rules

Safe address handling


No passwords are stored in plaintext.


---

⚠️ Validation Rules

Implemented validation states:

Please confirm address for pickup.

Please specify number of bags.

Please enter minimum number of bags (4).

Please fill in necessary fields.

Pickups scheduled can only be cancelled after 15 minutes, please contact customer care to settle the dispute.


---

🌱 Business Model

KleanCity earns revenue through:

15% commission on completed pickups


Future opportunities:

Brand partnerships

Reward sponsorships

Recycling data insights

Sustainability partnerships



---

👥 Team

TS Academy PM Capstone 2026

Group 13 — Climate / Sustainability

Team Members:

Esther Amos — UI/UX

Norbert Ezinne — Research Lead

Blessing Ogar — Documentation

Obiwenite Amarachi — Documentation

Nwude Mimi — Documentation

Ojobo-Charlie Precious B. — Documentation



---

🚀 Deployment

Build the application:

npm run build

Deploy using:

Vercel

Firebase Hosting

Netlify (optional)



---

📄 License

This project was developed for educational and demonstration purposes.


---

♻️ KleanCity

Building cleaner cities through smarter waste management.
