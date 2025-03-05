document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("taskList");
  const createTaskForm = document.getElementById("createTaskForm");

  const createButton = document.createElement("button");
  createButton.textContent = "Create Task";
  createButton.classList.add("saveButton");
  createButton.style.display = "flex";
  createButton.onclick = () => showCreateTask();

  const closeCreateButton = document.getElementById("closeCreate");
  closeCreateButton.onclick = () => closeCreate();

  const teste = document.getElementById("barraTask");
  teste.appendChild(createButton);

  const switchTheme = document.getElementById("switch-theme");
  const themeImage = document.getElementById("darkmode");
  const createBackground = document.getElementById("createTaskForm");
  
  switchTheme.addEventListener("click", () => {
    isLightTheme = !isLightTheme;

    if (isLightTheme) {
      themeImage.src =
        "https://img.icons8.com/?size=100&id=59841&format=png&color=000000";
      document.body.style.background = "#f4f4f4";
      document.body.style.color = "#000";
      createBackground.style.background = "#c5c2c2";
    } else {
      themeImage.src =
        "https://img.icons8.com/?size=100&id=3ijPBE1Xop4I&format=png&color=000000";
      document.body.style.background = "#121212";
      document.body.style.color = "#83177e";
      createBackground.style.background = "#282828";
    }

    updateTaskBackgrounds();
  });

  let isLightTheme =
    window.getComputedStyle(document.body).backgroundColor ===
    "rgb(244, 244, 244)";

  function updateTaskBackgrounds() {
    const taskBackgrounds = document.querySelectorAll("li");
    taskBackgrounds.forEach((taskBackground) => {
      taskBackground.style.background = isLightTheme ? "#c5c2c2" : "#282828";
    });
  }

  function getToken() {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    return token;
  }

  function fetchTasks() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID is not defined.");
        alert("User ID is not defined. Please log in.");
        window.location.href = "index.html";
        return;
    }
    fetch(`http://localhost:8080/task/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then((response) => {
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then((tasks) => {
        taskList.innerHTML = "";

        const helloUser = document.getElementById("username");
        const userName = localStorage.getItem("userName");
        helloUser.innerHTML = `Greetings ${userName}`;

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.taskCompleted).length;

        taskSummary.innerHTML = `Total Tasks: ${totalTasks} | Completed Tasks: ${completedTasks}`;

        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.classList.add("li");

            // Atualiza o fundo do li de acordo com o tema atual
            li.style.background = isLightTheme ? "#c5c2c2" : "#282828";

            const taskHeader = document.createElement("div");
            taskHeader.classList.add("task-header");

            const taskCreateDate = document.createElement("div");
            taskCreateDate.classList.add("task-create-date");
            taskCreateDate.textContent = "Created at " + task.taskCreateDate;
            taskList.appendChild(taskCreateDate);

            const checkCompleted = document.createElement("input");
            checkCompleted.type = "checkbox";
            checkCompleted.checked = task.taskCompleted;
            checkCompleted.classList.add("isCompletedCheckBox");
            taskList.appendChild(checkCompleted);

            const taskTitle = document.createElement("span");
            taskTitle.classList.add("task-title");
            taskTitle.textContent = task.taskTitle;
            taskHeader.appendChild(taskTitle);

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("editButton");
            taskHeader.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("deleteButton");
            deleteButton.onclick = () => deleteTask(task.taskId);
            taskHeader.appendChild(deleteButton);

            li.appendChild(taskHeader);

            const taskDescription = document.createElement("div");
            taskDescription.classList.add("task-description");
            taskDescription.textContent = task.taskDescription;
            li.appendChild(taskDescription);

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.classList.add("saveButton");
            saveButton.style.display = "none";

            li.appendChild(saveButton);

            let taskCompletedCheckbox;

            editButton.onclick = () => {
                taskCompletedCheckbox = document.createElement("input");
                taskCompletedCheckbox.type = "checkbox";
                taskCompletedCheckbox.checked = checkCompleted.checked;
                taskCompletedCheckbox.classList.add("taskCompletedCheckbox");

                if (saveButton.style.display === "none") {
                    taskTitle.contentEditable = true;
                    taskDescription.contentEditable = true;
                    taskTitle.style.border = "1px solid #333";
                    taskTitle.style.borderRadius = "10px";
                    taskDescription.style.border = "1px solid #333";
                    taskDescription.style.borderRadius = "10px";
                    saveButton.style.display = "block";
                    editButton.textContent = "Cancel";
                    taskHeader.appendChild(taskCompletedCheckbox);
                } else {
                    taskTitle.contentEditable = false;
                    taskDescription.contentEditable = false;
                    taskTitle.style.border = "none";
                    taskDescription.style.border = "none";
                    saveButton.style.display = "none";
                    editButton.textContent = "Edit";
                    taskHeader.removeChild(taskCompletedCheckbox);
                }
            };

            saveButton.onclick = () =>
                updateTask(
                    task.taskId,
                    taskTitle,
                    taskDescription,
                    taskCompletedCheckbox
                );

            if (checkCompleted.checked) {
                checkCompleted.classList.add("completed");  
                taskTitle.style.textDecoration = "line-through";
                taskTitle.style.textDecorationColor = "black";

                const setCompleted = document.createElement("input");
                setCompleted.type = "checkbox";
                setCompleted.checked = task.taskCompleted;
                setCompleted.classList.add("isCompletedCheckBox");
                if (task.taskCompleted && task.taskConclusionDate) {
                    setCompleted.classList.add("completeAt");
                    setCompleted.setAttribute("data-conclusion-date", task.taskConclusionDate);
                }
                li.appendChild(setCompleted);
            }

            taskList.appendChild(li);
        });
    });
  }

  createTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    console.log(
      "Creating task with title:",
      title,
      "and description:",
      description
    );
    const requestBody = JSON.stringify({ title, description });
    console.log("Request Body:", requestBody);

    fetch("http://localhost:8080/task/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          fetchTasks();
          alert("Task '" + title + "' has been created!");
          updateTaskBackgrounds();
        } else {
          console.error(
            "Error creating task:",
            response.status,
            response.statusText
          );
          alert("Error creating task");
        }
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        alert("Error creating task");
      });
  });

  function closeCreate() {
    if (createTaskForm.style.display === "block") {
      createTaskForm.style.display = "none";
    }
  }

  function showCreateTask() {
    createForm = document.getElementById("createTaskForm");
    createTaskForm.style.display =
      createTaskForm.style.display === "none" ? "block" : "none";
  }

  function deleteTask(taskId) {
    fetch(`http://localhost:8080/task/delete/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then((response) => {
      if (response.ok) {
        fetchTasks();
        alert("Task deleted!");
      } else {
        alert("Error deleting task");
      }
    });
  }

  function updateTask(
    taskId,
    taskTitle,
    taskDescription,
    taskCompletedCheckbox
  ) {
    const updatedTask = {
      taskTitle: taskTitle.textContent,
      taskDescription: taskDescription.textContent,
      taskCompleted: taskCompletedCheckbox.checked,
    };

    fetch(`http://localhost:8080/task/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedTask),
    }).then((response) => {
      if (response.ok) {
        fetchTasks();
        alert("Task '" + taskTitle.textContent + "' has been updated!");
        updateTaskBackgrounds();
      } else {
        alert("Error updating task");
      }
    });
  }

  const taskSummary = document.createElement("p");
  document.getElementById("totalTask").appendChild(taskSummary);

  fetchTasks();
});
