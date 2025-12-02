const fs = require("fs");
const EventEmitter = require("events");
const readline = require("readline");

// ----- readline setup -----
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ---- EventEmitter class ----
class VotingSystem extends EventEmitter {
  constructor() {
    super();
    this.votes = { A: 0, B: 0, C: 0 };
  }

  castVote(candidate, callback) {
    candidate = candidate.toUpperCase();

    if (this.votes.hasOwnProperty(candidate)) {
      this.votes[candidate]++;

      this.emit("vote_casted", candidate);

      this.saveVotes((err) => {
        if (err) callback(err);
        else callback(null, `Vote recorded for ${candidate}`);
      });

    } else {
      this.emit("invalid_vote", candidate);
      callback(`Invalid candidate: ${candidate}`);
    }
  }

  saveVotes(callback) {
    fs.writeFile("votes.json", JSON.stringify(this.votes, null, 2), (err) => {
      callback(err);
    });
  }

  endVoting() {
    this.emit("voting_ended", this.votes);
  }
}

// ---- Create system ----
const voting = new VotingSystem();

// ---- Event Listeners ----
voting.on("vote_casted", (candidate) => {
  console.log(`✅ Vote received for: ${candidate}`);
});

voting.on("invalid_vote", (candidate) => {
  console.log(`❌ Invalid vote: ${candidate}`);
});

voting.on("voting_ended", (votes) => {
  console.log("\n📊 FINAL RESULTS:");
  console.log(votes);

  let winner = Object.keys(votes).reduce((a, b) =>
    votes[a] > votes[b] ? a : b
  );

  console.log(`\n🏆 Winner is: ${winner}`);
  rl.close();
});

// ----- Ask for input -----
function takeVote() {
  rl.question("\nVote for A / B / C OR type END to stop: ", (answer) => {
    if (answer.toLowerCase() === "end") {
      voting.endVoting();
    } else {
      voting.castVote(answer, (err, msg) => {
        if (err) console.log("Error:", err);
        else console.log(msg);

        takeVote(); // ask again
      });
    }
  });
}

// ----- Start -----
console.log("\n🗳️ Voting Started...");
takeVote();
