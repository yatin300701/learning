for (var i = 0; i < 3; i++) {
  //   setTimeout(() => console.log(i), 1000);
}

//   fix

for (var i = 0; i < 3; i++) {
  ((j) => {
    // console.log("i", i);
    // setTimeout(() => console.log(j), 1000);
  })(i);
}

// Once
const greet = once(() => console.log("Hello"));
greet(); // "Hello"
greet(); // nothing
greet(); // nothing

// Implementation

console.log("once");

function once(fn) {
  let ranOnce = false;
  return () => {
    if (!ranOnce) {
      fn();
      ranOnce = true;
      console.log("ranOnce", ranOnce);
      return;
    }
    console.log("ranOnceCache", ranOnce);
    return;
  };
}
