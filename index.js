import axios from "axios";
import express from "express";
import bodyParser from "body-parser"; 

const app = express();
const port = 3000;
const apiURL = "https://riskofrain2api.herokuapp.com/api";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {picture: "/images/empty.png", title: "Awaiting Response Data...", description: "[REDACTED]"}); // On home page rendering, these will be displayed to let the user know that the contents are empty.
});

app.get("/getRandom", async (req, res) => {
    try {
        const response = await axios.get(apiURL + "/everyItem");
        const result = response.data[Math.floor(Math.random() * response.data.length)]; // math floors a math random based on all the items to return a random amount.
        res.render("index.ejs", {title: result.itemName, picture: result.itemImage, description: result.description});
    } catch(error) {
        res.render("index.ejs", {title: error.message, picture: "/images/empty.png", description: "[REDACTED]"}) // Catches the error and lists this in the title so code does not break
    };
});

app.post("/searchItem", async (req, res) => {
    const toJoin = req.body.search.split(" ");
    for (let i=0; i < toJoin.length; i++) {
        toJoin[i] = toJoin[i][0].toUpperCase() + toJoin[i].substr(1); // toJoin is the array of req.body seperating everything to capitalise it and [i] will access the split words in this array
    };
    const filter = toJoin.join(" "); // This for loop executes every post and uses the req.body to capitalise everything so that anything users entered is correct.
    try {
        const response = await axios.get(apiURL + "/everyItem");
        const searchedItem = response.data.find(item => {
            return item.itemName === filter; 
        });
        res.render("index.ejs", {title: searchedItem.itemName, picture: searchedItem.itemImage, description: searchedItem.description} );
    } catch(error) {
        res.render("index.ejs", {title: error.message, picture: "/images/empty.png", description: "[REDACTED]"})
    }
});

app.listen(port, () => {
    console.log(`Welcome aboard captain! All systems online via port ${port}`);
});