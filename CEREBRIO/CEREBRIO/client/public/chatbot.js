// Select DOM elements
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

// Function to send the user message to the backend
async function sendMessage() {
  const content = chatInput.value.trim();
  if (!content) return;

  // Display user message in the chat
  addMessageToChat(`You: ${content}`, true);
  chatInput.value = ""; // Clear input

  // Define the three variations to request
  const variations = [
    "Rewrite this message in a **formal** tone:",
    "Rewrite this message in a **casual** tone:",
    "Rewrite this message in a **concise** manner:"
  ];

  // Loop through each variation and hit the API sequentially
  for (let i = 0; i < variations.length; i++) {
    const prompt = `${variations[i]}\n\nOriginal Message: "${content}"`;

    try {
      // Display a loading message for each variation
      const loadingMessage = addMessageToChat("Bot: Thinking...", false);

      // API call to /api/chat
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: prompt })
      });
      const data = await response.json();

      // Remove the loading message and display the bot's response
      chatMessages.removeChild(loadingMessage);
      addMessageToChat(`Bot: ${data.message || "No response from server."}`, false);
    } catch (error) {
      console.error("Error:", error);
      addMessageToChat("Bot: Error: Unable to get a response from the server.", false);
    }
  }
}

// Function to add messages to the chat in separate boxes
function addMessageToChat(content, isUser = false) {
  const messageContainer = document.createElement("div");
  messageContainer.className = `message ${isUser ? "user-message" : "bot-message"}`;

  const messageElement = document.createElement("div");
  messageElement.innerHTML = content;

  if (!isUser) {
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = "📝";
    copyButton.addEventListener("click", () => copyTextToClipboard(content, copyButton));
    messageContainer.appendChild(copyButton);
  }

  messageContainer.appendChild(messageElement);
  chatMessages.appendChild(messageContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom

  return messageContainer; // Return the message container for potential removal
}

// Function to copy text to clipboard and show "Copied" feedback
function copyTextToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text.replace("Bot: ", ""); // Remove "Bot: " prefix when copying
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      const originalContent = button.textContent;
      button.textContent = "✔️";
      button.style.color = "green";
      setTimeout(() => {
        button.textContent = originalContent;
        button.style.color = "";
      }, 1000);
    } else {
      console.error("Failed to copy text");
    }
  } catch (err) {
    console.error("Fallback: Failed to copy text", err);
  }
  document.body.removeChild(textArea);
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});