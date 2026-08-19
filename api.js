if (!window.Parse) {
  console.error("Parse SDK not loaded!");
} else {
  console.log("Parse SDK Loaded");
Parse.initialize(
    "CHXrQck3aaULy1aZuPeRpHfhvbw386HOpjDa1XWF",
    "RPe3sQfHFnzuIn9KfOt1vYtb5JKAgPaByaNvH9yk"
    
);

Parse.serverURL = "https://parseapi.back4app.com/";
console.log("Parse ready:", typeof Parse);
}

