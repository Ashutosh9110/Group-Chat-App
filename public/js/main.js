const loginSection = document.getElementById("loginSection")
const signupSection = document.getElementById("signupSection")



    document.getElementById('signupForm').addEventListener('submit', async (e) => {

      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;

      const userData = { name, email, phone, password };

      try {
        const res = await fetch("http://localhost:3000/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        });

        const data = await res.json();
        if (res.ok) {
          alert("Signup successful!");
          // Redirect or reset form
          document.getElementById("signupForm").reset();
        } else {
          alert(data.msg);
        }

      } catch (error) {
        console.error("Signup error:", error);
        alert("Something went wrong.");
      }
    });


    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("loginEmail").value
      const password =  document.getElementById("loginPassword").value

      try {
        const res = await fetch("http://localhost:3000/users/signin", {
          method: "POST",
          headers: { "Content-Type" : "application/json"},
          body : JSON.stringify({ email, password })
        })
          const data = await res.json()
          alert(data.msg)
          if(res.ok){
            localStorage.setItem("token", data.token)
            document.getElementById("loginForm").reset()
            document.getElementById("authSection").classList.add("hidden")
            document.getElementById("chatSection").classList.remove("hidden")
            loadMessages()
          }
      } catch (error) {
        alert("Login error: " + error.msg)
      }

    })

  
    
  document.getElementById("switchToLogin").onclick = () => {
    loginSection.classList.remove("hidden")
    signupSection.classList.add("hidden")
  }


  document.getElementById("switchToSignup").onclick = () => {
    loginSection.classList.add("hidden")
    signupSection.classList.remove("hidden")
  }




// Chat Section


document.querySelector(".messageSendButton").addEventListener("click", async () => {
  const message = document.querySelector(".sendMessageInputBox").value;

  try {
    const res = await fetch("http://localhost:3000/chats/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (res.ok) {
      const msgDiv = document.createElement("div");
      msgDiv.innerText = `${data.sender.name}: ${data.message}`
      document.getElementById("chatMessages").appendChild(msgDiv);
      document.querySelector(".sendMessageInputBox").value = "";
    } else {
      alert(data.msg || "Failed to send message");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending message");
  }
});



async function loadMessages() {
  try {
    const res = await fetch("http://localhost:3000/chats/all", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("token"),
      }
    });

    const messages = await res.json();

    const chatMessagesDiv = document.getElementById("chatMessages");
    chatMessagesDiv.innerHTML = "" // clear existing

    messages.forEach((msg) => {
      const msgDiv = document.createElement("div");
      msgDiv.innerText = `${msg.sender.name}: ${msg.message}`;
      chatMessagesDiv.appendChild(msgDiv);
    });

  } catch (error) {
    console.error("Error loading messages", error);
  }
}
