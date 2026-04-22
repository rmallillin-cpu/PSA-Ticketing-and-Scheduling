const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const NOTIFY_SOUND_CANDIDATES = [
  "logo/notification.mp3",
  "logo/notify.mp3",
  "logo/message.mp3",
  "logo/sound.mp3",
  "logo/notification.wav",
  "logo/notify.wav",
  "logo/message.wav",
  "logo/sound.wav",
  "logo/notification.ogg",
  "logo/notify.ogg",
  "logo/message.ogg",
  "logo/sound.ogg"
];

const state = {
  currentUser: null,
  calendarDate: new Date(),
  editingEventId: null,
  activeTicketId: null,
  activeChatUserId: "",
  activeAdminTab: "schedule",
  announcementFilter: "",
  lastAnnouncementAt: "",
  lastUnreadCount: 0
};

const el = {
  globalSearchInput: document.getElementById("globalSearchInput"),
  welcomeText: document.getElementById("welcomeText"),
  userMeta: document.getElementById("userMeta"),
  timeInStatus: document.getElementById("timeInStatus"),
  openCalendarPanelBtn: document.getElementById("openCalendarPanelBtn"),
  openTicketPanelBtn: document.getElementById("openTicketPanelBtn"),
  openAccompPanelBtn: document.getElementById("openAccompPanelBtn"),
  openAdminLogsPanelBtn: document.getElementById("openAdminLogsPanelBtn"),
  calendarPanelModal: document.getElementById("calendarPanelModal"),
  ticketPanelModal: document.getElementById("ticketPanelModal"),
  accompPanelModal: document.getElementById("accompPanelModal"),
  adminLogsPanelModal: document.getElementById("adminLogsPanelModal"),
  closeCalendarPanelBtn: document.getElementById("closeCalendarPanelBtn"),
  closeTicketPanelBtn: document.getElementById("closeTicketPanelBtn"),
  closeAccompPanelBtn: document.getElementById("closeAccompPanelBtn"),
  closeAdminLogsPanelBtn: document.getElementById("closeAdminLogsPanelBtn"),
  employeeNameList: document.getElementById("employeeNameList"),
  messengerModal: document.getElementById("messengerModal"),
  closeMessengerBtn: document.getElementById("closeMessengerBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  announcementForm: document.getElementById("announcementForm"),
  announcementModal: document.getElementById("announcementModal"),
  openAnnouncementModalBtn: document.getElementById("openAnnouncementModalBtn"),
  openAnnouncementModalIconBtn: document.getElementById("openAnnouncementModalIconBtn"),
  closeAnnouncementModalBtn: document.getElementById("closeAnnouncementModalBtn"),
  announceAvatar: document.getElementById("announceAvatar"),
  feedComposerAvatar: document.getElementById("feedComposerAvatar"),
  announcementName: document.getElementById("announcementName"),
  announcementDepartment: document.getElementById("announcementDepartment"),
  announcementDate: document.getElementById("announcementDate"),
  announcementMessage: document.getElementById("announcementMessage"),
  announcementFile: document.getElementById("announcementFile"),
  announcementFeed: document.getElementById("announcementFeed"),
  prevMonth: document.getElementById("prevMonth"),
  nextMonth: document.getElementById("nextMonth"),
  openCalendarViewBtn: document.getElementById("openCalendarViewBtn"),
  calendarMonth: document.getElementById("calendarMonth"),
  calendarGrid: document.getElementById("calendarGrid"),
  calendarViewModal: document.getElementById("calendarViewModal"),
  closeCalendarView: document.getElementById("closeCalendarView"),
  viewPrevMonth: document.getElementById("viewPrevMonth"),
  viewNextMonth: document.getElementById("viewNextMonth"),
  viewToday: document.getElementById("viewToday"),
  calendarViewMonth: document.getElementById("calendarViewMonth"),
  calendarViewGrid: document.getElementById("calendarViewGrid"),
  ticketForm: document.getElementById("ticketForm"),
  ticketNumber: document.getElementById("ticketNumber"),
  ticketDepartment: document.getElementById("ticketDepartment"),
  ticketPosition: document.getElementById("ticketPosition"),
  ticketSubject: document.getElementById("ticketSubject"),
  ticketDeadline: document.getElementById("ticketDeadline"),
  ticketDetails: document.getElementById("ticketDetails"),
  ticketSignatory: document.getElementById("ticketSignatory"),
  ticketAttachment: document.getElementById("ticketAttachment"),
  ticketSearch: document.getElementById("ticketSearch"),
  ticketSenderSearch: document.getElementById("ticketSenderSearch"),
  printUserTicketsBtn: document.getElementById("printUserTicketsBtn"),
  ticketsTableBody: document.getElementById("ticketsTableBody"),
  accomplishmentForm: document.getElementById("accomplishmentForm"),
  accompName: document.getElementById("accompName"),
  accompDate: document.getElementById("accompDate"),
  accompActivity: document.getElementById("accompActivity"),
  accompFile: document.getElementById("accompFile"),
  accomplishmentTableBody: document.getElementById("accomplishmentTableBody"),
  adminLogsSection: document.getElementById("adminLogsSection"),
  adminDepartmentFilter: document.getElementById("adminDepartmentFilter"),
  adminNameFilter: document.getElementById("adminNameFilter"),
  tabScheduleBtn: document.getElementById("tabScheduleBtn"),
  tabTicketBtn: document.getElementById("tabTicketBtn"),
  tabAccompBtn: document.getElementById("tabAccompBtn"),
  panelSchedule: document.getElementById("panelSchedule"),
  panelTicket: document.getElementById("panelTicket"),
  panelAccomp: document.getElementById("panelAccomp"),
  printScheduleLogBtn: document.getElementById("printScheduleLogBtn"),
  printTicketLogBtn: document.getElementById("printTicketLogBtn"),
  printAccompLogBtn: document.getElementById("printAccompLogBtn"),
  adminScheduleTableBody: document.getElementById("adminScheduleTableBody"),
  adminTicketsTableBody: document.getElementById("adminTicketsTableBody"),
  adminAccomplishmentTableBody: document.getElementById("adminAccomplishmentTableBody"),
  eventModal: document.getElementById("eventModal"),
  eventForm: document.getElementById("eventForm"),
  eventModalTitle: document.getElementById("eventModalTitle"),
  eventId: document.getElementById("eventId"),
  eventDate: document.getElementById("eventDate"),
  eventDateLabel: document.getElementById("eventDateLabel"),
  eventTitle: document.getElementById("eventTitle"),
  eventDescription: document.getElementById("eventDescription"),
  eventCity: document.getElementById("eventCity"),
  eventStatus: document.getElementById("eventStatus"),
  deleteEventBtn: document.getElementById("deleteEventBtn"),
  cancelEventBtn: document.getElementById("cancelEventBtn"),
  ticketModal: document.getElementById("ticketModal"),
  closeTicketModal: document.getElementById("closeTicketModal"),
  ticketDetailsContainer: document.getElementById("ticketDetailsContainer"),
  ticketUpdateForm: document.getElementById("ticketUpdateForm"),
  updateTicketId: document.getElementById("updateTicketId"),
  updateSubject: document.getElementById("updateSubject"),
  updateDetails: document.getElementById("updateDetails"),
  updateDeadline: document.getElementById("updateDeadline"),
  updateSignatory: document.getElementById("updateSignatory"),
  notesThread: document.getElementById("notesThread"),
  noteForm: document.getElementById("noteForm"),
  noteTicketId: document.getElementById("noteTicketId"),
  noteText: document.getElementById("noteText"),
  noteAttachment: document.getElementById("noteAttachment"),
  chatEmployeeSelect: document.getElementById("chatEmployeeSelect"),
  chatThread: document.getElementById("chatThread"),
  chatForm: document.getElementById("chatForm"),
  chatMessageInput: document.getElementById("chatMessageInput"),
  chatFileInput: document.getElementById("chatFileInput"),
  chatSelectedFile: document.getElementById("chatSelectedFile")
};

initDashboard();

function initDashboard() {
  ensureSeeds();
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  state.currentUser = user;
  initializeNotificationState();
  bindEvents();
  bindHeader();
  postTimeInOncePerSession();
  fillTicketDefaults();
  fillAccomplishmentDefaults();
  fillAnnouncementDefaults();
  initMessenger();
  populateAdminDepartmentFilter();
  renderCalendar();
  populateSignatories();
  renderTickets();
  renderAccomplishments();
  renderAdminLogs();
  renderAnnouncements();
}

function bindEvents() {
  window.addEventListener("storage", handleStorageUpdate);

  el.openCalendarPanelBtn.addEventListener("click", () => el.calendarPanelModal.showModal());
  el.openTicketPanelBtn.addEventListener("click", () => el.ticketPanelModal.showModal());
  el.openAccompPanelBtn.addEventListener("click", () => el.accompPanelModal.showModal());
  el.openAdminLogsPanelBtn.addEventListener("click", () => el.adminLogsPanelModal.showModal());
  el.closeCalendarPanelBtn.addEventListener("click", () => el.calendarPanelModal.close());
  el.closeTicketPanelBtn.addEventListener("click", () => el.ticketPanelModal.close());
  el.closeAccompPanelBtn.addEventListener("click", () => el.accompPanelModal.close());
  el.closeAdminLogsPanelBtn.addEventListener("click", () => el.adminLogsPanelModal.close());
  el.openAnnouncementModalBtn.addEventListener("click", () => el.announcementModal.showModal());
  el.openAnnouncementModalIconBtn.addEventListener("click", () => el.announcementModal.showModal());
  el.closeAnnouncementModalBtn.addEventListener("click", () => el.announcementModal.close());

  el.closeMessengerBtn.addEventListener("click", () => {
    el.messengerModal.close();
  });

  el.logoutBtn.addEventListener("click", () => {
    const now = new Date();
    const timeOutText = now.toLocaleString();
    createSystemAnnouncement({
      message: `TIME-OUT: ${formatDisplayName(state.currentUser.fullname)} (${state.currentUser.department}) just timed out at ${timeOutText}.`,
      attachment: "",
      attachmentName: ""
    });
    logTimeOut(state.currentUser.id);
    window.alert(`Thank you ${formatDisplayName(state.currentUser.fullname)} (${state.currentUser.department}) Just Time-out ${timeOutText}`);
    clearSession();
    window.location.href = "login.html";
  });

  el.prevMonth.addEventListener("click", () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
    renderCalendar();
    renderCalendarView();
  });

  el.nextMonth.addEventListener("click", () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
    renderCalendar();
    renderCalendarView();
  });

  el.openCalendarViewBtn.addEventListener("click", () => {
    renderCalendarView();
    el.calendarViewModal.showModal();
  });

  el.closeCalendarView.addEventListener("click", () => el.calendarViewModal.close());

  el.viewPrevMonth.addEventListener("click", () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
    renderCalendar();
    renderCalendarView();
  });

  el.viewNextMonth.addEventListener("click", () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
    renderCalendar();
    renderCalendarView();
  });

  el.viewToday.addEventListener("click", () => {
    state.calendarDate = new Date();
    renderCalendar();
    renderCalendarView();
  });

  el.eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEvent();
  });

  el.deleteEventBtn.addEventListener("click", deleteEvent);
  el.cancelEventBtn.addEventListener("click", () => el.eventModal.close());

  el.ticketForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await createTicket();
  });

  el.accomplishmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitAccomplishment();
  });
  el.announcementForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitAnnouncement();
  });

  el.ticketSearch.addEventListener("input", renderTickets);
  el.ticketSenderSearch.addEventListener("input", renderTickets);
  el.printUserTicketsBtn.addEventListener("click", () => printTable("QUEUED TICKETS", el.ticketsTableBody));

  el.closeTicketModal.addEventListener("click", () => el.ticketModal.close());

  el.ticketUpdateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateTicketInfo();
  });

  el.noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addNote();
  });

  el.chatEmployeeSelect.addEventListener("change", () => {
    state.activeChatUserId = el.chatEmployeeSelect.value;
    if (!state.activeChatUserId) return;
    markConversationAsRead(state.activeChatUserId);
    renderChatThread();
    renderUnreadAlert();
  });

  el.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendChatMessage();
  });

  el.chatFileInput.addEventListener("change", () => {
    const file = el.chatFileInput.files[0];
    el.chatSelectedFile.textContent = file ? file.name : "No file selected";
  });

  if (el.globalSearchInput) {
    el.globalSearchInput.addEventListener("input", () => {
      state.announcementFilter = el.globalSearchInput.value.trim().toLowerCase();
      renderAnnouncements();
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (!target.closest(".chat-menu-wrap")) {
      document.querySelectorAll(".chat-menu").forEach((menu) => menu.classList.add("hidden"));
    }

    if (!target.closest(".post-menu-wrap")) {
      document.querySelectorAll(".post-menu").forEach((menu) => menu.classList.add("hidden"));
    }
  });

  if (el.adminDepartmentFilter) {
    el.adminDepartmentFilter.addEventListener("change", renderAdminLogs);
  }
  if (el.adminNameFilter) {
    el.adminNameFilter.addEventListener("input", renderAdminLogs);
  }
  if (el.tabScheduleBtn) {
    el.tabScheduleBtn.addEventListener("click", () => setAdminTab("schedule"));
  }
  if (el.tabTicketBtn) {
    el.tabTicketBtn.addEventListener("click", () => setAdminTab("ticket"));
  }
  if (el.tabAccompBtn) {
    el.tabAccompBtn.addEventListener("click", () => setAdminTab("accomp"));
  }
  if (el.printScheduleLogBtn) {
    el.printScheduleLogBtn.addEventListener("click", () => printTable("SCHEDULE LOGS", el.adminScheduleTableBody));
  }
  if (el.printTicketLogBtn) {
    el.printTicketLogBtn.addEventListener("click", () => printTable("TICKET LOGS", el.adminTicketsTableBody));
  }
  if (el.printAccompLogBtn) {
    el.printAccompLogBtn.addEventListener("click", () => printTable("ACCOMPLISHMENT LOGS", el.adminAccomplishmentTableBody));
  }
}

function bindHeader() {
  el.announceAvatar.src = state.currentUser.profilePicture || DEFAULT_AVATAR;
  el.feedComposerAvatar.src = state.currentUser.profilePicture || DEFAULT_AVATAR;
  el.welcomeText.textContent = `Welcome, ${formatDisplayName(state.currentUser.fullname)}`;
  el.userMeta.textContent = `${state.currentUser.employeeCode || "-"} | ${state.currentUser.department} | ${state.currentUser.position} | ${state.currentUser.role}`;
  el.timeInStatus.textContent = buildTimeInStatusText(state.currentUser.id);
  el.openAdminLogsPanelBtn.classList.toggle("hidden", state.currentUser.role !== "admin");
}

function fillTicketDefaults() {
  const next = getNextTicketNumber();
  el.ticketNumber.value = next;
  el.ticketDepartment.value = state.currentUser.department;
  el.ticketPosition.value = state.currentUser.position;
  el.ticketDeadline.value = "";
}

function fillAccomplishmentDefaults() {
  el.accompName.value = formatDisplayName(state.currentUser.fullname);
  el.accompDate.value = localDateKey(new Date());
}

function fillAnnouncementDefaults() {
  el.announcementName.value = formatDisplayName(state.currentUser.fullname);
  el.announcementDepartment.value = state.currentUser.department || "-";
  el.announcementDate.value = localDateKey(new Date());
}

function populateAdminDepartmentFilter() {
  if (!el.adminDepartmentFilter) return;
  el.adminDepartmentFilter.innerHTML = `<option value="">ALL DEPARTMENTS</option>`;
  DEPARTMENTS.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    el.adminDepartmentFilter.appendChild(option);
  });
}

function setAdminTab(tab) {
  state.activeAdminTab = tab;
  applyAdminTabVisibility();
}

function applyAdminTabVisibility() {
  if (!el.panelSchedule) return;
  const active = state.activeAdminTab;
  el.panelSchedule.classList.toggle("hidden", active !== "schedule");
  el.panelTicket.classList.toggle("hidden", active !== "ticket");
  el.panelAccomp.classList.toggle("hidden", active !== "accomp");
  el.tabScheduleBtn.classList.toggle("active-tab", active === "schedule");
  el.tabTicketBtn.classList.toggle("active-tab", active === "ticket");
  el.tabAccompBtn.classList.toggle("active-tab", active === "accomp");
}

function initMessenger() {
  const users = getUsers().filter((user) => user.id !== state.currentUser.id);
  el.chatEmployeeSelect.innerHTML = "";
  el.employeeNameList.innerHTML = "";

  if (!users.length) {
    el.chatEmployeeSelect.innerHTML = `<option value="">No employee available</option>`;
    el.chatEmployeeSelect.disabled = true;
    el.chatThread.innerHTML = "<p>No employee available for chat.</p>";
    el.chatForm.classList.add("hidden");
    renderUnreadAlert();
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select employee";
  placeholder.disabled = true;
  placeholder.selected = true;
  el.chatEmployeeSelect.appendChild(placeholder);

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${formatDisplayName(user.fullname)} [${user.employeeCode || "-"}]`;
    el.chatEmployeeSelect.appendChild(option);
  });

  el.chatEmployeeSelect.disabled = false;
  el.chatForm.classList.remove("hidden");
  state.activeChatUserId = users[0].id;
  el.chatEmployeeSelect.value = users[0].id;
  renderEmployeeNameList(users);
  markConversationAsRead(state.activeChatUserId);
  renderChatThread();
  renderUnreadAlert();
}

function renderEmployeeNameList(users) {
  el.employeeNameList.innerHTML = "";
  users.forEach((user) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "employee-name-btn";
    button.dataset.userId = user.id;
    button.innerHTML = `<span>${escapeHtml(formatDisplayName(user.fullname))}</span><i class=\"name-unread hidden\">0</i>`;
    button.addEventListener("click", () => openMessengerForUser(user.id));
    el.employeeNameList.appendChild(button);
  });
}

function openMessengerForUser(userId) {
  state.activeChatUserId = userId;
  el.chatEmployeeSelect.value = userId;
  markConversationAsRead(userId);
  renderChatThread();
  renderUnreadAlert();
  el.messengerModal.showModal();
}

function populateSignatories() {
  const users = getUsers();
  const options = users
    .map((u) => `<option value="${u.id}">${escapeHtml(u.fullname)} [${escapeHtml(u.employeeCode || "-")}] (${escapeHtml(u.position)})</option>`)
    .join("");

  el.ticketSignatory.innerHTML = `<option value="" disabled selected>Select signatory</option>${options}`;
  el.updateSignatory.innerHTML = options;
}

function getConversationKey(userA, userB) {
  return [userA, userB].sort().join("__");
}

function getConversationMessages(otherUserId) {
  const chats = getChats();
  const key = getConversationKey(state.currentUser.id, otherUserId);
  return Array.isArray(chats[key]) ? chats[key] : [];
}

function setConversationMessages(otherUserId, messages) {
  const chats = getChats();
  const key = getConversationKey(state.currentUser.id, otherUserId);
  chats[key] = messages;
  setChats(chats);
}

async function sendChatMessage() {
  const receiverId = state.activeChatUserId;
  const text = el.chatMessageInput.value.trim();
  const file = el.chatFileInput.files[0];
  if (!receiverId || (!text && !file)) return;

  const receiver = getUsers().find((user) => user.id === receiverId);
  if (!receiver) return;
  const attachmentData = file ? await fileToDataUrl(file) : "";

  const messages = getConversationMessages(receiverId);
  messages.push({
    id: crypto.randomUUID(),
    senderId: state.currentUser.id,
    senderName: state.currentUser.fullname,
    receiverId: receiver.id,
    text,
    attachment: attachmentData,
    attachmentName: file?.name || "",
    attachmentType: file?.type || "",
    readBy: [state.currentUser.id],
    createdAt: new Date().toISOString()
  });

  setConversationMessages(receiverId, messages);
  el.chatForm.reset();
  el.chatSelectedFile.textContent = "No file selected";
  playNotificationSound();
  renderChatThread();
  renderUnreadAlert();
}

function markConversationAsRead(otherUserId) {
  const messages = getConversationMessages(otherUserId);
  let changed = false;

  messages.forEach((message) => {
    if (message.receiverId === state.currentUser.id) {
      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (!readBy.includes(state.currentUser.id)) {
        readBy.push(state.currentUser.id);
        message.readBy = readBy;
        changed = true;
      }
    }
  });

  if (changed) setConversationMessages(otherUserId, messages);
}

function renderChatThread() {
  const otherUserId = state.activeChatUserId;
  if (!otherUserId) {
    el.chatThread.innerHTML = "<p>Select an employee to start chat.</p>";
    return;
  }

  const messages = getConversationMessages(otherUserId)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  el.chatThread.innerHTML = "";
  if (!messages.length) {
    el.chatThread.innerHTML = "<p>No messages yet. Start the conversation.</p>";
    return;
  }

  messages.forEach((message) => {
    const item = document.createElement("article");
    const mine = message.senderId === state.currentUser.id;
    item.className = `chat-message ${mine ? "mine" : "theirs"}`;
    const hasImage = String(message.attachmentType || "").startsWith("image/");
    const topRow = document.createElement("div");
    topRow.className = "chat-top-row";

    const meta = document.createElement("div");
    meta.className = "chat-meta";
    meta.textContent = `${message.senderName || "-"} | ${new Date(message.createdAt).toLocaleString()}`;
    topRow.appendChild(meta);

    if (mine) {
      const wrap = document.createElement("div");
      wrap.className = "chat-menu-wrap";

      const menuBtn = document.createElement("button");
      menuBtn.type = "button";
      menuBtn.className = "chat-menu-btn";
      menuBtn.textContent = "...";
      menuBtn.setAttribute("aria-label", "Message options");

      const menu = document.createElement("div");
      menu.className = "chat-menu hidden";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "chat-menu-item";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        menu.classList.add("hidden");
        editChatMessage(message.id);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "chat-menu-item danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        menu.classList.add("hidden");
        deleteChatMessage(message.id);
      });

      menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        document.querySelectorAll(".chat-menu").forEach((other) => {
          if (other !== menu) other.classList.add("hidden");
        });
        menu.classList.toggle("hidden");
      });

      menu.appendChild(editBtn);
      menu.appendChild(deleteBtn);
      wrap.appendChild(menuBtn);
      wrap.appendChild(menu);
      topRow.appendChild(wrap);
    }

    item.appendChild(topRow);

    if (message.text) {
      const text = document.createElement("div");
      text.className = "chat-text";
      text.textContent = message.text;
      item.appendChild(text);
    }

    if (hasImage) {
      const img = document.createElement("img");
      img.className = "chat-image";
      img.src = message.attachment;
      img.alt = message.attachmentName || "attachment";
      item.appendChild(img);
    }

    if (message.attachment) {
      const link = document.createElement("a");
      link.className = "chat-attachment";
      link.href = message.attachment;
      link.download = message.attachmentName || "file";
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = `View file: ${message.attachmentName || "file"}`;
      item.appendChild(link);
    }

    el.chatThread.appendChild(item);
  });

  el.chatThread.scrollTop = el.chatThread.scrollHeight;
}

function editChatMessage(messageId) {
  const otherUserId = state.activeChatUserId;
  if (!otherUserId) return;

  const messages = getConversationMessages(otherUserId);
  const idx = messages.findIndex((message) => message.id === messageId && message.senderId === state.currentUser.id);
  if (idx < 0) return;

  const currentText = messages[idx].text || "";
  const nextText = window.prompt("Edit your message:", currentText);
  if (nextText === null) return;

  messages[idx].text = nextText.trim();
  messages[idx].updatedAt = new Date().toISOString();
  setConversationMessages(otherUserId, messages);
  renderChatThread();
}

function deleteChatMessage(messageId) {
  const otherUserId = state.activeChatUserId;
  if (!otherUserId) return;

  const messages = getConversationMessages(otherUserId);
  const target = messages.find((message) => message.id === messageId && message.senderId === state.currentUser.id);
  if (!target) return;

  const updated = messages.filter((message) => message.id !== messageId);
  setConversationMessages(otherUserId, updated);
  renderChatThread();
  renderUnreadAlert();
}

function renderUnreadAlert() {
  const chats = getChats();
  const counts = {};

  Object.values(chats).forEach((messages) => {
    if (!Array.isArray(messages)) return;
    messages.forEach((message) => {
      if (message.receiverId !== state.currentUser.id) return;
      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (!readBy.includes(state.currentUser.id)) {
        counts[message.senderId] = (counts[message.senderId] || 0) + 1;
      }
    });
  });

  document.querySelectorAll(".employee-name-btn").forEach((button) => {
    const badge = button.querySelector(".name-unread");
    const userId = button.dataset.userId || "";
    const value = counts[userId] || 0;
    if (!badge) return;
    if (value > 0) {
      badge.textContent = String(value);
      badge.classList.remove("hidden");
    } else {
      badge.textContent = "0";
      badge.classList.add("hidden");
    }
  });
}

function renderCalendar() {
  renderCalendarGrid(el.calendarGrid, el.calendarMonth, false);
}

function renderCalendarView() {
  renderCalendarGrid(el.calendarViewGrid, el.calendarViewMonth, true);
}

function renderCalendarGrid(targetGrid, targetMonthLabel, isExpandedView) {
  const base = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth(), 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  if (targetMonthLabel) {
    targetMonthLabel.textContent = `${base.toLocaleString(undefined, { month: "long" })} ${year}`;
  }
  targetGrid.innerHTML = "";

  DAY_NAMES.forEach((name) => {
    const head = document.createElement("div");
    head.className = "cal-header";
    head.textContent = name;
    targetGrid.appendChild(head);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const events = getEvents();

  for (let i = 0; i < firstDay; i += 1) {
    const filler = document.createElement("div");
    filler.className = "cal-cell empty";
    targetGrid.appendChild(filler);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = formatDateKey(year, month + 1, day);
    const dayEvents = events.filter((event) => event.date === key);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-cell";
    if (key === todayKey) cell.classList.add("today");
    cell.innerHTML = `<div class="day-number">${day}</div>`;

    dayEvents.slice(0, isExpandedView ? 4 : 2).forEach((event) => {
      const badge = document.createElement("div");
      badge.className = `event-badge ${event.ownerId === state.currentUser.id ? "mine" : "shared"}`;
      const statusLabel = event.status === "approved" ? "Approved" : event.status === "re-sched" ? "Re-Sched" : "Pending";
      badge.textContent = `${event.title} (${statusLabel})`;
      badge.title = `${event.title} - ${event.ownerName} - ${event.cityAssigned || "-"} - ${statusLabel}`;
      cell.appendChild(badge);
    });

    if (dayEvents.length > (isExpandedView ? 4 : 2)) {
      const more = document.createElement("div");
      more.className = "event-more";
      more.textContent = `+${dayEvents.length - (isExpandedView ? 4 : 2)} more`;
      cell.appendChild(more);
    }

    cell.addEventListener("click", () => openEventModal(key));
    targetGrid.appendChild(cell);
  }
}

function openEventModal(dateKey) {
  const event = getEvents().find((e) => e.date === dateKey && e.ownerId === state.currentUser.id) || null;
  state.editingEventId = event?.id || null;

  el.eventId.value = event?.id || "";
  el.eventDate.value = dateKey;
  el.eventDateLabel.value = dateKey;
  el.eventTitle.value = event?.title || "";
  el.eventDescription.value = event?.description || "";
  el.eventCity.value = event?.cityAssigned || "";
  el.eventStatus.value = event?.status || "pending";
  el.eventModalTitle.textContent = event ? "Edit Event" : "Add Event";
  el.deleteEventBtn.style.display = event ? "inline-block" : "none";
  el.eventModal.showModal();
}

function saveEvent() {
  const title = el.eventTitle.value.trim();
  if (!title) {
    notify("Event title is required.", "error");
    return;
  }

  const events = getEvents();
  const payload = {
    date: el.eventDate.value,
    title,
    description: el.eventDescription.value.trim(),
    cityAssigned: el.eventCity.value,
    status: el.eventStatus.value,
    ownerId: state.currentUser.id,
    ownerName: state.currentUser.fullname,
    updatedAt: new Date().toISOString()
  };

  if (state.editingEventId) {
    const idx = events.findIndex((event) => event.id === state.editingEventId);
    if (idx >= 0) events[idx] = { ...events[idx], ...payload };
    notify("Event updated.", "success");
  } else {
    events.push({ id: crypto.randomUUID(), ...payload, createdAt: new Date().toISOString() });
    createSystemAnnouncement({
      message: `SCHEDULE ADDED: ${title} ON ${el.eventDate.value} (${normalizeScheduleStatus(el.eventStatus.value)})`,
      attachment: "",
      attachmentName: ""
    });
    notify("Event added.", "success");
  }

  setEvents(events);
  el.eventModal.close();
  renderCalendar();
  renderCalendarView();
  renderAdminLogs();
}

function deleteEvent() {
  if (!state.editingEventId) return;
  const filtered = getEvents().filter((event) => event.id !== state.editingEventId);
  setEvents(filtered);
  el.eventModal.close();
  renderCalendar();
  renderCalendarView();
  renderAdminLogs();
  notify("Event deleted.", "success");
}

async function createTicket() {
  const attachment = el.ticketAttachment.files[0] ? await fileToDataUrl(el.ticketAttachment.files[0]) : "";
  const signatory = getUsers().find((u) => u.id === el.ticketSignatory.value);

  const tickets = getTickets();
  const ticket = {
    id: crypto.randomUUID(),
    ticketNumber: getNextTicketNumber(),
    employeeId: state.currentUser.id,
    employeeCode: state.currentUser.employeeCode || "",
    employeeName: state.currentUser.fullname,
    department: state.currentUser.department,
    position: state.currentUser.position,
    subject: el.ticketSubject.value.trim(),
    deadline: el.ticketDeadline.value,
    details: el.ticketDetails.value.trim(),
    signatoryId: signatory?.id || "",
    signatoryName: signatory?.fullname || "",
    status: "pending",
    attachment,
    attachmentName: el.ticketAttachment.files[0]?.name || "",
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tickets.push(ticket);
  setTickets(tickets);
  incrementTicketCounter();
  createSystemAnnouncement({
    message: `TICKET SUBMITTED: ${ticket.ticketNumber} - ${ticket.subject}`,
    attachment,
    attachmentName: ticket.attachmentName || ""
  });

  el.ticketForm.reset();
  fillTicketDefaults();
  populateSignatories();
  renderTickets();
  renderAdminLogs();
  notify(`Ticket ${ticket.ticketNumber} created.`, "success");
}

function visibleTickets() {
  const keyword = el.ticketSearch.value.trim().toLowerCase();
  const senderKeyword = el.ticketSenderSearch.value.trim().toLowerCase();

  return getTickets().filter((ticket) => {
    const allowed = state.currentUser.role === "admin" || ticket.employeeId === state.currentUser.id;
    if (!allowed) return false;

    const keywordPass = !keyword || [ticket.ticketNumber, ticket.subject, ticket.status, ticket.signatoryName]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
    const senderRaw = (ticket.employeeName || "").toLowerCase();
    const senderFmt = formatDisplayName(ticket.employeeName || "").toLowerCase();
    const senderPass = !senderKeyword || senderRaw.includes(senderKeyword) || senderFmt.includes(senderKeyword);
    return keywordPass && senderPass;
  });
}

function renderTickets() {
  const tickets = visibleTickets().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  el.ticketsTableBody.innerHTML = "";

  if (!tickets.length) {
    el.ticketsTableBody.innerHTML = `<tr><td colspan="6">No tickets found.</td></tr>`;
    return;
  }

  tickets.forEach((ticket) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ticket.ticketNumber}</td>
      <td>${escapeHtml(ticket.subject)}</td>
      <td><span class="status-badge status-${ticket.status}">${ticket.status}</span></td>
      <td>${escapeHtml(ticket.signatoryName || "-")}</td>
      <td>${ticket.attachment ? `<a href="${ticket.attachment}" download="${ticket.attachmentName || "file"}">Download</a>` : "-"}</td>
      <td></td>
    `;

    const actions = row.lastElementChild;
    actions.appendChild(makeAction("View", () => openTicketModal(ticket.id)));

    if (state.currentUser.role === "admin") {
      actions.appendChild(makeAction("Pending", () => setTicketStatus(ticket.id, "pending"), ticket.status === "pending"));
      actions.appendChild(makeAction("Queued", () => setTicketStatus(ticket.id, "queued"), ticket.status === "queued"));
      actions.appendChild(makeAction("Approved", () => setTicketStatus(ticket.id, "approved"), ticket.status === "approved"));
    }

    const canDelete = state.currentUser.role === "admin" || ticket.employeeId === state.currentUser.id;
    if (canDelete) {
      actions.appendChild(makeAction("Delete", () => deleteTicket(ticket.id)));
    }

    el.ticketsTableBody.appendChild(row);
  });
}

function makeAction(label, handler, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn tiny";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", handler);
  return button;
}

function setTicketStatus(ticketId, status) {
  const tickets = getTickets();
  const idx = tickets.findIndex((ticket) => ticket.id === ticketId);
  if (idx < 0) return;

  tickets[idx].status = status;
  tickets[idx].updatedAt = new Date().toISOString();
  setTickets(tickets);

  renderTickets();
  renderAdminLogs();
  if (state.activeTicketId === ticketId) renderTicketModal(ticketId);
  notify(`Ticket status set to ${status}.`, "success");
}

function deleteTicket(ticketId) {
  const tickets = getTickets();
  const target = tickets.find((ticket) => ticket.id === ticketId);
  if (!target) return;

  const canDelete = state.currentUser.role === "admin" || target.employeeId === state.currentUser.id;
  if (!canDelete) {
    notify("You do not have permission to delete this ticket.", "error");
    return;
  }

  const updated = tickets.filter((ticket) => ticket.id !== ticketId);
  setTickets(updated);

  if (state.activeTicketId === ticketId) {
    state.activeTicketId = null;
    el.ticketModal.close();
  }

  renderTickets();
  renderAdminLogs();
  notify(`Ticket ${target.ticketNumber} deleted.`, "success");
}

function openTicketModal(ticketId) {
  state.activeTicketId = ticketId;
  el.noteTicketId.value = ticketId;
  renderTicketModal(ticketId);
  el.ticketModal.showModal();
}

function renderTicketModal(ticketId) {
  const ticket = getTickets().find((item) => item.id === ticketId);
  if (!ticket) return;

  el.ticketDetailsContainer.innerHTML = `
    <p><strong>Ticket #:</strong> ${ticket.ticketNumber}</p>
    <p><strong>Employee:</strong> ${escapeHtml(ticket.employeeName)}</p>
    <p><strong>Employee ID:</strong> ${escapeHtml(ticket.employeeCode || "-")}</p>
    <p><strong>Department:</strong> ${escapeHtml(ticket.department)}</p>
    <p><strong>Position:</strong> ${escapeHtml(ticket.position)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
    <p><strong>Deadline:</strong> ${escapeHtml(ticket.deadline || "-")}</p>
    <p><strong>Status:</strong> <span class="status-badge status-${ticket.status}">${ticket.status}</span></p>
    <p><strong>Signatory:</strong> ${escapeHtml(ticket.signatoryName || "-")}</p>
    <p><strong>Details:</strong> ${escapeHtml(ticket.details)}</p>
    <p><strong>Main File:</strong> ${ticket.attachment ? `<a href="${ticket.attachment}" download="${ticket.attachmentName || "file"}">${escapeHtml(ticket.attachmentName || "Download")}</a>` : "None"}</p>
  `;

  el.updateTicketId.value = ticket.id;
  el.updateSubject.value = ticket.subject;
  el.updateDetails.value = ticket.details;
  el.updateDeadline.value = ticket.deadline || "";
  el.updateSignatory.value = ticket.signatoryId;

  renderNotes(ticket);
}

function updateTicketInfo() {
  const ticketId = el.updateTicketId.value;
  const tickets = getTickets();
  const idx = tickets.findIndex((ticket) => ticket.id === ticketId);
  if (idx < 0) return;

  const signatory = getUsers().find((u) => u.id === el.updateSignatory.value);

  tickets[idx].subject = el.updateSubject.value.trim();
  tickets[idx].details = el.updateDetails.value.trim();
  tickets[idx].deadline = el.updateDeadline.value;
  tickets[idx].signatoryId = signatory?.id || "";
  tickets[idx].signatoryName = signatory?.fullname || "";
  tickets[idx].updatedAt = new Date().toISOString();

  setTickets(tickets);
  renderTickets();
  renderTicketModal(ticketId);
  renderAdminLogs();
  notify("Ticket information updated.", "success");
}

function renderNotes(ticket) {
  el.notesThread.innerHTML = "";

  if (!ticket.notes.length) {
    el.notesThread.innerHTML = "<p>No notes yet.</p>";
    return;
  }

  ticket.notes.forEach((note) => {
    const item = document.createElement("article");
    item.className = "note-item";
    item.innerHTML = `
      <div class="note-meta">${escapeHtml(note.author)} | ${new Date(note.createdAt).toLocaleString()}</div>
      <div>${escapeHtml(note.text)}</div>
      ${note.attachment ? `<a href="${note.attachment}" download="${note.attachmentName || "file"}">Revised File: ${escapeHtml(note.attachmentName || "download")}</a>` : ""}
    `;
    el.notesThread.appendChild(item);
  });
}

async function addNote() {
  const ticketId = el.noteTicketId.value;
  const tickets = getTickets();
  const idx = tickets.findIndex((ticket) => ticket.id === ticketId);
  if (idx < 0) return;

  const revisedFile = el.noteAttachment.files[0] ? await fileToDataUrl(el.noteAttachment.files[0]) : "";

  tickets[idx].notes.push({
    id: crypto.randomUUID(),
    author: state.currentUser.fullname,
    text: el.noteText.value.trim(),
    attachment: revisedFile,
    attachmentName: el.noteAttachment.files[0]?.name || "",
    createdAt: new Date().toISOString()
  });

  tickets[idx].updatedAt = new Date().toISOString();
  setTickets(tickets);

  el.noteForm.reset();
  renderTicketModal(ticketId);
  notify("Note added.", "success");
}

async function submitAccomplishment() {
  const file = el.accompFile.files[0];
  if (!file) {
    notify("Please upload a file for the accomplishment report.", "error");
    return;
  }

  const reports = getAccomplishments();
  reports.push({
    id: crypto.randomUUID(),
    userId: state.currentUser.id,
    employeeCode: state.currentUser.employeeCode || "",
    employeeName: state.currentUser.fullname,
    date: el.accompDate.value,
    activity: el.accompActivity.value.trim(),
    attachment: await fileToDataUrl(file),
    attachmentName: file.name,
    status: "submitted",
    createdAt: new Date().toISOString()
  });

  setAccomplishments(reports);
  createSystemAnnouncement({
    message: `ACCOMPLISHMENT REPORT SUBMITTED: ${el.accompActivity.value.trim()} (${el.accompDate.value})`,
    attachment: reports[reports.length - 1].attachment,
    attachmentName: reports[reports.length - 1].attachmentName
  });
  el.accomplishmentForm.reset();
  fillAccomplishmentDefaults();
  renderAccomplishments();
  renderAdminLogs();
  notify("Accomplishment report submitted.", "success");
}

async function submitAnnouncement() {
  const message = el.announcementMessage.value.trim();
  const file = el.announcementFile.files[0];
  if (!message && !file) {
    notify("POST MESSAGE OR ATTACH FILE.", "error");
    return;
  }

  const items = getAnnouncements();
  items.push({
    id: crypto.randomUUID(),
    userId: state.currentUser.id,
    name: state.currentUser.fullname,
    department: state.currentUser.department,
    date: el.announcementDate.value,
    message,
    attachment: file ? await fileToDataUrl(file) : "",
    attachmentName: file?.name || "",
    createdAt: new Date().toISOString()
  });
  setAnnouncements(items);
  el.announcementForm.reset();
  fillAnnouncementDefaults();
  el.announcementModal.close();
  playNotificationSound();
  renderAnnouncements();
  notify("ANNOUNCEMENT POSTED.", "success");
}

function renderAnnouncements() {
  const keyword = state.announcementFilter || "";
  const items = getAnnouncements()
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((item) => {
      if (!keyword) return true;
      const blob = [
        item.name,
        item.department,
        item.date,
        item.message,
        item.attachmentName
      ].join(" ").toLowerCase();
      return blob.includes(keyword);
    });
  el.announcementFeed.innerHTML = "";
  if (!items.length) {
    el.announcementFeed.innerHTML = "<p>No announcement found.</p>";
    return;
  }

  items.forEach((item) => {
    const canManagePost = state.currentUser.role === "admin" || item.userId === state.currentUser.id;
    const article = document.createElement("article");
    article.className = "announcement-item";
    article.dataset.id = item.id;
    const isImage = String(item.attachmentName || "").match(/\.(png|jpe?g|gif|webp|bmp)$/i);
    const actionMenu = canManagePost ? `
      <div class="post-menu-wrap">
        <button type="button" class="post-menu-btn" data-action="toggle-post-menu" data-id="${item.id}" aria-label="Post options">...</button>
        <div class="post-menu hidden" data-post-menu="${item.id}">
          <button type="button" class="post-menu-item" data-action="edit-post" data-id="${item.id}">Edit</button>
          <button type="button" class="post-menu-item danger" data-action="delete-post" data-id="${item.id}">Delete</button>
        </div>
      </div>
    ` : "";
    article.innerHTML = `
      <div class="announcement-top">
        <div class="announcement-meta">
          <span class="announcement-author">${escapeHtml(formatDisplayName(item.name || "-"))}</span>
          <span class="announcement-dept">${escapeHtml(item.department || "-")}</span>
          <span class="announcement-date">${escapeHtml(item.date || "-")}</span>
        </div>
        ${actionMenu}
      </div>
      ${item.message ? `<div class="announcement-text">${escapeHtml(item.message)}</div>` : ""}
      ${isImage && item.attachment ? `<img class="announcement-image" src="${item.attachment}" alt="${escapeHtml(item.attachmentName || "attachment")}" />` : ""}
      ${item.attachment && !isImage ? `
        <div class="announcement-file-row">
          <span class="announcement-file-name">${escapeHtml(item.attachmentName || "file")}</span>
          <a class="announcement-file-icon" href="${item.attachment}" download="${escapeHtml(item.attachmentName || "file")}" target="_blank" rel="noopener" title="${escapeHtml(item.attachmentName || "Download")}">&#8681;</a>
        </div>` : ""}
    `;
    article.querySelectorAll("[data-action='toggle-post-menu']").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const targetId = button.getAttribute("data-id");
        const menu = article.querySelector(`[data-post-menu="${targetId}"]`);
        if (!menu) return;
        document.querySelectorAll(".post-menu").forEach((other) => {
          if (other !== menu) other.classList.add("hidden");
        });
        menu.classList.toggle("hidden");
      });
    });

    article.querySelectorAll("[data-action='edit-post']").forEach((button) => {
      button.addEventListener("click", () => editAnnouncement(button.getAttribute("data-id") || ""));
    });

    article.querySelectorAll("[data-action='delete-post']").forEach((button) => {
      button.addEventListener("click", () => deleteAnnouncement(button.getAttribute("data-id") || ""));
    });

    el.announcementFeed.appendChild(article);
  });
}

function editAnnouncement(postId) {
  const items = getAnnouncements();
  const idx = items.findIndex((item) => item.id === postId);
  if (idx < 0) return;

  const item = items[idx];
  const canManagePost = state.currentUser.role === "admin" || item.userId === state.currentUser.id;
  if (!canManagePost) {
    notify("You do not have permission to edit this post.", "error");
    return;
  }

  const currentMessage = item.message || "";
  const nextMessage = window.prompt("Edit post message:", currentMessage);
  if (nextMessage === null) return;

  items[idx].message = nextMessage.trim();
  items[idx].updatedAt = new Date().toISOString();
  setAnnouncements(items);
  renderAnnouncements();
  notify("Post updated.", "success");
}

function deleteAnnouncement(postId) {
  const items = getAnnouncements();
  const target = items.find((item) => item.id === postId);
  if (!target) return;

  const canManagePost = state.currentUser.role === "admin" || target.userId === state.currentUser.id;
  if (!canManagePost) {
    notify("You do not have permission to delete this post.", "error");
    return;
  }

  const updated = items.filter((item) => item.id !== postId);
  setAnnouncements(updated);
  renderAnnouncements();
  notify("Post deleted.", "success");
}

function createSystemAnnouncement({ message, attachment, attachmentName }) {
  const items = getAnnouncements();
  items.push({
    id: crypto.randomUUID(),
    userId: state.currentUser.id,
    name: state.currentUser.fullname,
    department: state.currentUser.department,
    date: localDateKey(new Date()),
    message,
    attachment: attachment || "",
    attachmentName: attachmentName || "",
    createdAt: new Date().toISOString()
  });
  setAnnouncements(items);
  renderAnnouncements();
}

function initializeNotificationState() {
  state.lastAnnouncementAt = getLatestAnnouncementAt(getAnnouncements());
  state.lastUnreadCount = getUnreadMessageCount(getChats(), state.currentUser?.id);
}

function handleStorageUpdate(event) {
  if (!event.key) return;

  if (event.key === STORAGE_KEYS.announcements) {
    const latestAt = getLatestAnnouncementAt(getAnnouncements());
    const hasNew = latestAt && (!state.lastAnnouncementAt || latestAt > state.lastAnnouncementAt);
    state.lastAnnouncementAt = latestAt;
    renderAnnouncements();
    if (hasNew) playNotificationSound();
    return;
  }

  if (event.key === STORAGE_KEYS.chats) {
    const chats = getChats();
    const unread = getUnreadMessageCount(chats, state.currentUser?.id);
    const hasNewUnread = unread > state.lastUnreadCount;
    state.lastUnreadCount = unread;
    renderUnreadAlert();
    renderChatThread();
    if (hasNewUnread) playNotificationSound();
  }
}

function getLatestAnnouncementAt(items) {
  if (!Array.isArray(items) || !items.length) return "";
  return items.reduce((max, item) => {
    const createdAt = item?.createdAt || "";
    return createdAt > max ? createdAt : max;
  }, "");
}

function getUnreadMessageCount(chats, userId) {
  if (!userId || !chats || typeof chats !== "object") return 0;

  let count = 0;
  Object.values(chats).forEach((messages) => {
    if (!Array.isArray(messages)) return;
    messages.forEach((message) => {
      if (message.receiverId !== userId) return;
      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (!readBy.includes(userId)) count += 1;
    });
  });
  return count;
}

function playNotificationSound() {
  const tryPlay = (index) => {
    if (index >= NOTIFY_SOUND_CANDIDATES.length) {
      playFallbackBeep();
      return;
    }

    const audio = new Audio(NOTIFY_SOUND_CANDIDATES[index]);
    audio.volume = 0.75;
    audio.play().catch(() => tryPlay(index + 1));
  };

  tryPlay(0);
}

function playFallbackBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 120);
  } catch {
    // Silent fallback if audio context is blocked.
  }
}

function renderAccomplishments() {
  const reports = getAccomplishments()
    .filter((report) => state.currentUser.role === "admin" || report.userId === state.currentUser.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  el.accomplishmentTableBody.innerHTML = "";
  if (!reports.length) {
    el.accomplishmentTableBody.innerHTML = `<tr><td colspan="4">No accomplishment report submitted.</td></tr>`;
    return;
  }

  reports.forEach((report) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(formatDisplayName(report.employeeName))}</td>
      <td>${escapeHtml(report.date)}</td>
      <td>${escapeHtml(report.activity)}</td>
      <td><a href="${report.attachment}" download="${escapeHtml(report.attachmentName || "file")}">View file</a></td>
    `;
    el.accomplishmentTableBody.appendChild(row);
  });
}

function renderAdminLogs() {
  if (state.currentUser.role !== "admin") {
    el.adminLogsSection.classList.add("hidden");
    return;
  }

  el.adminLogsSection.classList.remove("hidden");
  applyAdminTabVisibility();
  renderAdminScheduleLogs();
  renderAdminTicketLogs();
  renderAdminAccomplishmentLogs();
}

function renderAdminScheduleLogs() {
  const { department, nameKeyword } = getAdminLogFilters();
  const users = getUsers();
  const userMap = new Map(users.map((user) => [user.id, user]));
  const events = getEvents()
    .filter((event) => {
      const owner = userMap.get(event.ownerId);
      const ownerDept = owner?.department || "";
      const ownerName = formatDisplayName(event.ownerName || "");
      const deptPass = !department || ownerDept === department;
      const namePass = !nameKeyword || ownerName.toLowerCase().includes(nameKeyword);
      return deptPass && namePass;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  el.adminScheduleTableBody.innerHTML = "";

  if (!events.length) {
    el.adminScheduleTableBody.innerHTML = `<tr><td colspan="6">NO SCHEDULE LOGS YET.</td></tr>`;
    return;
  }

  events.forEach((event) => {
    const owner = userMap.get(event.ownerId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(formatDisplayName(event.ownerName || "-"))}</td>
      <td>${escapeHtml(owner?.department || "-")}</td>
      <td>${escapeHtml(event.date || "-")}</td>
      <td>${escapeHtml(event.title || "-")}</td>
      <td>${escapeHtml(event.cityAssigned || "-")}</td>
      <td>${escapeHtml(normalizeScheduleStatus(event.status))}</td>
    `;
    el.adminScheduleTableBody.appendChild(row);
  });
}

function renderAdminTicketLogs() {
  const { department, nameKeyword } = getAdminLogFilters();
  const tickets = getTickets()
    .filter((ticket) => {
      const formattedName = formatDisplayName(ticket.employeeName || "");
      const deptPass = !department || (ticket.department || "") === department;
      const namePass = !nameKeyword || formattedName.toLowerCase().includes(nameKeyword);
      return deptPass && namePass;
    })
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  el.adminTicketsTableBody.innerHTML = "";

  if (!tickets.length) {
    el.adminTicketsTableBody.innerHTML = `<tr><td colspan="6">NO TICKET LOGS YET.</td></tr>`;
    return;
  }

  tickets.forEach((ticket) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(ticket.ticketNumber || "-")}</td>
      <td>${escapeHtml(formatDisplayName(ticket.employeeName || "-"))}</td>
      <td>${escapeHtml(ticket.department || "-")}</td>
      <td>${escapeHtml(ticket.subject || "-")}</td>
      <td>${escapeHtml(ticket.status || "-")}</td>
      <td>${new Date(ticket.updatedAt).toLocaleString()}</td>
    `;
    el.adminTicketsTableBody.appendChild(row);
  });
}

function renderAdminAccomplishmentLogs() {
  const { department, nameKeyword } = getAdminLogFilters();
  const reports = getAccomplishments()
    .filter((report) => {
      const formattedName = formatDisplayName(report.employeeName || "");
      const reportDept = getUserDepartment(report.userId);
      const deptPass = !department || reportDept === department;
      const namePass = !nameKeyword || formattedName.toLowerCase().includes(nameKeyword);
      return deptPass && namePass;
    })
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const attendance = getAttendance();
  el.adminAccomplishmentTableBody.innerHTML = "";

  if (!reports.length) {
    el.adminAccomplishmentTableBody.innerHTML = `<tr><td colspan="8">NO ACCOMPLISHMENT LOGS YET.</td></tr>`;
    return;
  }

  reports.forEach((report) => {
    const matchedAttendance = attendance
      .filter((entry) => entry.userId === report.userId && localDateKey(new Date(entry.timeIn)) === report.date)
      .sort((a, b) => a.timeIn.localeCompare(b.timeIn));

    const timeIn = matchedAttendance.length ? new Date(matchedAttendance[0].timeIn).toLocaleTimeString() : "-";
    const timeOutEntries = matchedAttendance.filter((entry) => entry.timeOut);
    const timeOut = timeOutEntries.length
      ? new Date(timeOutEntries[timeOutEntries.length - 1].timeOut).toLocaleTimeString()
      : "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(formatDisplayName(report.employeeName || "-"))}</td>
      <td>${escapeHtml(getUserDepartment(report.userId) || "-")}</td>
      <td>${escapeHtml(report.activity || "-")}</td>
      <td>${escapeHtml(report.date || "-")}</td>
      <td>${escapeHtml(timeIn)}</td>
      <td>${escapeHtml(timeOut)}</td>
      <td>${escapeHtml(report.status || "submitted")}</td>
      <td><a href="${report.attachment}" download="${escapeHtml(report.attachmentName || "file")}">View file</a></td>
    `;
    el.adminAccomplishmentTableBody.appendChild(row);
  });
}

function getAdminLogFilters() {
  return {
    department: el.adminDepartmentFilter?.value || "",
    nameKeyword: (el.adminNameFilter?.value || "").trim().toLowerCase()
  };
}

function getUserDepartment(userId) {
  return getUsers().find((user) => user.id === userId)?.department || "";
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildTimeInStatusText(userId) {
  const entry = getAttendance()
    .filter((row) => row.userId === userId && !row.timeOut)
    .sort((a, b) => b.timeIn.localeCompare(a.timeIn))[0];
  if (!entry) return "Time In: N/A";
  return `Time In: ${new Date(entry.timeIn).toLocaleString()}`;
}

function postTimeInOncePerSession() {
  const session = getSession();
  if (!session?.at) return;
  const marker = `psa_timein_posted_${session.userId}_${session.at}`;
  if (sessionStorage.getItem(marker)) return;

  createSystemAnnouncement({
    message: `TIME-IN: ${formatDisplayName(state.currentUser.fullname)} (${state.currentUser.department}) logged in at ${new Date(session.at).toLocaleString()}.`,
    attachment: "",
    attachmentName: ""
  });
  sessionStorage.setItem(marker, "1");
}

function normalizeScheduleStatus(status) {
  if (status === "approved") return "Approved";
  if (status === "re-sched") return "Re-Sched";
  return "Pending";
}

function printTable(title, tbodyElement) {
  if (!tbodyElement) return;
  const table = tbodyElement.closest("table");
  if (!table) return;

  const popup = window.open("", "_blank", "width=980,height=700");
  if (!popup) {
    notify("ALLOW POPUPS TO PRINT LOGS.", "error");
    return;
  }

  popup.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h2 { margin: 0 0 12px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #555; padding: 6px; text-align: left; }
        </style>
      </head>
      <body>
        <h2>${escapeHtml(title)}</h2>
        ${table.outerHTML}
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}
