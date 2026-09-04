import { createApp } from "./app";
import { validMockModel } from "./mockModel";

const port = 3001;
const app = createApp(validMockModel);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
