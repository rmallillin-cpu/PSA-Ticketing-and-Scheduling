const loginEls = {
  loginForm: document.getElementById("loginForm"),
  loginMode: document.getElementById("loginMode"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  showSignupBtn: document.getElementById("showSignupBtn"),
  signupModal: document.getElementById("signupModal"),
  cancelSignupBtn: document.getElementById("cancelSignupBtn"),
  signupForm: document.getElementById("signupForm"),
  signupUsername: document.getElementById("signupUsername"),
  signupFullname: document.getElementById("signupFullname"),
  signupEmployeeId: document.getElementById("signupEmployeeId"),
  signupEmail: document.getElementById("signupEmail"),
  signupDepartment: document.getElementById("signupDepartment"),
  signupPosition: document.getElementById("signupPosition"),
  signupPassword: document.getElementById("signupPassword"),
  signupProfilePic: document.getElementById("signupProfilePic"),
  signupIsAdmin: document.getElementById("signupIsAdmin"),
  loginTicketSearch: document.getElementById("loginTicketSearch"),
  loginNameFilter: document.getElementById("loginNameFilter"),
  loginTicketStatusBody: document.getElementById("loginTicketStatusBody"),
  loginScheduleStatusBody: document.getElementById("loginScheduleStatusBody")
};

initLogin();

function initLogin() {
  ensureSeeds();
  populateSignupReferenceLists();

  const existingUser = getCurrentUser();
  if (existingUser) {
    window.location.href = "dashboard.html";
    return;
  }

  loginEls.showSignupBtn.addEventListener("click", () => loginEls.signupModal.showModal());

  loginEls.cancelSignupBtn.addEventListener("click", () => {
    loginEls.signupForm.reset();
    loginEls.signupModal.close();
  });

  loginEls.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    doLogin();
  });

  loginEls.signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await doSignup();
  });

  loginEls.loginTicketSearch.addEventListener("input", renderTicketStatusRows);
  loginEls.loginNameFilter.addEventListener("input", renderTicketStatusRows);

  renderLoginStatusTables();
}

function doLogin() {
  const username = loginEls.loginUsername.value.trim();
  const password = loginEls.loginPassword.value;
  const mode = loginEls.loginMode.value;

  const user = getUsers().find((u) => u.username === username && u.password === password);

  if (!user) {
    notify("Invalid username or password.", "error");
    return;
  }

  if (mode === "admin" && user.role !== "admin") {
    notify("Please use User mode for this account.", "error");
    return;
  }

  if (mode === "user" && user.role === "admin") {
    notify("Please use Admin mode for this account.", "error");
    return;
  }

  setSession(user);
  logTimeIn(user);
  notify("Login successful.", "success");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 300);
}

function populateSignupReferenceLists() {
  loginEls.signupDepartment.innerHTML = `<option value="" disabled selected>Select department</option>`;
  DEPARTMENTS.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    loginEls.signupDepartment.appendChild(option);
  });

  loginEls.signupPosition.innerHTML = `<option value="" disabled selected>Select position</option>`;
  POSITIONS.forEach((position) => {
    const option = document.createElement("option");
    option.value = position;
    option.textContent = position;
    loginEls.signupPosition.appendChild(option);
  });
}

async function doSignup() {
  const users = getUsers();
  const username = loginEls.signupUsername.value.trim();
  const employeeCode = loginEls.signupEmployeeId.value.trim();
  const email = loginEls.signupEmail.value.trim().toLowerCase();

  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    notify("Username already exists.", "error");
    return;
  }

  if (users.some((u) => u.email.toLowerCase() === email)) {
    notify("Email already registered.", "error");
    return;
  }

  if (users.some((u) => (u.employeeCode || "").toLowerCase() === employeeCode.toLowerCase())) {
    notify("Employee ID already registered.", "error");
    return;
  }

  const picture = await fileToDataUrl(loginEls.signupProfilePic.files[0]);

  users.push({
    id: crypto.randomUUID(),
    employeeCode,
    username,
    fullname: loginEls.signupFullname.value.trim(),
    email,
    department: loginEls.signupDepartment.value.trim(),
    position: loginEls.signupPosition.value.trim(),
    password: loginEls.signupPassword.value,
    role: loginEls.signupIsAdmin.checked ? "admin" : "user",
    profilePicture: picture || DEFAULT_AVATAR,
    createdAt: new Date().toISOString()
  });

  setUsers(users);
  loginEls.signupForm.reset();
  loginEls.signupModal.close();
  renderLoginStatusTables();
  notify("Sign-up successful. You can login now.", "success");
}

function renderLoginStatusTables() {
  renderTicketStatusRows();
  renderScheduleStatusRows();
}

function renderTicketStatusRows() {
  const keyword = loginEls.loginTicketSearch.value.trim().toLowerCase();
  const senderName = loginEls.loginNameFilter.value.trim().toLowerCase();

  const tickets = getTickets()
    .filter((ticket) => {
      const ticketBlob = [
        ticket.ticketNumber,
        ticket.subject,
        ticket.signatoryName,
        ticket.status
      ].join(" ").toLowerCase();
      const sender = (ticket.employeeName || "").toLowerCase();
      const senderFormatted = formatDisplayName(ticket.employeeName || "").toLowerCase();
      const keywordPass = !keyword || ticketBlob.includes(keyword);
      const senderPass = !senderName || sender.includes(senderName) || senderFormatted.includes(senderName);
      return keywordPass && senderPass;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  loginEls.loginTicketStatusBody.innerHTML = "";

  if (!tickets.length) {
    loginEls.loginTicketStatusBody.innerHTML = `<tr><td colspan="6">No tickets yet.</td></tr>`;
    return;
  }

  tickets.slice(0, 10).forEach((ticket) => {
    const progress = computeProgress(ticket);
    const status = ticket.status === "approved" ? "Completed" : "Pending";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ticket.ticketNumber}</td>
      <td>${escapeHtml(formatDisplayName(ticket.employeeName || "-"))}</td>
      <td>${escapeHtml(ticket.signatoryName || "-")}</td>
      <td>${escapeHtml(ticket.subject || "-")}</td>
      <td>
        <div class="deadline-progress-wrap">
          <progress value="${progress}" max="100"></progress>
          <span>${progress}%</span>
        </div>
      </td>
      <td>${status}</td>
    `;
    loginEls.loginTicketStatusBody.appendChild(row);
  });
}

function renderScheduleStatusRows() {
  const events = getEvents().slice().sort((a, b) => b.date.localeCompare(a.date));
  loginEls.loginScheduleStatusBody.innerHTML = "";

  if (!events.length) {
    loginEls.loginScheduleStatusBody.innerHTML = `<tr><td colspan="3">No schedule yet.</td></tr>`;
    return;
  }

  events.slice(0, 10).forEach((event) => {
    const status = normalizeScheduleStatus(event.status);
    const city = event.cityAssigned ? ` [${event.cityAssigned}]` : "";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(`${event.title || "-"} - ${formatDisplayName(event.ownerName || "-")}${city}`)}</td>
      <td>${escapeHtml(event.date || "-")}</td>
      <td>${status}</td>
    `;
    loginEls.loginScheduleStatusBody.appendChild(row);
  });
}

function computeProgress(ticket) {
  if (ticket.status === "approved") return 100;
  if (!ticket.deadline) return 35;

  const start = new Date(ticket.createdAt).getTime();
  const end = new Date(ticket.deadline).getTime();
  const now = Date.now();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 35;
  if (now >= end) return 100;

  const ratio = ((now - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(ratio)));
}

function normalizeScheduleStatus(status) {
  if (status === "approved") return "Approved";
  if (status === "re-sched") return "Re-Sched";
  return "Pending";
}
