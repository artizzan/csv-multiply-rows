# CSV Row Multiplier Script

This script reads a CSV file, multiplies its rows by introducing a new column with values from a specific array, and writes the new rows to a new CSV file.

## Usage

1. Install the required dependencies:
   ```
   npm install csv-parser
   ```

2. Create a CSV file (e.g., `input.csv`) with the data you want to process.

3. Create a JavaScript file (e.g., `index.js`) and add the following code:
   ```javascript
   const csv = require('csv-parser');
   const fs = require('fs');

   function multiplyRows(csvFilePath, valuesArray) {
     const rows = [];

     fs.createReadStream(csvFilePath)
       .pipe(csv())
       .on('data', (data) => rows.push(data))
       .on('end', () => {
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
       });
   }
   ```

4. Run the script with the desired CSV file and array of values:
   ```bash
   node index.js input.csv ["value1", "value2", "value3"]
   ```

5. The new CSV file (`new_input.csv`) will be created with the multiplied rows.
