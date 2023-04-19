const fs = require('node:fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const inputFilePath = 'input.txt';
const findWordsFilePath = 'find_words.txt';
const dictionaryFilePath = 'dictionary.csv';
const outputFilePath = 'output.txt';

const startTime = process.hrtime.bigint();

// Step 1: Read the input text file, find words list text file and dictionary csv file.
const inputText = fs.readFileSync('./assets/t8.shakespeare.txt', 'utf-8');
const findWords = fs
  .readFileSync('./assets/find_words.txt', 'utf-8')
  .split('\n');
const dictionary = [];
fs.createReadStream('./assets/french_dictionary.csv')
  .pipe(csv())
  .on('data', (data) => {
    dictionary.push(data)
    // console.log(data);
  })
  .on('end', () => {
    // Step 2: Find all words that is in the find words list, that has a replacement word in the dictionary.
    const wordCount = {};
    const replacedWords = new Set();
    let outputText = inputText.replace(/\b\w+\b/g, (match) => {
      if (findWords.includes(match) && dictionary[match]) {
        replacedWords.add(match);
        wordCount[match] = (wordCount[match] || 0) + 1;
        return dictionary[match];
      }
      return match;
    });
    console.log(dictionary);
    // Step 4: Save the processed file as output.
    fs.writeFileSync('t8.shakespeare.translated.txt', outputText);

    // Step 5: Unique list of words that was replaced with French words from the dictionary.
    const uniqueReplacedWords = Array.from(replacedWords);

    // Step 6: Number of times a word was replaced.
    console.log(wordCount);
    const wordCountList = Object.entries(wordCount);

    // Step 7: Time taken to process.
    const endTime = process.hrtime.bigint();
    const elapsedTimeInMs = Number(endTime - startTime) / 1000000;

    // Step 8: Memory taken to process.
    const memoryUsageInMB = process.memoryUsage().heapUsed / 1024 / 1024;

    console.log(`Processed file saved to ${outputFilePath}`);
    console.log(`Unique replaced words: ${uniqueReplacedWords}`);
    console.log(`Word count: ${wordCountList}`);
    console.log(`Time taken: ${elapsedTimeInMs} ms`);
    console.log(`Memory used: ${memoryUsageInMB} MB`);
  });
