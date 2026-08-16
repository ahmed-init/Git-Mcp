

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

    message.querySelector(".message-content").textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


async function sendMessage() {

    const question = messageInput.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");

    messageInput.value = "";

    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";

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


        addMessage(
            result.data.answer,
            "assistant"
        );


    } catch (error) {

        console.error(error);

        addMessage(
            "Sorry, I couldn't process your question.",
            "assistant"
        );

    } finally {

        sendButton.disabled = false;
        sendButton.textContent = "Send";

        messageInput.focus();
    }
}


sendButton.addEventListener("click", sendMessage);


messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
});