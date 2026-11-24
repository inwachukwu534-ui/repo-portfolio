// Shared navigation, page details, planner, and contact form interactions.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      }
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".primary-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const todayDisplay = document.querySelector("[data-today]");
  if (todayDisplay) {
    todayDisplay.textContent = new Intl.DateTimeFormat("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "short"
    }).format(new Date());
  }

  initializePlanner();
  initializeContactForm();
});

const plannerStorageKey = "divinePortfolioTasks";

function initializePlanner() {
  const form = document.querySelector("#task-form");
  const taskList = document.querySelector("#task-list");
  if (!form || !taskList) return;

  const titleInput = document.querySelector("#task-title");
  const deadlineInput = document.querySelector("#task-deadline");
  const priorityInput = document.querySelector("#task-priority");
  const filterInput = document.querySelector("#task-filter");
  const emptyState = document.querySelector("#empty-tasks");
  const status = document.querySelector("#planner-status");
  const titleError = document.querySelector("#task-title-error");
  let tasks = loadTasks(status);

  function saveTasks() {
    try {
      localStorage.setItem(plannerStorageKey, JSON.stringify(tasks));
      return true;
    } catch (error) {
      status.textContent = "Could not save tasks in this browser. Check storage settings.";
      return false;
    }
  }

  function renderTasks() {
    const filter = filterInput.value;
    const visibleTasks = tasks.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
    taskList.replaceChildren();

    visibleTasks.forEach((task) => {
      const item = document.createElement("article");
      item.className = `task-item${task.completed ? " is-complete" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.className = "task-check";
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`);
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        const saved = saveTasks();
        renderTasks();
        if (!saved) status.textContent = "Could not save this update. Check browser storage settings.";
      });

      const details = document.createElement("div");
      const heading = document.createElement("h3");
      heading.textContent = task.title;
      details.append(heading);

      const meta = document.createElement("div");
      meta.className = "task-meta";
      if (task.deadline) {
        const deadline = document.createElement("span");
        const parsedDate = new Date(`${task.deadline}T00:00:00`);
        deadline.textContent = `Due ${new Intl.DateTimeFormat("en-NG", {
          day: "numeric", month: "short", year: "numeric"
        }).format(parsedDate)}`;
        meta.append(deadline);
      }
      const priority = document.createElement("span");
      const priorityNames = { high: "High priority", normal: "Normal priority", low: "Low priority" };
      priority.className = `priority-badge priority-${task.priority}`;
      priority.textContent = priorityNames[task.priority] || priorityNames.normal;
      meta.append(priority);
      details.append(meta);

      const deleteButton = document.createElement("button");
      deleteButton.className = "task-delete";
      deleteButton.type = "button";
      deleteButton.textContent = "\u00d7";
      deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
      deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((entry) => entry.id !== task.id);
        const saved = saveTasks();
        renderTasks();
        if (saved) status.textContent = `Deleted task: ${task.title}`;
        else status.textContent = "Task removed for this session, but could not be saved. Check browser storage settings.";
      });

      item.append(checkbox, details, deleteButton);
      taskList.append(item);
    });

    emptyState.hidden = visibleTasks.length > 0;
    const completedCount = tasks.filter((task) => task.completed).length;
    const countLabel = document.querySelector("[data-progress-count]");
    const progressBar = document.querySelector("[data-progress-bar]");
    if (countLabel) countLabel.textContent = `${completedCount} / ${tasks.length}`;
    if (progressBar) progressBar.style.width = `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    titleError.textContent = "";
    titleInput.removeAttribute("aria-invalid");

    if (!title) {
      titleError.textContent = "Enter a task before adding it.";
      titleInput.setAttribute("aria-invalid", "true");
      titleInput.focus();
      return;
    }

    tasks.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      deadline: deadlineInput.value,
      priority: priorityInput.value,
      completed: false
    });
    const saved = saveTasks();
    form.reset();
    filterInput.value = "all";
    renderTasks();
    if (saved) status.textContent = `Added task: ${title}`;
    titleInput.focus();
  });

  filterInput.addEventListener("change", renderTasks);
  renderTasks();
}

function loadTasks(status) {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(plannerStorageKey) || "[]");
    if (!Array.isArray(savedTasks)) {
      status.textContent = "Saved planner data is invalid and could not be loaded.";
      return [];
    }
    return savedTasks.filter((task) =>
      task && typeof task.id === "string" && typeof task.title === "string" &&
      typeof task.completed === "boolean"
    );
  } catch (error) {
    status.textContent = "Could not read saved planner tasks. Check browser storage settings.";
    return [];
  }
}

function initializeContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const fields = {
    name: document.querySelector("#contact-name"),
    email: document.querySelector("#contact-email"),
    phone: document.querySelector("#contact-phone"),
    message: document.querySelector("#contact-message")
  };
  const status = document.querySelector("#contact-status");
  const errorIds = { name: "name-error", email: "email-error", phone: "phone-error", message: "message-error" };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalidField = null;
    const values = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      message: fields.message.value.trim()
    };
    const errors = {
      name: values.name ? "" : "Please enter your name.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? "" : "Enter a valid email address.",
      phone: values.phone && !/^[+()\d\s.-]{7,20}$/.test(values.phone) ? "Enter a valid phone number or leave this optional field blank." : "",
      message: values.message ? "" : "Please add a message."
    };

    Object.keys(fields).forEach((key) => {
      const errorElement = document.getElementById(errorIds[key]);
      errorElement.textContent = errors[key];
      if (errors[key]) {
        fields[key].setAttribute("aria-invalid", "true");
        if (!firstInvalidField) firstInvalidField = fields[key];
      } else {
        fields[key].removeAttribute("aria-invalid");
      }
    });

    if (firstInvalidField) {
      status.textContent = "Please correct the highlighted fields and try again.";
      status.classList.add("error");
      firstInvalidField.focus();
      return;
    }

    status.classList.remove("error");
    status.textContent = "Your details look good. This demo does not send messages; please add a contact method before publishing.";
    form.reset();
  });
}
