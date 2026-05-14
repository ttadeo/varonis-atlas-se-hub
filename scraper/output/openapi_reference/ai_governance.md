# ai-governance API Endpoints

## GET /v2/ai-governance/endpoints — List Ai Governance Endpoints

**Endpoint**: `GET /v2/ai-governance/endpoints`
**Summary**: List Ai Governance Endpoints
**Tags**: ai-governance, endpoints

List LLM endpoints with governance monitoring capabilities and statistics.

This endpoint provides an inventory of all LLM resources (OpenAI, Azure OpenAI, Bedrock, etc.)
that are being monitored for AI governance compliance, with optional detailed analytics.

**Response Modes:**
- **simple** (default): Essential endpoint information for overview dashboards
  - Basic identity: resource_instance_id, display_name, resource_type, provider
  - Hierarchy: customer_id, organization_id, project_id for filtering
  - Status: active_alerts, highest_severity, last_request_at for health monitoring
- **advanced**: Full governance analytics for detailed analysis
  - All simple fields plus comprehensive statistics
  - Scanner performance: success rates, error counts, confidence scores
  - Risk distribution: governance tag counts, sentiment analysis, alert patterns
  - Usage analytics: request volumes, peak activity periods

**Optional Enhancements:**
- `include_severity_breakdown=true`: Returns severity counts (CRITICAL, HIGH, MEDIUM, LOW, NO_ISSUES)
  in the response, eliminating need for a separate `/endpoints/severity` call.

**Common Use Cases:**
- Resource inventory management: Use `mode=simple` with hierarchy filters
- Risk assessment: Use `mode=advanced` with `has_active_alerts=true`
- Performance monitoring: Filter by `activity_status` and `last_request_after`
- Scanner health checks: Use `enabled_scanners_only=true` for active monitoring

**Filtering Examples:**
- High-risk resources: `?has_active_alerts=true&severity=HIGH`
- Critical alerts only: `?severity=CRITICAL`
- Endpoints with no issues: `?severity=NO_ISSUES`
- Recent activity: `?last_request_after=2024-01-01&activity_status=active`
- Specific projects: `?organization_id=uuid&project_id=uuid`
- Provider analysis: `?llm_provider_name=OpenAI&mode=advanced`

Supports page-based pagination (default: 50 items per page) for optimal performance
with large resource inventories.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/endpoints/count — Count Ai Governance Endpoints

**Endpoint**: `GET /v2/ai-governance/endpoints/count`
**Summary**: Count Ai Governance Endpoints
**Tags**: ai-governance, endpoints

Count total AI governance endpoints (use cases) for efficient pagination and summary displays.

This lightweight endpoint returns only the total count of AI governance endpoints
that match the specified filters, without fetching the actual endpoint data.
Ideal for frontend dashboards that need to display total counts or implement
efficient pagination.

**Important:** This endpoint uses the same filtering logic as the list endpoint,
ensuring count consistency. By default, only endpoints with enabled scanners
(governance tags) are counted unless `enabled_scanners_only=false` is specified.

**Use Cases:**
- Dashboard summary displays showing total use case counts
- Pagination controls needing total item counts
- Performance-optimized counting for large datasets
- Filtering by governance status, activity level, and hierarchy

**Filtering Examples:**
- All endpoints with governance: `?enabled_scanners_only=true` (default)
- All endpoints regardless of governance: `?enabled_scanners_only=false`
- Organization scope: `?organization_id=uuid`
- Project scope: `?project_id=uuid`
- Active endpoints only: `?activity_status=active`
- Provider-specific: `?llm_provider_name=OpenAI`
- Search by name: `?search=production`

**Performance:**
This endpoint is optimized for speed using COUNT queries rather than data fetching,
making it suitable for frequent polling or real-time dashboard updates.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/requests/search — Search Ai Governance Requests

**Endpoint**: `GET /v2/ai-governance/requests/search`
**Summary**: Search Ai Governance Requests
**Tags**: ai-governance, requests

Search individual requests tagged by governance rules with tag scores.

Returns ALL requests that were tagged by the specified rule_type,
not just those that triggered alerts or blocks. This enables users
to drill down from aggregated AI Monitor charts to investigate
individual request data and validate rule performance.

**Response Format**:
Each request includes governance_tags as an array of objects with:
- **tag_label**: The tag name (e.g., "positive", "negative", "Non_Toxic")
- **tag_score**: Confidence score from 0.0 to 1.0 (e.g., 0.98)

This allows frontend to display tag scores on hover for user analysis.

**Purpose**: Drill-down from aggregated metrics to individual requests

**Key Difference from Capture/Replay**: Returns ALL requests tagged by
the governance scanner, not just those that triggered policy actions.

**Common Use Cases**:
- Investigate spike in sentiment analysis chart
- Review all prompts tagged as "Negative" in a time period
- Validate governance rule performance by examining tagged requests
- Analyze request patterns for specific governance rules
- Filter requests by specific tag labels for focused analysis

**Filtering Examples**:
- By rule: `?rule_type=SentimentRule`
- By specific tag: `?rule_type=SentimentRule&governance_tag=positive`
- Time range: `?start_date=2024-01-01&end_date=2024-01-31`
- Timezone: `?start_date=2024-01-01&end_date=2024-01-31&timezone=America/New_York`
- Specific resource: `?resource_instance_id=uuid&rule_type=SentimentRule`
- Combined filters: `?rule_type=SentimentRule&governance_tag=negative&start_date=2024-01-01`
- Paginated: `?page=2&per_page=100`

Args:
    customer_id: From JWT token (automatic)
    search_params: Query filters and pagination parameters (includes governance_tag, timezone filters)
    session: Database session

Returns:
    Paginated list of requests with governance tags (including scores) and previews

Example Response:
    ```json
    {
      "requests": [{
        "request_id": "uuid",
        "governance_tags": [
          {"tag_label": "Non_Toxic", "tag_score": 0.98}
        ],
        ...
      }],
      "pagination": {...}
    }
    ```

Example:
    GET /v2/ai-governance/requests/search?rule_type=SentimentRule&governance_tag=positive&start_date=2024-01-01&timezone=UTC

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
- `422`: Validation Error

---

## GET /v2/ai-governance/tags — Get Available Governance Tags

**Endpoint**: `GET /v2/ai-governance/tags`
**Summary**: Get Available Governance Tags
**Tags**: ai-governance, requests

Get list of available governance tags for filtering requests.

Returns all unique governance tags found in tagged requests, along with
the count of requests for each tag. For sentiment tags (positive, negative,
neutral), counts are based on the dominant sentiment per request using the
same weighted formula as the request search filter.

**Purpose**: Provide available tag options for frontend dropdowns and filters

**Use Cases**:
- Populate governance_tag filter dropdown in request search UI
- Show tag distribution and frequencies across requests
- Enable users to discover available tags for a specific rule type

**Filtering Examples**:
- All tags: `GET /v2/ai-governance/tags`
- For specific rule: `GET /v2/ai-governance/tags?rule_type=SentimentRule`
- For resource: `GET /v2/ai-governance/tags?resource_instance_id=uuid`
- Date range: `GET /v2/ai-governance/tags?start_date=2025-01-01&end_date=2025-01-31`
- With timezone: `GET /v2/ai-governance/tags?start_date=2025-01-01&timezone=America/New_York`

Args:
    customer_id: From JWT token (automatic)
    tags_params: Query parameters including filters, date range, and timezone
    session: Database session

Returns:
    List of governance tags with request counts, ordered by count descending

Example Response:
    ```json
    {
      "tags": [
        {"tag_label": "positive", "request_count": 150},
        {"tag_label": "neutral", "request_count": 75},
        {"tag_label": "negative", "request_count": 25}
      ]
    }
    ```

**Parameters**:
- `resource_instance_id` (query, optional): 
- `rule_type` (query, optional): 
- `direction` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 
- `timezone` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/timeseries — Get Ai Governance Timeseries

**Endpoint**: `GET /v2/ai-governance/timeseries`
**Summary**: Get Ai Governance Timeseries
**Tags**: ai-governance, analytics

Get governance analytics in time-bucketed format for trend analysis and reporting.

This endpoint provides historical governance data organized by time periods, enabling
trend analysis, compliance reporting, and pattern identification across LLM usage.

**Data Structure:**
- **Request volumes**: Total requests processed per time bucket
- **Scanner performance**: Tag detection rates, confidence scores, error tracking
- **Governance outcomes**: Tag distributions (sentiment, toxicity, compliance)
- **Alert patterns**: Alert generation trends and severity distributions
- **Untagged tracking**: Requests without governance tags (potential blind spots)

**Time Granularities:**
- **hour**: Real-time monitoring, incident investigation (max 7 days)
- **day**: Daily compliance reports, operational dashboards (recommended)
- **week**: Weekly summaries, trend analysis (good for 3-6 months)
- **month**: Executive reporting, long-term compliance tracking

**Governance Targets:**
- **input**: Analyze user prompts (PII detection, content moderation)
- **output**: Analyze LLM responses (sentiment, toxicity, refusal tracking)
- **both**: Complete request/response analysis (comprehensive view)

**Use Cases:**
- **Compliance reporting**: Weekly/monthly governance summaries
- **Incident investigation**: Hour-by-hour analysis during specific events
- **Trend identification**: Identify patterns in sentiment, toxicity over time
- **Scanner optimization**: Analyze which scanners provide most value
- **Resource comparison**: Compare governance performance across endpoints

**Filtering Examples:**
- Incident analysis: `?start_date=2024-01-15&granularity=hour&scanner_types=SentimentRule`
- Monthly report: `?granularity=month&governance_target=both`
- Resource focus: `?resource_instance_id=uuid&granularity=day`

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
- `422`: Validation Error

---

## GET /v2/ai-governance/dashboard/performance/timeseries — Get Performance Dashboard Timeseries

**Endpoint**: `GET /v2/ai-governance/dashboard/performance/timeseries`
**Summary**: Get Performance Dashboard Timeseries
**Tags**: ai-governance, dashboard

Get performance metrics dashboard timeseries data for candlestick chart visualization.

This endpoint provides numeric performance metrics (latency, tokens, request rates, etc.)
formatted for candlestick-style charts. The resource_instance_id parameter is required
for all requests, while metric is optional - when omitted, returns all available metrics
for the specified resource.

**Bulk Retrieval Mode:**
When metric parameter is omitted, returns all available performance metrics for the resource
as an array of metric objects.

**Single Metric Mode:**
When metric is specified, returns a single metric object for that specific metric.

**Available Metrics:**
- `total_tokens`: Combined input + completion tokens per request
- `input_prompt_tokens`: Input token count per request
- `completion_tokens`: Output token count per request
- `requests_per_user_id`: Request count grouped by user ID
- `requests_per_user_ip`: Request count grouped by user IP
- `latency_ms`: Request latency in milliseconds
- `response_generation_rate`: Tokens generated per second (when latency data available)
- `request_success_rate`: Percentage of successful requests

**Percentile Availability:**
Percentiles (p50, p90, p95, p99) are calculated based on statistical sample size requirements:

- `p50` (median): Available with ≥2 samples
- `p90`: Available with ≥10 samples (statistically meaningful percentile)
- `p95`: Available with ≥20 samples (higher statistical accuracy requirement)
- `p99`: Available with ≥100 samples (not yet implemented)

**Null Value Behavior:**
When insufficient data exists for statistically meaningful percentiles:
- Systems with low request volume ("toy" systems, demos) may return `null` for p90/p95
- Production systems with 100k+ daily requests will have complete percentile data
- `p90` and `p95` fields are always present in responses, but may be `null` when data requirements aren't met
- This ensures statistical integrity while maintaining API consistency

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
- `422`: Validation Error

---

## GET /v2/ai-governance/scanners/configuration — Get Scanner Configuration

**Endpoint**: `GET /v2/ai-governance/scanners/configuration`
**Summary**: Get Scanner Configuration
**Tags**: ai-governance, configuration

Get governance scanner configuration and operational status.

This endpoint provides a comprehensive view of all available AI governance scanners,
their current operational status, and configuration details for the customer.

**Scanner Information:**
- **Type identification**: Scanner names and categories (sentiment, toxicity, PII, etc.)
- **Operational status**: Active/inactive based on recent tag generation activity
- **Configuration details**: Alert thresholds, confidence levels, target selections
- **Performance metrics**: Tag generation rates, error counts, coverage statistics

**Status Determination:**
Scanner status is determined by actual usage rather than configuration settings:
- **Enabled**: Scanner has generated tags in the last 30 days
- **Available**: Scanner exists but hasn't been active recently
- **Configured**: Scanner has specific alert thresholds or targets set

**Use Cases:**
- **Scanner audit**: Verify which scanners are actively monitoring your resources
- **Configuration review**: Check alert thresholds and target settings
- **Coverage analysis**: Identify gaps in governance monitoring
- **Performance monitoring**: Track scanner effectiveness and reliability
- **Compliance validation**: Ensure required scanners are operational

**Response Structure:**
- **scanners[]**: Array of scanner objects with type, status, and configuration
- **summary**: Counts of enabled vs total scanners for quick overview
- **coverage_metrics**: Overall governance monitoring coverage statistics

This endpoint is essential for governance dashboard setup and scanner health monitoring.

**Responses**:
- `200`: Successful Response

---

## GET /v2/ai-governance/dashboard/filter-options — Get Governance Dashboard Filter Options

**Endpoint**: `GET /v2/ai-governance/dashboard/filter-options`
**Summary**: Get Governance Dashboard Filter Options
**Tags**: ai-governance, dashboard

Get available filter options for governance dashboard configuration.

This endpoint discovers and returns the actual governance rule types, tags, and targets
available in the customer's data, enabling dynamic dashboard filter configuration.

**Dynamic Discovery:**
- **Rule types**: All governance scanners that have generated data (SentimentRule, etc.)
- **Governance tags**: Actual tag values found in scanner outputs (Positive Sentiment, etc.)
- **Target options**: Available input/output direction combinations
- **Resource context**: Optionally scoped to specific resource instance

**Response Structure:**
- **rule_types[]**: Available scanner types with display names
- **governance_tags[]**: Tag values organized by rule type
- **targets[]**: Input/Output direction options
- **date_ranges**: Suggested date ranges based on available data

**Use Cases:**
- **Dashboard initialization**: Populate filter dropdowns with actual data
- **Dynamic UI configuration**: Show only relevant filters based on customer data
- **Resource-specific filtering**: Get options scoped to particular endpoints
- **Data validation**: Verify available governance data before querying

**Integration Notes:**
This endpoint is the foundation for governance dashboard UI configuration,
ensuring filter options match actual available data rather than static configurations.
Call this before using `/dashboard/timeseries` to get valid filter parameters.

**Parameters**:
- `resource_instance_id` (query, optional): Optional resource instance ID to filter results

**Responses**:
- `200`: Successful Response
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

## GET /v2/ai-governance/endpoints/severity — Get Use Cases By Severity

**Endpoint**: `GET /v2/ai-governance/endpoints/severity`
**Summary**: Get Use Cases By Severity
**Tags**: ai-governance, alerting

Get a use case breakdown by alert severity for the requested activity window.

Severity is computed from alerts in the `ai_governance_alert` and
`ai_performance_alert` tables, combined. The `Issue` table is not
consulted for severity.

**Severity Categories:**
- **CRITICAL / HIGH / MEDIUM / LOW**: Each use case lands in the bucket
  corresponding to the worst severity of any alert that fired for it
  within the window, across both alert tables.
- **NO_ISSUES**: Use cases that had firewall activity in the window but
  no governance or performance alerts in the window.

**Window parameters:** use `start_date` / `end_date`. The legacy
`last_request_after` / `last_request_before` pair is accepted as a
backward-compat alias and will be removed once frontends migrate. If a
caller sends both pairs, the new names win.

**In-window rule:** an alert counts iff
`COALESCE(activity_timestamp, triggered_at)` falls in
`[start_date, end_date)`. Alerts outside the window do not contribute —
even if their parent Issue is still open.

**Status is ignored.** An alert counts regardless of its `status`
(`OPEN` / `ACKNOWLEDGED` / `RESOLVED` / `IGNORED`) and regardless of its
parent Issue's status. This endpoint answers "what did this use case
experience in the window", not "what is still open right now".

**total_use_cases** is the number of LLM_ENDPOINT resources with
`PROMPT_ANALYSIS` capability that had firewall activity in the window.
`enabled_scanners_only` is deprecated and ignored.

**Response Structure:**
- **severity_breakdown**: Count of use cases per severity bucket; sums
  to `total_use_cases`.
- **total_use_cases**: LLM_ENDPOINT resources with in-window activity.
- **last_updated**: Timestamp of data freshness.

See `docs/ai-monitor/spec/http-api/endpoints-severity.md` for the full
contract.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/thresholds/list — List Thresholds

**Endpoint**: `GET /v2/ai-governance/thresholds/list`
**Summary**: List Thresholds
**Tags**: ai-governance, alerting

List all alerting threshold policies for the customer with optional filtering and pagination.

This endpoint provides a comprehensive view of all configured threshold policies,
enabling threshold management, policy review, and bulk operations workflows.

**Response Features:**
- **Full policy details**: ID, type, thresholds, status, timestamps
- **Resource context**: Resource instance ID and display name for reference
- **Pagination support**: Standard page-based pagination for large policy sets
- **Multi-criteria filtering**: Filter by rule type, direction, resource, or status

**Filtering Options:**
- **rule_type**: Filter by governance scanner type (SentimentRule, ToxicityRule, etc.)
- **direction**: Filter by Input or Output direction
- **resource_instance_id**: Filter policies for specific resource instance
- **is_enabled**: Filter by active/inactive policy status

**Policy Information:**
Each policy item includes:
- **Policy configuration**: Type, thresholds, enabled status
- **Rule context**: Rule type and direction for identification
- **Resource reference**: Associated resource instance with display name
- **Audit trail**: Creation and modification timestamps
- **Operational status**: Whether policy is actively monitoring

**Use Cases:**
- **Policy management dashboard**: Overview of all configured thresholds
- **Bulk configuration review**: Audit and validate threshold settings
- **Resource-specific filtering**: Review policies for particular endpoints
- **Status management**: Identify enabled vs disabled policies
- **Configuration export**: Extract policy configurations for backup/migration

**Response Format:**
Standard paginated response with policy array and pagination metadata,
compatible with existing pagination UI components.

**Parameters**:
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `rule_type` (query, optional): Filter by governance rule type
- `direction` (query, optional): Filter by Input or Output direction
- `resource_instance_id` (query, optional): Filter by resource instance ID
- `is_enabled` (query, optional): Filter by enabled/disabled status

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/thresholds — Get Thresholds

**Endpoint**: `GET /v2/ai-governance/thresholds`
**Summary**: Get Thresholds
**Tags**: ai-governance, alerting

Get existing alerting thresholds for a specific rule and resource.

This endpoint retrieves the current alerting policy configuration for a specific
governance rule type and direction on a particular resource or global policy.

**Policy Types:**
- **absolute**: Direct percentage thresholds (e.g., alert when rate ≥ 15%)
- **relative**: Percentage above available average (e.g., alert when 25% above average)
- **both**: Combined absolute and relative thresholds
- **disabled**: No alerting configured for this rule/resource combination

**Resource Scope:**
- **Resource-specific**: Provide resource_instance_id for resource-specific policy
- **Global**: Omit resource_instance_id (null) for global policy

**Use Cases:**
- Configuration UI initialization for threshold management
- Policy review and audit workflows
- Bulk configuration validation across resources
- Historical threshold change tracking

**Parameters**:
- `rule_type` (query, required): Governance rule type
- `direction` (query, required): Input or Output direction
- `resource_instance_id` (query, optional): Resource instance ID (null for global policies)

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-governance/thresholds — Set Thresholds

**Endpoint**: `POST /v2/ai-governance/thresholds`
**Summary**: Set Thresholds
**Tags**: ai-governance, alerting

Configure alerting thresholds for AI governance monitoring.

This endpoint creates, updates, or deletes alerting policies for specific governance rules
and resources, enabling proactive monitoring of AI compliance and performance
based on threshold violations.

**Threshold Types:**
- **Absolute Threshold**: Direct percentage comparison
  - Formula: `current_rate >= threshold_percentage`
  - Example: Alert when negative sentiment rate ≥ 15%
  - Use case: Fixed compliance requirements, hard limits

- **Relative Threshold**: Comparison against available average
  - Formula: `current_rate >= (available_average + (available_average * relative_threshold / 100))`
  - Example: Alert when rate exceeds available average by 25%
  - Use case: Trend detection, performance degradation alerts

**Policy Configuration:**
- **policy_type**: Automatically determined based on which thresholds are provided
  - `absolute`: When only absolute_threshold is provided
  - `relative`: When only relative_threshold is provided
  - `both`: When both thresholds are provided
  - `disabled`: When neither threshold is provided (policy disabled)

**Policy Deletion:**
- **Delete via null thresholds**: Set both `absolute_threshold=null` and `relative_threshold=null`
  - Permanently removes the alerting policy from the database
  - Alternative to using DELETE /thresholds/{policy_id} endpoint
  - Supports upsert pattern: create/update when thresholds provided, delete when both null
  - Returns success response with `policy_id=null` when policy is deleted

**Request Validation:**
- Thresholds must be valid percentages (0-100 for absolute, ≥0 for relative)
- Both thresholds null triggers policy deletion
- Policy type is automatically determined: no manual specification needed

**Alert Generation:**
Once configured, thresholds are continuously monitored against incoming
governance data. Violations trigger alert generation with appropriate severity
based on the degree of threshold exceedance.

**Use Cases:**
- Configure compliance monitoring for regulatory requirements
- Set up performance degradation alerts for production systems
- Establish baseline monitoring for new AI deployments
- Bulk threshold configuration across multiple resources
- Delete policies by setting both thresholds to null (upsert pattern)

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-governance/thresholds/{policy_id} — Update Threshold

**Endpoint**: `PATCH /v2/ai-governance/thresholds/{policy_id}`
**Summary**: Update Threshold
**Tags**: ai-governance, alerting

Update an existing alerting threshold policy.

This endpoint allows partial updates to existing alerting policies, enabling
flexible configuration changes without requiring all fields to be provided.

**Updatable Fields:**
- **policy_type**: Change the type of monitoring (absolute, relative, both, disabled)
- **absolute_threshold**: Update the fixed percentage threshold (0-100)
- **relative_threshold**: Update the percentage above available average
- **severity**: Change the alert severity level (CRITICAL, HIGH, MEDIUM, LOW)
- **is_enabled**: Enable or disable the policy without deleting it

**Update Behavior:**
- Only provided fields are updated; omitted fields retain current values
- Threshold requirements are validated based on policy_type changes
- Cannot update rule_type, direction, or resource_instance_id (immutable)
- Updates trigger immediate re-evaluation on new incoming data

**Validation Rules:**
- If updating to policy_type with "absolute", absolute_threshold is required
- If updating to policy_type with "relative", relative_threshold is required
- Thresholds must be valid percentages within allowed ranges

**Use Cases:**
- Adjust thresholds based on observed alert patterns
- Change severity levels for priority adjustments
- Temporarily disable policies without deletion
- Fine-tune thresholds after initial configuration

**Security:**
- Policy must belong to the authenticated customer
- Multi-tenant isolation enforced at service layer

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-governance/thresholds/{policy_id} — Delete Threshold

**Endpoint**: `DELETE /v2/ai-governance/thresholds/{policy_id}`
**Summary**: Delete Threshold
**Tags**: ai-governance, alerting

Delete an alerting threshold policy.

This endpoint permanently removes an alerting policy, stopping all future
alert generation for the associated rule type, direction, and resource.

**Deletion Effects:**
- Policy is permanently removed from the database
- No new alerts will be generated for this rule/resource combination
- Existing open alerts remain unaffected (must be resolved separately)
- Audit trail preserved through soft deletion timestamps

**Use Cases:**
- Remove obsolete monitoring configurations
- Clean up policies for decommissioned resources
- Disable alerting permanently for specific rules
- Policy migration or reorganization workflows

**Security:**
- Policy must belong to the authenticated customer
- Multi-tenant isolation enforced at service layer
- Deletion is logged for audit purposes

**Alternative to Deletion:**
Consider using PATCH to set is_enabled=false for temporary disabling
instead of permanent deletion, allowing easy re-enablement later.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/governance-alert-policies — Get Governance Alerts

**Endpoint**: `GET /v2/ai-governance/governance-alert-policies`
**Summary**: Get Governance Alerts
**Tags**: ai-governance, alerting

List governance alert policies for a specific dashboard.

A dashboard is identified by (customer, resource_instance, rule_type, direction, granularity).
Returns all alert policies configured on that dashboard.

**Parameters**:
- `resource_instance_id` (query, required): Resource instance ID
- `rule_type` (query, required): Governance rule type
- `direction` (query, required): Input or Output direction
- `granularity` (query, required): Metric time-window granularity: 5min, hour, day, week, or month
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-governance/governance-alert-policies — Create Governance Alert

**Endpoint**: `POST /v2/ai-governance/governance-alert-policies`
**Summary**: Create Governance Alert
**Tags**: ai-governance, alerting

Create a new governance alert policy.

Always creates a new policy row — multiple policies can exist on the same dashboard
with different thresholds and severities.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-governance/governance-alert-policies/{policy_id} — Update Governance Alert

**Endpoint**: `PATCH /v2/ai-governance/governance-alert-policies/{policy_id}`
**Summary**: Update Governance Alert
**Tags**: ai-governance, alerting

Update an existing governance alert policy.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-governance/governance-alert-policies/{policy_id} — Delete Governance Alert

**Endpoint**: `DELETE /v2/ai-governance/governance-alert-policies/{policy_id}`
**Summary**: Delete Governance Alert
**Tags**: ai-governance, alerting

Delete a governance alert policy.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/alert-policies — Get Performance Alerts

**Endpoint**: `GET /v2/ai-governance/performance/alert-policies`
**Summary**: Get Performance Alerts
**Tags**: ai-governance, alerting

List performance alert policies for a specific dashboard.

A dashboard is identified by (customer, resource_instance, metric_name, granularity).
Returns all alert policies configured on that dashboard.

**Parameters**:
- `resource_instance_id` (query, required): Resource instance ID
- `metric_name` (query, required): Performance metric name
- `granularity` (query, required): Metric time-window granularity: 5min, hour, day, week, or month
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-governance/performance/alert-policies — Create Performance Alert

**Endpoint**: `POST /v2/ai-governance/performance/alert-policies`
**Summary**: Create Performance Alert
**Tags**: ai-governance, alerting

Create a new performance alert policy.

Always creates a new policy row — multiple policies can exist on the same dashboard
with different thresholds and severities.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/issues — List Performance Issues

**Endpoint**: `GET /v2/ai-governance/performance/issues`
**Summary**: List Performance Issues
**Tags**: ai-governance, alerting

List performance issues (AI_PERFORMANCE_ALERT type).

Returns issues created by the performance alert evaluation ETL,
with alert counts for each issue.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by metric name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `metric_names` (query, optional): Filter by metric names (e.g. latency_ms)
- `resource_instance_id` (query, optional): Filter by resource instance ID
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page
- `orderBy` (query, optional): 
- `sortOrder` (query, optional): 
- `order` (query, optional): 
- `order_by` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-governance/performance/issues/{issue_id} — Update Performance Issue

**Endpoint**: `PATCH /v2/ai-governance/performance/issues/{issue_id}`
**Summary**: Update Performance Issue
**Tags**: ai-governance, alerting

Update a performance issue (e.g. close/reopen).

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/issues/{issue_id}/alerts — List Performance Issue Alerts

**Endpoint**: `GET /v2/ai-governance/performance/issues/{issue_id}/alerts`
**Summary**: List Performance Issue Alerts
**Tags**: ai-governance, performance

Get paginated alerts for a specific performance issue.

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
- `422`: Validation Error

---

## PATCH /v2/ai-governance/performance-alerts/{policy_id} — Update Performance Alert

**Endpoint**: `PATCH /v2/ai-governance/performance-alerts/{policy_id}`
**Summary**: Update Performance Alert
**Tags**: ai-governance, alerting

Update an existing performance alert policy.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-governance/performance-alerts/{policy_id} — Delete Performance Alert

**Endpoint**: `DELETE /v2/ai-governance/performance-alerts/{policy_id}`
**Summary**: Delete Performance Alert
**Tags**: ai-governance, alerting

Delete a performance alert policy.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/issues — Get Ai Governance Issues

**Endpoint**: `GET /v2/ai-governance/issues`
**Summary**: Get Ai Governance Issues
**Tags**: ai-governance, alerting

TODO (xiaochen): remove this api

Get AI governance issues with enhanced filtering and toggle between data sources.

This endpoint provides AI governance issues in an enhanced format with comprehensive
filtering options and the ability to toggle between the modern Issue table and
legacy AiGovernanceAlert table data sources.

**Data Source Toggle:**
- **use_issues_table=true** (default): Query Issue table with AI_GOVERNANCE_ALERT filtering
  - Modern approach using unified Issue table infrastructure
  - Better integration with incident management and workflow systems
  - Consistent with other issue types across the platform
- **use_issues_table=false**: Query AiGovernanceAlert table (legacy)
  - Legacy approach using dedicated alert table
  - Maintained for backward compatibility and migration support
  - Direct alert-to-issue conversion using existing logic

**Enhanced Response Format:**
Each issue includes:
- **Basic info**: issueId, description, severity, status, date
- **Endpoint object**: Comprehensive endpoint information with resource details
- **Associated alerts**: Array of related alerts with severity and timing
- **Incidents**: Array of related incidents for escalation tracking
- **Actions**: Available actions (remediate, ignore, create_incident)

**Advanced Filtering:**
- **search**: Search across rule display names and resource display names
- **statuses**: Filter by multiple issue statuses (OPEN, ACKNOWLEDGED, etc.)
- **severities**: Filter by severity levels (CRITICAL, HIGH, MEDIUM, LOW)
- **rule_types**: Filter by governance rule types (SentimentRule, ToxicityRule, etc.)
- **resource_instance_ids**: Filter by multiple resource instance IDs
- **resource_instance_id**: Filter by specific resource instance UUID (deprecated, use resource_instance_ids)
- **Enhanced sorting**: Support for severity, triggered_at, endpoint_name, rule_type
- **Sort order**: Configurable ascending/descending order
- **Frontend-friendly parameters**: Use `orderBy` and `sortOrder` for camelCase compatibility
- **Hierarchy filtering**: Organization and project scope support

**Default Sorting Strategy:**
Issues are sorted by priority to surface most critical items first:
1. **Severity** (descending): CRITICAL → HIGH → MEDIUM → LOW
2. **Triggered at** (descending): Most recent issues first
3. **Endpoint name** (ascending): Alphabetical for consistent grouping
4. **Rule type** (ascending): Consistent rule type ordering

**Migration Support:**
The toggle parameter enables smooth migration from alert-based to issue-based
data access patterns while maintaining full backward compatibility.

**Parameter Mapping for Frontend:**
For frontend compatibility, use camelCase parameter names that map to backend fields:
- `orderBy="resourceDisplayName"` → sorts by `endpoint_name` (resource display name)
- `orderBy="severity"` → sorts by severity priority
- `orderBy="rule_type"` → sorts by rule type
- `orderBy="triggered_at"` → sorts by triggered timestamp
- `sortOrder="asc|desc"` → ascending/descending sort order
- `severities=["CRITICAL","HIGH"]` → filters by severity levels
- `rule_types=["SentimentRule","ToxicityRule"]` → filters by rule types
- `resource_instance_ids=["uuid1","uuid2"]` → filters by multiple resource instances
- `resource_instance_id="uuid"` → filters by specific resource instance (deprecated)
Legacy parameters (`order`, `order_by`) are still supported for backward compatibility.

**Use Cases:**
- **Modern integration**: Use issues table for new implementations
- **Legacy support**: Maintain alert table access during migration
- **Advanced filtering**: Search and multi-status filtering for large datasets
- **Granular filtering**: Filter by severity, rule type, and resource instance for targeted views
- **Priority management**: Default sorting surfaces most critical issues first
- **Workflow integration**: Enhanced format supports advanced issue workflows

**Response Structure:**
Enhanced V2 response format with endpoint objects, associated alerts array,
and incidents array for comprehensive issue context and workflow support.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/governance-issues — Get Ai Governance Issues V2

**Endpoint**: `GET /v2/ai-governance/governance-issues`
**Summary**: Get Ai Governance Issues V2
**Tags**: ai-governance, alerting

Get AI governance issues (governance-scoped).

Same as /issues but always uses the Issue table (no legacy toggle).

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by rule display name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `rule_types` (query, optional): Filter by rule types
- `resource_instance_id` (query, optional): 
- `resource_instance_ids` (query, optional): Filter by multiple resource instance IDs
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
- `422`: Validation Error

---

## GET /v2/ai-governance/issues/{issue_id} — Get Ai Governance Issue Detail

**Endpoint**: `GET /v2/ai-governance/issues/{issue_id}`
**Summary**: Get Ai Governance Issue Detail
**Tags**: ai-governance, alerting

Get detailed information for a specific AI governance issue.

This endpoint retrieves comprehensive details for a single AI governance issue,
including full context, related alerts, incidents, and available actions.

**Data Source Toggle:**
- **use_issues_table=true** (default): Query Issue table with AI_GOVERNANCE_ALERT filtering
  - Modern approach using unified Issue table infrastructure
  - Full integration with incident management and workflow systems
- **use_issues_table=false**: Query AiGovernanceAlert table (legacy)
  - Legacy approach using dedicated alert table for backward compatibility
  - Direct alert-to-issue conversion with full detail expansion

**Detailed Response:**
- **Complete issue information**: All fields from the list endpoint plus expanded details
- **Full endpoint context**: Comprehensive resource and endpoint information
- **Recent alert history**: Most recent 20 associated alerts with timing and severity details
- **Incident tracking**: Full incident information for escalation and resolution tracking
- **Action context**: Available actions with current status and prerequisites

**Use Cases:**
- **Issue detail views**: Full context for individual issue investigation
- **Incident management**: Complete information for escalation workflows
- **Alert analysis**: Detailed alert context and historical information
- **Resolution workflows**: Full context for remediation planning

**Security:**
- Multi-tenant isolation enforced with customer_id filtering
- Issue must belong to the authenticated customer
- Returns 404 if issue not found or not accessible

**Migration Support:**
The toggle parameter maintains full backward compatibility during migration
from alert-based to issue-based data access patterns.

**Parameters**:
- `issue_id` (path, required): 
- `use_issues_table` (query, optional): Use Issue table (true) or AiGovernanceAlert table (false, legacy)

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/issues/{issue_id}/alerts — Get Issue Alerts

**Endpoint**: `GET /v2/ai-governance/issues/{issue_id}/alerts`
**Summary**: Get Issue Alerts
**Tags**: ai-governance, alerting

Get paginated list of alerts associated with a specific AI governance issue.

This endpoint provides access to all alerts that belong to a specific AI governance issue,
with support for pagination and optional filtering by status and severity.

**Pagination:**
- **page**: 1-based page number (default: 1)
- **page_size**: Number of alerts per page (default: 20, max: 100)
- Standard pagination response with total count and page information

**Filtering Options:**
- **status**: Filter by alert status (OPEN, ACKNOWLEDGED, RESOLVED, IGNORED)
- **severity**: Filter by alert severity (CRITICAL, HIGH, MEDIUM, LOW)

**Sorting Options:**
- **order_by**: Sort field ('triggered_at', 'severity', 'status', 'delta_vs_threshold', 'current_rate')
- **order**: Sort direction ('asc', 'desc') - default: 'desc'
- Default sorting: triggered_at DESC (most recent alerts first)

**Response Structure:**
- **alerts[]**: Array of alert objects with complete alert information
  - Alert details: ID, severity, status, triggered timestamp
  - Threshold information: Current rate, threshold violated, violation type
  - Historical context: 30-day average, percentage above threshold/average
- **pagination**: Standard pagination metadata (page, page_size, total_count, total_pages)

**Alert Information:**
Each alert includes:
- **Basic info**: Alert ID, severity level, current status
- **Timing**: When the alert was triggered and last updated
- **Violation details**: Current rate that triggered the alert
- **Threshold context**: What threshold was exceeded (absolute or relative)
- **Historical comparison**: How current rate compares to historical averages
- **Exceedance metrics**: Percentage above threshold and historical baseline, delta vs threshold (units vary by threshold_type: numeric for absolute, percentage for relative)

**Use Cases:**
- **Issue investigation**: Deep dive into all alerts for a specific governance issue
- **Alert management**: Review and manage alerts associated with an issue
- **Trend analysis**: Understand alert patterns and frequency for an issue
- **Escalation workflows**: Get complete alert context for incident creation

**Security:**
- Multi-tenant isolation enforced with customer_id filtering
- Issue and alerts must belong to the authenticated customer
- Returns 404 if issue not found or not accessible

**Performance:**
- Efficient pagination with database-level filtering
- Optimized queries using foreign key relationships
- Results ordered by triggered_at descending (most recent first)

**Integration:**
This endpoint complements the issue detail endpoint by providing dedicated
alert management capabilities with proper pagination for issues that may
have many associated alerts over time.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/requests/search — Governance Requests Search

**Endpoint**: `GET /v2/ai-governance/governance/requests/search`
**Summary**: Governance Requests Search
**Tags**: ai-governance, governance

Search governance-tagged requests. See /requests/search for full docs.

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

## GET /v2/ai-governance/governance/filter-options — Governance Filter Options

**Endpoint**: `GET /v2/ai-governance/governance/filter-options`
**Summary**: Governance Filter Options
**Tags**: ai-governance, governance

Governance filter options. See /dashboard/filter-options for full docs.

**Parameters**:
- `resource_instance_id` (query, optional): Optional resource instance ID to filter results

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/issues — Governance Issues

**Endpoint**: `GET /v2/ai-governance/governance/issues`
**Summary**: Governance Issues
**Tags**: ai-governance, governance

Governance issues list. See /governance-issues for full docs.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `search` (query, optional): Search by rule display name or resource display name
- `statuses` (query, optional): Filter by issue statuses
- `severities` (query, optional): Filter by severity levels
- `rule_types` (query, optional): Filter by rule types
- `resource_instance_id` (query, optional): 
- `resource_instance_ids` (query, optional): Filter by multiple resource instance IDs
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
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/alert-policies — Governance Alert Policies List

**Endpoint**: `GET /v2/ai-governance/governance/alert-policies`
**Summary**: Governance Alert Policies List
**Tags**: ai-governance, governance

List governance alert policies for a specific dashboard.

A dashboard is identified by (customer, resource_instance, rule_type, direction, granularity).
Returns all alert policies configured on that dashboard.

**Parameters**:
- `resource_instance_id` (query, required): Resource instance ID
- `rule_type` (query, required): Governance rule type
- `direction` (query, required): Input or Output direction
- `granularity` (query, required): Metric time-window granularity: 5min, hour, day, week, or month
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Results per page

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-governance/governance/alert-policies — Governance Alert Policies Create

**Endpoint**: `POST /v2/ai-governance/governance/alert-policies`
**Summary**: Governance Alert Policies Create
**Tags**: ai-governance, governance

Create a new governance alert policy.

Always creates a new policy row — multiple policies can exist on the same dashboard
with different thresholds and severities.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-governance/governance/alert-policies/{policy_id} — Governance Alert Policies Update

**Endpoint**: `PATCH /v2/ai-governance/governance/alert-policies/{policy_id}`
**Summary**: Governance Alert Policies Update
**Tags**: ai-governance, governance

Update an existing governance alert policy.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-governance/governance/alert-policies/{policy_id} — Governance Alert Policies Delete

**Endpoint**: `DELETE /v2/ai-governance/governance/alert-policies/{policy_id}`
**Summary**: Governance Alert Policies Delete
**Tags**: ai-governance, governance

Delete a governance alert policy.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-governance/governance/issues/{issue_id} — Governance Issue Update

**Endpoint**: `PATCH /v2/ai-governance/governance/issues/{issue_id}`
**Summary**: Governance Issue Update
**Tags**: ai-governance, governance

Update a governance issue (e.g. close/reopen).

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-governance/governance/issues/{issue_id}/alerts — Governance Issue Alerts

**Endpoint**: `GET /v2/ai-governance/governance/issues/{issue_id}/alerts`
**Summary**: Governance Issue Alerts
**Tags**: ai-governance, governance

Get paginated alerts for a specific governance issue.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/timeseries — Performance Timeseries

**Endpoint**: `GET /v2/ai-governance/performance/timeseries`
**Summary**: Performance Timeseries
**Tags**: ai-governance, performance

Performance timeseries data. See /dashboard/performance/timeseries for full docs.

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
- `422`: Validation Error

---

## GET /v2/ai-governance/performance/requests/search — Performance Requests Search

**Endpoint**: `GET /v2/ai-governance/performance/requests/search`
**Summary**: Performance Requests Search
**Tags**: ai-governance, performance

Drill down from a performance alert into individual LLM requests.

Returns requests within a time range sorted by the specified metric
(worst offenders first by default). Includes governance tags,
input/output previews, and threshold comparison.

Accepts either start_date/end_date (new) or bucket_start/bucket_end (legacy).

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
- `422`: Validation Error

---

## PATCH /v2/ai-governance/performance/alert-policies/{policy_id} — Performance Alert Policy Update

**Endpoint**: `PATCH /v2/ai-governance/performance/alert-policies/{policy_id}`
**Summary**: Performance Alert Policy Update
**Tags**: ai-governance, performance

Update a performance alert policy. See /performance-alerts/{id} for full docs.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-governance/performance/alert-policies/{policy_id} — Performance Alert Policy Delete

**Endpoint**: `DELETE /v2/ai-governance/performance/alert-policies/{policy_id}`
**Summary**: Performance Alert Policy Delete
**Tags**: ai-governance, performance

Delete a performance alert policy. See /performance-alerts/{id} for full docs.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
