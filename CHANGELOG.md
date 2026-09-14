# Changelog

All notable changes to the `@apifreaks/openapi-specs` package are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.4.3] - 2026-09-14

### Changed — Commodity APIs migrated from v1.0 to v2.0

All five Commodity API specs now target the `v2.0` server (`https://api.apifreaks.com/v2.0`) instead of `v1.0`. This was verified against the live v2.0 API using a real API key (all request/response shapes below were captured from actual live calls, not inferred).

Affected files:

- `specs/commodity/commodity-prices.json` (Live Commodity Prices — `/commodity/rates/latest`)
- `specs/commodity/commodity-fluctuation.json` (`/commodity/fluctuation`)
- `specs/commodity/commodity-time-series.json` (`/commodity/time-series`)
- `specs/commodity/historical-commodity-prices.json` (`/commodity/rates/historical`)
- `specs/commodity/commodity-symbols.json` (`/commodity/symbols`)

All five files bump `info.version` from `1.0.0` to `2.0.0`.

**Request parameters are unchanged.** Every query parameter (`symbols`, `updates`, `quote`, `startDate`, `endDate`, `date`, `format`) was re-verified live on v2.0 and accepts the exact same names, types, and required/optional status as v1.0. No parameter was added, removed, or renamed.

#### Response/behavior changes found live on v2.0

1. **New `206 Partial Content` response on `rates/latest`, `fluctuation`, `time-series`, and `rates/historical`.** If some (but not all) requested symbols can't be resolved, the endpoint no longer treats it as a hard failure — it returns `206` with the resolved data plus an `unresolved` object. If *no* requested symbol resolves, it's still a `404 SYMBOL_NOT_FOUND` as before. Verified live: `symbols=XAU,FAKESYM` → `206` with `rates.XAU` populated and `unresolved.FAKESYM` present; `symbols=FAKESYM` alone → `404`. Added a `206` response block with example to all four specs, and added `unresolved` as an optional property directly on each success schema (`LiveCommodityPricesResponse`, `CommodityFluctuationResponse`, `CommodityTimeSeriesResponse`, `HistoricalCommodityPricesResponse`) so `200` and `206` share one schema.

2. **`unresolved` entries can include a `suggestions` array of close-match symbols**, e.g. requesting `ZW` (ambiguous/retired) returns `unresolved.ZW = { "message": "Did you mean ZW-SPOT (Wheat Spot) or ZW-FUT (Wheat Futures)?", "suggestions": ["ZW-SPOT", "ZW-FUT"] }`. This applies both on `206` partial success and on `404 SYMBOL_NOT_FOUND`. Added `suggestions` (optional string array) to the `unresolved` schema everywhere it appears.

3. **New `402 Payment Required` / `PAYMENT_REQUIRED` response** documented on all four rate endpoints for exceeding the maximum symbols per request. Not reproducible against the current live catalog (244 active symbols in one request still returned `200`/`206` normally), but this is a confirmed, shipped v2.0 error path — documented per confirmed product changelog, without a fabricated live example payload beyond the standard error envelope shape.

4. **`rates/historical` falls back to the last available rate before the requested date** instead of 404ing, when the exact date has no data (e.g. weekends, or a date after a symbol's last historical print). The returned `rates.<symbol>.date` reflects the actual date used, which can differ from the requested `date`. Verified live with a deprecated symbol (`UANEU`, deprecated 2024-04-14): requesting `date=2024-06-10` returned its `2024-04-14` closing rate. `RATE_NOT_FOUND` (404) now only fires when there's no rate at all on or before the requested date. Schema and description updated to describe this explicitly.

5. **`commodity/fluctuation`**: monthly-updated commodities compute the fluctuation between the first day of the start month and the first day of the end month (not the exact requested dates), and all numeric values are rounded to 2 decimal places. Documented in the endpoint description; not a schema change.

6. **`commodity/time-series`**: a symbol counts as "resolved" if it appears on *at least one* date in the range — missing individual days for an otherwise-resolved symbol are not reported as unresolved, only symbols absent from every date go into `unresolved`. Monthly-updated commodities only have closing rates available. Documented in the endpoint description.

7. **`commodity/symbols` gained new fields**: `description` (string, currently empty for all 245 live symbols but present in the schema), `exchange` (optional string, e.g. `"World Bank"` — present on ~55 of 245 live symbols), `deprecationDate` (optional `YYYY-MM-DD`, present only when a symbol is deprecated), and `status` is now a documented enum (`active` | `inactive`) rather than an always-`active` string. One live symbol (`UANEU`) is currently `inactive`. `updateInterval` gained five more enum values beyond `PER_SECOND`/`PER_MINUTE`: `PER_10_MINUTES`, `PER_HOUR`, `PER_DAY`, `PER_WEEK`, `PER_MONTH`. Added two new examples (an `exchange`-bearing monthly symbol and an `inactive` deprecated symbol) alongside the original two.

8. **`historical-commodity-prices` error envelope was wrong/outdated and has been corrected to match live behavior.** The old spec claimed integer millisecond `timestamp` and a `status` field only. Live v2.0 responses show:
   - `timestamp` is an **ISO 8601 string**, not an integer.
   - Service-level errors (`VALIDATION_ERROR`, `SYMBOL_NOT_FOUND`, `RATE_NOT_FOUND`) use a **`code`** field instead of `status` (gateway-level errors like `Invalid Param Exception` still use `status`).
   - This is the same dual `status`/`code` pattern already documented in `commodity-fluctuation` and `commodity-time-series`; `historical-commodity-prices`'s `ErrorResponse` schema has been rewritten to match that pattern exactly (previously it was a bespoke, inaccurate schema).
   - Added a `missingSymbols` 400 example (gateway-level `Invalid Param Exception`), which the endpoint returns but the old spec never documented.

9. **`commodity/symbols` catalog has grown from 130+ to 245+ commodities**, and gained six new categories beyond the originally-documented Metals/Energy/Agriculture/Livestock: **Industrial, Raw Materials, Oils and Meals, Textiles, Meats, Poultry**. Descriptions in `commodity-symbols.json` and `commodity-prices.json`/`historical-commodity-prices.json` (which referenced "130+ commodities") were updated to "245+" and the full category list.

10. **`rates/latest` `updates` parameter default changed to `10m`.** Per product direction, the APIFreaks latest-rates endpoint should default to the 10-minute update frequency rather than 1-minute (the upstream commodity data provider itself has no such granularity knob — this `updates` parameter is an APIFreaks-specific control on top of it). `updates` remains **required** with allowed values `10m` and `1m`; only the documented/schema default and enum ordering changed (`10m` now listed first/default). No functional request change — this parameter already existed and already worked exactly this way; only the documented default flipped.

11. **`rates/latest` gained an optional `warning` string field** on success responses, present only when currency conversion for the requested `quote` is temporarily unavailable (rates then fall back to each commodity's default currency). Not reproducible on demand live, documented per confirmed product changelog.

12. All inline `path` fields inside example error payloads that hard-coded `/v1.0/...` were updated to `/v2.0/...`.

13. Every `200` success example across all five specs was refreshed with freshly captured live response payloads (new timestamps/prices) to keep examples realistic; response **shapes** for successful `200` responses were otherwise unchanged from v1.0 (still `success`, `timestamp`/`date`/`startDate`+`endDate`, `rates`, `metadata` as applicable).

#### Not changed

- Authentication (`X-apiKey` header / `apiKey` query param), the `X-AF-Credits-Cost` response header, and all 400 validation error messages for `fluctuation` and `time-series` (invalid date format, date doesn't exist, start-after-end, range-exceeded) were re-verified live and are byte-identical to what was already documented.

### Other repo updates

- `specs/README.md`: the "Servers" section now lists all five commodity endpoints under the v2.0 group (previously commodity was undocumented there and implicitly assumed v1.0).
- `src/manifest.ts` regenerated via `npm run generate` to pick up the spec changes (auto-generated file, no manual edits).
- `dist/specs/commodity/*.yaml` regenerated via `npm run generate:yaml`.
