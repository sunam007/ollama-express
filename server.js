import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import ollama from "ollama";
import axios from "axios";
import { generatePrompt } from "./helper.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5555;
const model = process.env.MODEL;

app.use(bodyParser.json());
app.use(cors());

app.post("/api/code/chat", async (req, res) => {
  try {
    const modelList = await ollama.list();
    const modelsNameArray = modelList?.models?.map((model) => model?.name);

    if (modelsNameArray?.length < 1) {
      return res.send("No Model Found! Pull a model from ollama & try again,");
    }

    const { message } = req.body;

    const instruction = generatePrompt(message);

    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: instruction }],
      stream: true,
      options: { temperature: 1 },
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream", // Set content type to text/event-stream
      "Cache-Control": "no-cache", // Disable caching
      Connection: "keep-alive", // Keep the connection open
    });

    // Send the original question first
    res.write(`You: ${message}\n\n`);

    for await (const part of response) {
      res.write(part.message.content);
    }

    res.end();
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.end();
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const modelList = await ollama.list();
    const modelsNameArray = modelList?.models?.map((model) => model?.name);

    if (modelsNameArray?.length < 1) {
      return res.send("No Model Found! Pull a model from ollama & try again,");
    }

    const { message } = req.body;

    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: message }],
      stream: true,
      options: { temperature: 1 },
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream", // Set content type to text/event-stream
      "Cache-Control": "no-cache", // Disable caching
      Connection: "keep-alive", // Keep the connection open
    });

    // Send the original question first
    res.write(`You: ${message}\n\n`);

    for await (const part of response) {
      res.write(part.message.content);
    }

    res.end();
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.end();
  }
});

app.post("/api/chat/tex2image", async (req, res) => {
  try {
    const response = await axios.post(process.env.SD_TXT2IMG_API, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error while calling Automatic1111 API:", error.message);

    res.status(error.response?.status || 500).json({
      error:
        error.response?.data || "An error occurred while generating the image.",
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
