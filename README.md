# Attendos WisprFlow

A modern, full-featured attendance management system built for students to track their class attendance, manage timetables, and monitor attendance statistics.

## ✨ Features

- **📊 Dashboard**: Real-time attendance tracking with visual progress indicators
- **📅 Daily Attendance**: Mark attendance for subjects scheduled on the current day
- **🗓️ Timetable Management**: Create and manage weekly class schedules
- **📚 Subject Management**: Add subjects with custom types (Lecture, Practical, Tutorial) and color coding
- **📈 Statistics**: View overall attendance percentage and subject-wise breakdown
- **📜 History**: Comprehensive attendance history with filtering and search capabilities
- **🎉 Holiday Tracking**: Mark and manage holidays
- **🌓 Dark Mode**: Full dark/light theme support
- **🔐 Authentication**: Secure user authentication with email/password

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Prisma
- **Authentication**: Better Auth
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database (or Neon account)
- npm, yarn, pnpm, or bun

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd attendos-wisprflow
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Optional: If using Neon
# DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Optional: Open Prisma Studio to view data
npx prisma studio
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Structure

```
app/
├── (auth)/              # Authentication pages
│   ├── login/          # Login page
│   └── register/       # Registration page
├── (dashboard)/        # Protected dashboard routes
│   ├── dashboard/      # Main attendance dashboard
│   ├── history/        # Attendance history
│   ├── subjects/       # Subject management
│   └── timetable/      # Timetable management
├── api/                # API routes
│   ├── attendance/     # Attendance operations
│   ├── auth/          # Authentication endpoints
│   ├── daily/         # Daily subject fetching
│   ├── holidays/      # Holiday management
│   ├── stats/         # Statistics calculation
│   ├── subjects/      # Subject CRUD operations
│   └── timetable/     # Timetable operations
└── globals.css        # Global styles
components/             # Reusable components
lib/                   # Utility functions and configs
prisma/                # Database schema
```

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User accounts and authentication
- **Subject**: Academic subjects with types (Lecture/Practical/Tutorial)
- **WeekdaySubject**: Weekly timetable assignments
- **AttendanceRecord**: Daily attendance records (Present/Absent/No Lecture)
- **Holiday**: Holiday calendar entries

## 🎨 Features in Detail

### Dashboard
- View today's subjects and mark attendance
- Real-time attendance percentage with circular progress indicator
- Quick stats: total present days, total conducted classes
- Holiday management

### Subjects
- Create subjects with custom names and types
- Assign color codes for easy identification
- Edit and delete subjects
- Subject-wise attendance statistics

### Timetable
- Add subjects to specific weekdays
- Visual weekly schedule
- Manage multiple subjects per day

### History
- View complete attendance history
- Filter by subject and date range
- Search and sort functionality

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables
4. Deploy

### Other Platforms

This is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

Ensure you set up environment variables and run database migrations before deployment.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Secret key for authentication | Yes |
| `BETTER_AUTH_URL` | Application URL | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Better Auth](https://better-auth.com/) - Authentication library
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
