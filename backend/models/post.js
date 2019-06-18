const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  text: { type: String, required: true },
  imagePath: { type: String, required: true },
  comments: { type: Array, required: false },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  creatorNickname: {
    type: String,
    required: true
  },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("Post", postSchema);
