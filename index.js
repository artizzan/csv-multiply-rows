const csv = require('csv-parser');
const fs = require('fs');
const csvFilePath = 'input.csv';
const valuesArray = ["value1", "value2", "value3"];

function multiplyRows() {
  const rows = [];

  if (!fs.existsSync(csvFilePath)) {
    console.error(`File not found: ${csvFilePath}`);
    return;
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', () => {
      if (rows.length === 0) {
        console.error('CSV file is empty or has an invalid format');
        return;
      }

      const newRows = [];

      rows.forEach(row => {
        valuesArray.forEach(value => {
          const newRow = { ...row, newColumn: value };
          newRows.push(newRow);
        });
      });

      const newCsvFilePath = 'new_' + csvFilePath;
      const writeStream = fs.createWriteStream(newCsvFilePath);
      writeStream.write(Object.keys(newRows[0]).join(',') + '\n');

      newRows.forEach(row => {
        writeStream.write(Object.values(row).join(',') + '\n');
      });

      writeStream.end();
    })
    .on('error', (error) => {
      console.error(`Error reading CSV file: ${error.message}`);
    });

  writeStream.on('error', (error) => {
    console.error(`Error writing CSV file: ${error.message}`);
  });
}
