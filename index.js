import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import translate from 'translate';

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));




async function translateText(text) {
  try {
    const response = await translate(text, { from: 'sv', to: 'en' });
    return response;
  } catch (error) {
    console.error('Translation error:', error);
    return text; 
  }
}

app.get("/iced", async (req, res) => {
  try {
    const result = await axios.get("https://api.sampleapis.com/coffee/iced");
    res.render("index.ejs", { coffee: result.data });
  } catch (error) {
    console.log(error.response.data);
    res.status(500);
  }
});


app.get("/", async (req, res) => {
  try {
    const result = await axios.get("https://coffee.alexflipnote.dev/random.json");
    res.render("index.ejs", {randomCoffee: result.data.file});
  } catch (error) {
    console.log(error.response.data);
    res.status(500);
  }
});

app.get("/hot", async (req, res) => {
  try {
    const result = await axios.get("https://api.sampleapis.com/coffee/hot");
    const translatedCoffee = await Promise.all(
      result.data.map(async (document) => {
        document.description = await translateText(document.description);
        return document;
      })
    );
    res.render("index.ejs", { coffee: translatedCoffee });
  } catch (error) {
    console.log(error.response.data);
    res.status(500);
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
