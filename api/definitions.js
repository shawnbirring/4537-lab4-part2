const http = require("http");
const url = require("url");

let wordDefinitions = {
  JSON: "JavaScript Object Notation, a lightweight data-interchange format.",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === "GET") {
    let word = parsedUrl.query.word;
    if (word) {
      word = word.toLowerCase();
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
