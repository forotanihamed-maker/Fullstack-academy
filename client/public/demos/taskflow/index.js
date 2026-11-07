/* ============================================================
   TaskFlow — index.js
   ============================================================ */

// ---------- Constants ----------
const STORAGE_KEY = "tasks";
const STATUSES = ["pending", "progress", "completed"];
const PRIORITIES = ["low", "medium", "high"];
const CATEGORIES = ["development", "design", "marketing", "personal"];

// ---------- State ----------
let tasks = [];
let currentStatus = "all";
let currentPriority = "all";
let currentCategory = "all";
let searchTerm = "";
let editingId = null;
let lastFocused = null;

// ---------- DOM ----------
const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statProgress = document.getElementById("stat-progress");
const statCompleted = document.getElementById("stat-completed");
const grid = document.getElementById("tasks-grid");
const noResults = document.getElementById("no-results");
const emptyMessage = document.getElementById("empty-message");
const clearFiltersBtn = document.getElementById("clear-filters");
const newTaskBtn = document.getElementById("new-task-btn");
const taskFormClose = document.getElementById("task-form-close");
const overlay = document.getElementById("task-form-overlay");
const taskForm = document.getElementById("task-form");
const filterStatus = document.getElementById("filter-status");
const filterPriority = document.getElementById("filter-priority");
const filterCategory = document.getElementById("filter-category");
const searchInput = document.getElementById("search-input");
const modalTitle = document.getElementById("modal-title");
const submitBtn = document.getElementById("submit-task");

const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const categoryInput = document.getElementById("task-category");
const priorityInput = document.getElementById("task-priority");
const statusInput = document.getElementById("task-status");
const dueDateInput = document.getElementById("task-due-date");

/* ============================================================
   Helpers
   ============================================================ */

// ورودی کاربر هرگز مستقیم داخل innerHTML نمی‌رود (جلوگیری از XSS)
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function statusLabel(status) {
  const labels = { pending: "Pending", progress: "In Progress", completed: "Completed" };
  return labels[status] || status;
}

function categoryLabel(category) {
  const labels = {
    development: "Development",
    design: "Design",
    marketing: "Marketing",
    personal: "Personal",
  };
  return labels[category] || category;
}

function priorityLabel(priority) {
  const labels = { low: "Low priority", medium: "Medium priority", high: "High priority" };
  return labels[priority] || priority;
}

// تاریخ امروز به شکل YYYY-MM-DD در زمان محلی (برای مقایسه با input type="date")
function todayISO() {
  return new Date().toLocaleDateString("sv-SE");
}

function isOverdue(task) {
  return task.status !== "completed" && Boolean(task.dueDate) && task.dueDate < todayISO();
}

// new Date("2026-09-28") را مرورگر UTC حساب می‌کند و در بعضی منطقه‌های زمانی یک روز عقب می‌افتد.
// پس رشته را خودمان به تاریخ محلی تبدیل می‌کنیم.
function formatDate(isoDate) {
  if (!isoDate) return "No due date";

  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date)) return isoDate;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ============================================================
   Storage
   ============================================================ */

// هر Task خوانده‌شده از storage اعتبارسنجی و پاک‌سازی می‌شود
function normalizeTask(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = Number(raw.id);
  const title = String(raw.title ?? "").trim();
  if (!Number.isFinite(id) || !title) return null;

  return {
    id,
    title,
    description: String(raw.description ?? ""),
    category: CATEGORIES.includes(raw.category) ? raw.category : "personal",
    priority: PRIORITIES.includes(raw.priority) ? raw.priority : "medium",
    dueDate: typeof raw.dueDate === "string" ? raw.dueDate : "",
    status: STATUSES.includes(raw.status) ? raw.status : "pending",
  };
}

function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data.map(normalizeTask).filter(Boolean) : [];
  } catch (err) {
    console.warn("Failed to load tasks:", err);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn("Failed to save tasks:", err);
  }
}

/* ============================================================
   Seed (فقط بار اول)
   ============================================================ */

function seedIfEmpty() {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== null) return; // قبلاً ذخیره شده — دست نزن
  } catch {
    return;
  }

  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("sv-SE");

  tasks = [
    {
      id: Date.now(),
      title: "Build homepage",
      description: "Create the homepage UI",
      category: "development",
      priority: "high",
      dueDate: inThreeDays,
      status: "pending",
    },
  ];
  saveTasks();
}

/* ============================================================
   تنها راه تغییر State: commit
   ============================================================ */

// هر تغییر یک آرایه‌ی جدید می‌سازد؛ Storage، آمار و UI همیشه با هم به‌روز می‌شوند
function commit(nextTasks) {
  tasks = nextTasks;
  saveTasks();
  updateStats();
  applyFilters();
}

/* ============================================================
   Stats
   ============================================================ */

function updateStats() {
  statTotal.textContent = tasks.length;
  statPending.textContent = tasks.filter((t) => t.status === "pending").length;
  statProgress.textContent = tasks.filter((t) => t.status === "progress").length;
  statCompleted.textContent = tasks.filter((t) => t.status === "completed").length;
}

/* ============================================================
   Render
   ============================================================ */

function hasActiveFilters() {
  return (
    currentStatus !== "all" ||
    currentPriority !== "all" ||
    currentCategory !== "all" ||
    searchTerm.trim() !== ""
  );
}

// دو Empty State متفاوت: «هنوز Taskی نیست» و «فیلتر چیزی پیدا نکرد»
function showEmptyState() {
  noResults.hidden = false;

  if (tasks.length === 0) {
    emptyMessage.textContent = "No tasks yet. Create your first task with “+ New Task”.";
    clearFiltersBtn.hidden = true;
  } else {
    emptyMessage.textContent = "No tasks match your filters.";
    clearFiltersBtn.hidden = !hasActiveFilters();
  }
}

function renderTasks(list) {
  if (list.length === 0) {
    grid.innerHTML = "";
    showEmptyState();
    return;
  }

  noResults.hidden = true;

  grid.innerHTML = list
    .map((task) => {
      const overdue = isOverdue(task);
      const next = STATUSES[STATUSES.indexOf(task.status) + 1];
      const badgeLabel = next
        ? `Status: ${statusLabel(task.status)}. Click to move to ${statusLabel(next)}`
        : `Status: ${statusLabel(task.status)}`;

      return `
      <article class="task-card">
        <div class="task-card__header">
          <h3 class="task-card__title">${escapeHTML(task.title)}</h3>
          <button type="button" class="badge badge--${task.status}" data-id="${task.id}"
            aria-label="${escapeHTML(badgeLabel)}" ${next ? "" : "disabled"}>
            ${statusLabel(task.status)}
          </button>
        </div>

        <p class="task-card__desc">${escapeHTML(task.description || "No description")}</p>

        <div class="task-card__meta">
          <span class="task-card__category">${escapeHTML(categoryLabel(task.category))}</span>
          <span class="task-card__priority task-card__priority--${task.priority}">${priorityLabel(task.priority)}</span>
          <span class="task-card__due${overdue ? " task-card__due--overdue" : ""}">${formatDate(task.dueDate)}${overdue ? " · Overdue" : ""}</span>
        </div>

        <div class="task-card__actions">
          <button type="button" class="task-card__btn task-card__btn--edit" data-id="${task.id}" aria-label="Edit ${escapeHTML(task.title)}">Edit</button>
          <button type="button" class="task-card__btn task-card__btn--delete" data-id="${task.id}" aria-label="Delete ${escapeHTML(task.title)}">Delete</button>
        </div>
      </article>
    `;
    })
    .join("");
}

/* ============================================================
   Modal (New / Edit)
   ============================================================ */

function openModal() {
  lastFocused = document.activeElement;
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  titleInput.focus(); // کار می‌کند چون .overlay.active فوراً visible می‌شود (CSS)
}

function closeModal() {
  overlay.classList.remove("active");
  document.body.style.overflow = "";

  // ریست فرم و حالت
  taskForm.reset();
  titleInput.setCustomValidity("");
  editingId = null;
  modalTitle.textContent = "New Task";
  submitBtn.textContent = "Save Task";

  lastFocused?.focus();
  lastFocused = null;
}

newTaskBtn.addEventListener("click", openModal);
taskFormClose.addEventListener("click", closeModal);

// بستن با کلیک روی پس‌زمینه (نه روی مودال)
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Escape و نگه‌داشتن Tab داخل مودال
document.addEventListener("keydown", (e) => {
  if (!overlay.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeModal();
    return;
  }

  if (e.key !== "Tab") return;

  const focusable = [...overlay.querySelectorAll("button, input, select, textarea")].filter(
    (el) => !el.disabled
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!overlay.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ============================================================
   Create / Update
   ============================================================ */

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value,
    priority: priorityInput.value,
    status: statusInput.value,
    dueDate: dueDateInput.value,
  };

  // required فقط خالی بودن کامل را می‌گیرد؛ «فاصله‌ها» را خودمان رد می‌کنیم
  if (!data.title) {
    titleInput.setCustomValidity("Please enter a title.");
    titleInput.reportValidity();
    return;
  }

  if (editingId === null) {
    commit([...tasks, { id: Date.now(), ...data }]);
  } else {
    commit(tasks.map((task) => (task.id === editingId ? { ...task, ...data } : task)));
  }

  closeModal();
});

titleInput.addEventListener("input", () => titleInput.setCustomValidity(""));

/* ============================================================
   Filters
   ============================================================ */

function applyFilters() {
  const query = searchTerm.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    const matchesStatus = currentStatus === "all" || task.status === currentStatus;
    const matchesPriority = currentPriority === "all" || task.priority === currentPriority;
    const matchesCategory = currentCategory === "all" || task.category === currentCategory;
    const matchesSearch = task.title.toLowerCase().includes(query);
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  renderTasks(filtered);
}

function clearFilters() {
  currentStatus = currentPriority = currentCategory = "all";
  searchTerm = "";
  filterStatus.value = filterPriority.value = filterCategory.value = "all";
  searchInput.value = "";
  applyFilters();
}

filterStatus.addEventListener("change", (e) => {
  currentStatus = e.target.value;
  applyFilters();
});
filterPriority.addEventListener("change", (e) => {
  currentPriority = e.target.value;
  applyFilters();
});
filterCategory.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  applyFilters();
});
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  applyFilters();
});
clearFiltersBtn.addEventListener("click", clearFilters);

/* ============================================================
   Delete / Change Status / Edit
   ============================================================ */

function deleteTask(id) {
  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  commit(tasks.filter((task) => task.id !== id));
}

// completed آخرین وضعیت چرخه است؛ برگرداندن آن از طریق فرم Edit انجام می‌شود
function nextStatus(current) {
  const index = STATUSES.indexOf(current);
  if (index === -1) return STATUSES[0];
  return STATUSES[Math.min(index + 1, STATUSES.length - 1)];
}

function changeStatus(id) {
  commit(tasks.map((task) => (task.id === id ? { ...task, status: nextStatus(task.status) } : task)));
}

function startEdit(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingId = id;

  titleInput.value = task.title;
  descriptionInput.value = task.description;
  categoryInput.value = task.category;
  priorityInput.value = task.priority;
  statusInput.value = task.status;
  dueDateInput.value = task.dueDate;

  modalTitle.textContent = "Edit Task";
  submitBtn.textContent = "Update Task";

  openModal();
}

// Event Delegation: یک Listener برای همه‌ی دکمه‌های کارت‌ها
grid.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".task-card__btn--delete");
  if (deleteBtn) return deleteTask(Number(deleteBtn.dataset.id));

  const badge = e.target.closest(".badge");
  if (badge && !badge.disabled) return changeStatus(Number(badge.dataset.id));

  const editBtn = e.target.closest(".task-card__btn--edit");
  if (editBtn) return startEdit(Number(editBtn.dataset.id));
});

/* ============================================================
   Init
   ============================================================ */

function init() {
  seedIfEmpty();
  tasks = loadTasks();
  updateStats();
  applyFilters();
}

init();
