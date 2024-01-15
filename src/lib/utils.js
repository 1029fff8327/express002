const path = require('path');
const fs = require('fs').promises;

function getDirectory() {
  return path.join(__dirname, '../data');
}

async function getDirectorySize(directory = getDirectory()) {
  try {
    // Check if the directory exists
    const exists = await fs.access(directory, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      console.error(`Directory not found: ${directory}`);
      return 0; // Return 0 or handle the case as appropriate for your application
    }

    const files = await fs.readdir(directory);
    let directorySize = 0;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isDirectory()) {
        directorySize += await getDirectorySize(filePath);
      } else {
        directorySize += fileStats.size;
      }
    }

    return directorySize;
  } catch (error) {
    console.error('Error calculating directory size:', error);
    throw error;
  }
}

module.exports = {
  getDirectory,
  getDirectorySize
};
