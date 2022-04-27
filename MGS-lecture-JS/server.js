const http = require("http");
const fs = require("fs");
var mySet = function (req, res) {
  var url = req.url;
  if (req.url === "/") {
    url = "/index.html";
  }
  if (req.url === "/about") {
    url = "/about.html";
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  var htmlFile = fs.readFileSync(__dirname + url);
  res.end(htmlFile);
};
var app = http.createServer(mySet);
app.listen(8080);
// function mySet(req, res) {
//   let url = req.url;
//   if (req.url === "/") {
//     url = "/index.html";
//   }
//   if (req.url === "/about") {
//     url = "/about.html";
//   }
//   req.writeHead(200);
//   var htmlFile = fs.readFileSync(__dirname + url);
//   res.end(htmlFile);
// }
// var app = http.createServer(mySet);
// app.listen(8080);
