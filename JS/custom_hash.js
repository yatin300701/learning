class CustomHash {
  bucket = Array.from({ length: 1000 }, () => []);

  set(key, value) {
    const index = this._hash(key);
    for (let i = 0; i < this.bucket[index].length; i++) {
      if (this.bucket[index][i].key == key) {
        this.bucket[index][i].value = value;
        return;
      }
    }
    this.bucket[index].push({ key, value });
  }

  get(key) {
    const index = this._hash(key);
    for (let i = 0; i < this.bucket[index].length; i++) {
      if (this.bucket[index][i].key == key) return this.bucket[index][i].value;
    }
    return null;
  }

  _hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = hash * 33 + key[i].charCodeAt(0);
    }
    return hash % 1000;
  }
}
