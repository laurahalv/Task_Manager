const REGISTER_URL = "http://localhost:8080/api/register"; 

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        // Faz a requisição POST para a API de registro
        const response = await fetch(REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Registro realizado com sucesso! Faça login para continuar.");
            window.location.href = "login.html"; 
        } else {
            const errorData = await response.json();
            alert(`Erro ao registrar: ${errorData.message || "Tente novamente."}`);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    }
});