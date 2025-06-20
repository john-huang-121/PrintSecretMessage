// const cheerio = require('cheerio');

// async function printSecretMessage(docUrl) {
//   try {
//     const response = await fetch(docUrl);
//     const html = await response.text();

//     const $ = cheerio.load(html);

//     const rows = $('table tr');
//     const points = [];
//     let maxX = 0;
//     let maxY = 0;

//     // Skip the header row (assumed to be the first row)
//     rows.slice(1).each((_, row) => {
//       const cols = $(row).find('td');

//       if (cols.length < 3) return;

//       const x = parseInt($(cols[0]).text().trim(), 10);
//       const char = $(cols[1]).text().trim();
//       const y = parseInt($(cols[2]).text().trim(), 10);

//       if (isNaN(x) || isNaN(y) || !char) return;

//       points.push({ char, x, y });

//       if (x > maxX) maxX = x;
//       if (y > maxY) maxY = y;
//     });

//     // Create the grid
//     const grid = Array.from({ length: maxY + 1 }, () =>
//       Array.from({ length: maxX + 1 }, () => ' ')
//     );

//     for (const { char, x, y } of points) {
//       grid[y][x] = char;
//     }

//     // Print the result
//     for (const row of grid) {
//       console.log(row.join(''));
//     }
//   } catch (err) {
//     console.error('Failed:', err.message);
//   }
// }

// const url = 'https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub';
// printSecretMessage(url);

const cheerioLib = require('cheerio');

const printSecretMessage = async (docUrl) => {
  try {
    const response = await fetch(docUrl);
    const html = await response.text();
    const cheerio = cheerioLib.load(html);
    const rows = cheerio('table tr');
    const points = [];
    let maxX = 0;
    let maxY = 0;

    rows.slice(1).each((_, row) => {
      const cols = cheerio(row).find('td');

      if (cols.length < 3) return; // Skip malformed rows

      const [xCell, charCell, yCell] = cols;

      const char = cheerio(charCell).text().trim();
      const x = parseInt(cheerio(xCell).text().trim(), 10);
      const y = parseInt(cheerio(yCell).text().trim(), 10);

      if (Number.isNaN(x) || Number.isNaN(y) || !char) return; // no type coersion

      points.push([char,x,y]);

      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    const grid = Array.from({ length: maxY + 1 }, () => Array.from({ length: maxX + 1 }, () => ' '));

    for (const [char, x, y] of points) {
      grid[y][x] = char;
    }

    for (const row of grid) {
      console.log(row.join(''));
    }
  } catch (err) {
    console.error('Failed', err.message);
  }
}

const url = "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub";
printSecretMessage(url);

// get a secret message