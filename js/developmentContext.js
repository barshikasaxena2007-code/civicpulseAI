// js/developmentContext.js

// Area Development Context Data
// ILLUSTRATIVE — NOT OFFICIAL GOVERNMENT DATA
// This is prototype/sample data for demonstration purposes only

const AREA_DEVELOPMENT_CONTEXT = {
  // Ward 4 - North Sector
  "ward-4": {
    areaName: "Ward 4 - North Sector",
    population: 45200,
    populationDensity: 8900, // people per square km
    vulnerablePopulation: {
      elderly: 4200, // age 65+
      children: 8100, // age 0-14
      disabled: 1100,
      lowIncome: 12500
    },
    infrastructure: {
      roads: {
        condition: "Fair",
        pavedPercentage: 78,
        maintenanceStatus: "Scheduled for quarterly review",
        lastMajorUpgrade: "2019"
      },
      water: {
        coverage: 85,
        qualityRating: "Good",
        supplyHours: 18, // hours per day
        infrastructureAge: "15-20 years"
      },
      healthcare: {
        facilities: 3,
        beds: 120,
        primaryHealthCenters: 2,
        lastAssessment: "2024"
      },
      schools: {
        primary: 8,
        secondary: 4,
        totalStudents: 4500,
        infrastructureCondition: "Good"
      }
    },
    plannedInvestments: [
      {
        project: "Road Resurfacing - Main Arteries",
        budget: 2500000,
        timeline: "Q4 2026",
        status: "Planned",
        impact: "High"
      },
      {
        project: "Water Pipeline Replacement - Zone B",
        budget: 1800000,
        timeline: "Q1 2027",
        status: "Planning",
        impact: "Medium"
      }
    ],
    developmentChallenges: [
      "Aging water infrastructure requires replacement",
      "Traffic congestion during peak hours",
      "Limited healthcare facility capacity"
    ],
    developmentOpportunities: [
      "High youth population for skill development",
      "Good road connectivity to city center",
      "Active community organizations"
    ]
  },

  // Ward 7 - Riverfront District
  "ward-7": {
    areaName: "Ward 7 - Riverfront District",
    population: 38500,
    populationDensity: 12000, // people per square km
    vulnerablePopulation: {
      elderly: 5100,
      children: 6800,
      disabled: 1400,
      lowIncome: 18200
    },
    infrastructure: {
      roads: {
        condition: "Poor",
        pavedPercentage: 62,
        maintenanceStatus: "Requires immediate attention",
        lastMajorUpgrade: "2015"
      },
      water: {
        coverage: 72,
        qualityRating: "Fair",
        supplyHours: 14,
        infrastructureAge: "25+ years"
      },
      healthcare: {
        facilities: 2,
        beds: 85,
        primaryHealthCenters: 1,
        lastAssessment: "2023"
      },
      schools: {
        primary: 6,
        secondary: 2,
        totalStudents: 3200,
        infrastructureCondition: "Fair"
      }
    },
    plannedInvestments: [
      {
        project: "Flood Protection Wall",
        budget: 4200000,
        timeline: "Q2 2027",
        status: "Approved",
        impact: "Critical"
      },
      {
        project: "Community Health Center Upgrade",
        budget: 950000,
        timeline: "Q3 2026",
        status: "In Progress",
        impact: "High"
      }
    ],
    developmentChallenges: [
      "Flood risk during monsoon season",
      "Overcrowded housing conditions",
      "Inadequate drainage systems"
    ],
    developmentOpportunities: [
      "Riverfront development potential",
      "Tourism and recreation opportunities",
      "Strong community cohesion"
    ]
  },

  // Ward 12 - Old Town Commercial
  "ward-12": {
    areaName: "Ward 12 - Old Town Commercial",
    population: 52800,
    populationDensity: 18500, // people per square km
    vulnerablePopulation: {
      elderly: 6300,
      children: 9200,
      disabled: 1800,
      lowIncome: 22100
    },
    infrastructure: {
      roads: {
        condition: "Poor",
        pavedPercentage: 55,
        maintenanceStatus: "Critical needs assessment",
        lastMajorUpgrade: "2012"
      },
      water: {
        coverage: 68,
        qualityRating: "Poor",
        supplyHours: 12,
        infrastructureAge: "30+ years"
      },
      healthcare: {
        facilities: 4,
        beds: 180,
        primaryHealthCenters: 3,
        lastAssessment: "2024"
      },
      schools: {
        primary: 12,
        secondary: 5,
        totalStudents: 6800,
        infrastructureCondition: "Poor"
      }
    },
    plannedInvestments: [
      {
        project: "Heritage Area Infrastructure Revitalization",
        budget: 8500000,
        timeline: "2027-2028",
        status: "Planning",
        impact: "High"
      },
      {
        project: "Underground Drainage System",
        budget: 5200000,
        timeline: "Q4 2026",
        status: "Approved",
        impact: "Critical"
      }
    ],
    developmentChallenges: [
      "Extremely high population density",
      "Aging infrastructure across all sectors",
      "Traffic and congestion issues",
      "Heritage conservation vs development needs"
    ],
    developmentOpportunities: [
      "Commercial and economic hub potential",
      "Heritage tourism development",
      "High economic activity"
    ]
  },

  // Ward 3 - Metro Transit Corridor
  "ward-3": {
    areaName: "Ward 3 - Metro Transit Corridor",
    population: 41500,
    populationDensity: 9800,
    vulnerablePopulation: {
      elderly: 3800,
      children: 7500,
      disabled: 950,
      lowIncome: 14000
    },
    infrastructure: {
      roads: {
        condition: "Good",
        pavedPercentage: 92,
        maintenanceStatus: "Regular maintenance schedule",
        lastMajorUpgrade: "2021"
      },
      water: {
        coverage: 91,
        qualityRating: "Good",
        supplyHours: 22,
        infrastructureAge: "10-15 years"
      },
      healthcare: {
        facilities: 3,
        beds: 140,
        primaryHealthCenters: 2,
        lastAssessment: "2024"
      },
      schools: {
        primary: 7,
        secondary: 4,
        totalStudents: 4100,
        infrastructureCondition: "Good"
      }
    },
    plannedInvestments: [
      {
        project: "Metro Station Access Roads",
        budget: 3200000,
        timeline: "Q1 2027",
        status: "In Progress",
        impact: "High"
      },
      {
        project: "Transit-Oriented Development Zone",
        budget: 15000000,
        timeline: "2027-2029",
        status: "Planning",
        impact: "High"
      }
    ],
    developmentChallenges: [
      "Coordinating with metro construction",
      "Managing transient population",
      "Ensuring affordable housing"
    ],
    developmentOpportunities: [
      "Metro connectivity advantages",
      "Transit-oriented development potential",
      "Modern infrastructure foundation"
    ]
  },

  // Ward 9 - Greenfield Suburbs
  "ward-9": {
    areaName: "Ward 9 - Greenfield Suburbs",
    population: 28900,
    populationDensity: 4200,
    vulnerablePopulation: {
      elderly: 2800,
      children: 5200,
      disabled: 650,
      lowIncome: 8900
    },
    infrastructure: {
      roads: {
        condition: "Good",
        pavedPercentage: 88,
        maintenanceStatus: "Preventive maintenance",
        lastMajorUpgrade: "2020"
      },
      water: {
        coverage: 94,
        qualityRating: "Excellent",
        supplyHours: 24,
        infrastructureAge: "5-10 years"
      },
      healthcare: {
        facilities: 2,
        beds: 75,
        primaryHealthCenters: 2,
        lastAssessment: "2024"
      },
      schools: {
        primary: 5,
        secondary: 3,
        totalStudents: 2800,
        infrastructureCondition: "Excellent"
      }
    },
    plannedInvestments: [
      {
        project: "Green Belt Development",
        budget: 1800000,
        timeline: "Q2 2026",
        status: "In Progress",
        impact: "Medium"
      },
      {
        project: "Smart Street Lighting System",
        budget: 750000,
        timeline: "Q3 2026",
        status: "Planning",
        impact: "Medium"
      }
    ],
    developmentChallenges: [
      "Rapid urbanization pressure",
      "Maintaining green spaces",
      "Public transportation connectivity"
    ],
    developmentOpportunities: [
      "Planned development advantages",
      "High quality of life potential",
      "Sustainable development model"
    ]
  }
};

function normalizeAreaKey(areaName) {
  return String(areaName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function createIllustrativeAreaContext(areaName, areaId) {
  return {
    areaName: areaName,
    contextSource: 'Illustrative placeholder — not official government data',
    population: null,
    populationDensity: null,
    vulnerablePopulation: { elderly: null, children: null, disabled: null, lowIncome: null },
    infrastructure: {
      roads: { condition: 'Not Available' },
      water: { coverage: null, qualityRating: 'Not Available' },
      healthcare: { facilities: null },
      schools: { totalStudents: null, infrastructureCondition: 'Not Available' }
    },
    plannedInvestments: [],
    developmentChallenges: ['Not Available'],
    developmentOpportunities: ['Not Available'],
    isIllustrativePlaceholder: true,
    areaId: areaId
  };
}

function registerAreaContext(areaName) {
  var displayName = String(areaName || '').trim().replace(/\s+/g, ' ');
  var normalizedArea = normalizeAreaKey(displayName);
  if (!normalizedArea) return null;

  var existing = getDevelopmentContext(displayName);
  if (existing) return existing;

  var areaId = 'custom-' + normalizedArea;
  if (!AREA_DEVELOPMENT_CONTEXT[areaId]) {
    AREA_DEVELOPMENT_CONTEXT[areaId] = createIllustrativeAreaContext(displayName, areaId);
  }
  return AREA_DEVELOPMENT_CONTEXT[areaId];
}

// Helper function to get development context for an area
function getDevelopmentContext(areaName) {
  var normalizedArea = normalizeAreaKey(areaName);

  if (!normalizedArea) return null;

  // Match IDs, configured names, and harmless spelling variations such as
  // "Ward 4 North Sector", "ward-4", and "WARD 4 - NORTH SECTOR".
  for (var areaId in AREA_DEVELOPMENT_CONTEXT) {
    var context = AREA_DEVELOPMENT_CONTEXT[areaId];
    var normalizedId = areaId.toLowerCase().replace(/[^a-z0-9]/g, '');
    var normalizedName = context.areaName.toLowerCase().replace(/[^a-z0-9]/g, '');
    var wardNumber = areaId.match(/^ward-(\d+)$/);
    var matchesWardNumber = wardNumber && new RegExp('^ward' + wardNumber[1] + '(?!\\d)').test(normalizedArea);

    if (normalizedArea === normalizedId || normalizedArea === normalizedName || matchesWardNumber) {
      return context;
    }
  }

  return null;
}

// Helper function to calculate development score for priority weighting
function calculateDevelopmentScore(context) {
  if (!context || !isFiniteContextNumber(context.populationDensity) || !isFiniteContextNumber(context.population)) {
    return null;
  }
  var score = 0;
  
  // Population density factor (higher density = higher priority needs)
  if (context.populationDensity > 15000) score += 20;
  else if (context.populationDensity > 10000) score += 15;
  else if (context.populationDensity > 5000) score += 10;
  
  // Vulnerable population percentage
  var totalPop = context.population;
  var vulnerablePercent = ((context.vulnerablePopulation.elderly + context.vulnerablePopulation.children + context.vulnerablePopulation.disabled + context.vulnerablePopulation.lowIncome) / totalPop) * 100;
  if (vulnerablePercent > 50) score += 25;
  else if (vulnerablePercent > 35) score += 20;
  else if (vulnerablePercent > 20) score += 15;
  
  // Infrastructure condition
  var infraScore = 0;
  if (context.infrastructure.roads.condition === "Poor") infraScore += 10;
  if (context.infrastructure.water.qualityRating === "Poor") infraScore += 10;
  if (context.infrastructure.schools.infrastructureCondition === "Poor") infraScore += 10;
  if (context.infrastructure.healthcare.facilities < 2) infraScore += 10;
  score += infraScore;
  
  // Planned investments (inverse - areas with fewer planned investments need more attention)
  if (context.plannedInvestments.length === 0) score += 15;
  else if (context.plannedInvestments.length === 1) score += 10;
  
  return Math.min(100, score);
}

function isFiniteContextNumber(value) {
  return value !== null && value !== '' && isFinite(Number(value));
}

function formatContextNumber(value, suffix) {
  return isFiniteContextNumber(value) ? Number(value).toLocaleString() + (suffix || '') : 'Not Available';
}

// Export functions for use in other modules
window.getDevelopmentContext = getDevelopmentContext;
window.registerAreaContext = registerAreaContext;
window.calculateDevelopmentScore = calculateDevelopmentScore;
window.AREA_DEVELOPMENT_CONTEXT = AREA_DEVELOPMENT_CONTEXT;

// Render function for development context display in dashboard
window.renderAreaDevelopmentContext = function (areaStats) {
  var container = document.getElementById('developmentContextContainer');
  if (!container) {
    // create container after AI recommended actions
    var aiActionsParent = document.getElementById('aiRecommendedActionsContainer');
    if (!aiActionsParent) {
      // fallback to hotspot analysis container
      aiActionsParent = document.getElementById('hotspotAnalysisContainer');
    }
    if (!aiActionsParent) return;

    container = document.createElement('div');
    container.id = 'developmentContextContainer';
    container.style.marginTop = '20px';
    container.style.padding = '16px';
    container.style.background = '#ffffff';
    container.style.border = '1px solid #e2e8f0';
    container.style.borderRadius = '8px';
    container.style.fontSize = '14px';

    // Insert after the parent element (at the end of the dashboard section)
    aiActionsParent.parentNode.appendChild(container);
  }

  var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">'
           + '<div style="display:flex;align-items:center;gap:8px;">'
           + '<span style="font-size:18px;">🏘️</span>'
           + '<strong style="color:#1e3a8a;font-size:16px;">Area Development Context</strong>'
           + '</div>'
           + '<span style="font-size:12px;color:#64748b;background:#f1f5f9;padding:4px 8px;border-radius:4px;">Illustrative — not official government data</span>'
           + '</div>';

  html += '<div style="background:#fef9c3;border:1px solid #fde047;border-radius:6px;padding:10px;margin-bottom:12px;">'
         + '<div style="font-size:12px;color:#854d0e;font-weight:600;">⚠️ Important Notice</div>'
         + '<div style="font-size:11px;color:#854d0e;margin-top:4px;">This section contains prototype/sample data for demonstration purposes only. '
         + 'The population figures, infrastructure assessments, and investment projects shown here are illustrative examples and do not represent official government statistics or planned investments.</div>'
         + '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px">';

  // Display only areas represented by live reports, using the same registry as
  // Demand Hotspot Analysis and AI Recommended Actions.
  var reportAreas = [];
  var seenAreas = {};
  for (var reportArea in (areaStats || {})) {
    var normalizedReportArea = normalizeAreaKey(reportArea);
    if (!normalizedReportArea || seenAreas[normalizedReportArea]) continue;
    seenAreas[normalizedReportArea] = true;
    reportAreas.push(reportArea);
    registerAreaContext(reportArea);
  }

  if (reportAreas.length === 0) {
    html += '<div style="padding:16px;color:#64748b;font-style:italic;">No submitted report locations available.</div>';
  }

  reportAreas.forEach(function (reportArea) {
    var ctx = getDevelopmentContext(reportArea) || registerAreaContext(reportArea);
    if (!ctx) return;
    var devScore = calculateDevelopmentScore(ctx);
    
    var scoreColor = '#64748b';
    var scoreBg = '#f1f5f9';
    var scoreLabel = devScore === null ? 'Not Available' : 'Low Development Need';
    if (devScore !== null && devScore > 70) { scoreColor = '#dc2626'; scoreBg = '#fef2f2'; scoreLabel = 'High Development Need'; }
    else if (devScore !== null && devScore > 40) { scoreColor = '#ca8a04'; scoreBg = '#fefce8'; scoreLabel = 'Medium Development Need'; }

    html += '<div style="padding:14px;border-radius:8px;background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">'
         + '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">'
         + '<div style="font-weight:700;color:#1e3a8a;font-size:15px;">' + escapeHtml(reportArea) + '</div>'
         + '<div style="background:' + scoreBg + ';color:' + scoreColor + ';padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;">' + scoreLabel + '</div>'
         + '</div>'
         + (ctx.isIllustrativePlaceholder
           ? '<div style="font-size:11px;color:#92400e;background:#fef9c3;border:1px solid #fde68a;border-radius:4px;padding:5px 7px;margin-bottom:10px;">Illustrative placeholder only — values are Not Available and are not official government data.</div>'
           : '')
         
         // Population and density
         + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">'
         + '<div style="background:#f0f9ff;padding:8px;border-radius:4px;border:1px solid #bae6fd;">'
         + '<div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;">👥 Population</div>'
         + '<div style="font-size:14px;font-weight:700;color:#0f172a;">' + formatContextNumber(ctx.population) + '</div>'
         + '</div>'
         + '<div style="background:#f0f9ff;padding:8px;border-radius:4px;border:1px solid #bae6fd;">'
         + '<div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;">📐 Density</div>'
         + '<div style="font-size:12px;font-weight:600;color:#0f172a;">' + formatContextNumber(ctx.populationDensity, '/sq km') + '</div>'
         + '</div>'
         + '</div>'

         // Vulnerable population breakdown
         + '<div style="background:#fef3c7;padding:8px;border-radius:4px;border:1px solid #fde68a;margin-bottom:10px;">'
         + '<div style="font-size:10px;font-weight:700;color:#92400e;text-transform:uppercase;margin-bottom:4px;">⚠️ Vulnerable Population</div>'
         + '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;font-size:11px;color:#78350f;">'
         + '<div>Elderly: ' + formatContextNumber(ctx.vulnerablePopulation.elderly) + '</div>'
         + '<div>Children: ' + formatContextNumber(ctx.vulnerablePopulation.children) + '</div>'
         + '<div>Disabled: ' + formatContextNumber(ctx.vulnerablePopulation.disabled) + '</div>'
         + '<div>Low Income: ' + formatContextNumber(ctx.vulnerablePopulation.lowIncome) + '</div>'
         + '</div>'
         + '</div>'

         // Infrastructure summary
         + '<div style="font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:6px;">🏗️ Infrastructure Summary</div>'
         + '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:10px;">'
         + infraMiniCell('🛣️', 'Roads', ctx.infrastructure.roads.condition)
         + infraMiniCell('💧', 'Water', ctx.infrastructure.water.qualityRating)
         + infraMiniCell('🏥', 'Healthcare', formatContextNumber(ctx.infrastructure.healthcare.facilities, ' facilities'))
         + infraMiniCell('🏫', 'Schools', formatContextNumber(ctx.infrastructure.schools.totalStudents, ' students'))
         + '</div>'

         // Planned investments
         + (ctx.plannedInvestments.length > 0
           ? '<div style="background:#ecfdf5;padding:8px;border-radius:4px;border:1px solid #6ee7b7;">'
             + '<div style="font-size:10px;font-weight:700;color:#065f46;text-transform:uppercase;margin-bottom:4px;">📋 Planned Investments (' + ctx.plannedInvestments.length + ')</div>'
             + '<ul style="margin:0;padding-left:14px;font-size:11px;color:#064e3b;">'
             + ctx.plannedInvestments.map(function(p){ return '<li>' + escapeHtml(p.project) + ' (' + escapeHtml(p.timeline) + ')</li>'; }).join('')
             + '</ul></div>'
           : '<div style="font-size:11px;color:#64748b;font-style:italic;">No planned investments listed</div>')
          + '</div>';
        });

  html += '</div>';
  container.innerHTML = html;

  function escapeHtml(u) {
    if (!u) return ''; return u.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function infraMiniCell(icon, label, value) {
    var bg = '#f1f5f9', color = '#334155';
    var lower = String(value).toLowerCase();
    if (lower.includes('poor') || lower.includes('0 facilities')) {
      bg = '#fef2f2'; color = '#b91c1c';
    } else if (lower.includes('good') || lower.includes('excellent')) {
      bg = '#f0fdf4'; color = '#15803d';
    }
    return '<div style="background:' + bg + ';padding:6px;border-radius:4px;">'
         + '<div style="font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;">' + icon + ' ' + label + '</div>'
         + '<div style="font-size:11px;color:' + color + ';font-weight:600;">' + escapeHtml(String(value)) + '</div>'
         + '</div>';
  }
};