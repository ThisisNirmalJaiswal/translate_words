const express = require('express');
const fs = require('node:fs');
const app = express();
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// app.get('/', (req, res) => {
//   res.send('Hi there');
// });

// reading the input file

let inputText = fs.readFileSync('./assets/t8.shakespeare.txt', 'utf-8');
// console.log(inputText);

// read the find words list file

const findWordsList = fs
  .readFileSync('./assets/find_words.txt', 'utf-8')
  .split('\n')
  .map((word) => word.trim());

// console.log(findWordsList);

// read the dictionary csv file
const dictionary = [];
fs.createReadStream('./assets/french_dictionary.csv')
  .pipe(csv())
  .on('data', (data) => {
    dictionary.push(data);

    // console.log(data);
  })
  .on('end', () => {
    let replacements = 0;
    const uniqueWords = {};
    // console.log(dictionary);
    // loop through the find words list and dictionary to find replacements
    for (const findWord of findWordsList) {
      const replacementWord = dictionary.find(
        (word) => word.english === findWord
      )?.french;
      if (replacementWord) {
        // replace the word in the input text file
        const regex = new RegExp(`\\b${findWord}\\b`, 'gi');
        inputText = inputText.replace(regex, replacementWord);
        // console.log(replacementWord);
        replacements++;
        uniqueWords['key'] = uniqueWords.key;
      }
    }
    // console.log(uniqueWords);
    //create and write a processed text file as an output
    fs.writeFileSync('t8.shakespeare.translated.txt', inputText);
  });

// fs.writeFileSync('frequency.csv');

app.listen(3000, () => {
  console.log('serving at http://localhost:3000');
});
