# AI Through a Moroccan Lens

A bilingual (Arabic/English) website showcasing AI projects through a distinctly Moroccan aesthetic lens. The website features modern web technologies while incorporating traditional Moroccan design elements, patterns, and color schemes.

## Features

- Bilingual support (Arabic/English) with automatic language detection
- Responsive design for mobile, tablet, and desktop
- RTL (Right-to-Left) support for Arabic language
- Modern UI with Moroccan-inspired design elements
- Gallery with full-screen image viewing capabilities
- About section with project timeline and team information

## Recent Updates

- Removed Blog and Contact pages for a simpler user experience
- Enhanced the Gallery page with full-screen photo viewing
- Fixed hydration issues with nested HTML elements
- Improved params handling with React.use() to follow Next.js best practices
- Simplified navigation and overall site structure

## Technologies Used

- **Framework**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: Custom i18n implementation for Arabic/English language switching
- **UI Components**: React Icons and custom components
- **Animations**: Transition effects for smooth user experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/youth-prize.git
   cd youth-prize
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
/youth-prize
├── public/              # Static assets
│   └── images/          # Image files
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── [locale]/    # Dynamic locale routing
│   │   │   ├── about/   # About page
│   │   │   ├── blog/    # Blog page
│   │   │   ├── contact/ # Contact page
│   │   │   ├── gallery/ # Gallery page
│   │   │   └── page.tsx # Home page
│   ├── components/      # Reusable components
│   ├── lib/             # Utility functions and configuration
│   │   ├── dictionaries/ # Translation files
│   │   └── i18n.ts     # Internationalization config
└── README.md           # Project documentation
```

## Internationalization

The website supports both English and Arabic languages. The language is detected automatically based on the user's browser settings, but can also be switched manually from the language selector in the navigation bar.

Translation files are located in `src/lib/dictionaries/` directory.

## Customization

To customize the website:

- Edit the translation files in `src/lib/dictionaries/` to change the text content
- Modify the Tailwind CSS configuration in `tailwind.config.js` to change the design system
- Update or add pages in the `src/app/[locale]/` directory
- Customize components in the `src/components/` directory

## License

This project is licensed under the MIT License.
