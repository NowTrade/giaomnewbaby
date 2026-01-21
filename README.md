# Giaom Marketplace - Next.js 15

A modern, responsive marketplace template built with Next.js 15, App Router, and Tailwind CSS.

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser:**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 📁 Project Structure

\`\`\`
app/
├── category/[slug]/
│   └── page.tsx         # Category pages
├── product/[id]/
│   └── page.tsx         # Product detail pages
├── layout.tsx           # Root layout
├── page.tsx             # Homepage
└── globals.css          # Global styles

components/
├── ui/                  # shadcn/ui components
├── header.tsx           # Site header
├── footer.tsx           # Site footer
├── hero.tsx             # Hero section
├── categories.tsx       # Categories grid
└── featured-products.tsx # Product listings

lib/
└── utils.ts             # Utility functions
\`\`\`

## 🛠️ Available Scripts

- \`npm run dev\` - Runs the app in development mode
- \`npm run build\` - Builds the app for production
- \`npm start\` - Starts the production server
- \`npm run lint\` - Runs ESLint

## 🎨 Features

- ✅ **Next.js 15** with App Router
- ✅ **Server Components** by default
- ✅ **File-based routing** with dynamic routes
- ✅ **Responsive design** (mobile-first)
- ✅ **shadcn/ui components**
- ✅ **Tailwind CSS** styling
- ✅ **TypeScript** support
- ✅ **Dark mode** ready
- ✅ **SEO optimized**

## 🔧 Tech Stack

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **TypeScript** - Type safety
- **next-themes** - Dark mode support

## 📱 Routes

- \`/\` - Homepage
- \`/product/[id]\` - Product detail page
- \`/category/[slug]\` - Category listing page

## 🚀 Deployment

### Deploy to Vercel
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 🎯 Next Steps

- Add authentication with NextAuth.js
- Integrate database with Prisma
- Add payment processing with Stripe
- Implement search functionality
- Add shopping cart state management

## 📄 License

MIT License - free for personal and commercial use.
