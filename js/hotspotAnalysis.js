// js/hotspotAnalysis.js
// Demand Hotspot Analysis — enriched with Area Development Context

(function () {
  window.renderDemandHotspotAnalysis = function (areaStats) {
    var container = document.getElementById('hotspotAnalysisContainer');
    if (!container) {
      var hotspotsParent = document.getElementById('hotspotsContainer');
      if (!hotspotsParent) return;
      container = document.createElement('div');
      container.id = 'hotspotAnalysisContainer';
      container.style.marginTop = '20px';
      container.style.padding = '16px';
      container.style.background = '#ffffff';
      container.style.border = '1px solid #e2e8f0';
      container.style.borderRadius = '8px';
      container.style.fontSize = '14px';
      hotspotsParent.parentNode.insertBefore(container, hotspotsParent.nextSibling);
    }

    var rows = [];
    for (var area in areaStats) {
      var stats = areaStats[area];

      // Dominant category
      var topCat = 'N/A', topCatCount = 0;
      for (var c in stats.categories) {
        if (stats.categories[c] > topCatCount) { topCatCount = stats.categories[c]; topCat = c; }
      }

      // Area signal is derived from the same individual report assessments.
      var overall = stats.strongestPriority || 'Low';

      // Illustrative context is informational only and never changes priority.
      var contextMultiplier = 1.0;
      var riskFactors = [];
      var ctx = null;
      
      var score = isFiniteNumber(stats.totalPeople) ? Number(stats.totalPeople) : stats.count;

      rows.push({ area: area, count: stats.count, totalPeople: stats.totalPeople,
                  uniqueClusters: stats.uniqueClusters || 0, topCategory: topCat, overallPriority: overall,
                  priorityScore: stats.strongestPriorityScore || 0,
                  score: score, contextMultiplier: contextMultiplier, riskFactors: riskFactors, ctx: ctx });
    }

    rows.sort(function (a, b) {
      return b.priorityScore - a.priorityScore || b.totalPeople - a.totalPeople;
    });

    // ── Header
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:8px;">'
             + '<div style="display:flex;align-items:center;gap:8px;">'
             + '<span style="font-size:18px;">📊</span>'
             + '<strong style="color:#1e3a8a;font-size:16px;">Demand Hotspot Analysis</strong>'
             + '</div>'
             + '<span style="font-size:11px;color:#64748b;background:#f1f5f9;padding:4px 8px;border-radius:4px;">Area signal = shared report assessments + affected people</span>'
             + '</div>'
             + '<p style="font-size:12px;color:#64748b;margin:0 0 14px;font-style:italic;">Ranking uses submitted report data only. Any area context shown below is illustrative and does not change priority.</p>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px">';

    if (rows.length === 0) {
      html += '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#64748b;font-style:italic;">No report data available for hotspot analysis</div>';
    } else {
      rows.slice(0, 6).forEach(function (r) {
        var priorityColor = '#64748b', priorityBg = '#f1f5f9';
        if (r.overallPriority === 'Critical') { priorityColor = '#dc2626'; priorityBg = '#fef2f2'; }
        else if (r.overallPriority === 'High')  { priorityColor = '#ea580c'; priorityBg = '#fff7ed'; }
        else if (r.overallPriority === 'Medium'){ priorityColor = '#ca8a04'; priorityBg = '#fefce8'; }

        var rankIdx = rows.indexOf(r) + 1;

        // Risk factor tags
        var riskTagsHtml = '';
        if (r.riskFactors.length > 0) {
          riskTagsHtml = '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">'
            + r.riskFactors.map(function(f) {
                return '<span style="font-size:10px;background:#fee2e2;color:#b91c1c;padding:2px 6px;border-radius:10px;font-weight:600;">' + escapeHtml(f) + '</span>';
              }).join('')
            + '</div>';
        }

        // Area Development Context block
        var ctxHtml = '';
        if (r.ctx) {
          var ctx = r.ctx;
          ctxHtml = '<div style="margin-top:10px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:10px;">'
            + '<div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">'
            + 'ℹ️ Area Development Context'
            + '<span style="font-weight:400;color:#64748b;font-style:italic;"> — Illustrative, not official govt data</span>'
            + '</div>'

            // Demographics row
            + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">'
            + '<div style="background:#fff;padding:5px 7px;border-radius:4px;border:1px solid #e0f2fe;">'
            + '<div style="font-size:9px;font-weight:700;color:#0369a1;text-transform:uppercase;">👥 Population</div>'
            + '<div style="font-size:13px;font-weight:700;color:#0f172a;">' + formatNumber(ctx.population) + '</div>'
            + '</div>'
            + '<div style="background:#fff;padding:5px 7px;border-radius:4px;border:1px solid #e0f2fe;">'
            + '<div style="font-size:9px;font-weight:700;color:#0369a1;text-transform:uppercase;">📐 Density</div>'
            + '<div style="font-size:11px;color:#0f172a;">' + formatNumber(ctx.populationDensity, '/sq km') + '</div>'
            + '</div>'
            + '</div>'

            // Vulnerable population breakdown
            + '<div style="background:#fff;padding:5px 7px;border-radius:4px;border:1px solid #fde68a;margin-bottom:6px;">'
            + '<div style="font-size:9px;font-weight:700;color:#92400e;text-transform:uppercase;">⚠️ Vulnerable Population</div>'
            + '<div style="font-size:10px;color:#0f172a;">'
            + 'Elderly: ' + formatNumber(vulnerableValues.elderly) + ' | '
            + 'Children: ' + formatNumber(vulnerableValues.children) + ' | '
            + 'Disabled: ' + formatNumber(vulnerableValues.disabled) + ' | '
            + 'Low Income: ' + formatNumber(vulnerableValues.lowIncome)
            + '</div>'
            + '</div>'

            // Infrastructure indices
            + '<div style="font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:4px;">🏗️ Infrastructure Indices</div>'
            + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px;">'
            + infraCell('🛣️', 'Roads', (ctx.infrastructure && ctx.infrastructure.roads.condition) || 'N/A')
            + infraCell('💧', 'Water', (ctx.infrastructure && ctx.infrastructure.water.qualityRating) || 'N/A')
            + infraCell('🏥', 'Healthcare', formatNumber(ctx.infrastructure && ctx.infrastructure.healthcare && ctx.infrastructure.healthcare.facilities, ' facilities'))
            + infraCell('🏫', 'Schools', formatNumber(ctx.infrastructure && ctx.infrastructure.schools && ctx.infrastructure.schools.totalStudents, ' students'))
            + '</div>'

            // Planned projects
            + (ctx.plannedInvestments && ctx.plannedInvestments.length
              ? '<div style="background:#ecfdf5;padding:5px 7px;border-radius:4px;border:1px solid #6ee7b7;">'
                + '<div style="font-size:9px;font-weight:700;color:#065f46;text-transform:uppercase;margin-bottom:3px;">📋 Planned Investment Projects</div>'
                + '<ul style="margin:0;padding-left:14px;font-size:11px;color:#064e3b;">'
                + ctx.plannedInvestments.map(function(p){ return '<li>' + escapeHtml(p.project) + ' (' + escapeHtml(p.timeline) + ')</li>'; }).join('')
                + '</ul></div>'
              : '')
            + '</div>';
        }

        html += '<div style="padding:14px;border-radius:8px;background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);transition:box-shadow 0.2s;" '
             + 'onmouseover="this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.12)\'" onmouseout="this.style.boxShadow=\'0 1px 3px rgba(0,0,0,0.06)\'">'
             // Title row
             + '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">'
             + '<div style="font-weight:700;color:#1e3a8a;font-size:14px;line-height:1.3;flex:1;margin-right:8px;">' + escapeHtml(r.area) + '</div>'
             + '<div style="background:#1e3a8a;color:#fff;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap;">Rank #' + rankIdx + '</div>'
             + '</div>'
             // Stats row

             + '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:6px;">'
             + '<span style="font-size:12px;color:#334155;"><strong>' + r.count + '</strong> total submissions</span>'
             + '<span style="font-size:12px;color:#334155;"><strong>' + r.uniqueClusters + '</strong> unique clusters</span>'
             + '<span style="font-size:12px;color:#334155;">👥 <strong>' + formatNumber(r.totalPeople) + '</strong> people</span>'
             + '</div>'
             // Category & priority
             + '<div style="font-size:12px;color:#64748b;margin-bottom:4px;">Dominant Issue: <strong style="color:#334155;">' + escapeHtml(r.topCategory || 'N/A') + '</strong></div>'
             + '<div style="display:inline-block;font-weight:700;font-size:12px;color:' + priorityColor + ';background:' + priorityBg + ';padding:3px 9px;border-radius:4px;margin-bottom:6px;">' + escapeHtml(r.overallPriority) + ' Area Signal</div>'
             // Risk factor tags
             + riskTagsHtml
             // Context block
             + ctxHtml
             + '</div>';
      });
    }

    html += '</div>';
    container.innerHTML = html;
  };

  function infraCell(icon, label, value) {
    var color = '#f1f5f9', textColor = '#334155';
    var lower = String(value).toLowerCase();
    if (lower.includes('poor') || lower.includes('aging') || lower.includes('intermittent') || lower.includes('congested') || lower.includes('contamination') || lower.includes('mobile') || lower.includes('0 facilities')) {
      color = '#fef2f2'; textColor = '#b91c1c';
    } else if (lower.includes('good') || lower.includes('excellent') || lower.includes('stable') || lower.includes('new') || lower.includes('recently')) {
      color = '#f0fdf4'; textColor = '#15803d';
    }
    return '<div style="background:' + color + ';padding:5px 7px;border-radius:4px;">'
         + '<div style="font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:2px;">' + icon + ' ' + label + '</div>'
         + '<div style="font-size:10px;color:' + textColor + ';font-weight:600;">' + escapeHtml(String(value)) + '</div>'
         + '</div>';
  }

  function isFiniteNumber(value) {
    return value !== null && value !== '' && isFinite(Number(value));
  }

  function formatNumber(value, suffix) {
    return isFiniteNumber(value) ? Number(value).toLocaleString() + (suffix || '') : 'Not Available';
  }

  function escapeHtml(u) {
    if (!u) return '';
    return u.toString()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
})();
