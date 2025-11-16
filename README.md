# AI Resume Analyzer

An intelligent, AI-powered resume analysis tool that helps job seekers optimize their resumes by comparing them against job descriptions. Get comprehensive insights including ATS compatibility scores, skill gap analysis, keyword optimization, and personalized recommendations.

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality

- **AI-Powered Analysis**: Leverages advanced AI models through OpenRouter to provide intelligent resume analysis
- **Multi-Format Support**: Upload resumes in PDF or DOCX format
- **Comprehensive Scoring**: Get detailed match scores including:
  - Overall Match Score (0-100%)
  - ATS Compatibility Score (0-100%)
  - Skill Match Rate (0-100%)

### 📊 Analysis Insights

- **Skill Gap Analysis**: Identify missing skills and qualifications that could improve your resume match
- **Matched Skills**: See which skills and experiences align with the job description
- **Keyword Density**: Understand which keywords from the job description appear in your resume and their frequency
- **ATS Issues Detection**: Get prioritized (HIGH, MEDIUM, LOW) ATS screening issues that could affect your application
- **Personalized Recommendations**: Receive actionable, tailored advice to optimize your resume

### 🎨 User Experience

- **Modern, Animated UI**: Beautiful interface with smooth animations and visual effects
- **Interactive Stepper**: Clear progress indication through the 3-step analysis process
- **Real-time Feedback**: Live status updates during analysis with animated loading states
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Input Validation**: Smart validation to ensure meaningful job descriptions and prevent gibberish input

### 🤖 ATS Optimization

- **Beat the Bots**: Get ATS compatibility scores to pass automated screening systems
- **Keyword Optimization**: Understand which keywords to include for better ATS matching
- **Issue Prioritization**: Focus on high-priority ATS issues first

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vipinvmenon/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Important**: To use free models on OpenRouter, you need to:
   1. Add a small amount of credits ($1-5 minimum) at [OpenRouter Settings](https://openrouter.ai/settings/credits)
   2. Enable "Model Training" at [OpenRouter Privacy Settings](https://openrouter.ai/settings/privacy)
   3. After this one-time setup, free models will work

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

1. **Start Analysis**: Click "Start Analysis" on the homepage
2. **Upload Resume**: Upload your resume in PDF or DOCX format (max 10MB)
3. **Enter Job Details**: 
   - Paste the job description (required, minimum 20 characters)
   - Optionally add job title and company name
4. **Analyze**: Click "Analyze Now" to start the AI-powered analysis
5. **Review Results**: Get comprehensive insights including:
   - Match scores and compatibility ratings
   - Skills analysis (matched and missing)
   - Keyword density and optimization suggestions
   - ATS issues with priority levels
   - Personalized recommendations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.3** - React framework with Pages Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **GSAP 3.13.0** - Animation library for smooth interactions
- **Lucide React** - Modern icon library
- **Three.js** - 3D graphics for visual effects

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **OpenRouter API** - AI model provider (supports multiple free models)
- **pdf2json** - PDF parsing library
- **mammoth** - DOCX parsing library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
resume-builder/
├── src/
│   ├── components/          # React components
│   │   ├── analysis/        # Analysis result components
│   │   ├── skeletons/       # Loading skeleton components
│   │   └── ...              # Other UI components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and constants
│   ├── pages/               # Next.js pages and API routes
│   │   ├── api/             # API endpoints
│   │   └── ...              # Page components
│   ├── services/            # API service functions
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── .env.local               # Environment variables (not committed)
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**
   - In Vercel project settings, add:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://your-app.vercel.app`)

4. **Deploy**
   - Vercel will automatically deploy on every push to your main branch

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### AI Model Settings

The application uses OpenRouter's auto-selection feature to choose the best available free model. You can modify the model in `src/lib/constants.ts`:

```typescript
export const AI_CONFIG = {
  PROVIDER: 'openrouter',
  MODEL: 'openrouter/auto', // Auto-selects best free model
  TEMPERATURE: 0.3,
  MAX_TOKENS: 2000,
}
```

### File Upload Limits

- **Max file size**: 10MB
- **Supported formats**: PDF, DOCX
- **Job description**: Minimum 20 characters with meaningful content validation

## 🐛 Troubleshooting

### API Key Issues

If you see "Missing credentials" errors:
1. Verify `OPENROUTER_API_KEY` is set in your environment variables
2. Ensure you've completed the OpenRouter setup (added credits and enabled model training)
3. Check Vercel environment variables if deployed

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check Node.js version (requires 20.x or higher)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### PDF Parsing Issues

- Ensure PDFs contain extractable text (not just images)
- Try converting scanned PDFs to text-based PDFs
- DOCX format is recommended for better text extraction

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) - AI model provider
- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform

---

Made with ❤️ for job seekers everywhere
