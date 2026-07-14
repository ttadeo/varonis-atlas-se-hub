# ai-governance API Endpoints

## GET /v2/ai-governance/needs-attention-queue — List the Needs-Attention queue (grouped signals)

**Endpoint**: `GET /v2/ai-governance/needs-attention-queue`
**Summary**: List the Needs-Attention queue (grouped signals)
**Tags**: ai-governance, needs-attention-queue

Returns the primary AI-Investigation triage surface: repeated Signal firings collapsed into grouped rows keyed on (policy, resource, time-bucket), with rollups (total detections, affected users/sessions, trend, representative evidence). Paginated, filterable by severity / status / type / policy / resource / time-range, and sortable. All results are scoped to the authenticated customer.

**Parameters**:
- `severity` (query, optional): 
- `status` (query, optional): 
- `type` (query, optional): 
- `policy_id` (query, optional): 
- `resource_instance_id` (query, optional): 
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `sort_field` (query, optional): 
- `sort_order` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/resource-search — Search AI-Investigation resources by name and investigation facets

**Endpoint**: `GET /v2/ai-governance/resource-search`
**Summary**: Search AI-Investigation resources by name and investigation facets
**Tags**: ai-governance, needs-attention-queue

Searches AI-Investigation resources by display-name substring plus five investigation facets (production LLMs, PII activity, latency anomalies, resources lacking session-policy coverage, and log sources with recent events). Paginated and sortable. The time-ranged facets honor start_time/end_time. All results are scoped to the authenticated customer. (spec §13.1, WB-9m1k PR11)

**Parameters**:
- `name_search` (query, optional): 
- `production_llm` (query, optional): 
- `has_pii_activity` (query, optional): 
- `has_latency_anomaly` (query, optional): 
- `without_session_policy_coverage` (query, optional): 
- `log_source_with_recent_events` (query, optional): 
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `sort_field` (query, optional): 
- `sort_order` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Invalid date range
- `500`: Unexpected server error

---

## GET /v2/ai-governance/signals/{signal_id}/drilldown — Get the per-signal drilldown payload (evidence)

**Endpoint**: `GET /v2/ai-governance/signals/{signal_id}/drilldown`
**Summary**: Get the per-signal drilldown payload (evidence)
**Tags**: ai-governance, needs-attention-queue

Returns the per-signal deep view (§11.5) for a single Signal: the common payload (summary, why-generated, policy details, affected resources/users, timeline, related event/session ids, recommended actions) plus a type-specific evidence sub-model (scanner / metric / anomaly / session). Keyed on the (signal_id, source_type) decode of the list response's drilldown_ref. Evidence is scoped to the authenticated customer (tenant scope); a wrong-tenant or unknown signal_id returns 404. Affected-users and metric chart-data are documented placeholders until a future PR.

**Parameters**:
- `signal_id` (path, required): 
- `source_type` (query, required): 

**Responses**:
- `200`: Successful Response
- `404`: Signal not found in tenant
- `422`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/empty-state — Classify the AI-Investigation signal-queue empty state

**Endpoint**: `GET /v2/ai-governance/empty-state`
**Summary**: Classify the AI-Investigation signal-queue empty state
**Tags**: ai-governance, needs-attention-queue

Returns which of the four empty states the tenant is in, plus the supporting counts shown next to the verdict. This classifier backs the Needs-Attention surface. The states are evaluated most-fundamental first: `no_activity` (no events processed in the window, so no signals can be generated — reported even when policies exist) > `no_policies_enabled` (activity, but no policies are evaluating) > `coverage_gaps_exist` (activity and enabled policies, but some resources are covered by no policy family) > `healthy`. Supporting counts: events_processed, active_resources, last_event_received, policies_evaluating, and coverage status (total / covered / uncovered). `active_users` is not yet populated and is always null today. All reads are scoped to the authenticated customer.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Invalid date range (start_time after end_time)
- `500`: Unexpected server error

---

## GET /v2/ai-governance/coverage-summary — Get tenant policy-coverage summary

**Endpoint**: `GET /v2/ai-governance/coverage-summary`
**Summary**: Get tenant policy-coverage summary
**Tags**: ai-governance, policies

Returns the tenant's policy-coverage summary: the total number of resources in scope and, per policy family (governance / performance), how many resources are covered vs uncovered. Each family also carries a list of its uncovered resources (id + display name) so you can see exactly which endpoints are unmonitored. The uncovered lists are capped at 100 entries; when the true count exceeds the cap the list is truncated and `uncovered_truncated` is True (the full count is still reported in `uncovered_resource_count`). Coverage follows policy inheritance, so a resource reached by a global, organization, or project assignment counts as covered. All reads are scoped to the authenticated customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/policy-health — List lean per-policy health

**Endpoint**: `GET /v2/ai-governance/policy-health`
**Summary**: List lean per-policy health
**Tags**: ai-governance, policies

Returns one row per live policy definition: `is_enabled` (enabled vs disabled), `last_fired_at` (most recent alert firing attributable to the definition, null if it has never fired), and `covered_resource_count` (the number of resources the definition covers, following policy inheritance). This is the list-level health surface, distinct from the single-policy `/policies/{id}/health` route. Data-source / capture (integration) health is not part of this response. All reads are scoped to the authenticated customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/dashboard-summary — Get the Signals dashboard summary metrics for a time range

**Endpoint**: `GET /v2/ai-governance/dashboard-summary`
**Summary**: Get the Signals dashboard summary metrics for a time range
**Tags**: ai-governance, needs-attention-queue

Returns the top-of-dashboard key metrics (§11.1) for the selected time range: total AI events, open signals, critical/high signals, anomalies detected, session-policy violations, affected resources, and affected users. Affected-users is GOVERNANCE-only (derived from a governance alert's flagged events -> event block user_id); performance alerts carry no user linkage, so that count under-represents (see coverage_note). All metrics are scoped to the authenticated customer.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/signal-trends — Per-policy signal-trend timeseries

**Endpoint**: `GET /v2/ai-governance/signal-trends`
**Summary**: Per-policy signal-trend timeseries
**Tags**: ai-governance, needs-attention-queue

Returns a per-bucket timeseries of Signal (alert) counts over the requested range, for the dashboard 'Signal trends' chart and the Resource Observability 'Session' tab. Each bucket carries a raw signal_count and a distinct session_count (computed at the bucket granularity in SQL — distinct session counts are NOT summable across buckets). Two grouping modes: group_by=policy (default) emits one series per policy; group_by=none emits a single distinct-session series for the resource. Buckets are anchored on FIRING time (coalesce(activity_timestamp, triggered_at, created_at)), so a later status change never shifts a signal into a different bucket. Missing buckets are zero-filled. Weekly buckets are Monday-aligned. All counts are scoped to the authenticated customer.

**Parameters**:
- `start_date` (query, required): 
- `end_date` (query, required): 
- `timezone` (query, optional): 
- `interval` (query, optional): 
- `group_by` (query, optional): 
- `policy_id` (query, optional): 
- `resource_instance_id` (query, optional): 
- `signal_type` (query, optional): 
- `severity` (query, optional): 
- `status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Invalid date range or timezone
- `500`: Unexpected server error

---

## GET /v2/ai-governance/top-risky-resources — List the top risky resources (ranked)

**Endpoint**: `GET /v2/ai-governance/top-risky-resources`
**Summary**: List the top risky resources (ranked)
**Tags**: ai-governance, needs-attention-queue

Returns the resources most relevant to investigate (§11.3), ranked by a weighted score (sum of severity weights CRITICAL=9/HIGH=5/MEDIUM=3/LOW=1 over in-window signals, highest first). Each row carries open signal count, critical/high count, affected users (GOVERNANCE-only — see coverage_note), last activity, and a trend (signed signal-count delta vs the immediately-prior equal-length window; null for open-ended ranges). Project is intentionally omitted (resource->project is many-to-many; resolve via the resource id). Scoped to the customer.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/top-affected-users — List the top affected users (ranked, governance-only)

**Endpoint**: `GET /v2/ai-governance/top-affected-users`
**Summary**: List the top affected users (ranked, governance-only)
**Tags**: ai-governance, needs-attention-queue

Returns the most affected users (§11.4), ranked by a weighted score (severity weights CRITICAL=9/HIGH=5/MEDIUM=3/LOW=1). Each row carries signal count, critical/high count, distinct resources accessed, session-policy violation count, last activity, and a trend (signed signal-count delta vs the immediately-prior equal-length window; null for open-ended ranges). User attribution is GOVERNANCE-only: it is derived from a governance alert's flagged events -> firewall event -> event block user_id (the product user id, never an auth0 id). Performance alerts and signals without a resolvable user are not represented (see coverage_note). 'Sensitive data events' is omitted (no signal-level marker exists). Scoped to the customer.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/endpoints — List AI governance endpoints

**Endpoint**: `GET /v2/ai-governance/endpoints`
**Summary**: List AI governance endpoints
**Tags**: ai-governance, endpoints

Returns a paginated inventory of LLM endpoints being monitored for AI governance compliance. Supports simple (overview) and advanced (full analytics) modes. Use to find endpoints with active alerts, filter by provider or severity, and identify coverage gaps. All results are scoped to the authenticated customer.

**Parameters**:
- `mode` (query, optional): 
- `search` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 
- `resource_type` (query, optional): 
- `llm_provider_name` (query, optional): 
- `llm_model_name` (query, optional): 
- `min_request_count` (query, optional): 
- `max_request_count` (query, optional): 
- `activity_status` (query, optional): 
- `enabled_scanners_only` (query, optional): 
- `has_active_alerts` (query, optional): 
- `severity` (query, optional): 
- `include_severity_breakdown` (query, optional): 
- `created_after` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `last_request_after` (query, optional): 
- `last_request_before` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/endpoints/count — Count AI governance endpoints

**Endpoint**: `GET /v2/ai-governance/endpoints/count`
**Summary**: Count AI governance endpoints
**Tags**: ai-governance, endpoints

Returns the total count of LLM endpoints matching the specified filters, without fetching full records. Use for dashboard summary displays and paginator totals. Supports the same filter set as listAiGovernanceEndpoints. Scoped to the authenticated customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by use case (endpoint) name
- `resource_instance_id` (query, optional): Filter by specific resource instance
- `resource_type` (query, optional): Filter by resource type
- `llm_provider_name` (query, optional): Filter by LLM provider
- `llm_model_name` (query, optional): Filter by model name
- `min_request_count` (query, optional): Minimum number of requests
- `max_request_count` (query, optional): Maximum number of requests
- `activity_status` (query, optional): Activity status filter
- `enabled_scanners_only` (query, optional): Only count endpoints with enabled scanners
- `last_request_after` (query, optional): Only count endpoints with activity after this date (ISO 8601 format or date-only)
- `last_request_before` (query, optional): Only count endpoints with activity before this date (ISO 8601 format or date-only)
- `has_active_alerts` (query, optional): Filter by alert status
- `severity` (query, optional): Filter by specific alert severity level (exact match). Use NO_ISSUES for endpoints with no alerts.
- `created_after` (query, optional): Only include endpoints created after this date

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/requests/search — Search governance-tagged LLM requests

**Endpoint**: `GET /v2/ai-governance/requests/search`
**Summary**: Search governance-tagged LLM requests
**Tags**: ai-governance, requests

Returns individual LLM requests that were tagged by a governance scanner rule, including tag labels and confidence scores. Use to drill down from aggregated chart spikes into raw request data for a specific rule type, tag, or time range. Paginated; scoped to the authenticated customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `rule_type` (query, optional): 
- `governance_tag` (query, optional): 
- `direction` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/tags — List available governance tags

**Endpoint**: `GET /v2/ai-governance/tags`
**Summary**: List available governance tags
**Tags**: ai-governance, requests

Returns unique governance tag values (e.g. positive, Toxic, PII) found in scanned requests along with per-tag request counts. Use to populate filter dropdowns or discover which tags are present for a given scanner rule type. Optionally scoped to a specific endpoint or date range; always scoped to the authenticated customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `rule_type` (query, optional): 
- `direction` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/timeseries — Get governance analytics time-series data

**Endpoint**: `GET /v2/ai-governance/timeseries`
**Summary**: Get governance analytics time-series data
**Tags**: ai-governance, analytics

Returns historical AI governance metrics bucketed by time period (hour, day, week, month). Each bucket contains request volumes, scanner tag distributions, alert patterns, and confidence data for the chosen governance target (input, output, or both). Use to power trend charts, compliance reports, or incident investigation. Filterable by endpoint, org/project, scanner types, and minimum confidence. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `enabled_scanners_only` (query, optional): 
- `start_date` (query, required): 
- `end_date` (query, required): 
- `granularity` (query, optional): 
- `governance_target` (query, optional): 
- `min_confidence` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/dashboard/performance/timeseries — Get performance metrics time-series for candlestick charts

**Endpoint**: `GET /v2/ai-governance/dashboard/performance/timeseries`
**Summary**: Get performance metrics time-series for candlestick charts
**Tags**: ai-governance, dashboard

Returns candlestick-ready performance metrics (latency, tokens, request rates, success rate) for a specific LLM endpoint over a time range. When `metric` is omitted, all available metrics are returned as an array; when specified, returns a single object. Percentiles (p50/p90/p95) are included when sufficient sample size is available. Use to drive performance dashboards or investigate regressions. Scoped to the token's customer.

**Parameters**:
- `metric` (query, optional): 
- `start_date` (query, required): 
- `end_date` (query, required): 
- `interval` (query, optional): 
- `resource_instance_id` (query, required): 
- `timezone_str` (query, optional): 
- `timezone` (query, optional): 
- `series` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/scanners/configuration — Get governance scanner configuration and status

**Endpoint**: `GET /v2/ai-governance/scanners/configuration`
**Summary**: Get governance scanner configuration and status
**Tags**: ai-governance, configuration

Returns all available AI governance scanners (sentiment, toxicity, PII, etc.) with their operational status, configured alert thresholds, and coverage metrics for the customer. Status is determined by actual tag-generation activity in the last 30 days. Use to audit which scanners are actively monitoring, identify coverage gaps, and review threshold settings before making changes. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v2/ai-governance/dashboard/filter-options — Get available filter options for the governance dashboard

**Endpoint**: `GET /v2/ai-governance/dashboard/filter-options`
**Summary**: Get available filter options for the governance dashboard
**Tags**: ai-governance, dashboard

Discovers and returns the rule types, governance tags, and direction options present in the customer's actual governance data, enabling dynamic population of dashboard filter controls. Optionally scoped to a specific resource instance, organization, or project. Use to initialize dashboard filter dropdowns before querying the governance timeseries endpoint. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): Optional resource instance ID to filter results
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `statuses` (query, optional): Only count issues with these statuses (e.g. UNRESOLVED)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/dashboard/timeseries — Get Governance Dashboard Timeseries

**Endpoint**: `GET /v2/ai-governance/dashboard/timeseries`
**Summary**: Get Governance Dashboard Timeseries
**Tags**: ai-governance, dashboard

Get governance dashboard time-series data optimized for chart visualization.

This is the primary endpoint for governance dashboard charts, providing time-series data
specifically formatted for stacked bar graphs with rate line overlays and moving averages.

**Chart-Ready Data Structure:**
Each response object represents one chart (rule+direction combination):
- **Stacked bars**: `tags[]` array provides segments (request counts by governance outcome)
- **Rate line**: `rate` field shows percentage of "bad" outcomes (0-100 scale)
- **Moving average line**: `moving_average_30_day` shows 30-day rolling average trend
- **Trend comparison**: `30_day_average` provides historical baseline for comparison
- **Alert arrays**: `absolute_alerts` and `relative_alerts` for threshold violations

**Business Logic:**
- **Rate calculation**: Primary negative tag count ÷ successfully scanned requests × 100
- **Tag prioritization**: Negative outcomes always appear as tags[0] for consistent visualization
- **Scanner methodology**: Uses actual scanner output rather than heuristic estimates
- **Timezone handling**: Proper timezone conversion for accurate daily bucketing
- **Tag ordering guarantee**: Tags are sorted by semantic priority (bad tags first) not count

**Tag Ordering System:**
- **Semantic Priority**: Tags are ordered by semantic importance, not frequency
- **Primary Bad Tags**: Each scanner type has a defined "bad" tag that appears first:
  - SentimentRule: "Negative" appears first
  - DetectGibberishRule: "Incoherent" appears first
  - SatisfactoryAnswerRule: "Fail To Answer" appears first
  - PIIDetectionRule: "PII" appears first
  - ToxicityRule: "Toxic" appears first
- **Tag Consolidation**: Similar concepts are normalized (e.g., "Failed To Answer" → "Fail To Answer", "Is Gibberish" → "Incoherent")
- **Consistent Visualization**: Primary bad tags always use red coloring for immediate identification

**Weekly Interval - Rolling 7-Day Buckets:**
The Weekly interval now uses rolling 7-day buckets instead of Monday-aligned calendar weeks:
- **Rolling Windows**: Buckets start from the user's selected `start_date`, not Monday
- **Complete Periods**: All weekly buckets are exactly 7 days long (no partial weeks)
- **End-Exclusive Bucketing**: The `end_date` is treated as exclusive for bucketing purposes
- **Date Range Adjustment**: Frontend should adjust date ranges to multiples of 7 days
- **Backward Compatibility**: Date ranges not aligned to 7-day multiples still work but may show unexpected bucketing

**Example**:
- User selects: Oct 15 (Wednesday) to Oct 28 (14 days)
- System generates: Two 7-day buckets: (Oct 15-21) and (Oct 22-28)
- Both buckets start on Wednesday, not Monday
- No Monday-alignment or partial week data

**Empty Data Handling:**
- **Expected Behavior**: Customers without resources, firewall requests, or governance metrics return empty data arrays instead of errors
- **No Activity Customers**: Return `{"data": [], "enabled_scanners": []}` with 200 status
- **Time Range Gaps**: Future dates or time ranges with no metrics return empty arrays
- **Partial Direction Data**: `governance_target='both'` includes available data from either Input or Output directions without requiring both
- **ETL Lag**: Customers with recent activity but no processed metrics return empty arrays until ETL completes
- **Resource-Scoped Queries**: Resources without governance metrics return empty arrays for that specific resource

**Visualization Features:**
- **Dual Y-axis support**: Left axis for request counts, right axis for percentages
- **Proportional display**: 28% moving average displays as 28% of chart height
- **Tab interface**: Separate charts for Input vs Output when both directions available
- **Color consistency**: Primary negative tags use consistent red coloring across charts

**Moving Average Calculation:**
- **30-day rolling window**: Each data point shows average of previous 30 days
- **Trend smoothing**: Reduces impact of daily fluctuations for clearer trend identification
- **Comparative analysis**: Compare current daily rate vs historical average
- **Percentage format**: Backend returns 0-100 percentage values for consistent rate comparison

**Alert Information:**
Each time series data point includes alert arrays:
- **absolute_alerts**: Array of all absolute threshold alerts in this time period
  - Each alert includes: `id`, `time`, `threshold`, `rate`, `delta`
  - `delta` = rate - threshold (simple difference)
  - Supports multiple alerts per time bucket (e.g., hourly alerts in weekly intervals)
- **relative_alerts**: Array of all relative threshold alerts in this time period
  - Each alert includes: `id`, `time`, `thirty_day_average`, `threshold`, `rate`, `delta`
  - `delta` = rate - (average + threshold% of average)
  - Provides full historical context with thirty_day_average for each alert

**Response Array Structure:**
```json
{
  "data": [
    {
      "rule_type": "SentimentRule",
      "rule_display_name": "Sentiment Analysis",
      "direction": "Output",
      "time_series_data": [
        {
          "Start": "2024-01-01T00:00:00",
          "tags": [
            {"label": "Negative", "value": "2"},
            {"label": "Neutral Sentiment", "value": "5"},
            {"label": "Positive Sentiment", "value": "3"}
          ],
          "rate": "20.0",
          "absolute_alerts": [],
          "relative_alerts": []
        }
      ],
      "30_day_average": "15.6"
    }
  ]
}
```

**Example with Alerts:**
```json
{
  "time_series_data": [
    {
      "Start": "2024-01-15T00:00:00",
      "rate": "35.0",
      "absolute_alerts": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "time": "2024-01-15T14:30:00Z",
          "threshold": 20.0,
          "rate": 35.0,
          "delta": 15.0
        }
      ],
      "relative_alerts": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "time": "2024-01-15T16:45:00Z",
          "thirty_day_average": 12.5,
          "threshold": 50.0,
          "rate": 35.0,
          "delta": 16.75
        }
      ]
    }
  ]
}
```

**Note**: In the example above, "Negative" appears first in the tags array
regardless of its count (2) being lower than "Neutral Sentiment" (5) or "Positive Sentiment" (3).
This semantic priority ordering ensures consistent visualization with bad tags always appearing first.

**Alert Arrays Benefits:**
- **Complete Alert History**: Weekly intervals can now show all alerts (up to 168 for hourly alerts)
- **Individual Alert Context**: Each alert maintains its specific timestamp, rate, and threshold
- **Alert Type Separation**: Absolute and relative alerts clearly distinguished
- **Detailed Calculations**: Each alert includes precise delta calculations for analysis
- **Timezone Consistency**: All alert timestamps in consistent ISO 8601 format with Z suffix

**Alert Array Use Cases:**
- **Detailed Alert Analysis**: Access individual alert context rather than just first/highest
- **Alert Timeline Visualization**: Show exact timing of multiple alerts within time periods
- **Threshold Analysis**: Compare absolute vs relative alert patterns
- **Historical Delta Tracking**: Analyze how far rates exceeded thresholds over time
- **Weekly Alert Summaries**: See all alerts in week-long time buckets for executive reporting

**Common Query Patterns:**
- Weekly dashboard: `?start_date=2024-01-01&end_date=2024-01-08&interval=Weekly` (7-day end-exclusive range)
- Daily dashboard: `?start_date=2024-01-01&end_date=2024-01-07&interval=Daily`
- Specific scanner: `?rule_type=SentimentRule&governance_target=Output`
- Resource focus: `?resource_instance_id=uuid&interval=Daily`
- Tag filtering: `?governance_tag=Negative` (e.g., for DetectGibberishRule use `?governance_tag=Incoherent`)
- Alert analysis: `?interval=Weekly` for comprehensive alert arrays in time buckets

**Parameters**:
- `resource_instance_id` (query, optional): 
- `start_date` (query, required): 
- `end_date` (query, required): 
- `timezone` (query, optional): 
- `interval` (query, optional): 
- `granularity` (query, optional): 
- `rule_type` (query, optional): 
- `governance_tag` (query, optional): 
- `governance_target` (query, optional): 
- `direction` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/endpoints/severity — Get LLM endpoint count breakdown by alert severity

**Endpoint**: `GET /v2/ai-governance/endpoints/severity`
**Summary**: Get LLM endpoint count breakdown by alert severity
**Tags**: ai-governance, alerting

Returns a summary of how many LLM endpoints had governance or performance alerts in the specified activity window, bucketed by worst-case severity (CRITICAL, HIGH, MEDIUM, LOW, NO_ISSUES). Use to populate dashboard severity summary cards or compare risk distribution across time periods. Alert status is ignored — all alerts within the window count regardless of whether they are open or resolved. Filterable by organization and project. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `start_date` (query, optional): Lower bound on the activity window (ISO 8601 datetime or date-only). Only alerts whose `COALESCE(activity_timestamp, triggered_at)` is ≥ `start_date` contribute to the rollup, and only resources with firewall activity in the window are counted in `total_use_cases`.
- `end_date` (query, optional): Upper bound on the activity window (exclusive). Same rules as `start_date`.
- `last_request_after` (query, optional): DEPRECATED alias for `start_date`; sent by older clients. If both pairs are present, `start_date` / `end_date` win.
- `last_request_before` (query, optional): DEPRECATED alias for `end_date`.
- `enabled_scanners_only` (query, optional): DEPRECATED: Ignored to ensure complete PROMPT_ANALYSIS coverage

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/thresholds/list — List alerting threshold policies

**Endpoint**: `GET /v2/ai-governance/thresholds/list`
**Summary**: List alerting threshold policies
**Tags**: ai-governance, alerting

Returns all configured AI governance alerting threshold policies for the customer, with optional filtering by rule type, direction, resource endpoint, or enabled state. Use to audit monitoring coverage, review configured alert thresholds, or identify policies that need adjustment. Paginated; scoped to the authenticated customer.

**Parameters**:
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `rule_type` (query, optional): Filter by governance rule type
- `direction` (query, optional): Filter by Input or Output direction
- `resource_instance_id` (query, optional): Filter by resource instance ID
- `is_enabled` (query, optional): Filter by enabled/disabled status

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/thresholds — Get alerting threshold for a rule and direction

**Endpoint**: `GET /v2/ai-governance/thresholds`
**Summary**: Get alerting threshold for a rule and direction
**Tags**: ai-governance, alerting

Returns the current alerting policy configuration for a specific governance rule type and direction (Input or Output). Supply resource_instance_id for a resource-specific policy, or omit it for the global customer policy. Returns default disabled values when no policy has been configured yet. Scoped to the authenticated customer.

**Parameters**:
- `rule_type` (query, required): Governance rule type
- `direction` (query, required): Input or Output direction
- `resource_instance_id` (query, optional): Resource instance ID (null for global policies)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/thresholds — Create or update an alerting threshold policy

**Endpoint**: `POST /v2/ai-governance/thresholds`
**Summary**: Create or update an alerting threshold policy
**Tags**: ai-governance, alerting

Creates or updates an alerting threshold policy for a governance scanner rule. Supports absolute thresholds (alert when rate exceeds a fixed percentage) and relative thresholds (alert when rate exceeds the rolling average by a percentage). Setting both thresholds to null deletes the policy. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/thresholds/{policy_id} — Update an existing alerting threshold policy

**Endpoint**: `PATCH /v2/ai-governance/thresholds/{policy_id}`
**Summary**: Update an existing alerting threshold policy
**Tags**: ai-governance, alerting

Partially updates an existing governance alerting threshold policy by policy_id. Only the fields provided in the request body are changed. Use to adjust thresholds, change severity levels, or enable/disable a policy without deleting it. Scoped to the authenticated customer.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/thresholds/{policy_id} — Delete a governance alerting threshold policy

**Endpoint**: `DELETE /v2/ai-governance/thresholds/{policy_id}`
**Summary**: Delete a governance alerting threshold policy
**Tags**: ai-governance, alerting

Permanently removes a governance alerting threshold policy. No new alerts will be generated for the associated rule type, direction, and resource after deletion. Existing open alerts are unaffected. As an alternative, use PATCH to set is_enabled=false for temporary disabling rather than permanent deletion. Returns 204 on success. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance-alert-policies — List governance alert policies for a dashboard (legacy path)

**Endpoint**: `GET /v2/ai-governance/governance-alert-policies`
**Summary**: List governance alert policies for a dashboard (legacy path)
**Tags**: ai-governance, alerting

Returns all governance alerting policies configured on the specified dashboard (identified by resource instance, rule type, direction, and granularity). Prefer /governance/alert-policies — this path is a legacy alias retained for backward compatibility and will be removed once clients migrate. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, required): Resource instance ID
- `rule_type` (query, required): Governance rule type
- `direction` (query, required): Input or Output direction
- `granularity` (query, required): Metric time-window granularity: 5min, hour, day, week, or month
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/governance-alert-policies — Create a governance alert policy (legacy path)

**Endpoint**: `POST /v2/ai-governance/governance-alert-policies`
**Summary**: Create a governance alert policy (legacy path)
**Tags**: ai-governance, alerting

Creates a new governance alerting policy on a dashboard (resource instance, rule type, direction, granularity). Multiple policies with different thresholds can coexist on the same dashboard. Prefer /governance/alert-policies — this path is a legacy alias retained for backward compatibility. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `409`: A byte-identical policy already exists
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/governance-alert-policies/{policy_id} — Update a governance alert policy (legacy path)

**Endpoint**: `PATCH /v2/ai-governance/governance-alert-policies/{policy_id}`
**Summary**: Update a governance alert policy (legacy path)
**Tags**: ai-governance, alerting

Partially updates an existing governance alerting policy. Only the supplied fields are changed; omitted fields retain their current values. Prefer /governance/alert-policies/{policy_id} — this path is a legacy alias. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/governance-alert-policies/{policy_id} — Delete a governance alert policy (legacy path)

**Endpoint**: `DELETE /v2/ai-governance/governance-alert-policies/{policy_id}`
**Summary**: Delete a governance alert policy (legacy path)
**Tags**: ai-governance, alerting

Permanently removes a governance alerting policy, stopping future alert generation for that rule/resource combination. Existing open alerts are unaffected. Prefer /governance/alert-policies/{policy_id} — this path is a legacy alias retained for backward compatibility. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/alert-policies — List performance alert policies for a dashboard

**Endpoint**: `GET /v2/ai-governance/performance/alert-policies`
**Summary**: List performance alert policies for a dashboard
**Tags**: ai-governance, alerting

Returns all performance alerting policies configured on the specified dashboard, identified by resource instance, metric name, and granularity. Multiple policies with different threshold levels can coexist on the same dashboard. Use to review existing performance alert configurations before creating new ones. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, required): Resource instance ID
- `metric_name` (query, required): Performance metric name
- `granularity` (query, required): Metric time-window granularity: 5min, hour, day, week, or month
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/performance/alert-policies — Create a performance alert policy

**Endpoint**: `POST /v2/ai-governance/performance/alert-policies`
**Summary**: Create a performance alert policy
**Tags**: ai-governance, alerting

Creates a new performance alerting policy on a specific dashboard (resource instance, metric name, granularity). Supports absolute thresholds and relative thresholds (percentage above rolling average). Multiple policies with different thresholds can coexist on the same dashboard. Use to set up latency, token, or request-rate monitoring on a monitored LLM endpoint. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `409`: A byte-identical policy already exists
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/issues — List AI performance issues

**Endpoint**: `GET /v2/ai-governance/performance/issues`
**Summary**: List AI performance issues
**Tags**: ai-governance, alerting

Returns paginated performance issues created by the performance alert evaluation pipeline. Filter by metric name (e.g. latency_ms), severity, status, or resource endpoint. Use to investigate latency regressions, token overruns, or request success-rate drops across monitored LLM endpoints. Scoped to the authenticated customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by metric name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `metric_names` (query, optional): Filter by metric names (e.g. latency_ms)
- `resource_instance_id` (query, optional): Filter by resource instance ID
- `resource_instance_ids` (query, optional): Filter by multiple resource instance IDs
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `orderBy` (query, optional): 
- `sortOrder` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/performance/issues/{issue_id} — Update performance issue status

**Endpoint**: `PATCH /v2/ai-governance/performance/issues/{issue_id}`
**Summary**: Update performance issue status
**Tags**: ai-governance, alerting

Updates the status of a performance issue (e.g. close or reopen). Provide the new status value in the request body. Use to acknowledge, resolve, or reopen issues as part of a performance-alert remediation workflow. Returns the updated issue id and current status. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Performance issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/issues/{issue_id}/alerts — List alerts for a performance issue

**Endpoint**: `GET /v2/ai-governance/performance/issues/{issue_id}/alerts`
**Summary**: List alerts for a performance issue
**Tags**: ai-governance, performance

Returns paginated alerts associated with a specific performance issue, including severity, current metric value, threshold violated, and timestamp of each alert event. Supports filtering by alert status, severity, and policy type, and sorting by triggered time or other fields. Use after listAiGovernanceIssues to drill into the alert history for a performance issue. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 
- `page` (query, optional): 
- `page_size` (query, optional): 
- `status` (query, optional): 
- `severity` (query, optional): 
- `policy_type` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Performance issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/performance-alerts/{policy_id} — Update a performance alert policy (legacy path)

**Endpoint**: `PATCH /v2/ai-governance/performance-alerts/{policy_id}`
**Summary**: Update a performance alert policy (legacy path)
**Tags**: ai-governance, alerting

Partially updates an existing performance alerting policy. Only the supplied fields are changed; omitted fields retain their current values. Prefer /performance/alert-policies/{policy_id} — this path is a legacy alias retained for backward compatibility. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/performance-alerts/{policy_id} — Delete a performance alert policy (legacy path)

**Endpoint**: `DELETE /v2/ai-governance/performance-alerts/{policy_id}`
**Summary**: Delete a performance alert policy (legacy path)
**Tags**: ai-governance, alerting

Permanently removes a performance alerting policy, stopping future alert generation for that metric/resource combination. Existing open alerts are unaffected. Prefer /performance/alert-policies/{policy_id} — this path is a legacy alias retained for backward compatibility. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/issues — List AI governance issues

**Endpoint**: `GET /v2/ai-governance/issues`
**Summary**: List AI governance issues
**Tags**: ai-governance, alerting

Returns paginated AI governance issues with comprehensive filtering by severity, status, rule type, resource endpoint, direction, and date range. Supports toggling between the modern Issues table and legacy alert table via `use_issues_table`. Sortable by severity, triggered time, endpoint name, or rule type. Use for building investigation dashboards or triaging governance violations. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `use_issues_table` (query, optional): Use Issue table (true) or AiGovernanceAlert table (false, legacy)
- `search` (query, optional): Search by rule display name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `rule_types` (query, optional): Filter by rule types
- `resource_instance_id` (query, optional): 
- `resource_instance_ids` (query, optional): Filter by multiple resource instance IDs
- `direction` (query, optional): Filter by Input or Output direction (case-insensitive). Omit to return both directions.
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `orderBy` (query, optional): 
- `sortOrder` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance-issues — List AI governance issues (legacy path, issues table only)

**Endpoint**: `GET /v2/ai-governance/governance-issues`
**Summary**: List AI governance issues (legacy path, issues table only)
**Tags**: ai-governance, alerting

Returns paginated AI governance issues using the Issues table (no legacy toggle). Identical filtering capabilities to /issues but always queries the modern Issues table. Prefer /governance/issues — this path is a legacy alias. Filterable by severity, status, rule type, resource endpoint, and date range. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by rule display name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `rule_types` (query, optional): Filter by rule types
- `resource_instance_id` (query, optional): 
- `resource_instance_ids` (query, optional): Filter by multiple resource instance IDs
- `direction` (query, optional): Filter by Input or Output direction (case-insensitive). Omit to return both directions.
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `orderBy` (query, optional): 
- `sortOrder` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/issues/{issue_id} — Get AI governance issue detail (legacy path)

**Endpoint**: `GET /v2/ai-governance/issues/{issue_id}`
**Summary**: Get AI governance issue detail (legacy path)
**Tags**: ai-governance, alerting

Returns full detail for a single AI governance issue: resource context, associated alerts (up to 20 most recent), incident tracking, and available workflow actions. Supports toggling between the modern Issues table and legacy alert table via `use_issues_table`. Prefer /governance/issues/{issue_id}. Returns 404 if the issue does not exist or does not belong to the authenticated customer. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 
- `use_issues_table` (query, optional): Use Issue table (true) or AiGovernanceAlert table (false, legacy)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/issues/{issue_id}/alerts/{alert_id} — Get AI governance alert detail

**Endpoint**: `GET /v2/ai-governance/issues/{issue_id}/alerts/{alert_id}`
**Summary**: Get AI governance alert detail
**Tags**: ai-governance, alerting

Returns full detail for a single AI governance or session-policy alert: Info-tab metadata (resource, direction, threshold, counts), triggering attributes, and Remediate deep-link IDs. Returns 404 if the alert does not exist, does not belong to the issue, or does not belong to the authenticated customer. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 
- `alert_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Alert not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/issues/{issue_id}/alerts/{alert_id}/affected-requests — List affected requests for an AI governance alert

**Endpoint**: `GET /v2/ai-governance/issues/{issue_id}/alerts/{alert_id}/affected-requests`
**Summary**: List affected requests for an AI governance alert
**Tags**: ai-governance, alerting

Returns the paginated affected events/turns for a single AI governance or session-policy alert. Session-policy alerts return the flagged_event_ids subset (not the whole session). Governance-tag rate alerts return the violating event-blocks in the breached metric bucket (the same set the ETL counted when it fired the alert); a governance-tag alert that is not ETL-aligned returns an empty list with a 200. Performance alerts do not exist on this path and return 404. Returns 404 if the alert does not exist, does not belong to the issue, or does not belong to the authenticated customer. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 
- `alert_id` (path, required): 
- `page` (query, optional): 
- `page_size` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Alert not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/issues/{issue_id}/alerts — List alerts for a governance issue (legacy path)

**Endpoint**: `GET /v2/ai-governance/issues/{issue_id}/alerts`
**Summary**: List alerts for a governance issue (legacy path)
**Tags**: ai-governance, alerting

Returns paginated alerts associated with a specific AI governance issue. Supports filtering by alert status, severity, and policy type, and sorting by triggered time or other fields. Returns 404 if the issue does not exist or has no alerts. Prefer /governance/issues/{issue_id}/alerts. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 
- `page` (query, optional): 
- `page_size` (query, optional): 
- `status` (query, optional): 
- `severity` (query, optional): 
- `policy_type` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/requests/search — Search governance-tagged LLM requests (canonical path)

**Endpoint**: `GET /v2/ai-governance/governance/requests/search`
**Summary**: Search governance-tagged LLM requests (canonical path)
**Tags**: ai-governance, governance

Returns individual LLM requests tagged by a governance scanner rule, including tag labels and confidence scores. Use to drill down from aggregated chart spikes into raw request data for a specific rule type, tag, or time range. Filterable by rule type, governance tag, direction, date range, and resource endpoint. Paginated. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `rule_type` (query, optional): 
- `governance_tag` (query, optional): 
- `direction` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/timeseries — Governance Timeseries

**Endpoint**: `GET /v2/ai-governance/governance/timeseries`
**Summary**: Governance Timeseries
**Tags**: ai-governance, governance

Governance timeseries data. See /dashboard/timeseries for full docs.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `start_date` (query, required): 
- `end_date` (query, required): 
- `timezone` (query, optional): 
- `interval` (query, optional): 
- `granularity` (query, optional): 
- `rule_type` (query, optional): 
- `governance_tag` (query, optional): 
- `governance_target` (query, optional): 
- `direction` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/filter-options — Get available filter options for governance views

**Endpoint**: `GET /v2/ai-governance/governance/filter-options`
**Summary**: Get available filter options for governance views
**Tags**: ai-governance, governance

Returns the rule types, governance tags, and direction options present in the customer's actual governance data, enabling dynamic population of filter controls. Optionally scoped to a specific resource instance, organization, or project. Use to initialize filter dropdowns before querying governance timeseries or issues. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): Optional resource instance ID to filter results
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `statuses` (query, optional): Only count issues with these statuses (e.g. UNRESOLVED)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/filter-options — Get available filter options for performance issues

**Endpoint**: `GET /v2/ai-governance/performance/filter-options`
**Summary**: Get available filter options for performance issues
**Tags**: ai-governance, performance

Returns the metric names and use-case (resource) options present in the customer's performance issue data, enabling dynamic population of filter controls on the performance issues view. Optionally scoped to a specific organization, project, or issue status. Use to initialize filter dropdowns before querying performance issues. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `statuses` (query, optional): Only count issues with these statuses (e.g. UNRESOLVED)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/session/filter-options — Get available filter options for session-policy issues

**Endpoint**: `GET /v2/ai-governance/session/filter-options`
**Summary**: Get available filter options for session-policy issues
**Tags**: ai-governance, governance

Returns the session-policy names and use-case (resource) options present in the customer's session-policy issue data, enabling dynamic population of filter controls on the session-policy issues tab. Optionally scoped to a specific organization, project, or issue status. Use to initialize filter dropdowns before querying session/issues. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `statuses` (query, optional): Only count issues with these statuses (e.g. UNRESOLVED)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/issues — List AI governance issues

**Endpoint**: `GET /v2/ai-governance/governance/issues`
**Summary**: List AI governance issues
**Tags**: ai-governance, governance

Returns a paginated list of AI governance issues (alert-type issues) for the customer. Filter by severity, status, rule type, or resource endpoint. Issues represent grouped alert events from governance scanners such as sentiment, toxicity, or PII detection. Use to build investigation dashboards or triage governance violations. Scoped to the authenticated customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by rule display name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `rule_types` (query, optional): Filter by rule types
- `resource_instance_id` (query, optional): 
- `resource_instance_ids` (query, optional): Filter by multiple resource instance IDs
- `direction` (query, optional): Filter by Input or Output direction (case-insensitive). Omit to return both directions.
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `orderBy` (query, optional): 
- `sortOrder` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/session/issues — List session-policy alert issues

**Endpoint**: `GET /v2/ai-governance/session/issues`
**Summary**: List session-policy alert issues
**Tags**: ai-governance, governance

Returns paginated SESSION_POLICY_ALERT issues raised by session-level policies (e.g. CustomPolicy, RunawayToolLoopPolicy, RepeatedJailbreakPolicy). Direction is always null for session-policy issues. Filterable by severity, status, rule type, resource endpoint, and date range. Use to back the session-policy Issues tab alongside governance and performance issue tabs. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Substring match against resource UUID (exact), resource display name, hydrated rule_type, and issue display name. Wildcard characters (`%`, `_`) in the input are escaped — they cannot be used to broaden the match.
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `rule_types` (query, optional): Filter by session-policy rule type. Values are ``SessionPolicyType`` enum members (e.g. ``CustomPolicy``, ``RunawayToolLoopPolicy``, ``RepeatedJailbreakPolicy``). Invalid values return 400.
- `resource_instance_id` (query, optional): Filter by specific resource instance
- `resource_instance_ids` (query, optional): Filter by one or more resource instance IDs. Omit the parameter entirely to disable resource-id filtering.
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `orderBy` (query, optional): 
- `sortOrder` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/alert-policies — List governance alert policies for a dashboard

**Endpoint**: `GET /v2/ai-governance/governance/alert-policies`
**Summary**: List governance alert policies for a dashboard
**Tags**: ai-governance, governance

Returns all governance alerting policies configured on a specific dashboard, identified by resource instance, rule type, direction, and granularity. Multiple policies with different thresholds and severities can exist on the same dashboard. Use to review or manage alert configurations before creating new ones. Scoped to the authenticated customer.

**Parameters**:
- `resource_instance_id` (query, required): Resource instance ID
- `rule_type` (query, required): Governance rule type
- `direction` (query, required): Input or Output direction
- `granularity` (query, required): Metric time-window granularity: 5min, hour, day, week, or month
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/governance/alert-policies — Create a governance alert policy

**Endpoint**: `POST /v2/ai-governance/governance/alert-policies`
**Summary**: Create a governance alert policy
**Tags**: ai-governance, governance

Creates a new governance alerting policy on a specific dashboard (resource instance, rule type, direction, granularity). Multiple policies can coexist on the same dashboard with different threshold levels and severities. Use to configure proactive monitoring for sentiment, toxicity, PII, or other governance scanners. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `409`: A byte-identical policy already exists
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/governance/alert-policies/{policy_id} — Update a governance alert policy

**Endpoint**: `PATCH /v2/ai-governance/governance/alert-policies/{policy_id}`
**Summary**: Update a governance alert policy
**Tags**: ai-governance, governance

Partially updates an existing governance alerting policy by policy_id. Only the supplied fields are changed; omitted fields retain their current values. Use to adjust threshold values, change severity, or enable/disable a policy. Returns 404 if the policy does not belong to the authenticated customer.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/governance/alert-policies/{policy_id} — Delete a governance alert policy

**Endpoint**: `DELETE /v2/ai-governance/governance/alert-policies/{policy_id}`
**Summary**: Delete a governance alert policy
**Tags**: ai-governance, governance

Permanently removes a governance alerting policy, stopping future alert generation for that rule/resource/direction combination. Existing open alerts are unaffected and must be resolved separately. The deletion is logged for audit purposes. Returns 204 on success. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/issues/{issue_id} — Get governance issue detail

**Endpoint**: `GET /v2/ai-governance/governance/issues/{issue_id}`
**Summary**: Get governance issue detail
**Tags**: ai-governance, governance

Returns full detail for a single AI governance issue including associated alerts, resource context, and available workflow actions. Use after listGovernanceIssues to investigate a specific issue, review its alert history, or gather context for remediation. Returns 404 if the issue does not belong to the authenticated customer.

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/governance/issues/{issue_id} — Update governance issue status

**Endpoint**: `PATCH /v2/ai-governance/governance/issues/{issue_id}`
**Summary**: Update governance issue status
**Tags**: ai-governance, governance

Updates the status of an AI governance issue (e.g. close or reopen). Provide the new status value in the request body. Use to acknowledge, resolve, or reopen issues as part of a remediation workflow. Returns 404 if the issue does not belong to the authenticated customer.

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/issues/{issue_id}/alerts — List alerts for a governance issue

**Endpoint**: `GET /v2/ai-governance/governance/issues/{issue_id}/alerts`
**Summary**: List alerts for a governance issue
**Tags**: ai-governance, governance

Returns paginated alerts associated with a specific AI governance issue. Each alert includes its severity, current rate, threshold violated, and timestamp. Use after getGovernanceIssueDetail to page through all historical alert events for trend analysis or escalation context. Scoped to the authenticated customer.

**Parameters**:
- `issue_id` (path, required): 
- `page` (query, optional): 
- `page_size` (query, optional): 
- `status` (query, optional): 
- `severity` (query, optional): 
- `policy_type` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/timeseries — Get performance metrics time-series (canonical path)

**Endpoint**: `GET /v2/ai-governance/performance/timeseries`
**Summary**: Get performance metrics time-series (canonical path)
**Tags**: ai-governance, performance

Returns candlestick-ready performance metrics (latency, tokens, request rates, success rate) for a specific LLM endpoint over a time range. Canonical path mirroring /dashboard/performance/timeseries. When `metric` is omitted, all available metrics are returned as an array. Use to drive performance trend charts or investigate latency regressions. Scoped to the token's customer.

**Parameters**:
- `metric` (query, optional): 
- `start_date` (query, required): 
- `end_date` (query, required): 
- `interval` (query, optional): 
- `resource_instance_id` (query, required): 
- `timezone_str` (query, optional): 
- `timezone` (query, optional): 
- `series` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/requests/search — Search LLM requests for performance drill-down

**Endpoint**: `GET /v2/ai-governance/performance/requests/search`
**Summary**: Search LLM requests for performance drill-down
**Tags**: ai-governance, performance

Returns individual LLM requests within a time range sorted by a specific performance metric (worst offenders first by default). Use to drill down from a performance alert into the raw requests that contributed to the threshold breach. Includes governance tags, input/output previews, and threshold comparison per request. Accepts start_date/end_date or legacy bucket_start/bucket_end params. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, required): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 
- `direction` (query, optional): 
- `bucket_start` (query, optional): 
- `bucket_end` (query, optional): 
- `metric_name` (query, optional): 
- `aggregator` (query, optional): 
- `sort_order` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/performance/alert-policies/{policy_id} — Update a performance alert policy

**Endpoint**: `PATCH /v2/ai-governance/performance/alert-policies/{policy_id}`
**Summary**: Update a performance alert policy
**Tags**: ai-governance, performance

Partially updates an existing performance alerting policy. Only the supplied fields are changed; omitted fields retain their current values. Use to adjust threshold values, change severity level, or enable/disable a policy without deleting it. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/performance/alert-policies/{policy_id} — Delete a performance alert policy

**Endpoint**: `DELETE /v2/ai-governance/performance/alert-policies/{policy_id}`
**Summary**: Delete a performance alert policy
**Tags**: ai-governance, performance

Permanently removes a performance alerting policy, stopping future alert generation for that metric/resource/granularity combination. Existing open alerts are unaffected. Returns 204 on success. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/policies — Create a governance policy definition

**Endpoint**: `POST /v2/ai-governance/policies`
**Summary**: Create a governance policy definition
**Tags**: ai-governance, policies

Creates a centrally-managed policy definition specifying what to detect (rule type, detection config, severity, and signal config). Definitions can be created before any resource activity exists. Assign them to the resource hierarchy with POST /policies/{id}/assignments to make them active. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/policies — List governance policy definitions

**Endpoint**: `GET /v2/ai-governance/policies`
**Summary**: List governance policy definitions
**Tags**: ai-governance, policies

Returns the customer's governance policy definitions. Filterable by enabled state, detection method, severity, and policy type; `search` matches a substring of the policy name. Paginated when `page`/`per_page` are supplied; returns all definitions unpaginated when omitted. Use to browse, audit, or select policies before assigning them to resources. Scoped to the token's customer.

**Parameters**:
- `is_enabled` (query, optional): 
- `detection_method` (query, optional): 
- `severity` (query, optional): 
- `policy_type` (query, optional): 
- `search` (query, optional): Substring match against the policy name.
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/policies/{policy_definition_id} — Get a governance policy definition

**Endpoint**: `GET /v2/ai-governance/policies/{policy_definition_id}`
**Summary**: Get a governance policy definition
**Tags**: ai-governance, policies

Returns the full detail of a single governance policy definition including its detection configuration, signal configuration, severity, and enabled state. Use to inspect or review a specific policy before updating or assigning it. Returns 404 if the definition does not belong to the authenticated customer. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-governance/policies/{policy_definition_id} — Update a governance policy definition

**Endpoint**: `PATCH /v2/ai-governance/policies/{policy_definition_id}`
**Summary**: Update a governance policy definition
**Tags**: ai-governance, policies

Partially updates a governance policy definition. Only the fields present in the request body are changed; omitted fields retain their current values. An explicit `description: null` clears the description field. Use to adjust detection config, severity, signal config, or enable/disable a policy. Returns 404 if the definition does not belong to the authenticated customer. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/policies/{policy_definition_id} — Delete a governance policy definition

**Endpoint**: `DELETE /v2/ai-governance/policies/{policy_definition_id}`
**Summary**: Delete a governance policy definition
**Tags**: ai-governance, policies

Soft-deletes a governance policy definition and all of its assignments, preventing it from firing on any resource. Idempotent from the caller's view — a missing definition returns 404. Use deleteGovernancePolicyAssignment to remove individual assignments without deleting the definition. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/policies/{policy_definition_id}/enabled — Enable or disable a governance policy definition

**Endpoint**: `POST /v2/ai-governance/policies/{policy_definition_id}/enabled`
**Summary**: Enable or disable a governance policy definition
**Tags**: ai-governance, policies

Sets the enabled state of a governance policy definition without modifying any other configuration. When disabled, the policy will not fire on any assigned resources. Use as a quick toggle to pause or resume monitoring without deleting the policy or its assignments. Returns the updated policy definition. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/policies/{policy_definition_id}/duplicate — Duplicate a governance policy definition

**Endpoint**: `POST /v2/ai-governance/policies/{policy_definition_id}/duplicate`
**Summary**: Duplicate a governance policy definition
**Tags**: ai-governance, policies

Creates a copy of a governance policy definition's detection and signal configuration under a new name. Assignments are NOT copied — the duplicate starts unassigned so it can be reviewed and adjusted before being assigned to resources. Use to quickly create variations of an existing policy. Returns 404 if the source definition does not exist. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Source policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/policies/{policy_definition_id}/health — Get governance policy health

**Endpoint**: `GET /v2/ai-governance/policies/{policy_definition_id}/health`
**Summary**: Get governance policy health
**Tags**: ai-governance, policies

Returns whether a governance policy can currently fire: it must be enabled AND have at least one enabled assignment. The `is_configured_but_inactive` flag signals the empty state — the policy exists but is not yet monitoring any resource. Use after createGovernancePolicyDefinition to confirm the policy is ready to fire, or to show a configuration-needed prompt in the UI. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-governance/policies/{policy_definition_id}/assignments — Assign a governance policy to a hierarchy level

**Endpoint**: `POST /v2/ai-governance/policies/{policy_definition_id}/assignments`
**Summary**: Assign a governance policy to a hierarchy level
**Tags**: ai-governance, policies

Binds a governance policy definition to a specific scope in the resource hierarchy: global (customer-wide), organization, project, or a specific resource endpoint. The assignment auto-applies to all current and future matching resources at that scope. Supply exactly the ID that matches `scope_level`. Returns 404 if the definition does not exist. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/policies/{policy_definition_id}/assignments — List a governance policy's assignments

**Endpoint**: `GET /v2/ai-governance/policies/{policy_definition_id}/assignments`
**Summary**: List a governance policy's assignments
**Tags**: ai-governance, policies

Returns all hierarchy assignments for a specific governance policy definition. Each assignment shows the scope level (global, org, project, or resource), the associated scope ID, and its enabled state. Use to audit where a policy is currently applied or identify scopes that need to be added or removed. Scoped to the token's customer.

**Parameters**:
- `policy_definition_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-governance/policy-assignments/{policy_assignment_id} — Delete a governance policy assignment

**Endpoint**: `DELETE /v2/ai-governance/policy-assignments/{policy_assignment_id}`
**Summary**: Delete a governance policy assignment
**Tags**: ai-governance, policies

Removes a single governance policy assignment, unscoping the policy from that specific hierarchy level (org, project, or resource). The policy definition and its other assignments are unaffected. Use to narrow the scope of a policy without deleting the policy itself. Returns 204 on success. Scoped to the token's customer.

**Parameters**:
- `policy_assignment_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy assignment not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-governance/policy-templates — List built-in governance policy templates

**Endpoint**: `GET /v2/ai-governance/policy-templates`
**Summary**: List built-in governance policy templates
**Tags**: ai-governance, policies

Returns the catalogue of built-in policy templates that can be instantiated into working customer-owned policy definitions. Each template includes pre-configured detection and signal settings for common governance use cases. Use to browse available templates before calling instantiateGovernancePolicyTemplate. Not tenant-scoped — templates are platform-wide and available to all customers.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## POST /v2/ai-governance/policy-templates/instantiate — Create a policy definition from a template

**Endpoint**: `POST /v2/ai-governance/policy-templates/instantiate`
**Summary**: Create a policy definition from a template
**Tags**: ai-governance, policies

Instantiates a built-in governance policy template into a customer-owned policy definition. Unset fields inherit the template's defaults; provided detection or signal configs replace the template defaults wholesale. The resulting definition starts unassigned — use createGovernancePolicyAssignment to make it active. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---
