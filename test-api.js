// Test script to verify Ceron Engine API key
// Run this with: node test-api.js

const fs = require("fs");

const testCeronAPI = async () => {
  const apiUrl =
    "https://cr-engine.jnowlan21.workers.dev/api/support-bot/query";
  const apiKey = "cr_test_1234567890abcdef";

  const payload = {
    bot_id: "2001",
    client_id: "1001",
    session_id: "test-session-123",
    user_message: "Hi, how long is shipping, What is the return policy?",
    page_url: "https://acme-test.com/help",
  };

  const log = [];
  const addLog = (msg) => {
    console.log(msg);
    log.push(msg);
  };

  addLog("Testing Ceron Engine API...");
  addLog("API Key: " + apiKey);
  addLog("Payload: " + JSON.stringify(payload, null, 2));
  addLog("\n---\n");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    addLog("Status: " + response.status + " " + response.statusText);
    addLog("\nResponse Headers:");
    response.headers.forEach((value, key) => {
      addLog(`  ${key}: ${value}`);
    });

    const data = await response.text();
    addLog("\nResponse Body:");

    try {
      const jsonData = JSON.parse(data);
      addLog(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      addLog(data);
    }

    if (!response.ok) {
      addLog("\n❌ API call failed!");
      addLog("\nPossible issues:");
      addLog("1. API key is invalid or not registered");
      addLog("2. API key not associated with this client_id");
      addLog("3. Bot ID might not exist");
      addLog("4. Rate limit exceeded");
    } else {
      addLog("\n✅ API call successful!");
    }
  } catch (error) {
    addLog("\n❌ Error: " + error.message);
  }

  // Save to file
  fs.writeFileSync("test-api-result.txt", log.join("\n"));
  addLog("\n--- Results saved to test-api-result.txt ---");
};

testCeronAPI();
