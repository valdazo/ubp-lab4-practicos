let Express = require("express");
let app = Express();
let bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ type: 'applicationlication/json' }));

require("./routes/app.routes")(app);

app.listen(5555, () => console.log("API started on port 5555"));