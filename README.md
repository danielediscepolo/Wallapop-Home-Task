# Wallapop-Home-Task

## Current limitations

- Price ranges are estimates based on the model's general knowledge. The
  application does not query live Wallapop listings or comparable-sales data.
- Groq's `openai/gpt-oss-20b` can vary between identical requests even with a
  lower temperature and fixed seed.
- Output language can occasionally drift or mix for short or language-neutral
  descriptions.
- Title and tag quality is guided by the prompt, not guaranteed by deterministic
  category rules. Tags can still be generic, redundant, or less useful than
  intended.
- The application currently has no category-specific fields, persistence,
  result history, or explicit edit and regeneration controls.

Generated suggestions should be reviewed by the seller before publishing.
