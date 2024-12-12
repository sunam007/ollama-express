### A Backend app for chatting locally with LLM models using ollama and express.js

## Requirements

- Ollama installed  on your system ([download ollama](https://ollama.com/))
- minimum Node v14.x

## Steps

### Start Ollama

- check ollama installation `ollama -v`
- pull a LLM model `ollama pull <model_name>`
- view available models on ollama `ollama list`

### Run Express.js Server
- define PORT and MODEL on the .env file
- install all the dependencies `npm install`
- `npm run dev` starts your express.js server at http://localhost:5555 if PORT is not specified in the `.env` file

### API endpoint
`POST  http://localhost:5555/api/chat` </br>

Request Body:
`{
  "message": "Why the sky is blue?"
}`
