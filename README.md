# NEURAL FATE (V.2.0.88)

![Vaporwave UI](https://img.shields.io/badge/Design_System-Vaporwave%2FOutrun-ff00ff?style=flat-square)
![Next.js](https://img.shields.io/badge/Framework-Next.js_16-black?style=flat-square)
![Gemini AI](https://img.shields.io/badge/AI_Core-Gemini_2.0-00ffff?style=flat-square)

A futuristic detective browser game where mundane choices lead to murder, now re-imagined with a **Vaporwave / Outrun** aesthetic.

## 🎨 New Design System: "Digital Nostalgia"

The UI has been completely overhauled to transport users to a synthetic reality:

- **The Infinite Grid**: Receding perspective grid that creates continuous spatial flow
- **Neon Tokens**: High-contrast Neon Cyan (`#00FFFF`) and Hot Magenta (`#FF00FF`)
- **CRT Aesthetics**: Global scanlines and subtle chromatic aberration
- **Kinetic Typography**: "Orbitron" for headings and "Share Tech Mono" for data
- **Theatrical Interaction**: Skewed buttons that morph on hover, glowing inputs, and glass-panel cards

## 🎮 Game Features

- **Local Mode**: Pass-the-terminal experience for two players
- **Online Multiplayer**: Real-time neural synchronization
- **Solo vs AI**: Challenge the Neural Shadow algorithm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase Account
- Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd neural-fate

# Install dependencies
npm install

# Setup Environment (.env.local)
# Make sure to set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and GEMINI_API_KEY
```

### Running Locally

```bash
npm run dev
# Access local terminal at http://localhost:3000
```

## 📦 Deployment (Vercel)

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: redesign UI to vaporwave system"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Import repository
   - Add Environment Variables
   - Deploy

3. **Verify Production**:
   Ensure fonts and animations load correctly on production URL.

## 🔧 Git Commands for Update

If you need to update the repository with the new design:

```bash
# Add all new design files
git add .

# Commit with descriptive message
git commit -m "refactor: complete UI overhaul to Vaporwave/Outrun design system"

# Push to your branch
git push origin main
```

## 📂 Project Structure

- `app/globals.css`: Contains the new Vaporwave CSS variables and global animations
- `components/ui/`: Contains the refactored "Glass Panel" and "Terminal" components
- `design.xml`: The source of truth for the new design system

---
**System Status**: ONLINE
**Visual Core**: ACTIVE
