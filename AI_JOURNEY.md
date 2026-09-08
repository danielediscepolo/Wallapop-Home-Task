# AI Journey

I used ChatGPT mainly as a thinking partner before writing code. Three prompts were particularly important in shaping the project.

The **first prompt** established the overall working approach: start from the best possible seller experience and work backwards, while keeping simplicity, maintainability, and ease of future change as constraints. I then transferred this context to Codex, where it became the foundation for the development process.

The **second prompt** focused on functionality. We brainstormed possible behaviours and features, compared the value they would actually provide to the seller, and separated the essential ones from useful but lower-priority ideas. During this discussion, we also realised that seller input could be more nuanced than initially expected, which led us to slightly adjust the functional approach before implementation.

The **third prompt** focused on architecture. Once the user experience and functionality were clear, we discussed the minimum technical structure, technology choices, and AI integration needed to support them without overcomplicating the solution, eventually choosing Groq over the other model options considered.

AI made mistakes at different levels. At the product level, it initially oversimplified some seller inputs. At the design level, it proposed an unnecessarily complex architecture for handling Groq responses. At the implementation level, a real model response omitted the expected `currency` field, which we identified through manual verification. In each case, I reviewed the suggestion and adjusted the approach before moving forward.

One area I do not fully understand is the Groq integration as a whole. I understand how our application communicates with the model and how we consume and validate its response, but I am less confident about the lower-level SDK and provider-specific behaviour.

With another four hours, I would mainly refine and evaluate the prompts to improve the consistency of prices, tags, and incomplete-input handling, together with a few UI refinements rather than adding more features.

**P.S.** A more detailed record of these decisions, discussions, and AI interactions is available in my development log, [`AI_JOURNEY_NOTES.md`](AI_resources/AI_JOURNEY_NOTES.md), which I maintained throughout the project.
