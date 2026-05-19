const app = require("./app");
const env = require("./config/env");

app.listen(env.port, () => {
  console.log(`GameNest backend listening on port ${env.port}`);
});
