const socket = io("http://localhost:3000");
let currentGroupId = null;


const loginSection = document.getElementById("loginSection")
const signupSection = document.getElementById("signupSection")




function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}


async function fetchGroups() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found. Skipping fetchGroups.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/groups/user", {
      headers: authHeader(),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Error fetching groups:", err);
      alert(err.msg || "Failed to fetch groups.");
      return;
    }

    const groups = await res.json();

    if (!Array.isArray(groups)) {
      console.error("Expected groups to be an array, got:", groups);
      return;
    }

    const groupList = document.getElementById("groupList");
    const groupSelectDropdown = document.getElementById("groupSelectDropdown");

    if (!groupList || !groupSelectDropdown) {
      console.error("Group list or dropdown not found in DOM");
      return;
    }

    groupList.innerHTML = "";
    groupSelectDropdown.innerHTML = "<option value=''>Select Group</option>";

    groups.forEach((g) => {
      const li = document.createElement("li");
      li.textContent = g.name;
      li.onclick = () => selectGroup(g.id);
      groupList.appendChild(li);

      const option = document.createElement("option");
      option.value = g.id;
      option.textContent = g.name;
      groupSelectDropdown.appendChild(option);
    });

  } catch (err) {
    console.error("Unexpected error in fetchGroups:", err);
    alert("Something went wrong while fetching groups.");
  }
}

async function selectGroup(groupId) {
  const messageContainer = document.getElementById("messages");
  const res = await fetch(`http://localhost:3000/group-messages/${groupId}`, {
    headers: authHeader(),
  });
  const messages = await res.json();
  messageContainer.innerHTML = "";
  messages.forEach((m) => {
    const div = document.createElement("div");
    div.textContent = `${m.sender.name}: ${m.message}`;
    messageContainer.appendChild(div);
  });
}

let selectedGroupId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const groupSelectDropdown = document.getElementById("groupSelectDropdown");
  const groupList = document.getElementById("groupList");
  const messageContainer = document.getElementById("messages");
  const messageForm = document.getElementById("messageForm");
  const messageInput = document.getElementById("messageInput");

  async function selectGroup(groupId) {
    selectedGroupId = groupId;
    currentGroupId = groupId;
  
    // Join socket room
    socket.emit("joinGroup", groupId);
  
    // Fetch past messages
    const res = await fetch(`http://localhost:3000/group-messages/${groupId}`, {
      headers: authHeader(),
    });
  
    if (!res.ok) return alert("Failed to fetch messages");
  
    const messages = await res.json();
    const messageContainer = document.getElementById("messages");
    messageContainer.innerHTML = "";
  
    messages.forEach((m) => {
      renderMessage(m.message, m.sender.name, m.createdAt);
    });
  }
  

  async function fetchGroups() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. Skipping fetchGroups.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/groups/user", {
        headers: authHeader(),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error fetching groups:", err);
        alert(err.msg || "Failed to fetch groups.");
        return;
      }

      const groups = await res.json();

      if (!Array.isArray(groups)) {
        console.error("Expected groups to be an array, got:", groups);
        return;
      }

      groupList.innerHTML = "";
      groupSelectDropdown.innerHTML = "<option value=''>Select Group</option>";

      groups.forEach((g) => {
        const li = document.createElement("li");
        li.textContent = g.name;
        li.onclick = () => selectGroup(g.id); // ✅ now uses correct scoped selectGroup
        groupList.appendChild(li);

        const option = document.createElement("option");
        option.value = g.id;
        option.textContent = g.name;
        groupSelectDropdown.appendChild(option);
      });

    } catch (err) {
      console.error("Unexpected error in fetchGroups:", err);
      alert("Something went wrong while fetching groups.");
    }
  }

  messageForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) return alert("Select a group first");
  
    const message = messageInput.value.trim();
    if (!message) return;
  
    const res = await fetch("http://localhost:3000/group-messages", {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: selectedGroupId, message }),
    });
  
    if (!res.ok) {
      alert("Failed to send message");
      return;
    }
  
    const newMsg = await res.json();
  
    // Emit message to socket room
    // socket.emit("sendMessage", {
    //   groupId: selectedGroupId,
    //   message: newMsg.message,
    //   sender: newMsg.sender.name,
    //   timestamp: newMsg.createdAt,
    // });
  
    messageInput.value = "";
  };
  

  await fetchGroups(); // ✅ now uses correct fetchGroups
});


socket.on("newMessage", ({ groupId, message, sender, timestamp }) => {
  if (groupId === currentGroupId) {
    renderMessage(message, sender, timestamp);
  }
});

function renderMessage(message, sender, timestamp) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${sender}: ${message}`;
  document.getElementById("messages").appendChild(msgDiv);
}

socket.on("newPersonalMessage", ({ message, sender, timestamp }) => {
  renderPersonalMessage(message, sender, timestamp);
});

function renderPersonalMessage(message, sender, timestamp) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${sender}: ${message}`;
  document.getElementById("chatMessages").appendChild(msgDiv);
}

const createGroupBtn = document.getElementById("createGroupBtn");
const addUserToGroupBtn = document.getElementById("addUserToGroupBtn");
const newGroupNameInput = document.getElementById("newGroupName");
const addUserEmailInput = document.getElementById("addUserEmail");

createGroupBtn.onclick = async () => {
  const name = newGroupNameInput.value.trim();
  if (!name) return alert("Group name required");

  try {
    const res = await fetch("http://localhost:3000/groups/create", {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Group created");
      newGroupNameInput.value = "";
      fetchGroups();
    } else {
      alert(data.msg || "Failed to create group");
    }
  } catch (err) {
    console.error("Create group error:", err);
    alert("Error creating group");
  }
};

addUserToGroupBtn.onclick = async () => {
  const email = addUserEmailInput.value.trim();
  const groupId = groupSelectDropdown.value;

  if (!email || !groupId) {
    return alert("Email and group required");
  }

  try {
    const res = await fetch("http://localhost:3000/groups/add-user", {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ email, groupId }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("User added to group");
      addUserEmailInput.value = "";
    } else {
      alert(data.msg || "Failed to add user");
    }
  } catch (err) {
    console.error("Add user error:", err);
    alert("Error adding user to group");
  }
};



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
          loginSection.classList.remove("hidden")
          signupSection.classList.add("hidden")
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
          if (res.ok){
            localStorage.setItem("token", data.token)

            const decoded = JSON.parse(atob(data.token.split('.')[1]));
            const currentUserId = decoded.userId;
            localStorage.setItem("currentUserId", currentUserId);

            document.getElementById("loginForm").reset()
            document.getElementById("authSection").classList.add("hidden")
            document.getElementById("chatSection").classList.remove("hidden")

            socket.emit("registerUser", data.userId);

            
            // loadMessages()
            setTimeout(() => {
              // fetchGroups();
            }, 100); // small delay to ensure token is set
        
          }
      } catch (error) {
        console.error("Login error:", error);
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
        ...authHeader()
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (res.ok) {
      // const msgDiv = document.createElement("div");
      // msgDiv.innerText = `${data.sender.name}: ${data.message}`
      // document.getElementById("chatMessages").appendChild(msgDiv);
      // document.querySelector(".sendMessageInputBox").value = "";

      socket.emit("sendPersonalMessage", {
        recipientId: data.receiverId, // make sure backend returns this
        message: data.message,
        sender: data.sender.name,
      });
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
      headers: authHeader()
    });

    const messages = await res.json();
      if (!Array.isArray(messages)) {
        console.error("Unexpected messages format:", messages);
        return;
      }
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



window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("chatSection").classList.remove("hidden");
    loadMessages()
    // fetchGroups()
  }
});



// setInterval(() => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     if (selectedGroupId) {
//       selectGroup(selectedGroupId)
//     } else {
//       loadMessages()
//     }
//   }
// }, 3000);




function saveMessagesToLocalStorage(messages) {
  localStorage.setItem("messages", JSON.stringify(messages));
}

function getMessagesFromLocalStorage() {
  const data = localStorage.getItem("messages");
  return data ? JSON.parse(data) : [];
}



document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("messages");
      localStorage.removeItem("currentUserId")
      location.reload();
    });
  } else {
    console.error("Logout button not found");
  }
});


document.getElementById("promoteUserBtn").onclick = async () => {
  const email = document.getElementById("promoteEmail").value.trim();
  const groupId = groupSelectDropdown.value;

  const res = await fetch("http://localhost:3000/groups/promote-user", {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ email, groupId }),
  });

  const data = await res.json();
  alert(data.msg);
};


document.getElementById("removeUserBtn").onclick = async () => {
  const email = document.getElementById("removeEmail").value.trim();
  const groupId = groupSelectDropdown.value;

  const res = await fetch("http://localhost:3000/groups/remove-user", {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ email, groupId }),
  });

  const data = await res.json();
  alert(data.msg);
};



socket.on("disconnect", () => {
  console.warn("Disconnected from server");
});

socket.on("connect", () => {
  if (currentGroupId) {
    socket.emit("joinGroup", currentGroupId);
    
  }
});


window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("chatSection").classList.remove("hidden");

    // Only load personal messages if no group selected
    if (!selectedGroupId) loadMessages();
  }
});




async function sendFile() {
  const currentUserId = localStorage.getItem("currentUserId");
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('receiverId', currentUserId); // or formData.append('groupId', currentGroupId);

  const response = await fetch('http://localhost:3000/messages/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: formData
  });

  const data = await response.json();
  if (data.success) {
    console.log('File sent:', data.message);
  }
}


// if (msg.isFile) {
//   if (msg.message.endsWith('.jpg') || msg.message.endsWith('.png')) {
//     msgDisplay.innerHTML = `<img src="${msg.message}" style="max-width:200px" />`;
//   } else {
//     msgDisplay.innerHTML = `<a href="${msg.message}" target="_blank">Download File</a>`;
//   }
// }
