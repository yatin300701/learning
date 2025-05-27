const corpus = ["low", "lower", "newest", "widest"];
function buildVocab(corpus) {
  const vocab = {};
  for (const word of corpus) {
    const tokens = word.split("").concat(["</w>"]); // example: l o w </w>
    const key = tokens.join(" ");
    vocab[key] = (vocab[key] || 0) + 1;
  }
  return vocab;
}

// usage
const vocab = buildVocab(corpus);
console.log("Initial vocab:", vocab);
