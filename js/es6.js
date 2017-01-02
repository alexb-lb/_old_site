'use strict';
var promise = new Promise((resolve, reject) => {
  setTimeout(() => reject (new Error("o_O")), 5000);
});

promise
  .then(
    result => console.log("Fulfilled: " + result),
    error => console.log("Rejected: " + error.message) // Rejected: время вышло!
  );
