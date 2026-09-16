const path = require('path');
const fs = require('fs');

// Load environment variables (check root .env first, then backend/.env)
const envPath = fs.existsSync(path.resolve(__dirname, '.env'))
  ? path.resolve(__dirname, '.env')
  : path.resolve(__dirname, 'backend', '.env');
require('dotenv').config({ path: envPath });

// Auto-detect src folder (root ./src or ./backend/src)
const srcDir = fs.existsSync(path.resolve(__dirname, 'backend', 'src'))
  ? './backend/src'
  : './src';

const app = require(`${srcDir}/app`);
const connectDB = require(`${srcDir}/config/database`);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error(`✗ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();