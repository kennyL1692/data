# Medical Charges Dashboard

An interactive web dashboard visualizing medical insurance cost data with beautiful animations and insights.

## Features

- 📊 **Interactive Visualizations**: D3.js-powered charts including scatter plots, bar charts, and histograms
- 🎨 **Modern Design**: Dark theme with medical teal accents and smooth gradients
- ✨ **Smooth Animations**: Anime.js animations for engaging user experience
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🚀 **Fast**: Built with Vite for lightning-fast development and optimized production builds

## Visualizations

1. **Scatter Plot**: Medical Charges vs Age - Shows the correlation between age and medical costs, color-coded by smoking status
2. **Bar Chart**: Average Charges by Region - Compares regional variations in medical insurance costs
3. **Histogram**: BMI Distribution - Displays the distribution of Body Mass Index across the population

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **D3.js** - Data visualization
- **Anime.js** - Animations
- **CSS3** - Styling with custom properties

## Installation

Since npm/npx commands may have execution policy restrictions on Windows, you have two options:

### Option 1: Manual Installation (Recommended for Windows)

The project structure is already set up. Just install dependencies:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Navigate to the project directory
4. Run: `npm install`

### Option 2: Use Command Prompt

Instead of PowerShell, use Command Prompt (cmd.exe):

```cmd
cd c:\Users\Kenny\OneDrive\Documents\GitHub\data
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deploy to Netlify

### Method 1: Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### Method 2: Netlify UI (Drag & Drop)

1. Build the project: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

### Method 3: Git Integration

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Click "Deploy site"

## Project Structure

```
data/
├── public/
│   └── medical-charges.csv    # Medical data
├── src/
│   ├── components/
│   │   ├── Charts/
│   │   │   ├── ScatterPlot.jsx
│   │   │   ├── BarChart.jsx
│   │   │   └── Histogram.jsx
│   │   ├── Dashboard.jsx
│   │   └── StatsCard.jsx
│   ├── utils/
│   │   └── dataLoader.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Data Source

The dashboard uses the `medical-charges.csv` dataset containing:
- Age
- Sex
- BMI (Body Mass Index)
- Number of children
- Smoker status
- Region
- Medical charges

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

Built with ❤️ using React, D3.js, and Anime.js
