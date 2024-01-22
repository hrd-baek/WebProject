const app = require("../server");
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`서버가 시작되었습니다. ${PORT}`);
});

