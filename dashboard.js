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
  calendarAutoFocused: false,
  editingEventId: null,
  activeTicketId: null,
  activeChatUserId: "",
  activeAdminTab: "schedule",
  announcementFilter: "",
  lastAnnouncementAt: "",
  lastUnreadCount: 0
};

const el = {
  employeeSearchInput: document.getElementById("employeeSearchInput"),
  globalSearchInput: document.getElementById("globalSearchInput"),
  welcomeText: document.getElementById("welcomeText"),
  userMeta: document.getElementById("userMeta"),
  timeInStatus: document.getElementById("timeInStatus"),
  cloudSyncStatus: document.getElementById("cloudSyncStatus"),
  openCalendarPanelBtn: document.getElementById("openCalendarPanelBtn"),
  openTicketPanelBtn: document.getElementById("openTicketPanelBtn"),
  openAccompPanelBtn: document.getElementById("openAccompPanelBtn"),
  openAdminLogsPanelBtn: document.getElementById("openAdminLogsPanelBtn"),
  calendarPanelModal: document.getElementById("calendarPanelModal"),
  openTicketEntryBtn: document.getElementById("openTicketEntryBtn"),
  ticketEntryModal: document.getElementById("ticketEntryModal"),
  openAccompEntryBtn: document.getElementById("openAccompEntryBtn"),
  accompEntryModal: document.getElementById("accompEntryModal"),
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
  ticketGroupSelect: document.getElementById("ticketGroupSelect"),
  accompGroupSelect: document.getElementById("accompGroupSelect"),
  printUserTicketsBtn: document.getElementById("printUserTicketsBtn"),
  ticketsTableBody: document.getElementById("ticketsTableBody"),
  accomplishmentForm: document.getElementById("accomplishmentForm"),
  accompName: document.getElementById("accompName"),
  accompDate: document.getElementById("accompDate"),
  accompActivity: document.getElementById("accompActivity"),
  accompFile: document.getElementById("accompFile"),
  accomplishmentTableBody: document.getElementById("accomplishmentTableBody"),
  adminGroupSelect: document.getElementById("adminGroupSelect"),
  adminStatsSummary: document.getElementById("adminStatsSummary"),
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
  eventDateLabel: document.getElementById("eventDateLabel"), // This is in eventModal, which is now in dashboard.html
  dailyScheduleContainer: document.getElementById("dailyScheduleContainer"), // This is in calendar.html
  selectedScheduleDate: document.getElementById("selectedScheduleDate"), // This is in calendar.html
  dailyScheduleTableBody: document.getElementById("dailyScheduleTableBody"), // This is in calendar.html
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
  chatSelectedFile: document.getElementById("chatSelectedFile"),
  chatCurrentAvatar: document.getElementById("chatCurrentAvatar"),
  chatCurrentName: document.getElementById("chatCurrentName"),
  chatCurrentMeta: document.getElementById("chatCurrentMeta")
};

startDashboard().catch((error) => {
  console.error("Dashboard startup error:", error);
  if (el.cloudSyncStatus) {
    el.cloudSyncStatus.textContent = "App error: reload page";
    el.cloudSyncStatus.classList.remove("online");
    el.cloudSyncStatus.classList.add("offline");
  }
  if (typeof notify === "function") {
    notify("Page startup failed. Reload the page.", "error");
  }
});

async function startDashboard() {
  // Initialize UI safely first
  highlightActiveTab();
  applyPageKindLayout();
  renderCloudSyncStatus();
  
  // Initialize UI with local data immediately
  initDashboard();

  // Ensure rendering happens on next frame to ensure DOM is ready
  requestAnimationFrame(() => {
    renderAllData();
  });

  // Attempt cloud sync and refresh UI regardless of outcome
  try {
    await Promise.race([
      bootstrapCloudState(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Cloud startup timed out.")), 9000))
    ]);
  } catch (err) {
    console.warn("Cloud bootstrap failed, continuing in local mode.", err);
  } finally {
    renderAllData();
    renderCloudSyncStatus();
  }

  startCloudPolling(() => {
    renderAllData();
  }, 2000);

  window.addEventListener("focus", () => {
    renderAllData();
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      highlightActiveTab();
      applyPageKindLayout();
      renderAllData();
    }
  });
}

function renderAllData() {
  const previousUnread = state.lastUnreadCount;
  const previousAnnouncement = state.lastAnnouncementAt;
  const refreshedUser = getCurrentUser();
  if (!refreshedUser) return;

  state.currentUser = refreshedUser;
  applyPageKindLayout(); // Ensure visibility is correct during every data refresh
  bindHeader();
  renderCalendar();
  renderCalendarView();
  renderTickets();
  renderAccomplishments();
  renderAdminLogs();
  renderAnnouncements();
  initMessenger();
  if (state.activeTicketId && el.ticketModal?.open) {
    renderTicketModal(state.activeTicketId);
  }

  const unreadNow = getUnreadMessageCount(getChats(), state.currentUser?.id, state.currentUser?.username);
  const announcementNow = getLatestAnnouncementAt(buildPublicFeedItems());
  if (unreadNow > previousUnread || (announcementNow && announcementNow > previousAnnouncement)) {
    playNotificationSound();
  }
  state.lastUnreadCount = unreadNow;
  state.lastAnnouncementAt = announcementNow;
}

function initDashboard() {
  ensureSeeds();
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Modern UI Reset: Remove background logo and set clean background
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = '#f0f2f5';

  state.currentUser = user;
  initializeNotificationState();
  bindEvents();
  bindHeader();
  postTimeInOncePerSession();
  fillTicketDefaults();
  fillAccomplishmentDefaults();
  fillAnnouncementDefaults();
  populateAdminDepartmentFilter();
  populateSignatories();
  renderAllData(); // Centralized call to load everything
}

function bindEvents() {
  window.addEventListener("storage", handleStorageUpdate);

  // Added null checks to prevent script crashes on multi-page layout
  if (el.openCalendarPanelBtn) bindPanelLauncher(el.openCalendarPanelBtn, el.calendarPanelModal, "calendar");
  if (el.openTicketPanelBtn) bindPanelLauncher(el.openTicketPanelBtn, el.ticketPanelModal, "ticket");
  if (el.openAccompPanelBtn) bindPanelLauncher(el.openAccompPanelBtn, el.accompPanelModal, "accomplishment");
  if (el.openAdminLogsPanelBtn) bindPanelLauncher(el.openAdminLogsPanelBtn, el.adminLogsPanelModal, "admin-logs");
  
  if (el.openTicketEntryBtn) {
    el.openTicketEntryBtn.addEventListener("click", () => {
      if (document.body.dataset.pageKind === "ticket") {
        el.ticketForm?.scrollIntoView({ behavior: "smooth", block: "start" });
        el.ticketSubject?.focus();
        return;
      }
      if (el.ticketEntryModal) {
        el.ticketEntryModal.showModal();
        return;
      }
      el.ticketForm?.scrollIntoView({ behavior: "smooth", block: "start" });
      el.ticketSubject?.focus();
    });
  }
  if (el.openAccompEntryBtn) {
    el.openAccompEntryBtn.addEventListener("click", () => {
      if (document.body.dataset.pageKind === "accomplishment") {
        el.accomplishmentForm?.scrollIntoView({ behavior: "smooth", block: "start" });
        el.accompActivity?.focus();
        return;
      }
      if (el.accompEntryModal) {
        el.accompEntryModal.showModal();
        return;
      }
      el.accomplishmentForm?.scrollIntoView({ behavior: "smooth", block: "start" });
      el.accompActivity?.focus();
    });
  }

  if (el.employeeSearchInput) el.employeeSearchInput.addEventListener("input", initMessenger);

  if (el.openAnnouncementModalBtn) {
    el.openAnnouncementModalBtn.addEventListener("click", () => el.announcementModal.showModal());
    el.openAnnouncementModalIconBtn.addEventListener("click", () => el.announcementModal.showModal());
    el.closeAnnouncementModalBtn.addEventListener("click", () => el.announcementModal.close());
  }

  if (el.closeMessengerBtn && el.messengerModal) el.closeMessengerBtn.addEventListener("click", () => {
    el.messengerModal.close();
  });

  if (el.logoutBtn) el.logoutBtn.addEventListener("click", async () => {
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
    try {
      await pushCloudState();
    } catch {
      // Allow logout flow to continue even when immediate push fails.
    }
    window.location.href = "login.html";
  });

  if (el.prevMonth) {
    el.prevMonth.addEventListener("click", () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      state.calendarAutoFocused = true;
      renderCalendar();
      renderCalendarView();
    });
  }

  if (el.nextMonth) {
    el.nextMonth.addEventListener("click", () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      state.calendarAutoFocused = true;
      renderCalendar();
      renderCalendarView();
    });
  }

  if (el.openCalendarViewBtn && el.calendarViewModal) {
    el.openCalendarViewBtn.addEventListener("click", () => {
      renderCalendarView();
      el.calendarViewModal.showModal();
    });
  }

  if (el.closeCalendarView && el.calendarViewModal) {
    el.closeCalendarView.addEventListener("click", () => el.calendarViewModal.close());
  }

  if (el.viewPrevMonth) {
    el.viewPrevMonth.addEventListener("click", () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      state.calendarAutoFocused = true;
      renderCalendar();
      renderCalendarView();
    });
  }

  if (el.viewNextMonth) {
    el.viewNextMonth.addEventListener("click", () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      state.calendarAutoFocused = true;
      renderCalendar();
      renderCalendarView();
    });
  }

  if (el.viewToday) {
    el.viewToday.addEventListener("click", () => {
      state.calendarDate = new Date();
      state.calendarAutoFocused = true;
      renderCalendar();
      renderCalendarView();
    });
  }

  if (el.eventForm) {
    el.eventForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveEvent();
    });
  }

  if (el.deleteEventBtn) el.deleteEventBtn.addEventListener("click", deleteEvent);
  if (el.cancelEventBtn && el.eventModal) el.cancelEventBtn.addEventListener("click", () => el.eventModal.close());

  if (el.ticketForm) {
    el.ticketForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await createTicket();
    });
  }

  if (el.accomplishmentForm) {
    el.accomplishmentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitAccomplishment();
    });
  }

  if (el.announcementForm) {
    el.announcementForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitAnnouncement();
    });
  }

  if (el.ticketSearch) el.ticketSearch.addEventListener("input", renderTickets);
  if (el.ticketSenderSearch) el.ticketSenderSearch.addEventListener("input", renderTickets);
  if (el.ticketGroupSelect) el.ticketGroupSelect.addEventListener("change", renderTickets);
  if (el.accompGroupSelect) el.accompGroupSelect.addEventListener("change", renderAccomplishments);
  if (el.adminGroupSelect) el.adminGroupSelect.addEventListener("change", renderAdminLogs);
  if (el.printUserTicketsBtn) el.printUserTicketsBtn.addEventListener("click", () => printTable("QUEUED TICKETS", el.ticketsTableBody));

  if (el.closeTicketModal && el.ticketModal) el.closeTicketModal.addEventListener("click", () => el.ticketModal.close());

  if (el.ticketUpdateForm) {
    el.ticketUpdateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateTicketInfo();
    });
  }

  if (el.noteForm) {
    el.noteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await addNote();
    });
  }

  if (el.chatEmployeeSelect) {
    el.chatEmployeeSelect.addEventListener("change", () => {
      state.activeChatUserId = el.chatEmployeeSelect.value;
      if (!state.activeChatUserId) return;
      markConversationAsRead(state.activeChatUserId);
      renderChatThread();
      renderUnreadAlert();
    });
  }

  if (el.chatForm) {
    el.chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await sendChatMessage();
    });
  }

  if (el.chatMessageInput) {
    el.chatMessageInput.addEventListener("input", autoresizeChatInput);
    el.chatMessageInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        await sendChatMessage();
      }
    });
    autoresizeChatInput();
  }

  if (el.chatFileInput && el.chatSelectedFile) {
    el.chatFileInput.addEventListener("change", () => {
      const file = el.chatFileInput.files[0];
      el.chatSelectedFile.textContent = file ? file.name : "No file selected";
    });
  }

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
  if (el.announceAvatar) el.announceAvatar.src = state.currentUser.profilePicture || DEFAULT_AVATAR;
  if (el.feedComposerAvatar) el.feedComposerAvatar.src = state.currentUser.profilePicture || DEFAULT_AVATAR;
  if (el.welcomeText) el.welcomeText.textContent = `Welcome, ${formatDisplayName(state.currentUser.fullname)}`;
  if (el.userMeta) el.userMeta.textContent = `${state.currentUser.employeeCode || "-"} | ${state.currentUser.department} | ${state.currentUser.position} | ${state.currentUser.role}`;
  if (el.timeInStatus) el.timeInStatus.textContent = buildTimeInStatusText(state.currentUser.id);
  renderCloudSyncStatus();
  if (el.openAdminLogsPanelBtn) {
    el.openAdminLogsPanelBtn.classList.toggle("hidden", state.currentUser.role !== "admin");
  }
}

function renderCloudSyncStatus() {
  if (!el.cloudSyncStatus) return;
  let stateInfo = { connected: false, attempted: false };
  try {
    stateInfo = getCloudSyncState();
  } catch {
    stateInfo = { connected: false, attempted: false };
  }
  if (!stateInfo.attempted) {
    el.cloudSyncStatus.textContent = "Cloud sync: checking...";
    el.cloudSyncStatus.classList.remove("online", "offline");
    return;
  }
  if (stateInfo.connected) {
    el.cloudSyncStatus.textContent = "Cloud sync: connected";
    el.cloudSyncStatus.classList.remove("offline");
    el.cloudSyncStatus.classList.add("online");
  } else {
    el.cloudSyncStatus.textContent = "Cloud sync: offline (local-only)";
    el.cloudSyncStatus.classList.remove("online");
    el.cloudSyncStatus.classList.add("offline");
  }
}

function fillTicketDefaults() {
  if (!el.ticketNumber || !el.ticketDepartment || !el.ticketPosition || !el.ticketDeadline) return;
  const next = getNextTicketNumber();
  el.ticketNumber.value = next;
  el.ticketDepartment.value = state.currentUser.department;
  el.ticketPosition.value = state.currentUser.position;
  el.ticketDeadline.value = "";
}

function fillAccomplishmentDefaults() {
  if (!el.accompName || !el.accompDate) return;
  el.accompName.value = formatDisplayName(state.currentUser.fullname);
  el.accompDate.value = localDateKey(new Date());
}

function fillAnnouncementDefaults() {
  if (!el.announcementName || !el.announcementDepartment || !el.announcementDate) return;
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
  applyPageKindLayout();
}

function getGroupedData(items, groupKey) {
  if (!groupKey) return { "": items };
  return items.reduce((acc, item) => {
    const val = item[groupKey] || "Unassigned";
    if (!acc[val]) acc[val] = [];
    acc[val].push(item);
    return acc;
  }, {});
}

function bindPanelLauncher(trigger, modal, panelKey) {
  if (!trigger || !modal) return;
  const pageKind = document.body.dataset.pageKind || "dashboard";
  const isAnchor = trigger.tagName === "A";
  if (isAnchor) {
    if (pageKind === panelKey) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        modal.showModal();
      });
    }
    return;
  }
  trigger.addEventListener("click", () => modal.showModal());
}

function highlightActiveTab() {
  const pageKind = document.body.dataset.pageKind || "dashboard";
  const links = document.querySelectorAll(".left-tab-btn");
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.includes(pageKind)) {
      link.classList.add("active-tab-btn");
    }
  });
}

function applyPageKindLayout() {
  const pageKind = document.body.dataset.pageKind || "dashboard";
  const isDashboard = pageKind === "dashboard";

  if (el.openAnnouncementModalBtn) {
    el.openAnnouncementModalBtn.classList.toggle("hidden", !isDashboard);
  }
  if (el.openAnnouncementModalIconBtn) {
    el.openAnnouncementModalIconBtn.classList.toggle("hidden", !isDashboard);
  }
  
  const mainFeedSection = document.querySelector(".announcement-section");
  if (mainFeedSection) {
    mainFeedSection.classList.toggle("hidden", !isDashboard);
  }

  // Content is now directly in main section for each page
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
  if (!el.employeeNameList) return;
  let users = getUniqueChatUsers(getUsers());
  const previousActiveChatUserId = state.activeChatUserId;
  const { latestUserToken, latestUnreadUserToken } = getLatestConversationMeta();
  el.employeeNameList.innerHTML = "";
  if (el.chatEmployeeSelect) {
    el.chatEmployeeSelect.innerHTML = "";
  }

  if (el.employeeSearchInput) {
    const filter = el.employeeSearchInput.value.toLowerCase();
    users = users.filter(u => u.fullname.toLowerCase().includes(filter) || (u.employeeCode || "").toLowerCase().includes(filter));
  }

  if (!users.length) {
    if (el.chatEmployeeSelect) {
      el.chatEmployeeSelect.innerHTML = `<option value="">No employee available</option>`;
      el.chatEmployeeSelect.disabled = true;
    }
    if (el.chatThread) {
      el.chatThread.innerHTML = "<p>No employee available for chat.</p>";
    }
    if (el.chatForm) {
      el.chatForm.classList.add("hidden");
    }
    renderChatRecipientSummary("");
    renderUnreadAlert();
    return;
  }

  if (el.chatEmployeeSelect) {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select employee";
    placeholder.disabled = true;
    placeholder.selected = true;
    el.chatEmployeeSelect.appendChild(placeholder);
  }

  users.forEach((user) => {
    const token = normalizeToken(user.username || user.id);
    if (el.chatEmployeeSelect) {
      const option = document.createElement("option");
      option.value = token;
      option.textContent = `${formatDisplayName(user.fullname)} [${user.employeeCode || "-"}]`;
      option.dataset.username = String(user.username || "").toLowerCase();
      option.dataset.userId = user.id;
      el.chatEmployeeSelect.appendChild(option);
    }
  });

  if (el.chatEmployeeSelect) {
    el.chatEmployeeSelect.disabled = false;
  }
  if (el.chatForm) {
    el.chatForm.classList.remove("hidden");
  }
  const defaultChatUser = users.find((user) => normalizeToken(user.username || user.id) === normalizeToken(previousActiveChatUserId))
    || users.find((user) => normalizeToken(user.username || user.id) === normalizeToken(latestUnreadUserToken))
    || users.find((user) => normalizeToken(user.username || user.id) === normalizeToken(latestUserToken))
    || users.find((user) => user.id !== state.currentUser.id)
    || users[0];
  state.activeChatUserId = normalizeToken(defaultChatUser.username || defaultChatUser.id);
  if (el.chatEmployeeSelect) {
    el.chatEmployeeSelect.value = state.activeChatUserId;
  }
  renderEmployeeNameList(users);
  if (state.activeChatUserId) markConversationAsRead(state.activeChatUserId);
  renderChatRecipientSummary(state.activeChatUserId);
  renderChatThread();
  renderUnreadAlert();
}

function renderEmployeeNameList(users) {
  if (!el.employeeNameList) return;
  el.employeeNameList.innerHTML = "";
  users.forEach((user) => {
    const token = normalizeToken(user.username || user.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "employee-name-btn";
    button.dataset.userId = user.id;
    button.dataset.userToken = token;
    button.dataset.username = String(user.username || "").toLowerCase();
    
    const isOnline = checkUserOnline(user.id);
    button.innerHTML = `
      <div class="employee-name-main">
        <span class="employee-avatar-chip"><img src="${user.profilePicture || DEFAULT_AVATAR}" alt="${escapeHtml(formatDisplayName(user.fullname || user.username || "Employee"))}" /></span>
        <div class="employee-name-copy">
          <div class="employee-name-title"><i class="status-dot ${isOnline ? 'online' : ''}"></i><span>${escapeHtml(formatDisplayName(user.fullname))}</span></div>
          <div class="employee-name-meta">${escapeHtml(user.department || "-")} | ${escapeHtml(user.position || "-")}</div>
        </div>
      </div>
      <i class="name-unread hidden">0</i>
    `;
    button.addEventListener("click", () => openMessengerForUser(token));
    el.employeeNameList.appendChild(button);
  });
}

function openMessengerForUser(userId) {
  if (!el.chatEmployeeSelect || !el.messengerModal) return;
  state.activeChatUserId = userId;
  el.chatEmployeeSelect.value = userId;
  markConversationAsRead(userId);
  renderChatRecipientSummary(userId);
  renderChatThread();
  renderUnreadAlert();
  el.messengerModal.showModal();
}

function populateSignatories() {
  if (!el.ticketSignatory || !el.updateSignatory) return;
  const users = getUsers();
  const options = users
    .map((u) => `<option value="${u.id}">${escapeHtml(u.fullname)} [${escapeHtml(u.employeeCode || "-")}] (${escapeHtml(u.position)})</option>`)
    .join("");

  el.ticketSignatory.innerHTML = `<option value="" disabled selected>Select signatory</option>${options}`;
  el.updateSignatory.innerHTML = options;
}

function normalizeToken(value) {
  return String(value || "").trim().toLowerCase();
}

function buildInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function renderChatRecipientSummary(otherUserId) {
  if (!el.chatCurrentName || !el.chatCurrentMeta || !el.chatCurrentAvatar) return;
  const otherUser = otherUserId ? findUserByToken(otherUserId) : null;

  if (!otherUser) {
    el.chatCurrentName.textContent = "Select a conversation";
    el.chatCurrentMeta.textContent = "Choose an employee from the list.";
    el.chatCurrentAvatar.innerHTML = `<span>${escapeHtml(buildInitials("PSA"))}</span>`;
    return;
  }

  const displayName = formatDisplayName(otherUser.fullname || otherUser.username || "Employee");
  el.chatCurrentName.textContent = displayName;
  el.chatCurrentMeta.textContent = `${otherUser.department || "-"} | ${checkUserOnline(otherUser.id) ? "Active now" : "Offline"}`;
  if (otherUser.profilePicture) {
    el.chatCurrentAvatar.innerHTML = `<img src="${otherUser.profilePicture}" alt="${escapeHtml(displayName)}" />`;
  } else {
    el.chatCurrentAvatar.innerHTML = `<span>${escapeHtml(buildInitials(otherUser.fullname || otherUser.username || "E"))}</span>`;
  }
}

function formatChatDayLabel(dateValue) {
  const date = new Date(dateValue);
  if (!Number.isFinite(date.getTime())) return "";
  const today = localDateKey(new Date());
  const dateKey = localDateKey(date);
  if (dateKey === today) return "Today";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateKey === localDateKey(yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function formatChatTimeLabel(dateValue) {
  const date = new Date(dateValue);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function createChatAvatar(user, className = "chat-avatar") {
  const avatar = document.createElement("div");
  avatar.className = className;
  const label = formatDisplayName(user?.fullname || user?.username || "Employee");
  if (user?.profilePicture) {
    avatar.innerHTML = `<img src="${user.profilePicture}" alt="${escapeHtml(label)}" />`;
  } else {
    avatar.textContent = buildInitials(user?.fullname || user?.username || "E");
  }
  return avatar;
}

function getConversationTokenSet(userId, fallbackUsername = "") {
  const users = getUsers();
  const set = new Set();
  const normalizedId = normalizeToken(userId);
  if (normalizedId) set.add(normalizedId);

  const user = users.find((item) => item.id === userId);
  const username = normalizeToken(fallbackUsername || user?.username);
  if (username) {
    set.add(username);
    users.forEach((item) => {
      if (normalizeToken(item.username) === username) {
        const userToken = normalizeToken(item.id);
        if (userToken) set.add(userToken);
      }
    });
  }

  return set;
}

function keyBelongsToConversation(conversationKey, myTokens, otherTokens) {
  const parts = String(conversationKey || "")
    .split("__")
    .map((part) => normalizeToken(part))
    .filter(Boolean);
  if (!parts.length) return false;
  const hasMine = parts.some((part) => myTokens.has(part));
  const hasOther = parts.some((part) => otherTokens.has(part));
  return hasMine && hasOther;
}

function isMessageBetweenUsers(message, myTokens, otherTokens) {
  const senderTokens = [
    normalizeToken(message?.senderId),
    normalizeToken(message?.senderUsername)
  ].filter(Boolean);
  const receiverTokens = [
    normalizeToken(message?.receiverId),
    normalizeToken(message?.receiverUsername)
  ].filter(Boolean);

  const mineToOther = senderTokens.some((token) => myTokens.has(token))
    && receiverTokens.some((token) => otherTokens.has(token));
  const otherToMine = senderTokens.some((token) => otherTokens.has(token))
    && receiverTokens.some((token) => myTokens.has(token));
  return mineToOther || otherToMine;
}

function mergeMessagesById(items) {
  if (!Array.isArray(items) || !items.length) return [];
  const byId = new Map();
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const key = String(item.id || "").trim() || `${item.senderId || ""}|${item.receiverId || ""}|${item.createdAt || ""}|${item.text || ""}`;
    if (!byId.has(key)) byId.set(key, item);
  });
  return Array.from(byId.values());
}

function getLatestConversationMeta() {
  if (!state.currentUser) return { latestUserToken: "", latestUnreadUserToken: "" };

  const chats = getChats();
  const currentId = normalizeToken(state.currentUser.id);
  const currentUsername = normalizeToken(state.currentUser.username);
  const latestByUser = new Map();
  const latestUnreadByUser = new Map();

  Object.values(chats).forEach((messages) => {
    if (!Array.isArray(messages)) return;
    messages.forEach((message) => {
      if (!message || typeof message !== "object") return;

      const senderId = normalizeToken(message.senderId);
      const senderUsername = normalizeToken(message.senderUsername);
      const receiverId = normalizeToken(message.receiverId);
      const receiverUsername = normalizeToken(message.receiverUsername);
      const mine = senderId === currentId || senderUsername === currentUsername;
      const forMe = receiverId === currentId || receiverUsername === currentUsername;
      let otherToken = "";

      if (mine) {
        otherToken = receiverUsername || receiverId;
      } else if (forMe) {
        otherToken = senderUsername || senderId;
      }

      if (!otherToken) return;

      const createdAt = String(message.createdAt || "");
      if (createdAt > String(latestByUser.get(otherToken) || "")) {
        latestByUser.set(otherToken, createdAt);
      }

      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (forMe && !readBy.includes(state.currentUser.id) && createdAt > String(latestUnreadByUser.get(otherToken) || "")) {
        latestUnreadByUser.set(otherToken, createdAt);
      }
    });
  });

  const latestUserToken = Array.from(latestByUser.entries())
    .sort((a, b) => String(b[1]).localeCompare(String(a[1])))[0]?.[0] || "";
  const latestUnreadUserToken = Array.from(latestUnreadByUser.entries())
    .sort((a, b) => String(b[1]).localeCompare(String(a[1])))[0]?.[0] || "";

  return { latestUserToken, latestUnreadUserToken };
}

function getUniqueChatUsers(users) {
  if (!Array.isArray(users)) return [];
  const map = new Map();
  users.forEach((user) => {
    if (!user || !user.id) return;
    if (user.id === state.currentUser?.id) return;
    const key = String(user.username || user.id).toLowerCase();
    if (!map.has(key)) map.set(key, user);
  });
  return Array.from(map.values()).sort((a, b) => formatDisplayName(a.fullname).localeCompare(formatDisplayName(b.fullname)));
}

function checkUserOnline(userId) {
  if (!userId) return false;

  const currentUser = state.currentUser;
  if (currentUser?.id === userId) return true;

  const activeSession = getSession();
  if (activeSession?.userId === userId) return true;

  const latestOpenAttendance = getAttendance()
    .filter((entry) => entry.userId === userId && !entry.timeOut)
    .sort((a, b) => String(b.timeIn || "").localeCompare(String(a.timeIn || "")))[0];

  if (!latestOpenAttendance?.timeIn) return false;

  const activeSince = new Date(latestOpenAttendance.timeIn).getTime();
  if (!Number.isFinite(activeSince)) return false;

  const twelveHours = 12 * 60 * 60 * 1000;
  return Date.now() - activeSince < twelveHours;
}

function findUserByToken(token) {
  const normalized = normalizeToken(token);
  return getUsers().find((user) => {
    const usernameToken = normalizeToken(user.username);
    const idToken = normalizeToken(user.id);
    return normalized === usernameToken || normalized === idToken;
  }) || null;
}

function getConversationMessages(otherUserId) {
  const chats = getChats();
  const otherUser = findUserByToken(otherUserId);
  const myTokens = getConversationTokenSet(state.currentUser.id, state.currentUser.username);
  const otherTokens = getConversationTokenSet(otherUser?.id || otherUserId, otherUser?.username);
  const bucket = [];

  Object.entries(chats).forEach(([conversationKey, messages]) => {
    if (!Array.isArray(messages)) return;
    if (keyBelongsToConversation(conversationKey, myTokens, otherTokens)) {
      bucket.push(...messages);
      return;
    }
    messages.forEach((message) => {
      if (isMessageBetweenUsers(message, myTokens, otherTokens)) {
        bucket.push(message);
      }
    });
  });

  const merged = mergeMessagesById(bucket);
  return merged.sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
}

function setConversationMessages(otherUserId, messages) {
  const chats = getChats();
  const otherUser = findUserByToken(otherUserId);
  const myToken = normalizeToken(state.currentUser.username || state.currentUser.id);
  const otherToken = normalizeToken(otherUser?.username || otherUser?.id || otherUserId);
  const key = [myToken, otherToken].sort().join("__");
  const myTokens = getConversationTokenSet(state.currentUser.id, state.currentUser.username);
  const otherTokens = getConversationTokenSet(otherUser?.id || otherUserId, otherUser?.username);

  chats[key] = messages;
  Object.keys(chats).forEach((conversationKey) => {
    if (conversationKey === key) return;
    if (keyBelongsToConversation(conversationKey, myTokens, otherTokens)) {
      delete chats[conversationKey];
    }
  });

  setChats(chats);
}

async function sendChatMessage() {
  const receiverId = state.activeChatUserId;
  const text = el.chatMessageInput.value.trim();
  const file = el.chatFileInput.files[0];
  if (!receiverId || (!text && !file)) return;

  const receiver = findUserByToken(receiverId);
  if (!receiver) return;
  const attachmentData = file ? await fileToDataUrl(file) : "";

  const messages = getConversationMessages(receiverId);
  messages.push({
    id: crypto.randomUUID(),
    senderId: state.currentUser.id,
    senderName: state.currentUser.fullname,
    senderUsername: state.currentUser.username,
    receiverId: receiver.id,
    receiverUsername: receiver.username,
    text,
    attachment: attachmentData,
    attachmentName: file?.name || "",
    attachmentType: file?.type || "",
    readBy: [state.currentUser.id],
    createdAt: new Date().toISOString()
  });

  setConversationMessages(receiverId, messages);
  try {
    await pushCloudState();
  } catch {
    // polling can still sync later if immediate push fails
  }
  el.chatForm.reset();
  el.chatSelectedFile.textContent = "No file selected";
  autoresizeChatInput();
  playNotificationSound();
  renderChatThread();
  renderUnreadAlert();
}

function autoresizeChatInput() {
  if (!el.chatMessageInput) return;
  el.chatMessageInput.style.height = "auto";
  const nextHeight = Math.max(44, Math.min(el.chatMessageInput.scrollHeight, 120));
  el.chatMessageInput.style.height = `${nextHeight}px`;
}

function markConversationAsRead(otherUserId) {
  const messages = getConversationMessages(otherUserId);
  let changed = false;
  const currentUsername = String(state.currentUser.username || "").toLowerCase();

  messages.forEach((message) => {
    const isForCurrentUser = message.receiverId === state.currentUser.id
      || String(message.receiverUsername || "").toLowerCase() === currentUsername;
    if (isForCurrentUser) {
      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (!readBy.includes(state.currentUser.id)) {
        readBy.push(state.currentUser.id);
        message.readBy = readBy;
        changed = true;
      }
    }
  });

  if (changed) {
    setConversationMessages(otherUserId, messages);
    scheduleCloudPush();
  }
}

function renderChatThread() {
  if (!el.chatThread) return;
  const otherUserId = state.activeChatUserId;
  renderChatRecipientSummary(otherUserId);
  if (!otherUserId) {
    el.chatThread.innerHTML = `<div class="chat-empty-state"><strong>No conversation selected</strong><span>Select an employee to start chatting.</span></div>`;
    return;
  }

  const otherUser = findUserByToken(otherUserId);
  const messages = getConversationMessages(otherUserId)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  el.chatThread.innerHTML = "";
  if (!messages.length) {
    el.chatThread.innerHTML = `<div class="chat-empty-state"><strong>No messages yet</strong><span>Send the first message to ${escapeHtml(formatDisplayName(otherUser?.fullname || otherUser?.username || "this employee"))}.</span></div>`;
    return;
  }

  let lastDayLabel = "";
  messages.forEach((message) => {
    const mine = message.senderId === state.currentUser.id
      || normalizeToken(message.senderUsername) === normalizeToken(state.currentUser.username);
    const senderUser = mine ? state.currentUser : (findUserByToken(message.senderId || message.senderUsername) || otherUser);
    const dayLabel = formatChatDayLabel(message.createdAt);
    if (dayLabel && dayLabel !== lastDayLabel) {
      const divider = document.createElement("div");
      divider.className = "chat-day-divider";
      divider.innerHTML = `<span>${escapeHtml(dayLabel)}</span>`;
      el.chatThread.appendChild(divider);
      lastDayLabel = dayLabel;
    }

    const row = document.createElement("div");
    row.className = `chat-row ${mine ? "mine" : "theirs"}`;
    if (!mine) {
      row.appendChild(createChatAvatar(senderUser, "chat-avatar"));
    }

    const item = document.createElement("article");
    item.className = `chat-message ${mine ? "mine" : "theirs"}`;
    const hasImage = String(message.attachmentType || "").startsWith("image/");
    const topRow = document.createElement("div");
    topRow.className = "chat-top-row";

    const meta = document.createElement("div");
    meta.className = "chat-meta";
    meta.textContent = mine
      ? `You • ${formatChatTimeLabel(message.createdAt)}`
      : `${formatDisplayName(message.senderName || senderUser?.fullname || "-")} • ${formatChatTimeLabel(message.createdAt)}`;
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
      link.textContent = message.attachmentName || "View file";
      item.appendChild(link);
    }

    row.appendChild(item);
    el.chatThread.appendChild(row);
  });

  el.chatThread.scrollTop = el.chatThread.scrollHeight;
  markConversationAsRead(otherUserId);
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
  const currentUsername = String(state.currentUser.username || "").toLowerCase();
  const seenIds = new Set();

  Object.values(chats).forEach((messages) => {
    if (!Array.isArray(messages)) return;
    messages.forEach((message) => {
      const msgId = String(message.id || "");
      if (msgId && seenIds.has(msgId)) return;
      if (msgId) seenIds.add(msgId);
      const isForCurrentUser = message.receiverId === state.currentUser.id
        || String(message.receiverUsername || "").toLowerCase() === currentUsername;
      if (!isForCurrentUser) return;
      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (!readBy.includes(state.currentUser.id)) {
        const senderToken = String(message.senderUsername || message.senderId || "").toLowerCase();
        counts[senderToken] = (counts[senderToken] || 0) + 1;
      }
    });
  });

  document.querySelectorAll(".employee-name-btn").forEach((button) => {
    const badge = button.querySelector(".name-unread");
    const token = String(button.dataset.userToken || button.dataset.username || button.dataset.userId || "").toLowerCase();
    const value = counts[token] || 0;
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
  if (!el.calendarGrid || !el.calendarMonth) return;
  ensureCalendarFocus();
  renderCalendarGrid(el.calendarGrid, el.calendarMonth, false);

  const scheduleDate = getPreferredScheduleDateKey();
  if (el.dailyScheduleTableBody && el.dailyScheduleContainer) {
    renderDailyScheduleTable(scheduleDate);
  }
}

function renderCalendarView() {
  if (!el.calendarViewGrid || !el.calendarViewMonth) return;
  ensureCalendarFocus();
  renderCalendarGrid(el.calendarViewGrid, el.calendarViewMonth, true);
}

function getPreferredCalendarEvent() {
  const events = getEvents().slice();
  if (!events.length) return null;
  const todayKey = localDateKey(new Date());
  const sortByRecency = (a, b) => {
    const aStamp = a.updatedAt || a.createdAt || `${a.date || ""}T00:00:00`;
    const bStamp = b.updatedAt || b.createdAt || `${b.date || ""}T00:00:00`;
    return bStamp.localeCompare(aStamp);
  };
  const upcoming = events
    .filter((event) => (event.date || "") >= todayKey)
    .sort((a, b) => {
      const byDate = (a.date || "").localeCompare(b.date || "");
      return byDate || sortByRecency(a, b);
    });
  if (upcoming.length) return upcoming[0];
  return events.sort(sortByRecency)[0] || null;
}

function ensureCalendarFocus(force = false) {
  if (state.calendarAutoFocused && !force) return;
  const preferredEvent = getPreferredCalendarEvent();
  if (!preferredEvent?.date) {
    state.calendarAutoFocused = true;
    return;
  }
  const [year, month, day] = preferredEvent.date.split("-").map(Number);
  state.calendarDate = new Date(year, (month || 1) - 1, day || 1);
  state.calendarAutoFocused = true;
}

function getPreferredScheduleDateKey() {
  const preferredEvent = getPreferredCalendarEvent();
  return preferredEvent?.date || localDateKey(new Date());
}

function renderCalendarGrid(targetGrid, targetMonthLabel, isExpandedView) {
  if (!targetGrid || !targetMonthLabel) return;
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

    const cell = document.createElement("div");
    cell.className = "cal-cell";
    if (key === todayKey) cell.classList.add("today");
    cell.innerHTML = `
      <div class="cal-cell-head">
        <div class="day-number">${day}</div>
        <button type="button" class="cal-add-btn" aria-label="Add schedule for ${key}">+</button>
      </div>
    `;

    const addBtn = cell.querySelector(".cal-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEventModal(key, null);
      });
    }

    dayEvents.slice(0, isExpandedView ? 4 : 2).forEach((event) => {
      const badge = document.createElement("div");
      badge.className = `event-badge ${event.ownerId === state.currentUser.id ? "mine" : "shared"}`;
      const statusLabel = event.status === "approved" ? "Approved" : event.status === "re-sched" ? "Re-Sched" : "Pending";
      badge.textContent = `${event.title} (${statusLabel})`;
      badge.title = `${event.title} - ${event.ownerName} - ${event.cityAssigned || "-"} - ${statusLabel}`;
      
      // Click badge to EDIT specific event
      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        openEventModal(key, event.id);
      });
      
      cell.appendChild(badge);
    });

    if (dayEvents.length > (isExpandedView ? 4 : 2)) {
      const more = document.createElement("div");
      more.className = "event-more";
      more.textContent = `+${dayEvents.length - (isExpandedView ? 4 : 2)} more`;
      cell.appendChild(more);
    }

    cell.addEventListener("mouseenter", () => renderDailyScheduleTable(key));
    targetGrid.appendChild(cell);
  }
}

function renderDailyScheduleTable(dateKey) {
  if (!el.dailyScheduleTableBody || !el.dailyScheduleContainer || !el.selectedScheduleDate) return;

  el.dailyScheduleTableBody.innerHTML = "";

  // Show date immediately for user feedback
  el.selectedScheduleDate.textContent = dateKey;

  const events = getEvents().filter(e => e.date === dateKey);
  const userMap = new Map(getUsers().map(u => [u.id, u]));
  
  if (!events.length) {
    el.dailyScheduleContainer.classList.add("hidden");
    return;
  }

  el.dailyScheduleContainer.classList.remove("hidden");

  // Group by department
  const grouped = events.reduce((acc, ev) => {
    const dept = userMap.get(ev.ownerId)?.department || "Other";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(ev);
    return acc;
  }, {});

  Object.keys(grouped).sort().forEach(dept => {
    // Department Header Row
    const headRow = document.createElement("tr");
    headRow.className = "group-header-row";
    headRow.innerHTML = `<td colspan="5">${dept.toUpperCase()}</td>`;
    el.dailyScheduleTableBody.appendChild(headRow);

    grouped[dept].forEach(ev => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(formatDisplayName(ev.ownerName))}</td>
        <td>${escapeHtml(dept)}</td>
        <td>${escapeHtml(ev.title)}</td>
        <td>${escapeHtml(ev.cityAssigned || "-")}</td>
        <td><span class="status-badge status-${ev.status}">${normalizeScheduleStatus(ev.status)}</span></td>
      `;
      el.dailyScheduleTableBody.appendChild(row);
    });
  });
}

function openEventModal(dateKey, eventId = null) {
  if (!el.eventModal) return;
  const event = eventId ? getEvents().find((e) => e.id === eventId) : null;
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
  if (!el.eventDate || !el.eventTitle || !el.eventDescription || !el.eventCity || !el.eventStatus) return;
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
    if (idx >= 0) {
      const prev = events[idx];
      events[idx] = { ...events[idx], ...payload };
      setEvents(events);
      createSystemAnnouncement({
        message: `SCHEDULE UPDATED: ${prev.title} -> ${title} on ${el.eventDate.value} (${normalizeScheduleStatus(el.eventStatus.value)})`,
        attachment: "",
        attachmentName: ""
      });
    }
    notify("Event updated.", "success");
  } else {
    events.push({ id: crypto.randomUUID(), ...payload, createdAt: new Date().toISOString() });
    setEvents(events);
    createSystemAnnouncement({
      message: `SCHEDULE ADDED: ${title} ON ${el.eventDate.value} (${normalizeScheduleStatus(el.eventStatus.value)})`,
      attachment: "",
      attachmentName: ""
    });
    notify("Event added.", "success");
  }

  if (payload.date) {
    const [year, month, day] = payload.date.split("-").map(Number);
    state.calendarDate = new Date(year, (month || 1) - 1, day || 1);
    state.calendarAutoFocused = true;
  }
  el.eventModal.close();
  state.editingEventId = null;
  renderAllData();
}

function deleteEvent() {
  if (!state.editingEventId) return;
  const filtered = getEvents().filter((event) => event.id !== state.editingEventId);
  setEvents(filtered);
  el.eventModal.close();
  state.editingEventId = null;
  renderAllData();
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
  if (el.ticketEntryModal) el.ticketEntryModal.close();
  incrementTicketCounter();
  createSystemAnnouncement({
    message: `TICKET SUBMITTED: ${ticket.ticketNumber} - ${ticket.subject}`,
    attachment,
    attachmentName: ticket.attachmentName || ""
  });

  el.ticketForm.reset();
  fillTicketDefaults();
  populateSignatories();
  renderAllData();
  notify(`Ticket ${ticket.ticketNumber} created.`, "success");
}

function visibleTickets() {
  const keyword = (el.ticketSearch?.value || "").trim().toLowerCase();
  const senderKeyword = (el.ticketSenderSearch?.value || "").trim().toLowerCase();

  return getTickets().filter((ticket) => {
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
  if (!el.ticketsTableBody) return;
  const tickets = visibleTickets().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  el.ticketsTableBody.innerHTML = "";
  const groupKey = el.ticketGroupSelect ? el.ticketGroupSelect.value : "";
  const groups = getGroupedData(tickets, groupKey);

  if (!tickets.length) {
    el.ticketsTableBody.innerHTML = `<tr><td colspan="7">No tickets found.</td></tr>`;
    return;
  }

  for (const [groupName, groupItems] of Object.entries(groups)) {
    if (groupKey && groupName) {
      const headRow = document.createElement("tr");
      headRow.className = "group-header-row";
      headRow.innerHTML = `<td colspan="7">${groupName.toUpperCase()}</td>`;
      el.ticketsTableBody.appendChild(headRow);
    }

    groupItems.forEach((ticket) => {
      const progress = computeProgress(ticket);
      const displayStatus = ticket.status === "approved" || progress === 100 ? "Completed" : ticket.status;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ticket.ticketNumber}</td>
        <td>${escapeHtml(ticket.subject)}</td>
        <td><div class="deadline-progress-wrap"><progress value="${progress}" max="100"></progress><span>${progress}%</span></div></td>
        <td><span class="status-badge status-${ticket.status}">${displayStatus}</span></td>
        <td>${escapeHtml(formatDisplayName(ticket.signatoryName || "-"))}</td>
        <td>${ticket.attachment ? `<a href="${ticket.attachment}" download="${ticket.attachmentName || "file"}">Download</a>` : "-"}</td>
        <td></td>
      `;

      const actions = row.lastElementChild;
      actions.appendChild(makeAction("👁️", () => openTicketModal(ticket.id), false, "View Details"));

      if (state.currentUser.role === "admin") {
        actions.appendChild(makeAction("🕒", () => setTicketStatus(ticket.id, "pending"), ticket.status === "pending", "Set Pending"));
        actions.appendChild(makeAction("📥", () => setTicketStatus(ticket.id, "queued"), ticket.status === "queued", "Set Queued"));
        actions.appendChild(makeAction("✅", () => setTicketStatus(ticket.id, "approved"), ticket.status === "approved", "Approve / Complete"));
      }

      const canDelete = state.currentUser.role === "admin" || ticket.employeeId === state.currentUser.id;
      if (canDelete) {
        actions.appendChild(makeAction("🗑️", () => deleteTicket(ticket.id), false, "Delete Ticket"));
      }

      el.ticketsTableBody.appendChild(row);
    });
  }
}

function makeAction(icon, handler, disabled = false, title = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn icon-action-btn";
  button.innerHTML = icon;
  button.title = title;
  button.disabled = disabled;
  button.addEventListener("click", handler);
  return button;
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

function setTicketStatus(ticketId, status) {
  const tickets = getTickets();
  const idx = tickets.findIndex((ticket) => ticket.id === ticketId);
  if (idx < 0) return;

  tickets[idx].status = status;
  tickets[idx].updatedAt = new Date().toISOString();
  setTickets(tickets);
  createSystemAnnouncement({
    message: `TICKET STATUS UPDATED: ${tickets[idx].ticketNumber} - ${tickets[idx].subject} is now ${status.toUpperCase()}`,
    attachment: "",
    attachmentName: ""
  });

  renderTickets();
  renderAdminLogs();
  if (state.activeTicketId === ticketId) renderTicketModal(ticketId);
  const msg = status === "approved" ? "Ticket marked as Completed!" : `Ticket status set to ${status}.`;
  notify(msg, "success");
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

  const displayStatus = ticket.status === "approved" ? "Completed" : ticket.status;

  el.ticketDetailsContainer.innerHTML = `
    <p><strong>Ticket #:</strong> ${ticket.ticketNumber}</p>
    <p><strong>Employee:</strong> ${escapeHtml(ticket.employeeName)}</p>
    <p><strong>Employee ID:</strong> ${escapeHtml(ticket.employeeCode || "-")}</p>
    <p><strong>Department:</strong> ${escapeHtml(ticket.department)}</p>
    <p><strong>Position:</strong> ${escapeHtml(ticket.position)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
    <p><strong>Deadline:</strong> ${escapeHtml(ticket.deadline || "-")}</p>
    <p><strong>Status:</strong> <span class="status-badge status-${ticket.status}">${displayStatus}</span></p>
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

function normalizeTicketNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((note) => note && typeof note === "object")
    .slice()
    .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
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
  createSystemAnnouncement({
    message: `TICKET UPDATED: ${tickets[idx].ticketNumber} saved changes for "${tickets[idx].subject}"`,
    attachment: "",
    attachmentName: ""
  });
  renderTickets();
  renderTicketModal(ticketId);
  renderAdminLogs();
  notify("Ticket information updated.", "success");
}

function renderNotes(ticket) {
  if (!el.notesThread) return;
  const notes = normalizeTicketNotes(ticket?.notes);
  el.notesThread.innerHTML = "";

  if (!notes.length) {
    el.notesThread.innerHTML = "<p>No notes yet.</p>";
    return;
  }

  notes.forEach((note) => {
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

  tickets[idx].notes = normalizeTicketNotes(tickets[idx].notes);
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
  if (el.accompEntryModal) el.accompEntryModal.close();
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
  renderAllData();
  notify("ANNOUNCEMENT POSTED.", "success");
}

function renderAnnouncements() {
  if (!el.announcementFeed) return;
  const keyword = state.announcementFilter || "";
  const items = buildPublicFeedItems()
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
    const isManualAnnouncement = item.sourceType === "announcement";
    const canDeletePost = state.currentUser.role === "admin" || item.userId === state.currentUser.id;
    const canEditPost = isManualAnnouncement && canDeletePost;
    const article = document.createElement("article");
    article.className = "announcement-item";
    article.dataset.id = item.id;
    const isImage = String(item.attachmentName || "").match(/\.(png|jpe?g|gif|webp|bmp)$/i);
    const actionMenu = canDeletePost ? `
      <div class="post-menu-wrap">
        <button type="button" class="post-menu-btn" data-action="toggle-post-menu" data-id="${item.id}" aria-label="Post options">...</button>
        <div class="post-menu hidden" data-post-menu="${item.id}">
          ${canEditPost ? `<button type="button" class="post-menu-item" data-action="edit-post" data-id="${item.id}">Edit</button>` : ""}
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
      button.addEventListener("click", () => deleteFeedItem(item));
    });

    el.announcementFeed.appendChild(article);
  });
}

function getSystemAnnouncementPatterns() {
  return [
    /^TICKET\s+(SUBMITTED|UPDATED|DELETED)/i,
    /^SCHEDULE\s+(ADDED|UPDATED|DELETED)/i,
    /^ACCOMPLISHMENT REPORT SUBMITTED/i,
    /^ATTENDANCE\s+\|/i,
    /^TIME-IN:/i,
    /^TIME-OUT:/i
  ];
}

function buildPublicFeedItems() {
  const LIMIT = 50;
  const allUsers = getUsers();
  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const systemAnnouncementPatterns = getSystemAnnouncementPatterns();

  const announcements = getAnnouncements()
    .filter((item) => {
      const sourceType = String(item.sourceType || "announcement").toLowerCase();
      if (sourceType === "system") return false;
      const message = String(item.message || "");
      return !systemAnnouncementPatterns.some((pattern) => pattern.test(message));
    })
    .slice(-LIMIT)
    .map((item) => ({
    ...item,
    sourceType: item.sourceType || "announcement",
    sourceId: item.sourceId || item.id
  }));

  const ticketPosts = getTickets()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, LIMIT)
    .map((ticket) => ({
    id: `ticket-${ticket.id}`,
    userId: ticket.employeeId,
    name: ticket.employeeName,
    department: ticket.department,
    date: (ticket.createdAt || "").slice(0, 10) || localDateKey(new Date()),
    message: `Ticket ${ticket.ticketNumber} | ${ticket.subject} | Status: ${ticket.status}`,
    attachment: ticket.attachment || "",
    attachmentName: ticket.attachmentName || "",
    createdAt: ticket.updatedAt || ticket.createdAt || new Date().toISOString(),
    sourceType: "ticket",
    sourceId: ticket.id
  }));

  const schedulePosts = getEvents()
    .sort((a, b) => {
      const aStamp = a.updatedAt || a.createdAt || `${a.date || ""}T00:00:00`;
      const bStamp = b.updatedAt || b.createdAt || `${b.date || ""}T00:00:00`;
      return bStamp.localeCompare(aStamp);
    })
    .slice(0, LIMIT)
    .map((event) => ({
    id: `event-${event.id}`,
    userId: event.ownerId,
    name: event.ownerName,
    department: userMap.get(event.ownerId)?.department || "",
    date: event.date || localDateKey(new Date()),
    message: `Schedule | ${event.title} | ${event.date} | ${normalizeScheduleStatus(event.status)} | ${event.cityAssigned || "-"}`,
    attachment: "",
    attachmentName: "",
    createdAt: event.updatedAt || event.createdAt || new Date().toISOString(),
    sourceType: "schedule",
    sourceId: event.id
  }));

  const accomplishmentPosts = getAccomplishments()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, LIMIT)
    .map((report) => ({
    id: `accomp-${report.id}`,
    userId: report.userId,
    name: report.employeeName,
    department: userMap.get(report.userId)?.department || "",
    date: report.date || localDateKey(new Date()),
    message: `Accomplishment | ${report.activity}`,
    attachment: report.attachment || "",
    attachmentName: report.attachmentName || "",
    createdAt: report.createdAt || new Date().toISOString(),
    sourceType: "accomplishment",
    sourceId: report.id
  }));

  const attendancePosts = getAttendance()
    .sort((a, b) => b.timeIn.localeCompare(a.timeIn))
    .slice(0, LIMIT)
    .map((entry) => ({
    id: `attendance-${entry.id}`,
    userId: entry.userId,
    name: entry.fullname,
    department: entry.department,
    date: (entry.timeIn || "").slice(0, 10) || localDateKey(new Date()),
    message: `Attendance | Time In: ${entry.timeIn ? new Date(entry.timeIn).toLocaleString() : "-"} | Time Out: ${entry.timeOut ? new Date(entry.timeOut).toLocaleString() : "-"}`,
    attachment: "",
    attachmentName: "",
    createdAt: entry.timeOut || entry.timeIn || new Date().toISOString(),
    sourceType: "attendance",
    sourceId: entry.id
  }));

  const merged = [...announcements, ...ticketPosts, ...schedulePosts, ...accomplishmentPosts, ...attendancePosts];
  const dedup = new Map();
  merged.forEach((item) => {
    const key = `${item.sourceType}|${item.sourceId || item.id}`;
    if (!dedup.has(key)) dedup.set(key, item);
  });
  return Array.from(dedup.values());
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
    sourceType: "system",
    createdAt: new Date().toISOString()
  });
  setAnnouncements(items);
  renderAnnouncements();
}

function deleteFeedItem(item) {
  if (!item || !item.sourceType) return;
  if (state.currentUser.role !== "admin" && item.userId !== state.currentUser.id) return;

  const confirmText = `Delete this ${item.sourceType} post?`;
  if (!window.confirm(confirmText)) return;

  if (item.sourceType === "announcement" || item.sourceType === "system") {
    const items = getAnnouncements().filter((row) => row.id !== item.id);
    setAnnouncements(items);
    renderAnnouncements();
    notify("Post deleted.", "success");
    return;
  }

  if (item.sourceType === "ticket") {
    const tickets = getTickets().filter((row) => row.id !== item.sourceId);
    setTickets(tickets);
    renderTickets();
    renderAdminLogs();
    renderAnnouncements();
    notify("Ticket deleted.", "success");
    return;
  }

  if (item.sourceType === "schedule") {
    const events = getEvents().filter((row) => row.id !== item.sourceId);
    setEvents(events);
    renderCalendar();
    renderCalendarView();
    renderAdminLogs();
    renderAnnouncements();
    notify("Schedule deleted.", "success");
    return;
  }

  if (item.sourceType === "accomplishment") {
    const reports = getAccomplishments().filter((row) => row.id !== item.sourceId);
    setAccomplishments(reports);
    renderAccomplishments();
    renderAdminLogs();
    renderAnnouncements();
    notify("Accomplishment report deleted.", "success");
    return;
  }

  if (item.sourceType === "attendance") {
    const attendance = getAttendance().filter((row) => row.id !== item.sourceId);
    setAttendance(attendance);
    renderAdminLogs();
    renderAnnouncements();
    notify("Attendance log deleted.", "success");
  }
}

function initializeNotificationState() {
  state.lastAnnouncementAt = getLatestAnnouncementAt(buildPublicFeedItems());
  state.lastUnreadCount = getUnreadMessageCount(getChats(), state.currentUser?.id, state.currentUser?.username);
}

function handleStorageUpdate(event) {
  if (!event.key) return;

  if (event.key === STORAGE_KEYS.tickets) {
    renderTickets();
    renderAdminLogs();
    renderAnnouncements();
    if (state.activeTicketId && el.ticketModal?.open) {
      renderTicketModal(state.activeTicketId);
    }
    return;
  }

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
    const unread = getUnreadMessageCount(chats, state.currentUser?.id, state.currentUser?.username);
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

function getUnreadMessageCount(chats, userId, username) {
  if ((!userId && !username) || !chats || typeof chats !== "object") return 0;

  const normalizedUsername = String(username || "").toLowerCase();
  const seenIds = new Set();
  let count = 0;
  Object.values(chats).forEach((messages) => {
    if (!Array.isArray(messages)) return;
    messages.forEach((message) => {
      const msgId = String(message.id || "");
      if (msgId && seenIds.has(msgId)) return;
      if (msgId) seenIds.add(msgId);
      const receiverIdMatch = userId ? message.receiverId === userId : false;
      const receiverUsernameMatch = normalizedUsername
        ? String(message.receiverUsername || "").toLowerCase() === normalizedUsername
        : false;
      if (!receiverIdMatch && !receiverUsernameMatch) return;
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
  if (!el.accomplishmentTableBody) return;
  const reports = getAccomplishments()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  el.accomplishmentTableBody.innerHTML = "";
  const groupKey = el.accompGroupSelect ? el.accompGroupSelect.value : "";
  const groups = getGroupedData(reports, groupKey);

  if (!reports.length) {
    el.accomplishmentTableBody.innerHTML = `<tr><td colspan="4">No accomplishment report submitted.</td></tr>`;
    return;
  }

  for (const [groupName, groupItems] of Object.entries(groups)) {
    if (groupKey && groupName) {
      const headRow = document.createElement("tr");
      headRow.className = "group-header-row";
      headRow.innerHTML = `<td colspan="4">${groupName.toUpperCase()}</td>`;
      el.accomplishmentTableBody.appendChild(headRow);
    }
    groupItems.forEach((report) => {
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
}

function renderAdminLogs() {
  if (!el.adminLogsSection) return;
  if (state.currentUser.role !== "admin") {
    el.adminLogsSection.classList.add("hidden");
    return;
  }

  el.adminLogsSection.classList.remove("hidden");
  applyAdminTabVisibility();
  renderAdminStats();
  renderAdminScheduleLogs();
  renderAdminTicketLogs();
  renderAdminAccomplishmentLogs();
}

function renderAdminStats() {
  if (!el.adminStatsSummary) return;
  const tickets = getTickets();
  const stats = {};
  
  DEPARTMENTS.forEach(dept => {
    stats[dept] = 0;
  });
  
  tickets.forEach(ticket => {
    const dept = ticket.department || "Other";
    stats[dept] = (stats[dept] || 0) + 1;
  });

  el.adminStatsSummary.innerHTML = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .map(([dept, count]) => `
      <div class="stat-box">
        <p>${escapeHtml(dept)}</p>
        <h3>${count}</h3>
        <span style="font-size: 0.75rem; color: var(--muted); font-weight: 600;">Total Tickets</span>
      </div>
    `).join("");
}

function renderAdminScheduleLogs() {
  if (!el.adminScheduleTableBody) return;
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

  const groupKey = el.adminGroupSelect ? el.adminGroupSelect.value : "";
  const groups = getGroupedData(events, groupKey);

  if (!events.length) {
    el.adminScheduleTableBody.innerHTML = `<tr><td colspan="6">NO SCHEDULE LOGS YET.</td></tr>`;
    return;
  }

  for (const [groupName, groupItems] of Object.entries(groups)) {
    if (groupKey && groupName) {
      const headRow = document.createElement("tr");
      headRow.className = "group-header-row";
      headRow.innerHTML = `<td colspan="6">${groupName.toUpperCase()}</td>`;
      el.adminScheduleTableBody.appendChild(headRow);
    }
    groupItems.forEach((event) => {
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
}

function renderAdminTicketLogs() {
  if (!el.adminTicketsTableBody) return;
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
  if (!el.adminAccomplishmentTableBody) return;
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
