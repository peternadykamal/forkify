let words = "0.5,kg,Rice,hello".replaceAll(" ", "").split(",", 3);
console.log(words);
words = [...words, ...new Array(3 - words.length).fill("")];
console.log(words);
