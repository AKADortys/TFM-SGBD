const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    isStoreOpen: {
      type: Boolean,
      default: true,
    },
    closingSchedule: {
        start: { type: Date, default: null },
        end: { type: Date, default: null },
    },
    reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Config", configSchema);
