// js/aiRecommendedActions.js
// AI Recommended Actions — enriched with Area Development Context

(function () {
  function isFiniteNumber(value) {
    return value !== null && value !== '' && isFinite(Number(value));
  }

  function formatNumber(value, suffix) {
    return isFiniteNumber(value) ? Number(value).toLocaleString() + (suffix || '') : 'Not Available';
  }

  window.renderAIRecommendedActions = function (areaStats) {
    var container = document.getElementById('aiRecommendedActionsContainer');
    if (!container) {
      var hotspotAnalysisParent = document.getElementById('hotspotAnalysisContainer') || document.getElementById('hotspotsContainer');
      if (!hotspotAnalysisParent) return;
      container = document.createElement('div');
      container.id = 'aiRecommendedActionsContainer';
      container.style.marginTop = '20px';
      container.style.padding = '16px';
      container.style.background = '#ffffff';
      container.style.border = '1px solid #e2e8f0';
      container.style.borderRadius = '8px';
      container.style.fontSize = '14px';
      hotspotAnalysisParent.parentNode.insertBefore(container, hotspotAnalysisParent.nextSibling);
    }

    var rows = [];
    for (var area in areaStats) {
      var stats = areaStats[area];
      var topCat = 'N/A', topCatCount = 0;
      for (var c in stats.categories) {
        if (stats.categories[c] > topCatCount) { topCatCount = stats.categories[c]; topCat = c; }
      }
      var overall = stats.strongestPriority || 'Low';
      rows.push({ area: area, count: stats.count, uniqueClusters: stats.uniqueClusters || 0,
        totalPeople: stats.totalPeople, topCategory: topCat, overallPriority: overall,
        priorityScore: stats.strongestPriorityScore || 0 });
    }
    rows.sort(function (a, b) {
      return b.priorityScore - a.priorityScore || b.totalPeople - a.totalPeople;
    });

    var recommendations = rows.slice(0, 4).map(function (r) { return generateRecommendation(r); });

    // ── Header
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:8px;">'
             + '<div style="display:flex;align-items:center;gap:8px;">'
             + '<span style="font-size:18px;">🤖</span>'
             + '<strong style="color:#1e3a8a;font-size:16px;">Rule-Based Recommended Actions</strong>'
             + '</div>'
             + '<span style="font-size:11px;color:#64748b;background:#f1f5f9;padding:4px 8px;border-radius:4px;">Based on submitted report data and shared area signals</span>'
             + '</div>'
             + '<p style="font-size:12px;color:#64748b;margin:0 0 14px;font-style:italic;">Recommendations use submitted categories, affected people, report volume, community support, and rule-based priority signals. Missing evidence is flagged for field verification.</p>';

    if (recommendations.length === 0) {
      html += '<div style="text-align:center;padding:20px;color:#64748b;font-style:italic;">No hotspot data available for AI recommendations</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:14px">';

      recommendations.forEach(function (rec) {
        var priorityColor = '#64748b', priorityBg = '#f1f5f9', priorityIcon = '📋', borderColor = '#e2e8f0';
        if (rec.priority === 'Critical') { priorityColor = '#dc2626'; priorityBg = '#fef2f2'; priorityIcon = '🚨'; borderColor = '#fca5a5'; }
        else if (rec.priority === 'High')  { priorityColor = '#ea580c'; priorityBg = '#fff7ed'; priorityIcon = '⚡'; borderColor = '#fdba74'; }
        else if (rec.priority === 'Medium'){ priorityColor = '#ca8a04'; priorityBg = '#fefce8'; priorityIcon = '📌'; borderColor = '#fde68a'; }

        var ctx = null;

        // Context panel
        var ctxHtml = '';
        if (ctx) {
          // Context-influence explanation using new development context
          var influences = [];
          var vulnerableValues = ctx.vulnerablePopulation || {};
          var totalVulnerable = [vulnerableValues.elderly, vulnerableValues.children,
            vulnerableValues.disabled, vulnerableValues.lowIncome].reduce(function (total, value) {
              return total + (isFiniteNumber(value) ? Number(value) : 0);
            }, 0);
          var vulnerablePercent = isFiniteNumber(ctx.population) && Number(ctx.population) > 0
            ? (totalVulnerable / Number(ctx.population)) * 100
            : null;
          
          if (vulnerablePercent !== null && vulnerablePercent > 40) {
            influences.push('High vulnerable population (' + vulnerablePercent.toFixed(1) + '%) elevates urgency — delays disproportionately harm at-risk residents.');
          } else if (vulnerablePercent !== null && vulnerablePercent > 25) {
            influences.push('Significant vulnerable population (' + vulnerablePercent.toFixed(1) + '%) requires careful response planning.');
          }
          
          if (ctx.infrastructure.water.qualityRating === 'Poor' || ctx.infrastructure.water.coverage < 70) {
            influences.push('Reported water conditions require field verification before changing response priority.');
          }
          if (ctx.infrastructure.roads.condition === 'Poor') {
            influences.push('Poor road condition compounds access issues for emergency services.');
          }
          if (ctx.infrastructure.healthcare.facilities < 2) {
            influences.push('Healthcare access information requires verification before it affects response planning.');
          }
          if (ctx.plannedInvestments && ctx.plannedInvestments.length > 0) {
            influences.push('Planned investments exist — coordinate with investment timelines to avoid redundant work.');
          }

          ctxHtml = '<div style="margin-top:12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;overflow:hidden;">'
            + '<div style="background:#0369a1;color:#fff;padding:6px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">'
            + 'ℹ️ Area Development Context &nbsp;<span style="font-weight:400;opacity:.8;font-style:italic;">(Illustrative — not official govt data)</span>'
            + '</div>'
            + '<div style="padding:10px;">'

            // Demographics
            + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px;">'
            + miniStat('👥', 'Population', formatNumber(ctx.population))
            + miniStat('📐', 'Density', formatNumber(ctx.populationDensity, '/sq km'))
            + miniStat('⚠️', 'Vulnerable', vulnerablePercent === null ? 'Not Available' : vulnerablePercent.toFixed(1) + '%')
            + '</div>'

            // Infrastructure
            + '<div style="font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:5px;">🏗️ Infrastructure Indices</div>'
            + '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-bottom:8px;">'
            + infraBadge('🛣️', 'Roads', ctx.infrastructure.roads.condition)
            + infraBadge('💧', 'Water', ctx.infrastructure.water.qualityRating)
            + infraBadge('🏥', 'Healthcare', formatNumber(ctx.infrastructure && ctx.infrastructure.healthcare && ctx.infrastructure.healthcare.facilities, ' facilities'))
            + infraBadge('🏫', 'Schools', formatNumber(ctx.infrastructure && ctx.infrastructure.schools && ctx.infrastructure.schools.totalStudents, ' students'))
            + '</div>'

            // How context affects this recommendation
            + (influences.length
              ? '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:4px;padding:7px 9px;">'
                + '<div style="font-size:10px;font-weight:700;color:#92400e;margin-bottom:4px;">💬 How This Context Affects the Recommendation</div>'
                + '<ul style="margin:0;padding-left:14px;font-size:11px;color:#78350f;line-height:1.6;">'
                + influences.map(function(i){ return '<li>' + escapeHtml(i) + '</li>'; }).join('')
                + '</ul></div>'
              : '')

            // Planned projects
            + (ctx.plannedInvestments && ctx.plannedInvestments.length
              ? '<div style="margin-top:7px;background:#ecfdf5;border:1px solid #6ee7b7;border-radius:4px;padding:7px 9px;">'
                + '<div style="font-size:10px;font-weight:700;color:#065f46;margin-bottom:3px;">📋 Planned Investment Projects</div>'
                + '<ul style="margin:0;padding-left:14px;font-size:11px;color:#064e3b;line-height:1.6;">'
                + ctx.plannedInvestments.map(function(p){ return '<li>' + escapeHtml(p.project + ' (' + p.timeline + ')') + '</li>'; }).join('')
                + '</ul></div>'
              : '')

            + '</div></div>';
        }

        html += '<div style="padding:14px;border-radius:8px;background:#ffffff;border:1px solid ' + borderColor + ';box-shadow:0 1px 4px rgba(0,0,0,0.06);transition:box-shadow 0.2s;" '
             + 'onmouseover="this.style.boxShadow=\'0 4px 14px rgba(0,0,0,0.12)\'" onmouseout="this.style.boxShadow=\'0 1px 4px rgba(0,0,0,0.06)\'">'
             // Header row
             + '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;flex-wrap:wrap;gap:8px;">'
             + '<div style="display:flex;align-items:center;gap:8px;">'
             + '<span style="font-size:22px;">' + rec.icon + '</span>'
             + '<div>'
             + '<div style="font-weight:700;color:#1e3a8a;font-size:15px;">' + escapeHtml(rec.location) + '</div>'
             + '<div style="font-size:11px;color:#64748b;margin-top:2px;">👥 ' + formatNumber(rec.peopleAffected) + ' people · ' + formatNumber(rec.reportCount) + ' total submissions · ' + formatNumber(rec.uniqueClusters) + ' unique clusters</div>'
             + '</div></div>'
             + '<div style="display:flex;align-items:center;gap:5px;background:' + priorityBg + ';padding:4px 10px;border-radius:4px;border:1px solid ' + borderColor + ';">'
             + '<span>' + priorityIcon + '</span>'
             + '<span style="font-weight:700;font-size:12px;color:' + priorityColor + ';">' + escapeHtml(rec.priority) + ' Area Signal</span>'
             + '</div>'
             + '</div>'
             // Recommended action
             + '<div style="margin-bottom:10px;">'
             + '<div style="font-size:12px;font-weight:700;color:#334155;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px;">Recommended Action</div>'
             + '<div style="font-size:13px;color:#0f172a;line-height:1.6;padding:9px 12px;background:#f8fafc;border-left:3px solid #3b82f6;border-radius:0 5px 5px 0;">' + escapeHtml(rec.action) + '</div>'
             + '</div>'
             // Rule-based reason
             + '<div style="font-size:11px;color:#64748b;font-style:italic;background:#fefce8;padding:8px 10px;border-radius:4px;border:1px solid #fef3c7;">'
             + '<span style="font-weight:700;color:#92400e;font-style:normal;">💡 Rule-Based Reason: </span>' + escapeHtml(rec.reason)
             + '</div>'
             // Context block
             + ctxHtml
             + '</div>';
      });

      html += '</div>';
    }

    container.innerHTML = html;

    function miniStat(icon, label, val) {
      return '<div style="background:#fff;padding:5px 7px;border-radius:4px;border:1px solid #e0f2fe;text-align:center;">'
           + '<div style="font-size:14px;">' + icon + '</div>'
           + '<div style="font-size:9px;font-weight:700;color:#0369a1;text-transform:uppercase;">' + label + '</div>'
           + '<div style="font-size:11px;font-weight:600;color:#0f172a;">' + escapeHtml(val) + '</div>'
           + '</div>';
    }

    function infraBadge(icon, label, value) {
      var bg = '#f1f5f9', col = '#334155';
      var lower = (value || '').toString().toLowerCase();
      if (lower.includes('poor') || lower.includes('aging') || lower.includes('intermittent') || lower.includes('congested') || lower.includes('contamination') || lower.includes('mobile') || lower.includes('frequent')) {
        bg = '#fef2f2'; col = '#b91c1c';
      } else if (lower.includes('stable') || lower.includes('new') || lower.includes('recently') || lower.includes('good') || lower.includes('adequate')) {
        bg = '#f0fdf4'; col = '#15803d';
      }
      return '<div style="background:' + bg + ';padding:5px 8px;border-radius:4px;">'
           + '<div style="font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:2px;">' + icon + ' ' + label + '</div>'
           + '<div style="font-size:10px;font-weight:600;color:' + col + ';">' + escapeHtml(value || 'Not Available') + '</div>'
           + '</div>';
    }


    function escapeHtml(u) {
      if (!u) return '';
      return u.toString()
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
  };

  function generateRecommendation(hotspotData) {
    var category = hotspotData.topCategory || 'General';
    var priority = hotspotData.overallPriority || 'Low';
    var peopleAffected = isFiniteNumber(hotspotData.totalPeople) ? Number(hotspotData.totalPeople) : null;
    var reportCount = isFiniteNumber(hotspotData.count) ? Number(hotspotData.count) : null;
    var location = hotspotData.area || 'Unknown Area';
    
    // Area context is illustrative and is not used to make recommendations.
    var ctx = null;

    var categoryActions = {
      'Water Supply & Sanitation': {
        icon: '💧',
        critical: 'Deploy emergency water tankers and conduct immediate water quality testing. Initiate pipeline repair within 48 hours.',
        high: 'Schedule urgent infrastructure assessment and implement temporary water distribution points while repairs are planned.',
        medium: 'Add to maintenance queue for systematic water network upgrades and preventive maintenance scheduling.',
        low: 'Include in routine infrastructure review and long-term water system improvement planning.'
      },
      'Road Infrastructure & Potholes': {
        icon: '🛣️',
        critical: 'Immediate road closure and emergency repair deployment. Install safety barriers and redirect traffic within 24 hours.',
        high: 'Priority resurfacing within 2 weeks. Implement temporary speed reduction measures and hazard marking.',
        medium: 'Schedule for next maintenance cycle. Conduct detailed damage assessment and resource planning.',
        low: 'Add to routine road maintenance schedule and long-term infrastructure improvement plan.'
      },
      'Waste Management & Drainage': {
        icon: '🗑️',
        critical: 'Emergency waste cleanup and drainage clearing to prevent flooding/disease. Deploy additional sanitation crews immediately.',
        high: 'Priority waste collection schedule adjustment and drainage system inspection within 1 week.',
        medium: 'Increase collection frequency and schedule drainage system maintenance assessment.',
        low: 'Review waste management routes and optimize collection schedules for the area.'
      },
      'Street Lighting & Public Safety': {
        icon: '💡',
        critical: 'Immediate emergency lighting installation or repair. Deploy temporary lighting and increase security patrols.',
        high: 'Priority lighting repair within 1 week. Coordinate with electrical department for urgent fixture replacement.',
        medium: 'Schedule for regular maintenance cycle. Assess lighting coverage and plan system upgrades.',
        low: 'Include in periodic lighting maintenance and infrastructure improvement planning.'
      },
      'Public Transit & Accessibility': {
        icon: '🚌',
        critical: 'Emergency transit service adjustment and immediate accessibility barrier removal. Deploy alternative transportation options.',
        high: 'Priority service route optimization and accessibility improvements within 2 weeks.',
        medium: 'Review transit service coverage and plan accessibility enhancements for next cycle.',
        low: 'Include in long-term transit network planning and accessibility improvement program.'
      },
      'Public Parks & Civic Spaces': {
        icon: '🌳',
        critical: 'Immediate safety hazard removal and park closure if necessary. Deploy maintenance crews for urgent repairs.',
        high: 'Priority maintenance scheduling and safety equipment installation within 2 weeks.',
        medium: 'Schedule for regular maintenance cycle and plan facility improvements.',
        low: 'Include in routine park maintenance and long-term civic space enhancement planning.'
      }
    };

    var categoryData = categoryActions[category] || {
      icon: '🏗️',
      critical: 'Emergency assessment and immediate intervention to address critical infrastructure or service failure.',
      high: 'Priority scheduling for infrastructure assessment and service improvement planning.',
      medium: 'Include in regular maintenance and improvement cycles with systematic assessment.',
      low: 'Add to routine review and long-term infrastructure planning.'
    };

    var action = categoryData[priority.toLowerCase()] || categoryData.medium;


    var reasonParts = [];
    if (priority === 'Critical')      reasonParts.push('Critical priority requires immediate intervention due to potential health/safety risks.');
    else if (priority === 'High')     reasonParts.push('High priority indicates severe daily disruption affecting community quality of life.');
    else if (priority === 'Medium')   reasonParts.push('Medium priority suggests moderate inconvenience warranting scheduled attention.');
    else                              reasonParts.push('Low priority indicates routine maintenance needs for long-term improvement.');

    if (peopleAffected !== null && peopleAffected > 200)        reasonParts.push('Large population impact (' + peopleAffected.toLocaleString() + ' people) elevates community significance.');
    else if (peopleAffected !== null && peopleAffected > 50)    reasonParts.push('Significant community impact (' + peopleAffected.toLocaleString() + ' people) requires coordinated response.');
    else if (peopleAffected !== null)                           reasonParts.push('Localized impact affecting ' + peopleAffected.toLocaleString() + ' residents.');
    else                                                        reasonParts.push('Population impact is Not Available; confirm affected residents before prioritizing resources.');

    if (reportCount !== null && reportCount > 5)      reasonParts.push('High report volume (' + reportCount + ') indicates persistent community concern.');
    else if (reportCount !== null && reportCount > 2) reasonParts.push('Multiple reports (' + reportCount + ') suggest recurring issue.');
    else if (reportCount !== null)                    reasonParts.push('Emerging issue for monitoring.');
    else                                              reasonParts.push('Report volume is Not Available; confirm source data before acting.');

    reasonParts.push('Confirm the reported condition and urgency through field inspection before committing resources.');

    return {
      location: location, action: action, priority: priority,
      reason: reasonParts.join(' '),
      icon: categoryData.icon, peopleAffected: peopleAffected, reportCount: reportCount
    };
  }
})();