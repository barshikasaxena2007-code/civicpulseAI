

(function () {
  "use strict";

  // --- localStorage helpers ---
  // Local persistence disabled for Live Preview/Supabase-first behavior.
  var STORAGE_KEY = "civicRequests";

  function saveToStorage() {
    // Intentionally left blank. Persistence moved to Supabase — no localStorage fallback.
    return;
  }

  function loadFromStorage() {
    // Intentionally return empty; we rely on Supabase for live reports and demo data as fallback.
    return [];
  }

  // --- Application State ---
  // Start with empty state - Supabase is the single source of truth
  const state = {
    issues: [], // Will be populated from Supabase on init
    activeInputType: "text",
    searchQuery: "",
    selectedPriority: "all",
    selectedArea: "all"
  };

  // --- DOM Element References ---
  const elements = {
    // Nav & Mobile Menu
    mobileMenuToggle: document.getElementById("mobileMenuToggle"),
    navLinksList: document.getElementById("navLinksList"),
    navLinks: document.querySelectorAll(".nav-link"),

    // Hero Buttons
    heroReportBtn: document.getElementById("heroReportBtn"),
    heroViewPrioritiesBtn: document.getElementById("heroViewPrioritiesBtn"),

    // Citizen Request Form Controls
    citizenReportForm: document.getElementById("citizenReportForm"),
    citizenName: document.getElementById("citizenName"),
    reportArea: document.getElementById("reportArea"),
    manualAreaInput: document.getElementById("customLocation"),
    customLocation: document.getElementById("customLocation"),
    reportCategory: document.getElementById("reportCategory"),
    manualCategoryInput: document.getElementById("customCategory"),
    customCategory: document.getElementById("customCategory"),
    peopleAffected: document.getElementById("peopleAffected"),
    urgencySeverity: document.getElementById("urgencySeverity"),
    reportLanguage: document.getElementById("reportLanguage"),
    reportDescription: document.getElementById("reportDescription"),
    charCount: document.getElementById("charCount"),

    // Input Tabs & Panels
    tabText: document.getElementById("tabText"),
    tabVoice: document.getElementById("tabVoice"),
    panelText: document.getElementById("panelText"),
    panelVoice: document.getElementById("panelVoice"),
    mockMicBtn: document.getElementById("voiceBtn"),
    voiceBtn: document.getElementById("voiceBtn"),
    micBtnText: document.getElementById("micBtnText"),
    voiceTranscript: document.getElementById("voiceTranscript"),
    voiceUnsupportedMsg: document.getElementById("voiceUnsupportedMsg"),
    voiceVisualizer: document.getElementById("voiceVisualizer"),
    voiceSupportContainer: document.getElementById("voiceSupportContainer"),

    // Government Dashboard KPIs & Hotspots
    kpiTotalReports: document.getElementById("kpiTotalReports"),
    kpiCitizenVsDemoCount: document.getElementById("kpiCitizenVsDemoCount"),
    kpiHighPriority: document.getElementById("kpiHighPriority"),
    kpiMostReported: document.getElementById("kpiMostReported"),
    kpiMostReportedCount: document.getElementById("kpiMostReportedCount"),
    kpiMostAffected: document.getElementById("kpiMostAffected"),
    kpiMostAffectedCount: document.getElementById("kpiMostAffectedCount"),
    hotspotsContainer: document.getElementById("hotspotsContainer"),
    distCritCount: document.getElementById("distCritCount"),
    distHighCount: document.getElementById("distHighCount"),
    distMedCount: document.getElementById("distMedCount"),
    distLowCount: document.getElementById("distLowCount"),
    barSegmentCrit: document.getElementById("barSegmentCrit"),
    barSegmentHigh: document.getElementById("barSegmentHigh"),
    barSegmentMed: document.getElementById("barSegmentMed"),
    barSegmentLow: document.getElementById("barSegmentLow"),
    countPending: document.getElementById("countPending"),
    countInProgress: document.getElementById("countInProgress"),
    countResolved: document.getElementById("countResolved"),

    // Table & Filters
    issueSearchInput: document.getElementById("issueSearchInput"),
    filterPrioritySelect: document.getElementById("filterPrioritySelect"),
    filterAreaSelect: document.getElementById("filterAreaSelect"),
    issuesTableBody: document.getElementById("issuesTableBody"),
    resultsCount: document.getElementById("resultsCount"),
    noResultsState: document.getElementById("noResultsState"),

    // Modal Dialog
    issueModal: document.getElementById("issueModal"),
    modalCloseBtn: document.getElementById("modalCloseBtn"),
    modalDismissBtn: document.getElementById("modalDismissBtn"),
    modalIssueTitle: document.getElementById("modalIssueTitle"),

    modalPriorityBadge: document.getElementById("modalPriorityBadge"),
    modalCategoryBadge: document.getElementById("modalCategoryBadge"),
    modalIdBadge: document.getElementById("modalIdBadge"),
    modalCitizenName: document.getElementById("modalCitizenName"),
    modalArea: document.getElementById("modalArea"),
    modalPeopleAffected: document.getElementById("modalPeopleAffected"),
    modalSeverity: document.getElementById("modalSeverity"),
    modalCommunitySupport: document.getElementById("modalCommunitySupport"),
    modalDescription: document.getElementById("modalDescription"),
    modalPriorityReason: document.getElementById("modalPriorityReason"),
    modalAction: document.getElementById("modalAction"),
    modalAreaContext: document.getElementById("modalAreaContext"),
    modalAreaContextContent: document.getElementById("modalAreaContextContent"),
    modalStatusSelect: document.getElementById("modalStatusSelect"),

    // Toast Notification
    toastNotification: document.getElementById("toastNotification"),
    toastTitle: document.getElementById("toastTitle"),
    toastMessage: document.getElementById("toastMessage"),
    toastCloseBtn: document.getElementById("toastCloseBtn"),
    submitReportBtn: document.getElementById("submitReportBtn")
  };

  // Log missing elements for debugging
  var missingElements = [];
  for (var key in elements) {
    if (!elements[key]) {
      missingElements.push(key);
    }
  }
  if (missingElements.length > 0) {
    console.warn('Missing DOM elements:', missingElements);
  }

  function normalizeReportText(value) {
    return (value || "").toString().trim().replace(/\s+/g, " ").toLowerCase();
  }

  function isFiniteNumber(value) {
    return value !== null && value !== '' && isFinite(Number(value));
  }

  function formatNumber(value, suffix) {
    return isFiniteNumber(value) ? Number(value).toLocaleString() + (suffix || '') : 'Not Available';
  }

  function getCanonicalAreaName(area) {
    var displayArea = (area || 'Unknown Area').toString().trim().replace(/\s+/g, ' ');
    if (window.getDevelopmentContext) {
      var context = window.getDevelopmentContext(displayArea);
      if (context && context.areaName) return context.areaName;
    }
    return displayArea;
  }

  function getReportGroupKey(report) {
    return [getCanonicalAreaName(report.area), report.category, report.description]
      .map(normalizeReportText)
      .join('|');
  }

  function groupReports(reports) {
    var grouped = new Map();

    reports.forEach(function (report) {
      var key = getReportGroupKey(report);
      var group = grouped.get(key);

      if (!group) {
        group = Object.assign({}, report, {
          area: getCanonicalAreaName(report.area),
          reportCount: 0,
          peopleAffected: 0,
          communitySupport: 0,
          hasPeopleAffected: false
        });
        grouped.set(key, group);
      }

      group.reportCount += 1;
      if (isFiniteNumber(report.peopleAffected)) {
        group.peopleAffected = Math.max(group.peopleAffected, Number(report.peopleAffected));
        group.hasPeopleAffected = true;
      }
      group.communitySupport = Math.max(
        group.communitySupport,
        isFiniteNumber(report.communitySupport) ? Number(report.communitySupport) : 1
      );
    });

    return Array.from(grouped.values()).map(function (group) {
      group.communitySupport = Math.max(group.communitySupport, group.reportCount);
      if (!group.hasPeopleAffected) group.peopleAffected = null;
      var groupPriority = calculatePriority(
        group.category,
        group.severity || "Medium",
        group.peopleAffected || 1,
        group.description || "",
        group.communitySupport
      );
      group.severity = groupPriority.verifiedSeverity;
      group.priority = groupPriority.priority;
      group.priorityReason = groupPriority.priorityReason;
      group.priorityScore = groupPriority.score;
      delete group.hasPeopleAffected;
      return group;
    });
  }

  function uniqueReportsById(reports) {
    var unique = new Map();
    reports.forEach(function (report, index) {
      var key = report.id || ('row-' + index);
      if (!unique.has(key)) unique.set(key, report);
    });
    return Array.from(unique.values());
  }

  function escapeIlikePattern(value) {
    return (value || "").toString().replace(/[\\%_]/g, "\\$&");
  }

  async function findSimilarReport(area, description) {
    const { data, error } = await window.supabaseClient
      .from('reports')
      .select('request_id, id, category, area, description, people_affected, severity, priority, priority_reason, community_support, status')
      .ilike('area', escapeIlikePattern(area))
      .ilike('description', '%' + escapeIlikePattern(description) + '%')
      .limit(1);

    if (error) throw error;
    return data && data.length ? data[0] : null;
  }

  async function upvoteReport(report) {
    var reportId = report.request_id || report.id;
    var communitySupport = (Number(report.community_support != null ? report.community_support : report.communitySupport) || 1) + 1;
    var priorityCalc = calculatePriority(
      report.category,
      report.severity || "Medium",
      Number(report.people_affected != null ? report.people_affected : report.peopleAffected) || 1,
      report.description || "",
      communitySupport
    );

    const { error } = await window.supabaseClient
      .from('reports')
      .update({
        community_support: communitySupport,
        severity: priorityCalc.verifiedSeverity,
        priority: priorityCalc.priority,
        priority_reason: priorityCalc.priorityReason
      })
      .eq(report.request_id ? 'request_id' : 'id', reportId);

    if (error) throw error;
  }

  // --- 1. Initialization ---
  // Fetch live reports from Supabase - single source of truth
  async function loadReportsFromSupabase() {
    console.log('Starting Supabase load...');
    
    // If Supabase client not present, error out instead of using demo data
    if (!window.supabaseClient) {
      console.error('Supabase client not found on window. Is the Supabase CDN blocked or missing?');
      showToast('Initialization Error', 'Supabase client missing from window.');
      state.issues = [];
      // Clear loading states on error
      if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = "Error";
      if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-up">Client Error</span>`;
      if (elements.resultsCount) elements.resultsCount.textContent = "Error loading reports";
      return;
    }

    try {
      console.log('Fetching reports from Supabase...');
      // Select recent reports; adjust column names to match your table
      const { data, error } = await window.supabaseClient
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase fetch error [RLS or Query]:', error);
        showToast('Supabase Error', error.message || 'Error fetching live reports');
        state.issues = [];
        // Clear loading states on error
        if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = "Error";
        if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-up">Error loading</span>`;
        if (elements.resultsCount) elements.resultsCount.textContent = "Error loading reports";
        return;
      }

      if (!data) {
        console.warn('No data array returned from Supabase.');
        state.issues = [];
        // Clear loading states when no data
        if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = "0";
        if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-info">0 Live Reports</span> from Supabase`;
        if (elements.resultsCount) elements.resultsCount.textContent = "No reports found";
        return;
      }

      // Map Supabase rows to application issue objects
      const liveReports = data.map(function (r, idx) {
        var peopleAffectedValue = r.people_affected != null ? r.people_affected : r.peopleAffected;
        var reportArea = getCanonicalAreaName(r.area || 'Unknown Area');
        if (window.registerAreaContext) window.registerAreaContext(reportArea);
        var recalculatedPriority = calculatePriority(
          r.category || r.category_name || 'General',
          r.severity || 'Medium',
          isFiniteNumber(peopleAffectedValue) ? Number(peopleAffectedValue) : 1,
          r.description || '',
          r.community_support != null ? r.community_support : (r.communitySupport || 1)
        );

        return {
          id: r.request_id || r.id || ('CP-REQ-SUP-' + (idx + 1)),
          citizenName: r.citizen_name || r.citizenName || 'Anonymous Citizen',
          title: r.title || (r.category ? (r.category + ' in ' + r.area) : 'Citizen Report'),
          category: r.category || r.category_name || 'General',
          area: reportArea,
          description: r.description || '',
          peopleAffected: isFiniteNumber(peopleAffectedValue) ? Number(peopleAffectedValue) : null,
          severity: recalculatedPriority.verifiedSeverity,
          priority: recalculatedPriority.priority,
          priorityReason: recalculatedPriority.priorityReason,
          priorityScore: recalculatedPriority.score,
          communitySupport: r.community_support != null ? r.community_support : (r.communitySupport || 1),
          status: r.status || 'Pending',
          suggestedAction: r.suggested_action || r.suggestedAction || 'Forwarded to ward inspection division for field assessment.',
          submittedAt: r.submitted_at || r.submittedAt || new Date().toISOString(),
        };
      });

      // Supabase is the single source of truth
      state.issues = uniqueReportsById(liveReports);
      console.info('Loaded', state.issues.length, 'unique reports from Supabase:', state.issues);
      
      if (state.issues.length === 0) {
         console.info('Supabase query returned 0 rows. No reports in database yet.');
         // Show empty state instead of loading
         if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = "0";
         if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-info">0 Live Reports</span> from Supabase`;
         if (elements.resultsCount) elements.resultsCount.textContent = "No reports found";
      } else {
        // Loading states will be cleared by updateGovernmentDashboard() and renderIssuesTable()
        console.log('Reports loaded successfully, updating UI...');
      }
    } catch (err) {
      console.error('Supabase network/fetch exception:', err);
      showToast('Network/Fetch Error', err.message || err.toString());
      state.issues = [];
    }
  }

  async function init() {
    console.log('Initializing CivicPulse AI...');
    populateDropdowns();
    setupEventListeners();
    
    // Show loading state in dashboard
    if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = "Not Available";
    if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-info">Live reports syncing...</span>`;
    if (elements.resultsCount) elements.resultsCount.textContent = "Loading reports from Supabase...";
    
    try {
      // Load live reports from Supabase (single source of truth)
      console.log('Calling loadReportsFromSupabase...');
      await loadReportsFromSupabase();
      console.log('Supabase load complete, issues count:', state.issues.length);
      
      // Rebuild area filter list based on loaded reports
      restoreCustomAreas();
      console.log('Custom areas restored');
      
      renderIssuesTable();
      console.log('Issues table rendered');
      
      updateGovernmentDashboard();
      console.log('Government dashboard updated');
    } catch (error) {
      console.error('Initialization error:', error);
      // Show error state in dashboard
      if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = "Error";
      if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-up">Failed to load</span>`;
      if (elements.resultsCount) elements.resultsCount.textContent = "Error loading reports";
      showToast('Initialization Error', 'Failed to load reports from Supabase. Please check your connection.');
    }
  }

  // Adds any custom areas from Supabase reports to the area filter dropdown
  function restoreCustomAreas() {
    state.issues.forEach(function (item) {
      if (window.registerAreaContext) window.registerAreaContext(item.area);
      var areaExists = false;
      for (var i = 0; i < elements.filterAreaSelect.options.length; i++) {
        if (elements.filterAreaSelect.options[i].value.toLowerCase() === item.area.toLowerCase()) {
          areaExists = true;
          break;
        }
      }
      if (!areaExists) {
        var opt = document.createElement("option");
        opt.value = item.area;
        opt.textContent = item.area;
        elements.filterAreaSelect.appendChild(opt);
      }
    });
  }

  // --- 2. Populate Dropdowns ---
  function populateDropdowns() {
    // Populate Areas / Wards
    INITIAL_DATA.areas.forEach(function (area) {
      // In Form
      const formOpt = document.createElement("option");
      formOpt.value = area.name;
      formOpt.textContent = area.name;
      elements.reportArea.appendChild(formOpt);

      // In Table Filter
      const filterOpt = document.createElement("option");
      filterOpt.value = area.name;
      filterOpt.textContent = area.name;
      elements.filterAreaSelect.appendChild(filterOpt);
    });

    // Add "Other - Enter Manually" option to Form Location dropdown
    const otherOpt = document.createElement("option");
    otherOpt.value = "other";
    otherOpt.textContent = "Other - Enter Manually";
    elements.reportArea.appendChild(otherOpt);

    // Populate Categories
    INITIAL_DATA.categories.forEach(function (cat) {
      const opt = document.createElement("option");
      opt.value = cat.name;
      opt.textContent = cat.icon + " " + cat.name;
      elements.reportCategory.appendChild(opt);
    });

    // Add "Other - Specify Issue" option to Form Category dropdown
    const otherCatOpt = document.createElement("option");
    otherCatOpt.value = "other";
    otherCatOpt.textContent = "Other - Specify Issue";
    elements.reportCategory.appendChild(otherCatOpt);

    // Populate Languages
    INITIAL_DATA.languages.forEach(function (lang) {
      const opt = document.createElement("option");
      opt.value = lang.code;
      opt.textContent = lang.label;
      if (lang.code === "en") opt.selected = true;
      elements.reportLanguage.appendChild(opt);
    });

    // Add event listener so changing language updates UI placeholders and voice recognition locale
    elements.reportLanguage.addEventListener('change', function (e) {
      var lang = e.target.value;
      // Update placeholder text for description and voice transcript depending on language
      var descPlaceholder = "Describe the issue clearly (e.g. 'Contaminated brownish tap water in Block 4').";
      var voicePlaceholder = "Your spoken words will appear here. You can also type manually...";
      
      if (lang === 'hi') {
        descPlaceholder = "कृपया समस्या का स्पष्ट वर्णन करें (उदा., 'ब्लॉक 4 में गंदा पानी', आदि)...";
        voicePlaceholder = "आपके बोले गए शब्द यहां दिखाई देंगे (या आप मैन्युअल रूप से टाइप कर सकते हैं)...";
      } else if (lang === 'bn') {
        descPlaceholder = "সমস্যাটি স্পষ্টভাবে বর্ণনা করুন (যেমন 'ব্লক 4-এ দূষিত বাদামী ট্যাপ জল')...";
        voicePlaceholder = "আপনার কথা বলা শব্দগুলি এখানে প্রদর্শিত হবে (আপনি ম্যানুয়ালি টাইপ করতে পারেন)...";
      } else if (lang === 'ta') {
        descPlaceholder = "பிரச்சனையை தெளிவாக விவரிக்கவும் (எ.கா 'தொகுதி 4-ல் மாசுபட்ட பழுப்பு நீர்')...";
        voicePlaceholder = "உங்கள் பேச்சு சொற்கள் இங்கே தோன்றும் (நீங்கள் கைமுறையாக தட்டச்சு செய்யலாம்)...";
      } else if (lang === 'mr') {
        descPlaceholder = "समस्येचे स्पष्ट वर्णन करा (उदा. 'ब्लॉक 4 मध्ये दूषित तपकिरी पाणी')...";
        voicePlaceholder = "तुमचे बोललेले शब्द येथे दिसतील (तुम्ही हाताने टाइप करू शकता)...";
      } else if (lang === 'es') {
        descPlaceholder = "Describa el problema claramente (ej. 'Agua del grifo marrón contaminada en el Bloque 4')...";
        voicePlaceholder = "Sus palabras habladas aparecerán aquí (también puede escribir manualmente)...";
      }
      
      elements.reportDescription.placeholder = descPlaceholder;
      elements.voiceTranscript.placeholder = voicePlaceholder;

      // If recognition exists, update its language mapping (affects next recording)
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        try {
          // Use the comprehensive language mapping function
          var locale = mapLangCodeToSpeechLocale(lang);
          if (typeof recognition !== 'undefined' && recognition) recognition.lang = locale;
        } catch (e) { /* ignore */ }
      }
    });
  }

  // --- 3. Event Listeners ---
  
  // Language mapping function for speech recognition (accessible globally within the module)
  function mapLangCodeToSpeechLocale(code) {
    if (!code) return 'en-IN';
    // Map language codes to speech recognition locale codes
    if (code === 'en') return 'en-IN';
    if (code === 'hi') return 'hi-IN';
    if (code === 'bn') return 'bn-IN';
    if (code === 'ta') return 'ta-IN';
    if (code === 'mr') return 'mr-IN';
    if (code === 'es') return 'es-ES';
    // default fallback
    return code + '-' + code.toUpperCase();
  }
  
  function setupEventListeners() {
    // Mobile navigation toggle
    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.addEventListener("click", function () {
        const isOpen = elements.navLinksList.classList.toggle("open");
        elements.mobileMenuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    // Close mobile nav when link is clicked
    elements.navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        elements.navLinksList.classList.remove("open");
        if (elements.mobileMenuToggle) {
          elements.mobileMenuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Location / Area dropdown change listener (conditional render for custom location input)
    if (elements.reportArea) {
      elements.reportArea.addEventListener("change", function () {
        var targetInput = elements.customLocation || elements.manualAreaInput;
        if (targetInput) {
          if (elements.reportArea.value.toLowerCase() === "other") {
            targetInput.style.display = "block";
            targetInput.setAttribute("required", "required");
            targetInput.focus();
          } else {
            targetInput.style.display = "none";
            targetInput.removeAttribute("required");
            targetInput.value = "";
          }
        }
      });
    }

    // Issue Category dropdown change listener (conditional render for custom category input)
    if (elements.reportCategory) {
      elements.reportCategory.addEventListener("change", function () {
        var targetInput = elements.customCategory || elements.manualCategoryInput;
        if (targetInput) {
          if (elements.reportCategory.value.toLowerCase() === "other") {
            targetInput.style.display = "block";
            targetInput.setAttribute("required", "required");
            targetInput.focus();
          } else {
            targetInput.style.display = "none";
            targetInput.removeAttribute("required");
            targetInput.value = "";
          }
        }
      });
    }

    // Multimodal input tabs
    elements.tabText.addEventListener("click", function () { switchInputType("text"); });
    elements.tabVoice.addEventListener("click", function () { switchInputType("voice"); });

    // Character counter for description
    elements.reportDescription.addEventListener("input", function () {
      elements.charCount.textContent = elements.reportDescription.value.length;
    });

    // Live Voice Note logic
    let isRecording = false;
    let recognition = null;
    
    // Check support
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      // Initialize recognition language based on selected report language
      recognition.lang = mapLangCodeToSpeechLocale(elements.reportLanguage.value || 'en');
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = function() {
        isRecording = true;
        elements.mockMicBtn.style.background = "#d9534f";
        elements.micBtnText.textContent = "Stop Listening";
        elements.voiceVisualizer.style.display = "flex";
        document.querySelectorAll(".voice-bar").forEach(function (bar) {
          bar.style.animation = "pulseBar 0.4s infinite alternate";
        });
      };

      recognition.onresult = function(event) {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        elements.voiceTranscript.value = transcript;
        elements.charCount.textContent = transcript.length; // optional if user cares
      };

      recognition.onend = function() {
        isRecording = false;
        elements.mockMicBtn.style.background = "#1e3a8a";
        elements.micBtnText.textContent = "Click to Speak";
        elements.voiceVisualizer.style.display = "none";
        document.querySelectorAll(".voice-bar").forEach(function (bar) {
          bar.style.animation = "none";
        });
      };

      recognition.onerror = function(event) {
        console.error("SpeechRecognition onerror:", event);
        var errName = (event && event.error) ? event.error : "unknown";
        var friendly;

        switch (errName) {
          case "network":
            friendly = "Network error: speech service unreachable. Check your internet connection or network/firewall settings.";
            break;
          case "not-allowed":
          case "permission-denied":
            friendly = "Microphone permission denied. Allow microphone access in the browser site settings and try again.";
            break;
          case "service-not-allowed":
            friendly = "Speech service not allowed by this browser or environment.";
            break;
          case "no-speech":
            friendly = "No speech detected. Try speaking louder or ensure your microphone is not muted.";
            break;
          case "audio-capture":
            friendly = "Microphone not available or already in use by another application.";
            break;
          default:
            friendly = "Voice recording failed (" + errName + "). Try again or use the text input as a fallback.";
        }

        showToast("Voice Error", friendly);

        // Stop recognition cleanly if still running
        if (isRecording && recognition && typeof recognition.stop === "function") {
          try { recognition.stop(); } catch (e) { console.warn("Error stopping recognition", e); }
        }

        // On network/permission/service errors, fall back to text input to let the user continue
        if (errName === "network" || errName === "not-allowed" || errName === "service-not-allowed") {
          switchInputType("text");
        }
      };

      if (elements.mockMicBtn) {
        elements.mockMicBtn.addEventListener("click", function () {
        if (!isRecording) {
          elements.voiceTranscript.value = "";
          // Ensure recognition.lang matches current selected language at the time of start
          try {
            recognition.lang = mapLangCodeToSpeechLocale(elements.reportLanguage.value || 'en');
          } catch (e) { /* ignore */ }
          recognition.start();
        } else {
          recognition.stop();
        }
        });
      }
    } else {
      // Not supported
      if (elements.voiceUnsupportedMsg) elements.voiceUnsupportedMsg.style.display = "block";
      if (elements.mockMicBtn) elements.mockMicBtn.style.display = "none";
    }

    // Mock Photo Dropzone Click
    if (elements.mockDropzone) {
      elements.mockDropzone.addEventListener("click", function (e) {
        if (e.target.tagName !== "INPUT") {
          showToast("Photo Preview", "Photo dropzone selected. Multimodal Vision verification planned for Phase 2.");
        }
      });
    }

    // Form Submission
    elements.citizenReportForm.addEventListener("submit", handleRequestSubmit);

    // Filters and Search
    elements.issueSearchInput.addEventListener("input", function (e) {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderIssuesTable();
    });



    elements.filterPrioritySelect.addEventListener("change", function (e) {
      state.selectedPriority = e.target.value;
      renderIssuesTable();
    });

    elements.filterAreaSelect.addEventListener("change", function (e) {
      state.selectedArea = e.target.value;
      renderIssuesTable();
    });

    // Modal Close
    elements.modalCloseBtn.addEventListener("click", closeModal);
    elements.modalDismissBtn.addEventListener("click", closeModal);
    elements.issueModal.addEventListener("click", function (e) {
      if (e.target === elements.issueModal) closeModal();
    });

    // Admin Panel Status Change
    elements.modalStatusSelect.addEventListener("change", async function(e) {
      if (!currentModalIssueId) return;
      var newStatus = e.target.value;
      
      // Update status in Supabase
      try {
        const { error: updateError } = await window.supabaseClient
          .from('reports')
          .update({ status: newStatus })
          .eq('request_id', currentModalIssueId);
        
        if (updateError) throw updateError;
        
        // Reload from Supabase to ensure single source of truth
        await loadReportsFromSupabase();
        
        // Update UI with fresh data
        renderIssuesTable();
        updateGovernmentDashboard();
        showToast("Status Updated", "Report #" + currentModalIssueId + " is now " + newStatus + ".");
      } catch (err) {
        console.error("Error updating status in Supabase:", err);
        alert("Error updating status: " + err.message);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && elements.issueModal.classList.contains("open")) {
        closeModal();
      }
    });

    // Toast Close
    elements.toastCloseBtn.addEventListener("click", function () {
      elements.toastNotification.classList.remove("show");
    });
  }

  // --- 4. Switch Input Type (Text / Voice) ---
  function switchInputType(type) {
    state.activeInputType = type;

    const tabs = [
      { type: "text", btn: elements.tabText, panel: elements.panelText },
      { type: "voice", btn: elements.tabVoice, panel: elements.panelVoice }
    ];

    tabs.forEach(function (tab) {
      const isCurrent = tab.type === type;
      tab.btn.classList.toggle("active", isCurrent);
      tab.btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
      tab.panel.classList.toggle("active", isCurrent);
    });

    if (type === "text") {
      elements.reportDescription.setAttribute("required", "required");
    } else {
      elements.reportDescription.removeAttribute("required");
    }
  }

  // --- 5. Rule-Based Priority Assessment ---
  /**
  * Rule-based priority assessment based on:
   * 1. Base score from People Affected (1-50: 20pts, 51-200: 50pts, 201+: 80pts)
  * 2. User-selected urgency, validated against explicit danger or health-risk evidence
   * 3. AI Keyword check in description (+20 positive, -10 negative)
   * 4. Community Support count (1: +0, 2-3: +10, 4-5: +20, 6+: +30)
  * Final thresholds: 0-40=Low, 41-70=Medium, 71-85=High, 86-100=Critical.
  * Critical is capped at High unless the description contains critical evidence.
   *
   * Returns { priority: 'Critical'|'High'|'Medium'|'Low', priorityReason: string, score: number }
   */
  function calculatePriority(category, severity, peopleAffected, description, communitySupport) {
    var score = 0;
    var reasonParts = [];
    var desc = (description || "").toLowerCase();
    var criticalIndicators = ["immediate danger", "life threatening", "life-threatening", "injury", "accident", "contaminated", "drinking water", "disease", "sewage", "fire", "unsafe", "health risk", "emergency"];
    var hasCriticalIndicator = criticalIndicators.some(function (indicator) {
      return desc.includes(indicator);
    });
    var validatedSeverity = severity;
    var verificationStatus = "Rule-based assessment";

    if (severity === "Critical" && !hasCriticalIndicator) {
      validatedSeverity = "High";
      verificationStatus = "Needs verification";
      reasonParts.push("Critical claim lacks explicit danger or health-risk evidence; assessed as High");
    }

    // 1. Base score from people affected
    if (peopleAffected >= 201) {
      score += 80;
      reasonParts.push("201+ people (80 pts)");
    } else if (peopleAffected >= 51) {
      score += 50;
      reasonParts.push("51-200 people (50 pts)");
    } else {
      score += 20;
      reasonParts.push("1-50 people (20 pts)");
    }

    // 2. Urgency score with fake-Critical prevention
    var urgencyPts;
    if (validatedSeverity === "Critical") {
      if (peopleAffected < 20) {
        urgencyPts = 15;
        reasonParts.push("Critical urgency (15 pts, low population cap)");
      } else {
        urgencyPts = 40;
        reasonParts.push("Critical urgency (40 pts)");
      }
    } else if (validatedSeverity === "High") {
      urgencyPts = 30;
      reasonParts.push("High urgency (30 pts)");
    } else if (validatedSeverity === "Medium") {
      urgencyPts = 20;
      reasonParts.push("Medium urgency (20 pts)");
    } else {
      urgencyPts = 10;
      reasonParts.push("Low urgency (10 pts)");
    }
    score += urgencyPts;

    // 3. AI Keyword check in description
    var positiveKeywords = ["hospital", "school", "children", "drinking water", "disease", "sewage", "accident", "blocked"];
    var negativeKeywords = ["dustbin", "small pothole", "light flicker"];
    var keywordBonus = 0;
    var posFound = false;
    var negFound = false;
    positiveKeywords.forEach(function (kw) {
      if (desc.includes(kw)) { posFound = true; }
    });
    negativeKeywords.forEach(function (kw) {
      if (desc.includes(kw)) { negFound = true; }
    });
    if (posFound) { keywordBonus += 20; }
    if (negFound) { keywordBonus -= 10; }
    if (keywordBonus > 0) reasonParts.push("High-impact keywords detected (+" + keywordBonus + " pts)");
    else if (keywordBonus < 0) reasonParts.push("Low-impact keywords detected (" + keywordBonus + " pts)");
    score += keywordBonus;

    // 4. Community Support score
    if (communitySupport >= 6) {
      score += 30;
      reasonParts.push("6+ community supports (30 pts)");
    } else if (communitySupport >= 4) {
      score += 20;
      reasonParts.push("4-5 community supports (20 pts)");
    } else if (communitySupport >= 2) {
      score += 10;
      reasonParts.push("2-3 community supports (10 pts)");
    }

    var scoreCap = hasCriticalIndicator ? 100 : 85;
    if (score > scoreCap) {
      score = scoreCap;
      reasonParts.push("Score capped at " + scoreCap + " until critical evidence is present");
    }

    var priority;
    if (score >= 86 && hasCriticalIndicator) priority = "Critical";
    else if (score >= 71) priority = "High";
    else if (score >= 41) priority = "Medium";
    else priority = "Low";

    var priorityReason = priority + " priority (" + score + "/100): " + reasonParts.join(", ") + ". Rule-Based Priority Assessment. " + verificationStatus + ".";

    return {
      priority: priority,
      priorityReason: priorityReason,
      score: score,
      verifiedSeverity: validatedSeverity,
      verificationStatus: verificationStatus
    };
  }

  // --- 6. Form Submission Handler ---
   async function handleRequestSubmit(e) {
    e.preventDefault();
    if (state.submitLocked) return;

    const citizenNameInput = elements.citizenName ? elements.citizenName.value.trim() : "";
    let finalArea = "";
    const areaVal = elements.reportArea.value;
    const isAreaOther = areaVal && areaVal.toLowerCase() === "other";

    if (isAreaOther) {
      const targetInput = elements.customLocation || elements.manualAreaInput;
      finalArea = targetInput.value.trim();
      if (!finalArea) {
        alert("Please enter your custom Location / Area.");
        targetInput.focus();
        return;
      }
    } else {
      finalArea = areaVal;
      if (!finalArea) {
        alert("Please select a Location / Area.");
        elements.reportArea.focus();
        return;
      }
    }

    // Fix 1: Auto-space after comma in location (e.g. "Gomti Nagar,Lucknow" -> "Gomti Nagar, Lucknow")
    finalArea = finalArea.replace(/,\s*/g, ", ").trim();

    let finalCategory = "";
    const catVal = elements.reportCategory.value;
    const isCatOther = catVal && catVal.toLowerCase() === "other";

    if (isCatOther) {
      const targetInput = elements.customCategory || elements.manualCategoryInput;
      finalCategory = targetInput.value.trim();
      if (!finalCategory) {
        alert("Please specify your custom issue category.");
        targetInput.focus();
        return;
      }
    } else {
      finalCategory = catVal;
      if (!finalCategory) {
        alert("Please select an Issue Category.");
        elements.reportCategory.focus();
        return;
      }
    }

    // Fix 2: Title Case for category (e.g. "noise pollution" → "Noise Pollution")
    finalCategory = finalCategory.replace(/\w\S*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const peopleAffectedInput = parseInt(elements.peopleAffected.value, 10);
    const severity = elements.urgencySeverity.value;

    if (isNaN(peopleAffectedInput) || peopleAffectedInput < 1) {
      alert("Please enter a valid number of people affected (minimum 1).");
      elements.peopleAffected.focus();
      return;
    }

    if (!severity) {
      alert("Please select an Urgency / Severity level.");
      elements.urgencySeverity.focus();
      return;
    }

    // Determine problem description based on active input mode
    let descriptionText = "";
    if (state.activeInputType === "text") {
      descriptionText = elements.reportDescription.value.trim();
      if (!descriptionText) {
        alert("Please describe the problem.");
        elements.reportDescription.focus();
        return;
      }
    } else if (state.activeInputType === "voice") {
      const voiceNotes = elements.voiceTranscript.value.trim();
      if (!voiceNotes) {
        alert("Please speak or type a voice transcript.");
        elements.voiceTranscript.focus();
        return;
      }
      descriptionText = `[Voice Note]: ${voiceNotes}`;
    }

    // Fix 3: Trim extra internal spaces/tabs/newlines down to a single space
    descriptionText = descriptionText.replace(/\s+/g, " ").trim();

    // Calculate rule-based priority (new reports start with communitySupport: 1)
    const priorityCalc = calculatePriority(finalCategory, severity, peopleAffectedInput, descriptionText, 1);

    // Generate unique Citizen Request ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const requestId = "CP-REQ-" + randomNum;

    // Build new citizen request object
    const newRequest = {
      id: requestId,
      citizenName: citizenNameInput || "Anonymous Citizen",
      title: `${finalCategory} in ${finalArea.split(" - ")[0]}`,
      category: finalCategory,
      area: finalArea,
      description: descriptionText,
      peopleAffected: peopleAffectedInput,
      severity: priorityCalc.verifiedSeverity,
      priority: priorityCalc.priority,
      priorityReason: priorityCalc.priorityReason,
      priorityScore: priorityCalc.score,
      communitySupport: 1,               // every unique report starts at 1
      status: "Pending",
      suggestedAction: "Forwarded to ward inspection division for immediate field assessment.",
      submittedAt: new Date().toISOString()
    };

    state.submitLocked = true;
    if (elements.submitReportBtn) {
      elements.submitReportBtn.disabled = true;
      elements.submitReportBtn.setAttribute("aria-disabled", "true");
    }
    setTimeout(function () {
      state.submitLocked = false;
      if (elements.submitReportBtn) {
        elements.submitReportBtn.disabled = false;
        elements.submitReportBtn.removeAttribute("aria-disabled");
      }
    }, 3000);

    // Check for an existing report before inserting a second row.
    try {
      const similarReport = await findSimilarReport(finalArea, descriptionText);
      if (similarReport) {
        await upvoteReport(similarReport);
        await loadReportsFromSupabase();
        renderIssuesTable();
        updateGovernmentDashboard();
        showToast("Similar Report Found", "Similar report already exists in this area. Existing report upvoted.");
        return;
      }
    } catch (err) {
      console.error("Error checking for similar report:", err);
      alert("Unable to check for similar reports: " + err.message);
      return;
    }

    // --- SUPABASE SAVE START ---
  console.log('Saving to Supabase:', newRequest);
  try {
    const { data, error } = await window.supabaseClient
      .from('reports')
      .insert([{
        request_id: newRequest.id,
        citizen_name: newRequest.citizenName,
        title: newRequest.title,
        category: newRequest.category,
        area: newRequest.area,
        description: newRequest.description,
        people_affected: newRequest.peopleAffected,
        severity: newRequest.severity,
        priority: newRequest.priority,
        priority_reason: newRequest.priorityReason,
        community_support: newRequest.communitySupport,
        status: 'Pending'
      }]);
    if (error) {
      // A database unique constraint is the final protection against concurrent duplicate submits.
      if (error.code === "23505") {
        try {
          const similarReport = await findSimilarReport(finalArea, descriptionText);
          if (similarReport) {
            await upvoteReport(similarReport);
            await loadReportsFromSupabase();
            renderIssuesTable();
            updateGovernmentDashboard();
            showToast("Similar Report Found", "Similar report already exists in this area. Existing report upvoted.");
            return;
          }
        } catch (duplicateError) {
          console.error("Error handling duplicate report constraint:", duplicateError);
        }
      }
      throw error;
    }
    console.log("Saved to Supabase successfully!", data);
  } catch (err) {
    console.error("Supabase error:", err);
    alert("Supabase error: " + err.message);
    return;
  }
  // --- SUPABASE SAVE END ---

  console.log('Reloading from Supabase after save...');
  // Reload from Supabase to ensure single source of truth
  await loadReportsFromSupabase();
  console.log('Reload complete, updating UI...');

    // If finalArea is a custom area, dynamically add it to filterAreaSelect so it can be filtered
    let areaExistsInFilter = false;
    for (let i = 0; i < elements.filterAreaSelect.options.length; i++) {
      if (elements.filterAreaSelect.options[i].value.toLowerCase() === finalArea.toLowerCase()) {
        areaExistsInFilter = true;
        break;
      }
    }
    if (!areaExistsInFilter) {
      const newFilterOpt = document.createElement("option");
      newFilterOpt.value = finalArea;
      newFilterOpt.textContent = finalArea;
      elements.filterAreaSelect.appendChild(newFilterOpt);
    }

    // After Supabase reload, update UI with fresh data
    renderIssuesTable();
    updateGovernmentDashboard();

    // Reset Form
    elements.citizenReportForm.reset();
    elements.charCount.textContent = "0";
    elements.manualAreaInput.style.display = "none";
    elements.manualAreaInput.removeAttribute("required");
    elements.manualAreaInput.value = "";
    elements.manualCategoryInput.style.display = "none";
    elements.manualCategoryInput.removeAttribute("required");
    elements.manualCategoryInput.value = "";
    elements.voiceTranscript.value = "";
    switchInputType("text");

    // Display Toast with Request ID
    showToast(
      "Citizen Request Submitted!",
      `Assigned ID: ${requestId}. Priority calculated as ${priorityCalc.priority}. Added directly to dashboard.`
    );

    // Smooth scroll to the Priority Issues Dashboard
    const issuesSection = document.getElementById("issues-list");
    if (issuesSection) {
      setTimeout(function () {
        issuesSection.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
  }

  // --- 7. Render Priority Issues Table ---
  function renderIssuesTable() {
    console.log('renderIssuesTable called, issues count:', state.issues.length);
    const tbody = elements.issuesTableBody;
    if (!tbody) {
      console.error('issuesTableBody element not found!');
      return;
    }
    tbody.innerHTML = "";

    // Filter requests, then group identical issues into one rendered row.
    const filtered = groupReports(state.issues.filter(function (item) {
      // 1. Priority Filter
      if (state.selectedPriority !== "all" && item.priority !== state.selectedPriority) return false;

      // 2. Area Filter
      if (state.selectedArea !== "all" && item.area !== state.selectedArea) return false;

      // 3. Search Filter
      if (state.searchQuery) {
        const q = state.searchQuery;
        const matches = (item.title && item.title.toLowerCase().includes(q)) ||
                        (item.description && item.description.toLowerCase().includes(q)) ||
                        (item.area && item.area.toLowerCase().includes(q)) ||
                        (item.category && item.category.toLowerCase().includes(q)) ||
                        (item.id && item.id.toLowerCase().includes(q)) ||
                        (item.citizenName && item.citizenName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }));

    // Rank by priority score first, then affected people for ties.
    filtered.sort(function (a, b) {
      return b.priorityScore - a.priorityScore || b.peopleAffected - a.peopleAffected;
    });

    if (elements.resultsCount) {
      elements.resultsCount.textContent = `Showing ${filtered.length} ranked community ${filtered.length === 1 ? 'request' : 'requests'}`;
    }

    if (filtered.length === 0) {
      elements.noResultsState.style.display = "block";
    } else {
      elements.noResultsState.style.display = "none";

      filtered.forEach(function (req, index) {
        const tr = document.createElement("tr");

        // Priority Badge Class
        var pClass;
        if (req.priority === "Critical") pClass = "badge-priority-critical";
        else if (req.priority === "High") pClass = "badge-priority-high";
        else if (req.priority === "Medium") pClass = "badge-priority-medium";
        else pClass = "badge-priority-low";

        // Status Text
        var statusColor = "#6b7280"; // gray for Pending
        var s = req.status || "Pending";
        if (s === "In Progress") statusColor = "#2563eb";
        else if (s === "Resolved") statusColor = "#16a34a";
        const statusHtml = `<div style="margin-top: 6px; font-size: 12px; font-weight: 600; color: ${statusColor};">STATUS: ${escapeHtml(s.toUpperCase())}</div>`;

        tr.innerHTML = `
          <td>
            <strong>#${index + 1}</strong>
          </td>
          <td style="max-width: 280px;">
            <div class="issue-main-title">${escapeHtml(req.title)}</div>
            <div style="font-size: 13px; color: #555555; margin-bottom: 4px;">${escapeHtml(truncateString(req.description, 80))}</div>
            ${req.reportCount > 1 ? `<div style="font-size: 12px; color: #1e3a8a; margin-bottom: 4px;">${req.reportCount} reports for same issue in ${escapeHtml(req.area)}</div>` : ""}
            <div class="issue-meta-id">${escapeHtml(req.id)} &bull; By: ${escapeHtml(req.citizenName || 'Anonymous')}</div>
          </td>
          <td>
            <span style="font-weight: bold; color: #333333;">${escapeHtml(req.area)}</span>
          </td>
          <td>
            <span style="font-size: 13px; color: #555555;">${escapeHtml(req.category)}</span>
          </td>
          <td style="text-align: center;">
            <span class="reports-count-pill">
              👥 ${formatNumber(req.peopleAffected)}
            </span>
          </td>
          <td>
            <span class="badge-priority ${pClass}">● ${escapeHtml(req.priority)}</span>
            <span class="ai-verify-info" title="Rule-Based Priority Assessment - Based on People Affected, Urgency, Keywords &amp; Community Support">ℹ️</span>
            <div style="font-size: 11px; color: #555555; margin-top: 4px;">🤝 Community Support: ${req.communitySupport || 1}</div>
          </td>
          <td style="font-size: 13px; color: #444444; max-width: 220px;">
            ${escapeHtml(req.priorityReason || 'Calculated via rule-based priority assessment.')}
          </td>
          <td>
            ${statusHtml}
          </td>
          <td style="text-align: right;">
            <button type="button" class="action-btn" data-req-id="${escapeHtml(req.id)}">
              View Details &rarr;
            </button>
          </td>
        `;

        const btn = tr.querySelector(".action-btn");
        btn.addEventListener("click", function () {
          openModal(req);
        });

        tbody.appendChild(tr);
      });
    }
  }

  // --- 8. Update Government Dashboard & Demand Hotspots ---
  function updateGovernmentDashboard() {
    console.log('updateGovernmentDashboard called, issues count:', state.issues.length);
    state.issues.forEach(function (item) {
      if (window.registerAreaContext) window.registerAreaContext(item.area);
    });
    var totalRequests = state.issues.length;
    var critPriorityCount = 0;
    var highPriorityCount = 0;
    var medPriorityCount = 0;
    var lowPriorityCount = 0;
    
    var pendingCount = 0;
    var inProgressCount = 0;
    var resolvedCount = 0;

    var categoryCounts = {};
    var areaStats = {};
    var issueClusters = groupReports(state.issues);

    state.issues.forEach(function (item) {
      var reportCount = 1;
      // Normalize status
      var s = (item.status || "Pending").trim();
      if (s !== "In Progress" && s !== "Resolved") {
        s = "Pending";
        item.status = "Pending"; // persist the normalized status
      }
      
      if (s === "Pending") pendingCount += reportCount;
      else if (s === "In Progress") inProgressCount += reportCount;
      else if (s === "Resolved") resolvedCount += reportCount;

      if (item.priority === "Critical") critPriorityCount += reportCount;
      else if (item.priority === "High") highPriorityCount += reportCount;
      else if (item.priority === "Medium") medPriorityCount += reportCount;
      else if (item.priority === "Low") lowPriorityCount += reportCount;

      // Category count
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + reportCount;

      // Area statistics for demand hotspots (track counts, categories, people, and per-priority counts)
      if (!areaStats[item.area]) {
        areaStats[item.area] = {
          count: 0,
          uniqueClusters: 0,
          categories: {},
          priorityCounts: { Critical: 0, High: 0, Medium: 0, Low: 0 },
          totalPeople: 0,
          hasPeopleAffected: false,
          highCount: 0,
          strongestPriority: "Low",
          strongestPriorityScore: 0
        };
      }
      areaStats[item.area].count += reportCount;
      var p = item.priority || 'Low';
      if (!areaStats[item.area].priorityCounts[p]) areaStats[item.area].priorityCounts[p] = 0;
      areaStats[item.area].priorityCounts[p] += reportCount;
      areaStats[item.area].categories[item.category] = (areaStats[item.area].categories[item.category] || 0) + reportCount;
      if (p === "Critical" || p === "High") areaStats[item.area].highCount += reportCount;
      if ((item.priorityScore || 0) > areaStats[item.area].strongestPriorityScore) {
        areaStats[item.area].strongestPriority = p;
        areaStats[item.area].strongestPriorityScore = item.priorityScore || 0;
      }
    });

    issueClusters.forEach(function (cluster) {
      if (!areaStats[cluster.area]) return;
      areaStats[cluster.area].uniqueClusters += 1;
      if (isFiniteNumber(cluster.peopleAffected)) {
        areaStats[cluster.area].totalPeople += Number(cluster.peopleAffected);
        areaStats[cluster.area].hasPeopleAffected = true;
      }
    });

    // 1. Total Requests & Breakdown
    if (elements.kpiTotalReports) elements.kpiTotalReports.textContent = totalRequests;
    if (elements.kpiCitizenVsDemoCount) elements.kpiCitizenVsDemoCount.innerHTML = `<span class="trend-badge-info">${totalRequests} Live Reports</span> from Supabase`;
    
    if (elements.countPending) elements.countPending.textContent = pendingCount;
    if (elements.countInProgress) elements.countInProgress.textContent = inProgressCount;
    if (elements.countResolved) elements.countResolved.textContent = resolvedCount;

    // 2. Critical + High Priority Count (combined urgent requests)
    if (elements.kpiHighPriority) elements.kpiHighPriority.textContent = critPriorityCount + highPriorityCount;

    // 3. Most Reported Category
    var topCategory = "None";
    var topCategoryCount = 0;
    for (var cat in categoryCounts) {
      if (categoryCounts[cat] > topCategoryCount) {
        topCategoryCount = categoryCounts[cat];
        topCategory = cat;
      }
    }
    if (elements.kpiMostReported) elements.kpiMostReported.textContent = topCategory;
    if (elements.kpiMostReportedCount) elements.kpiMostReportedCount.textContent = `${topCategoryCount} community requests logged`;

    // 4. Highest Request Area
    var topArea = "None";
    var topAreaCount = 0;
    for (var area in areaStats) {
      if (areaStats[area].count > topAreaCount) {
        topAreaCount = areaStats[area].count;
        topArea = area;
      }
    }
    if (elements.kpiMostAffected) elements.kpiMostAffected.textContent = topArea;
    if (elements.kpiMostAffectedCount) elements.kpiMostAffectedCount.textContent = `${topAreaCount} total requests in cluster`;

    // 5. Render Basic Demand Hotspots
    if (elements.hotspotsContainer) {
      renderDemandHotspots(areaStats);
    }

    // 5b. Render Demand Hotspot Analysis (grouping by location with dominant category and overall priority)
    try {
      if (window.renderDemandHotspotAnalysis) {
        renderDemandHotspotAnalysis(areaStats);
      }
    } catch (e) {
      console.warn('Error rendering hotspot analysis', e);
    }

    // 5c. Render AI Recommended Actions (based on hotspot analysis data)
    try {
      if (window.renderAIRecommendedActions) {
        renderAIRecommendedActions(areaStats);
      }
    } catch (e) {
      console.warn('Error rendering AI recommended actions', e);
    }

    // 5d. Render Area Development Context (if function exists)
    try {
      if (window.renderAreaDevelopmentContext) {
        renderAreaDevelopmentContext(areaStats);
      }
    } catch (e) {
      console.warn('Error rendering area development context', e);
    }

    // 6. Update Severity Distribution Bar (Critical + High + Medium + Low = 100%)
    var total = totalRequests;
    var critPct = total > 0 ? Math.round((critPriorityCount / total) * 100) : 0;
    var highPct = total > 0 ? Math.round((highPriorityCount / total) * 100) : 0;
    var medPct = total > 0 ? Math.round((medPriorityCount / total) * 100) : 0;
    var lowPct = total > 0 ? Math.max(0, 100 - critPct - highPct - medPct) : 0;

    if (elements.distCritCount) elements.distCritCount.textContent = critPriorityCount;
    if (elements.distHighCount) elements.distHighCount.textContent = highPriorityCount;
    if (elements.distMedCount) elements.distMedCount.textContent = medPriorityCount;
    if (elements.distLowCount) elements.distLowCount.textContent = lowPriorityCount;

    if (elements.barSegmentCrit) {
      elements.barSegmentCrit.style.width = critPct + "%";
      elements.barSegmentCrit.setAttribute("title", "Critical: " + critPct + "%");
    }
    if (elements.barSegmentHigh) {
      elements.barSegmentHigh.style.width = highPct + "%";
      elements.barSegmentHigh.setAttribute("title", "High: " + highPct + "%");
    }
    if (elements.barSegmentMed) {
      elements.barSegmentMed.style.width = medPct + "%";
      elements.barSegmentMed.setAttribute("title", "Medium: " + medPct + "%");
    }
    if (elements.barSegmentLow) {
      elements.barSegmentLow.style.width = lowPct + "%";
      elements.barSegmentLow.setAttribute("title", "Low: " + lowPct + "%");
    }
  }

  // --- 9. Render Basic Demand Hotspots ---
  function renderDemandHotspots(areaStats) {
    const container = elements.hotspotsContainer;
    if (!container) return;
    container.innerHTML = "";

    // Convert areaStats to array and sort by request count descending
    const hotspotList = [];
    for (const area in areaStats) {
      // Find top category for this specific area
      const cats = areaStats[area].categories;
      let topCat = "";
      let topCount = 0;
      for (const c in cats) {
        if (cats[c] > topCount) {
          topCount = cats[c];
          topCat = c;
        }
      }

      hotspotList.push({
        area: area,
        count: areaStats[area].count,
        uniqueClusters: areaStats[area].uniqueClusters,
        highCount: areaStats[area].highCount,
        totalPeople: areaStats[area].hasPeopleAffected ? areaStats[area].totalPeople : null,
        topCategory: topCat,
        areaPriority: areaStats[area].strongestPriority,
        priorityScore: areaStats[area].strongestPriorityScore
      });
    }

    hotspotList.sort(function (a, b) {
      return b.priorityScore - a.priorityScore || b.totalPeople - a.totalPeople;
    });

    // Display top hotspots
    hotspotList.slice(0, 4).forEach(function (hotspot, i) {
      const item = document.createElement("div");
      item.className = "hotspot-item";
      
      const urgencyLabel = hotspot.areaPriority + " Area Signal";
      const urgencyClass = hotspot.areaPriority === "Critical" || hotspot.areaPriority === "High"
        ? "hotspot-badge-critical" : "hotspot-badge-moderate";

      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <strong style="color: #1e3a8a; font-size: 14px;">${escapeHtml(hotspot.area)}</strong>
          <span class="${urgencyClass}">${urgencyLabel}</span>
        </div>
        <div style="font-size: 13px; color: #555555; margin-bottom: 4px;">
          <strong>${formatNumber(hotspot.count)} total submissions</strong> &bull; <strong>${formatNumber(hotspot.uniqueClusters)} unique issue clusters</strong> &bull; 👥 ~${formatNumber(hotspot.totalPeople)} people affected
        </div>
        <div style="font-size: 12px; color: #777777;">
          Top Category: <strong>${escapeHtml(hotspot.topCategory || 'Civic Services')}</strong>
        </div>
      `;

      container.appendChild(item);
    });
  }
  
  // --- 10. Modal Dialog Logic ---
  let currentModalIssueId = null;

  function openModal(req) {
    currentModalIssueId = req.id;
    elements.modalIssueTitle.textContent = req.title;
    elements.modalIdBadge.textContent = `#${req.id}`;
    elements.modalCategoryBadge.textContent = req.category;
    elements.modalCitizenName.textContent = req.citizenName || "Anonymous Citizen";
    elements.modalArea.textContent = req.area;
    elements.modalPeopleAffected.textContent = `👥 ${formatNumber(req.peopleAffected)} citizens affected`;
    elements.modalSeverity.textContent = req.severity || "Standard";
    elements.modalCommunitySupport.textContent = "🤝 " + (req.communitySupport || 1);
    elements.modalDescription.textContent = req.description;
    elements.modalPriorityReason.textContent = req.priorityReason || "Calculated via rule-based priority engine.";
    
    // Check the same normalized Area Development Context used by dashboard panels.
    let actionText = req.suggestedAction || "Forwarded to ward inspection division.";
    const modalContext = window.getDevelopmentContext ? window.getDevelopmentContext(req.area) : null;
    if (modalContext && elements.modalAreaContext && elements.modalAreaContextContent) {
      elements.modalAreaContext.style.display = "block";
      var modalProjects = modalContext.plannedInvestments && modalContext.plannedInvestments.length
        ? modalContext.plannedInvestments.map(function (project) { return project.project; }).join(', ')
        : 'Not Available';
      elements.modalAreaContextContent.innerHTML = `
        <div><strong>Population:</strong> ${formatNumber(modalContext.population)}</div>
        <div><strong>Density:</strong> ${formatNumber(modalContext.populationDensity, '/sq km')}</div>
        <div style="grid-column: span 2;"><strong>Vulnerable:</strong> ${formatNumber((modalContext.vulnerablePopulation || {}).children)} children, ${formatNumber((modalContext.vulnerablePopulation || {}).elderly)} elderly</div>
        <div style="grid-column: span 2;"><strong>Infrastructure:</strong> Roads: ${escapeHtml(modalContext.infrastructure && modalContext.infrastructure.roads && modalContext.infrastructure.roads.condition || 'Not Available')} | Water: ${escapeHtml(modalContext.infrastructure && modalContext.infrastructure.water && modalContext.infrastructure.water.qualityRating || 'Not Available')}</div>
        <div style="grid-column: span 2; color: #2b6cb0;"><strong>Planned Projects:</strong> ${escapeHtml(modalProjects)}</div>
      `;
      actionText += ` Note: Area context is illustrative only; planned projects: ${modalProjects}.`;
    } else {
      if (elements.modalAreaContext) elements.modalAreaContext.style.display = "none";
    }

    elements.modalAction.textContent = actionText;
    
    // Set status dropdown
    elements.modalStatusSelect.value = req.status || "Pending";

    // Priority badge
    elements.modalPriorityBadge.className = "badge-priority";
    if (req.priority === "Critical") elements.modalPriorityBadge.classList.add("badge-priority-critical");
    else if (req.priority === "High") elements.modalPriorityBadge.classList.add("badge-priority-high");
    else if (req.priority === "Medium") elements.modalPriorityBadge.classList.add("badge-priority-medium");
    else elements.modalPriorityBadge.classList.add("badge-priority-low");
    elements.modalPriorityBadge.textContent = req.priority + " Priority";

    elements.issueModal.classList.add("open");
    document.body.style.overflow = "hidden";
    elements.modalCloseBtn.focus();
  }

  function closeModal() {
    elements.issueModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // --- 11. Toast Notification Helper ---
  let toastTimer;
  function showToast(title, message) {
    if (toastTimer) clearTimeout(toastTimer);
    elements.toastTitle.textContent = title;
    elements.toastMessage.textContent = message;
    elements.toastNotification.classList.add("show");

    toastTimer = setTimeout(function () {
      elements.toastNotification.classList.remove("show");
    }, 4500);
  }

  // --- 12. Utilities ---
  function truncateString(str, n) {
    if (!str) return "";
    return str.length > n ? str.slice(0, n) + "..." : str;
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
