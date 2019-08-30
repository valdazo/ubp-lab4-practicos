let express = require('express');
let app = express();
let bodyParser = require ('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'applicationlication/json' }));

require("./routes/app.routes")(app);

app.listen(8080, ()=> console.log("app running on port 8080"));