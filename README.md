# Hackathon Voting System

A real-time, interactive voting platform for hackathons. This system allows administrators to manage events and teams, while providing a seamless voting experience for the audience via QR codes and a mobile-friendly interface.

## Features

### 🌟 Admin Portal
- **Dashboard**: Centralized hub for event management.
- **Event Setup**: Configure event details, voting points for audience and judges.
- **Team Management**: Add, edit, and manage participating teams and projects.
- **QR Code Generation**: Instantly generate QR codes for audience login.
- **Live Monitoring**: View real-time voting progress.

### 🗳️ Audience Portal
- **Simple Login**: Quick access via Name and Email (QR code supported).
- **Interactive Voting**: Browse project cards and allocate points.
- **Real-time Balance**: Live tracking of remaining voting points.
- **Glassmorphic UI**: Modern, responsive, and visually appealing design.

### 🏆 Leaderboard
- **Live Rankings**: Real-time updates of team standings.
- **Dynamic Sorting**: Teams automatically reordered based on vote counts.
- **Public View**: Accessible to everyone on a large screen or personal device.

## Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with Glassmorphism)
- **Database**: SQLite (via Prisma ORM)
- **Data Fetching**: SWR (Stale-While-Revalidate)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackathon_Voting_System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   Visit `http://localhost:3000` (or `3001` if 3000 is busy).

## Usage Guide

### Admin Access
   For Admin Access Contact Me.

### Audience Voting
1. Scan the QR code generated in the Admin Portal or go to `/login`.
2. Enter your Name and Email to join.
3. Browse teams on the dashboard and allocate your points.

### Viewing Results
1. Navigate to `/leaderboard` for the public results view.
