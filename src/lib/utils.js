const path = require('path');
const { readdir, stat } = require('fs/promises');

function getDirectory() {
  return path.join(__dirname, '../data');
}

async function getDirectorySize(directory = getDirectory()) {
  try {
    const files = await readdir(directory);
    const stats = await Promise.all(files.map(file => stat(path.join(directory, file))));
    const directorySize = stats.reduce((acc, { size }) => acc + size, 0);
    return directorySize;
  } catch (error) {
    console.error('Error calculating directory size:', error);
    throw error;
  }
}

getDirectorySize();

module.exports = {
  getDirectory,
  getDirectorySize
};
