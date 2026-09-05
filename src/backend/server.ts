import { createApp } from "./app";
import { selectMockModel } from "./mockModel";

const port = 3001;
const app = createApp(selectMockModel(process.env.MOCK_SCENARIO));

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
