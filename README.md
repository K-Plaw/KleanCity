♻️ KleanCity


Cleaner Cities, Smarter Waste Pickup.


KleanCity is a modern climate-tech web application that enables Lagos households to schedule on-demand waste pickups, discover nearby recycling drop-off locations, and earn rewards for responsible waste disposal.


Built as a TS Academy PM Capstone 2026 project, KleanCity combines sustainability, accessibility, and smart-city convenience into a premium digital experience tailored for urban Nigeria.



🌍 Problem


Urban Lagos faces major waste management challenges:




Irregular waste collection


Limited access to recycling points


Poor waste disposal awareness


Environmental pollution and flooding




A survey conducted among Lagos residents revealed:




77% would use a waste management app


41% said they don't know nearby recycling points


31% complained about unreliable waste collection


56% would abandon an app that is slow or over-notifies them




KleanCity was built to solve these problems.



✨ Features


🚛 On-Demand Waste Pickup




Schedule waste pickups


Select waste type


Choose pickup time slots


Track pickup status in real time




♻️ Recycling Drop-Off Locator




Find nearby recycling centers in Lagos


Interactive map integration


Log recyclable drop-offs




🪙 KleanPoints Rewards System




Earn points for completed pickups


Earn bonus points for recycling


Redeem points for rewards and vouchers




💳 Wallet System




Fund wallet


View saved cards


Transaction history




🛠️ Dispute Management




Raise pickup disputes


Upload evidence


Track dispute status




🔐 Authentication




Secure signup/login


Firebase Authentication


Protected routes





🧠 Product Goals


KleanCity aims to:




Improve urban waste collection efficiency


Encourage recycling behavior


Reduce environmental pollution


Create a smarter waste management ecosystem


Increase sustainability awareness in Lagos





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




Backend




Firebase Authentication


Firebase Firestore


Firebase Storage


Firebase Cloud Functions




APIs & Services




Google Maps API


OpenStreetMap Fallback




Deployment




Vercel





📱 Core Screens




Homepage


Authentication


Dashboard


Schedule Pickup Flow


Rewards


Wallet


Disputes





🔄 Pickup Flow




User schedules pickup


Pickup status becomes Pending


Collector accepts request


Status updates to Accepted


Pickup completed


User earns +5 KleanPoints





♻️ Recycling Flow




User opens recycling map


Finds nearby recycling point


Logs recyclable drop-off


Earns +10 KleanPoints





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




⚡ Installation


Clone Repository


git clone <repository-url>



Navigate Into Project


cd kleancity



Install Dependencies


npm install



Run Development Server


npm run dev




🔑 Environment Variables


Create a .env.local file:


NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=




🔥 Firebase Setup




Create Firebase Project


Enable Authentication


Enable Firestore Database


Enable Firebase Storage


Add Web App credentials


Paste credentials into .env.local





🗺️ Seeded Lagos Recycling Locations




Lekki


Yaba


Surulere


Ikeja


Victoria Island





📊 Success Metrics




Completed waste pickups


Recycling participation


KleanPoints earned


User retention


Fast page load performance





🎨 Design Philosophy


KleanCity combines:




Eco-conscious aesthetics


Premium fintech-inspired UI


Smooth modern animations


Mobile-first responsiveness


Accessible design principles





🚀 Deployment


Deploy easily with Vercel:


npm run build



Then connect repository to Vercel.



👥 Team


TS Academy PM Capstone 2026

Group 13 — Climate / Sustainability



📜 License


This project is for educational and demonstration purposes.



🌱 KleanCity


Building cleaner cities through smarter waste management.



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
