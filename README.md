# School Token System

A Next.js application for managing school tokens and details made for School towards Technology (S2T) 5.0 organized by Sairam Institutions.

## Features

- Token generation and management
- School details dashboard
- PDF generation capabilities
- MongoDB integration for data storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following structure:

```env
#===========================================
# MongoDB Database Configuration
#===========================================
# WARNING: Never commit this file to version control
# Make sure .env is in your .gitignore file

# MongoDB Atlas connection string
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                  # Next.js application routes
├── components/          # Reusable React components
├── lib/                 # Utility functions and database connections
├── models/             # MongoDB schema definitions
├── public/             # Static assets
├── styles/             # Global styles and CSS modules
└── pdfMaker/           # PDF generation utilities
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

This project can be deployed on [Vercel](https://vercel.com) for optimal performance with Next.js.

1. Push your code to a Git repository
2. Import your project to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## Important Notes

- Ensure `.env` is added to `.gitignore`
- Configure MongoDB Atlas security settings properly
- Set up proper authentication mechanisms
- Keep your MongoDB connection string private

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

#   s 2 t  
 