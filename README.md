# Getty Images Clone 📸

A fully functional Getty Images clone - Stock photo platform with advanced search, collections, face detection, and user management. Built with Next.js 15, TypeScript, Supabase, and shadcn/ui.

## ✨ Features

### 🖼️ **Image Gallery & Search**
- Advanced infinite scroll image gallery
- Powerful search with filters (category, type, premium status)
- Professional watermarked image previews
- High-quality image display with zoom functionality
- Mobile-responsive design

### 👤 **User Management**
- Complete authentication system
- User roles (admin, user, premium)
- Profile management with avatars
- User dashboard with analytics

### 📚 **Collections & Favorites**
- Create and manage image collections
- Add images to favorites
- Public and private collection visibility
- Collection sharing capabilities

### 📊 **Admin Panel**
- Comprehensive admin dashboard
- User management and analytics
- Content moderation tools
- Upload management system
- Download tracking and analytics
- Face detection and recognition system

### 🤖 **AI-Powered Features**
- Advanced face detection and recognition
- Face tagging and management
- Training insights and metrics
- Bulk face processing

### 💾 **Database & Storage**
- Complete Supabase integration
- 6 core database tables with relationships
- Secure file storage with size/type validation
- Row Level Security (RLS) enabled
- Storage buckets for images and thumbnails

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/miezeer/getty-images-clone.git
cd getty-images-clone
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Environment Setup**
Copy the `.env.local` file and update with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The application includes a complete database schema with:

- **Users table** - User accounts and profiles
- **Images table** - Image metadata and information
- **Collections table** - User-created collections
- **Downloads table** - Download tracking
- **Favorites table** - User favorites
- **User Collections table** - Collection-image relationships

Storage buckets are configured for:
- `stock-images` - Full-size images (50MB limit)
- `stock-thumbnails` - Thumbnail images (10MB limit)

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS, CSS Variables
- **Icons**: Lucide React
- **Package Manager**: Bun

## 📱 Features Overview

### Public Features
- Browse image gallery
- Search and filter images
- View image details
- Download images (with authentication)

### User Features
- Create account and login
- Create and manage collections
- Add images to favorites
- Download tracking
- Personal dashboard

### Admin Features
- User management
- Content moderation
- Upload management
- Analytics dashboard
- Face detection management
- System settings

## 🚀 Deployment

### Netlify (Recommended)
The project includes a `netlify.toml` configuration file for easy deployment:

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel
You can also deploy on Vercel:

1. Import your GitHub repository
2. Set environment variables
3. Deploy with one click

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Live Demo](https://your-demo-url.netlify.app) (Coming Soon)
- [GitHub Repository](https://github.com/miezeer/getty-images-clone)
- [Issues](https://github.com/miezeer/getty-images-clone/issues)

---

**Built with ❤️ using Next.js and Supabase**
