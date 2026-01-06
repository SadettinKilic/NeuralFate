# NEURAL FATE

A futuristic detective browser game powered by AI where mundane choices lead to murder.

![Neural Fate](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-blue?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?style=flat-square)

## 🎮 About the Game

Neural Fate is a hybrid AI detective experience where two players (or one player vs AI) live through a seemingly ordinary day filled with mundane choices. Unbeknownst to them, these choices converge at a crime scene, turning both into suspects in a murder investigation.

### Game Modes

- **🖥️ Local Mode**: Pass-the-phone experience for two players on one device
- **🌐 Online Multiplayer**: Real-time synchronization with a friend on another device  
- **🤖 Solo vs AI**: Challenge the Neural Shadow AI opponent across difficulty levels

### Key Features

- **AI-Powered Narratives**: Gemini 2.0 Flash generates unique stories and interrogation questions
- **Memory-Based Interrogation**: Players must recall specific details from their day
- **Dynamic Difficulty**: EASY, MEDIUM, and HARD modes with varying dilemma frequency
- **Suspicion Meter**: Track guilt levels based on interrogation performance
- **Scenario Caching**: Highly-rated scenarios are saved and reused for future games
- **Futuristic UI**: Anti-gravity animations, glassmorphism, and neon effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd neural-fate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ndrvkpfdjdufeosfoaqv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcnZrcGZkamR1ZmVvc2ZvYXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTI0NjQsImV4cCI6MjA4MzI2ODQ2NH0.eyK4OCtQHyDF_tMZM08qtB_CN-J-PNS6mXbqHfKwfgg
   GEMINI_API_KEY=AIzaSyCRUzRLHKn_OJLrCnStQF3dkiVc6wQKIWA
   ```

4. **Set up Supabase database**
   
   Run the SQL script in `supabase-schema.sql` in your Supabase SQL Editor to create the required tables.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL + Realtime)
- **AI**: Google Gemini 2.0 Flash
- **Icons**: Lucide React
- **State Management**: React Context API

## 🎯 How to Play

### 1. Select Game Mode
Choose between Local, Online Multiplayer, or Solo vs AI

### 2. Create Characters
- Enter your name
- Select an avatar
- Choose difficulty level (host only in multiplayer)

### 3. Day Phase (07:00 - 23:30)
- Make mundane choices throughout the day
- Each decision has a 10-second timer
- Choices determine your location at specific times

### 4. The Catalyst
A news bulletin reveals a murder at a location where both players were present

### 5. Interrogation Phase
- Answer 10 memory-based questions about your day
- Each question has a 15-second timer
- Correct answers lower suspicion (-10 to -20%)
- Wrong answers keep suspicion stable (0%)
- Timeouts increase suspicion (+10 to +20%)
- 2 critical mistakes = Arrested

### 6. Final Reveal
- Winner is determined by lowest suspicion level
- The true killer is revealed
- Rate the scenario (3+ saves it for future games)

## 🏗️ Project Structure

```
neural-fate/
├── app/
│   ├── api/
│   │   └── gemini/          # AI generation endpoints
│   ├── game/
│   │   ├── [mode]/          # Character creation
│   │   ├── play/            # Day phase gameplay
│   │   ├── interrogation/   # Interrogation phase
│   │   └── results/         # Final results
│   ├── globals.css          # Design system
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components
│   └── game/                # Game-specific components
├── lib/
│   ├── contexts/            # React contexts
│   └── utils/               # Utility functions
├── supabase-schema.sql      # Database schema
└── public/                  # Static assets
```

## 🎨 Design Philosophy

Neural Fate follows **Anti-Gravity** design principles:

- **Floating Elements**: All cards and components have subtle float animations
- **Glassmorphism**: Translucent backgrounds with backdrop blur
- **Neon Accents**: Electric blue and neon red color scheme
- **Responsive**: Mobile-first design with touch-optimized interactions
- **Accessibility**: Minimum 48px touch targets, keyboard navigation

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Neural Fate game"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Environment Variables in Vercel**
   
   Add these in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

## 📊 Game Statistics

- **Dilemma Frequency**:
  - EASY: Every 3-4 hours (4 dilemmas)
  - MEDIUM: Every 2 hours (6 dilemmas)
  - HARD: Every hour (8 dilemmas)

- **AI Opponent Accuracy**:
  - EASY: 65% (35% error rate)
  - MEDIUM: 82% (18% error rate)
  - HARD: 95% (5% error rate)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini**: For powerful AI story generation
- **Supabase**: For realtime database infrastructure
- **Vercel**: For seamless deployment
- **Framer Motion**: For stunning animations

---

**Built with ❤️ using Next.js, Gemini AI, and Supabase**

For issues or questions, please open an issue on GitHub.
