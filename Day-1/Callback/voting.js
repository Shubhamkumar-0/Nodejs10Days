const fs = require("fs");
const EventEmitter = require("events");

// ---- EventEmitter class ----
class VotingSystem extends EventEmitter {
  constructor() {
    super();
    this.votes = { A: 0, B: 0, C: 0 };
  }

  // Cast vote
  castVote(candidate, callback) {
    if (this.votes.hasOwnProperty(candidate)) {
      this.votes[candidate]++;

      // Call event
      this.emit("vote_casted", candidate);

      // Call callback after saving vote
      this.saveVotes((err) => {
        if (err) callback(err);
        else callback(null, `Vote recorded for ${candidate}`);
      });
    } else {
      this.emit("invalid_vote", candidate);
      callback(`Invalid candidate: ${candidate}`);
    }
  }

  // Save votes to file (callback)
  saveVotes(callback) {
    fs.writeFile("votes.json", JSON.stringify(this.votes, null, 2), (err) => {
      callback(err);
    });
  }

  // End voting
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
  console.log("\n📊 Voting Results:");
  console.log(votes);

  let winner = Object.keys(votes).reduce((a, b) =>
    votes[a] > votes[b] ? a : b
  );
  console.log(`🏆 Winner is: ${winner}`);
});

// ---- Simulation ----
voting.castVote("A", (err, msg) => {
  if (err) console.log("Error:", err);
  else console.log(msg);

  voting.castVote("B", (err, msg) => {
    if (err) console.log("Error:", err);
    else console.log(msg);

    voting.castVote("A", (err, msg) => {
      if (err) console.log("Error:", err);
      else console.log(msg);

      voting.castVote("X", (err, msg) => { // invalid
        if (err) console.log("Error:", err);

        voting.endVoting();
      });
    });
  });
});
