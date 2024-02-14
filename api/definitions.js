const http = require("http");
const url = require("url");

let wordDefinitions = { alex: "a programmer" };
let totalRequests = 0;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const parsedUrl = url.parse(req.url, true);
  if (req.method === "GET") {
    totalRequests++;
    let word = parsedUrl.query.word;
    if (word) {
      word = word.toLowerCase();
      const definition = wordDefinitions[word];
      if (definition) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ word, definition }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ totalRequests }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ totalRequests }));
    }
  } else if (req.method === "POST") {
    totalRequests++;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        let { word, definition } = JSON.parse(body);
        word = word.toLowerCase();
        // used gpt here to check if there are numbers in the word or definition
        const hasNumbers = /\d/;
        if (!word || word.length === 0 || !definition || definition.length === 0 || hasNumbers.test(word) || hasNumbers.test(definition)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ totalRequests }));
        } else if (wordDefinitions[word]) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ totalRequests }));
        } else {
          wordDefinitions[word] = definition;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ word, definition }));
        }
      } catch (error) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ totalRequests }));
      }
    });
  }
});

module.exports = server;
