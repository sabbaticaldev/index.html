import express from "express";

import {fetchGroup,importGroups,importTags} from "./controllers.js";

async function main() {
  const app = express();
  const port = 3000;
  const importDelay = 5000;
  const maxGroups = 10; 

  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


  app.get("/import-tags", async (req, res) => {
    try {
      const tags = await importTags();
      res.status(200).send(tags);
    } catch (error) {
      res.status(500).send({ error: "Error importing tags" });
    }
  });
  app.get("/import-groups", async (req, res) => {
    try {
      await importGroups(importDelay, maxGroups);
      res.status(200).send({ message: "Import started successfully" });
    } catch (error) {
      console.error("Error importing groups:", error);
      res.status(500).send({ error: "Error importing groups" });
    }
  });

  app.get("/fetch-group", async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    if (!url) {
      return res.status(400).send({ error: "URL is required" });
    }
  
    try {
      const response = await fetchGroup(url); 
      res.send(response);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send({ error: "Error processing request" });
    }
  });
  

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main().catch(err => console.error(err));
