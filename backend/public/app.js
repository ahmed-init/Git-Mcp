const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");


function addMessage(text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.innerHTML = `
        <div class="message-label">
            ${type === "user" ? "You" : "AI Assistant"}
        </div>

        <div class="message-content"></div>
    `;

    const content = message.querySelector(".message-content");

    if (type === "assistant" && typeof marked !== "undefined") {

        content.innerHTML = marked.parse(text);

    } else {

        content.textContent = text;

    }

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}


function addLoadingMessage() {

    const message = document.createElement("div");

    message.className = "message assistant loading-message";

    message.innerHTML = `
        <div class="message-label">
            AI Assistant
        </div>

        <div class="message-content">
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}


async function sendMessage() {

    const question = messageInput.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");

    messageInput.value = "";

    sendButton.disabled = true;
    messageInput.disabled = true;

    sendButton.textContent = "Thinking...";

    const loadingMessage = addLoadingMessage();

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })

        });


        const result = await response.json();


        if (!result.success) {

            throw new Error(
                result.error?.message || "Something went wrong"
            );

        }


        loadingMessage.remove();

        addMessage(
            result.data.answer,
            "assistant"
        );


    } catch (error) {

        console.error("Chat error:", error);

        loadingMessage.remove();

        addMessage(
            `### Something went wrong

${error.message}

Please try again.`,
            "assistant"
        );

    } finally {

        sendButton.disabled = false;
        messageInput.disabled = false;

        sendButton.textContent = "Send";

        messageInput.focus();

    }
}


sendButton.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);