const data = require("./src/data");
const fs = require("fs");

txt = fs
  .readFileSync("../Introspect/train.txt", "utf8")
  .split("\n")
  .filter(l => l)
  .map(l => l.split(": "));
hi = 0;
ai = 0;
ki = 0;
txt2 = txt.filter(txt => txt[0].length > 0).map(l => {
  switch (l[0]) {
    case "A":
      return {
        text: l[1],
        sentiment: data.antoineSentiment[ai],
        emoji: data.antoineEmoji[ai++],
        author: "fbid:100010298859546"
      };
    case "H":
      return {
        text: l[1],
        sentiment: data.hugoSentiment[hi],
        emoji: data.hugoEmoji[hi++],
        author: "fbid:1119230936"
      };
    case "K":
      return {
        text: l[1],
        sentiment: data.alexandreSentiment[ki],
        emoji: data.alexandreEmoji[ki++],
        author: "fbid:100007935940515"
      };
  }
});
fs.writeFileSync("src/data2.json", JSON.stringify(txt2));
