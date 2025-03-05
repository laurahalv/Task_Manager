const LOGIN_URL = "http://localhost:8080/api/login"; 

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const userId = data.userId; 
      const userName = data.name; 
      localStorage.setItem('userName', userName);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', userId);
        
        alert("Login has been successful! You can see your tasks now!");
        window.location.href = "tasks.html";
      } else {
        alert("Login error: Token has not been found.");
      }
    } else {
      const errorData = await response.json();
      alert(`Login error: ${errorData.message || "Try again."}`);
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Error at try to connect to the server. Try again later.");
  }
});