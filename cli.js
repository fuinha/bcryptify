#!/usr/bin/env node

const bcrypt = require("bcryptjs");
const ncp = require("copy-paste");
const readline = require("readline");
const { Writable } = require("stream");

const mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted) process.stdout.write(chunk, encoding);
    callback();
  }
});

mutableStdout.muted = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

rl.question("Password: ", password => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  ncp.copy(hashedPassword, () => {
    mutableStdout.muted = false;
    console.log("\nHash copied to clipboard!");
    rl.question("Test your password against the hash: ", password => {
      const matches = bcrypt.compareSync(password, hashedPassword);
      if (matches) {
        console.log("\nMatches! All done :)");
      } else {
        console.log("\nNo match... try running this program again.");
      }
      rl.close();
    });
    mutableStdout.muted = true;
  });
  // rl.close();
});

mutableStdout.muted = true;
