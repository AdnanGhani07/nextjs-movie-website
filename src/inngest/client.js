import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "CinePulse",
  name: "CinePulse",
  credentials: {
    gemini: process.env.GEMINI_API_KEY,
  },
});
