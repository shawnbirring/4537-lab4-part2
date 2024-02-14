const http = require("http");
const url = require("url");

let wordDefinitions = [
  {
    word: "word",
    definition: "a word or something.",
  },
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === "GET") {
    const word = parsedUrl.query.word;
    if (word) {
      const definition = wordDefinitions[word];
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ word, definition }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `No definition found for word: ${word}` })
      );
    }
  } else if (req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "post" }));
  }
});

module.exports = server;
