const http = require("http");
const url = require("url");

let wordDefinitions = {};
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
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ word, definition, totalRequests }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: `No definition found for word: ${word}`,
          totalRequests,
        })
      );
    }
  } else if (req.method === "POST") {
    totalRequests++;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { word, definition } = JSON.parse(body);
        if (wordDefinitions[word]) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "word already in", totalRequests })
          );
        } else {
          wordDefinitions[word] = definition;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ word, definition, totalRequests }));
        }
      } catch (error) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "cannot parse json", totalRequests })
        );
      }
    });
  }
});

module.exports = server;
