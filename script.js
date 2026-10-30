(() => {
  "use strict";

  const TASKS_KEY = "taskly.tasks.v1";
  const THEME_KEY = "taskly.theme";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("count");
  const clearBtn = document.getElementById("clear-completed");
  const themeToggle = document.getElementById("theme-toggle");
  const filterButtons = document.querySelectorAll(".filter");

  let tasks = loadTasks();
  let currentFilter = "all";

  // ---------- Storage ----------
  function loadTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch {
      // Storage may be unavailable (private mode); the app still works in memory.
    }
  }

  // ---------- Actions ----------
  function addTask(text) {
    tasks.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text,
      done: false,
    });
    update();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) task.done = !task.done;
    update();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    update();
  }

  function editTask(id, text) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const trimmed = text.trim();
    if (trimmed) {
      task.text = trimmed;
    } else {
      tasks = tasks.filter((t) => t.id !== id);
    }
    update();
  }

  function clearCompleted() {
    tasks = tasks.filter((t) => !t.done);
    update();
  }

  // ---------- Rendering ----------
  function visibleTasks() {
    if (currentFilter === "active") return tasks.filter((t) => !t.done);
    if (currentFilter === "completed") return tasks.filter((t) => t.done);
    return tasks;
  }

  function render() {
    list.textContent = "";
    const items = visibleTasks();

    items.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");
      li.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Mark task as done");
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;
      text.addEventListener("dblclick", () => startEditing(li, text, task));

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.type = "button";
      del.setAttribute("aria-label", "Delete task");
      del.innerHTML = "&times;";
      del.addEventListener("click", () => deleteTask(task.id));

      li.append(checkbox, text, del);
      list.appendChild(li);
    });

    emptyState.hidden = items.length !== 0;

    const remaining = tasks.filter((t) => !t.done).length;
    countEl.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
    clearBtn.disabled = !tasks.some((t) => t.done);
    clearBtn.style.opacity = clearBtn.disabled ? "0.5" : "1";
  }

  function startEditing(li, textEl, task) {
    const editor = document.createElement("input");
    editor.type = "text";
    editor.className = "edit-input";
    editor.value = task.text;
    editor.maxLength = 120;
    editor.setAttribute("aria-label", "Edit task");

    let finished = false;
    const finish = (save) => {
      if (finished) return;
      finished = true;
      if (save) editTask(task.id, editor.value);
      else render();
    };

    editor.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish(true);
      if (e.key === "Escape") finish(false);
    });
    editor.addEventListener("blur", () => finish(true));

    li.replaceChild(editor, textEl);
    editor.focus();
    editor.select();
  }

  function update() {
    saveTasks();
    render();
  }

  // ---------- Theme ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {
      // ignore
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
  }

  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  });

  // ---------- Events ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    addTask(value);
    input.value = "";
    input.focus();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });

  clearBtn.addEventListener("click", clearCompleted);

  // ---------- Init ----------
  initTheme();
  render();
})();
