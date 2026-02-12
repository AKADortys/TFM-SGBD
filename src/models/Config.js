const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    isStoreOpen: {
      type: Boolean,
      default: true, // Master switch
    },
    openingHours: {
      type: [
        {
          dayOfWeek: { type: Number, required: true },
          isOpen: { type: Boolean, default: true },
          morning: {
            start: { type: String, default: "09:00" },
            end: { type: String, default: "12:00" },
          },
          afternoon: {
            start: { type: String, default: "14:00" },
            end: { type: String, default: "18:00" },
          },
        },
      ],
      default: [],
    },
    plannedClosures: {
      type: [
        {
          start: { type: Date, required: true },
          end: { type: Date, required: true },
          reason: { type: String, default: "Fermeture exceptionnelle" },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Config", configSchema);
