import { createApp } from "./app";
import { selectModel } from "./selectModel";

const port = 3001;
const app = createApp(selectModel(process.env));

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
