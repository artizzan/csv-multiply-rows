const csv = require('csv-parser');
const fs = require('fs');

const sourceCsvFilePath = 'input.csv';
const newColumnName = 'Task';
const newColumnValues = ["analyze", "act", "validate"];

multiplyRows();

function multiplyRows() {
  const rows = [];

  if (!fs.existsSync(sourceCsvFilePath)) {
    console.error(`File not found: ${sourceCsvFilePath}`);
    return;
  }

  fs.createReadStream(sourceCsvFilePath)
    .pipe(csv())
    .on('error', (error) => {
      console.error(`Error writing CSV file: ${error.message}`);
    })
    .on('data', (data) => rows.push(data))
    .on('end', () => {
      if (rows.length === 0) {
        console.error('CSV file is empty or has an invalid format');
        return;
      }

      const newRows = [];

      rows.forEach(row => {
        newColumnValues.forEach(value => {
            const newRow = { ...row, [newColumnName]: value };
          newRows.push(newRow);
        });
      });

      const newCsvFilePath = 'new_' + sourceCsvFilePath;
      const writeStream = fs.createWriteStream(newCsvFilePath);
      writeStream.write(Object.keys(newRows[0]).join(',') + '\n');

      newRows.forEach((row, index) => {
        writeStream.write(Object.values(row).join(','));
        if (index < newRows.length - 1) {
          writeStream.write('\n');
        }
      });

      writeStream.end();
    })
    .on('error', (error) => {
      console.error(`Error reading CSV file: ${error.message}`);
    });
}
