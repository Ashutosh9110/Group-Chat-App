const express = require("express")
const app = express()
const PORT = 3000


app.get("/", (req, res) => {
  console.log("Hello g");
  res.send("sffsf")
})

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
})