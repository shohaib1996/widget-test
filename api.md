# Ceron Engine API

Base URL (production):

- `https://cr-engine.jnowlan21.workers.dev`

All endpoints accept `POST` and `OPTIONS` only.

---

## Common Behavior

### CORS

All responses include:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, X-API-Key`

### Authentication & Rate Limiting

All endpoints require an API key:

- Header: `X-API-Key: <your-api-key>`

The API key is validated and rate‑limited per client using KV / Supabase. On failure, endpoints return an error JSON and appropriate HTTP status (401 or 429).

### Request Format

- `Content-Type: application/json`
- Request bodies must be valid JSON.

---

## 1. Translate Ceron → JSON

### Endpoint

`POST /v1/translate/ceron-to-json`

Translate a Ceron text document into a canonical JSON representation.

### Request

**Headers**

http
Content-Type: application/json
X-API-Key: <your-api-key>

**Body**

json
{
"ceron": "<ceron text here>"
}

- `ceron` (string, required): Ceron text to translate.

### Responses

#### 200 OK

json
{
"ok": true,
"data": {
/_ canonical JSON structure (CeronCanonical) _/
}
}

#### 400 Bad Request

Examples:

json
{
"ok": false,
"error": "Field ceron must be string"
}

or validation errors from the Ceron parser.

#### 401 Unauthorized / 429 Too Many Requests

json
{
"error": "<reason>"
}

---

## 2. Translate JSON → Ceron

### Endpoint

`POST /v1/translate/json-to-ceron`

Translate a canonical JSON representation back into Ceron text.

### Request

**Headers**

http
Content-Type: application/json
X-API-Key: <your-api-key>

**Body**

json
{
"json": {
/_ CeronCanonical-compatible JSON object _/
}
}

- `json` (object, required): JSON conforming to the Ceron canonical schema.

### Responses

#### 200 OK

json
{
"ok": true,
"ceron": "<ceron text here>"
}

#### 400 Bad Request

json
{
"ok": false,
"error": "Field json must be object"
}

or schema/validation errors.

#### 401 / 429

As above.

---

## 3. Validate Ceron

### Endpoint

`POST /v1/validate`

Validate a Ceron document without translating it.

### Request

**Headers**

http
Content-Type: application/json
X-API-Key: <your-api-key>

**Body**

json
{
"ceron": "<ceron text here>"
}

- `ceron` (string, required): Ceron text to validate.

### Responses

#### 200 OK (valid)

json
{
"ok": true,
"valid": true,
"errors": []
}

#### 400 Bad Request (invalid or bad input)

json
{
"ok": false,
"valid": false,
"errors": [
/* validation error messages */
]
}

or

json
{
"ok": false,
"error": "Field ceron must be string"
}

#### 401 / 429

As above.

---

## 4. Support Bot Query

### Endpoint

`POST /api/support-bot/query`

Domain‑agnostic support bot endpoint. It:

- Checks per‑client/session rate limits
- Validates API key
- Retrieves KB snippets from your vector store
- Builds a VJ (JVERNOT) structure with `@cipherandrowhq/vernot-core`
- Calls Mistral via the configured model
- Parses the LLM output back into a structured VJ
- Logs usage and messages to Supabase
- Caches successful responses

### Request

**Headers**

http
Content-Type: application/json
X-API-Key: <your-api-key>

**Body**

json
{
"bot_id": "support-bot-1",
"client_id": "1001",
"session_id": "sess-123",
"user_message": "How do I reset my password?",
"page_url": "https://app.example.com/settings"
}

#### Fields

- `bot_id` (string, required): Identifier of the bot configuration.
- `client_id` (string, required): Tenant / customer ID.
- `session_id` (string, required): Conversation/session identifier (used for rate limiting and logging).
- `user_message` (string, required): User's question.
- `page_url` (string, optional): Current page URL for contextual retrieval; can be `null`.

### Responses

#### 200 OK (fresh answer)

json
{
"ok": true,
"bot_answer": "Here's how you can reset your password: ...",
"confidence": 0.92,
"meta": {
"model": "mistral-...",
"latency_ms": 1234
}
}

#### 200 OK (cache hit)

json
{
"ok": true,
"bot_answer": "Cached answer ...",
"confidence": null,
"meta": {
"model": "mistral-...",
"latency_ms": 0
}
}

#### 400 Bad Request

- Invalid JSON
- Invalid payload structure

json
{
"ok": false,
"error": "invalid_request"
}

#### 401 Unauthorized

- API key missing/invalid for the given `client_id`:

json
{
"ok": false,
"error": "invalid_request"
}

#### 429 Too Many Requests

- Support‑specific rate limit exceeded:

json
{
"ok": false,
"error": "invalid_request"
}

#### 502 Bad Gateway – Invalid LLM Output

json
{
"ok": false,
"error": "invalid_llm_output"
}

#### 502 Bad Gateway – LLM / Internal Error

json
{
"ok": false,
"error": "llm_error"
}

---

## 5. OPTIONS / Preflight

Any of the above paths accept CORS preflight:

http
OPTIONS /v1/validate
OPTIONS /v1/translate/ceron-to-json
OPTIONS /v1/translate/json-to-ceron
OPTIONS /api/support-bot/query

**Response**

- Status: `204 No Content`
- Headers: as in the **CORS** section.
