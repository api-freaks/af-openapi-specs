# APIFreaks OpenAPI specifications

OpenAPI 3.1 documents for [APIFreaks](https://apifreaks.com) API products. Each file is a complete, standalone spec: paths, parameters, request/response schemas, examples, and authentication.

This folder is the source of truth. JSON only. YAML is produced when the npm package is built, not checked in here.

To install the specs as a package (`getSpec`, `SpecSlug`, JSON imports), see the [repository README](../README.md).

## Open a spec

Pick a file, then open it in any OpenAPI-aware tool.

**Swagger Editor:** import this raw GitHub URL (or swap in another path):

```
https://raw.githubusercontent.com/api-freaks/af-openapi-specs/main/specs/ip-intelligence/ip-locator.json
```

**Postman / Insomnia:** import the JSON file as an OpenAPI definition.

**Code generation:** point `openapi-generator`, `orval`, `openapi-typescript`, or similar at the same URL:

```bash
npx openapi-typescript https://raw.githubusercontent.com/api-freaks/af-openapi-specs/main/specs/ip-intelligence/ip-locator.json -o ip-locator.ts
```

The slug is the filename without `.json`. It is the identifier the npm package uses (`getSpec("ip-locator")`).

## Authentication

Every spec uses an API key from [apifreaks.com](https://apifreaks.com). Either form is valid:

| Location | Name       | Example              |
| -------- | ---------- | -------------------- |
| Header   | `X-apiKey` | `X-apiKey: YOUR_KEY` |
| Query    | `apiKey`   | `?apiKey=YOUR_KEY`   |

Successful responses include `X-AF-Credits-Cost`, the credits consumed by that request. Remaining balances: [usage-credits.json](billing/usage-credits.json).

## Servers

Each document declares its base URL under `servers`. Most products use `https://api.apifreaks.com/v1.0`.

These use `https://api.apifreaks.com/v2.0`: IP geolocation, bulk IP geolocation, timezone lookup, domain WHOIS, bulk WHOIS, and astronomy.

Weather products (except astronomy) use `https://api.apifreaks.com/v1.0/weather`.

## Catalog

Grouped by folder. Slug is the stable id; the name links to the file.

### IP intelligence

| Slug                          | Spec                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `ip-locator`                  | [IP Geolocation](ip-intelligence/ip-locator.json)                               |
| `bulk-ip-lookup`              | [Bulk IP Geolocation](ip-intelligence/bulk-ip-lookup.json)                      |
| `ip-threat-intelligence`      | [IP Threat Intelligence](ip-intelligence/ip-threat-intelligence.json)           |
| `bulk-ip-threat-intelligence` | [Bulk IP Threat Intelligence](ip-intelligence/bulk-ip-threat-intelligence.json) |

### Geocoding

| Slug                | Spec                                                  |
| ------------------- | ----------------------------------------------------- |
| `forward-geocoding` | [Forward Geocoding](geocoding/forward-geocoding.json) |
| `reverse-geocoding` | [Reverse Geocoding](geocoding/reverse-geocoding.json) |

### WHOIS

| Slug                          | Spec                                                    |
| ----------------------------- | ------------------------------------------------------- |
| `whois-domain-lookup`         | [Domain WHOIS](whois/whois-domain-lookup.json)          |
| `whois-ip-lookup`             | [IP WHOIS](whois/whois-ip-lookup.json)                  |
| `asn-lookup`                  | [ASN Lookup](whois/asn-lookup.json)                     |
| `domain-whois-history-lookup` | [WHOIS History](whois/domain-whois-history-lookup.json) |
| `reverse-whois`               | [Reverse WHOIS](whois/reverse-whois.json)               |
| `bulk-whois-lookup`           | [Bulk WHOIS](whois/bulk-whois-lookup.json)              |

### DNS

| Slug                 | Spec                                              |
| -------------------- | ------------------------------------------------- |
| `dns-lookup`         | [DNS Lookup](dns/dns-lookup.json)                 |
| `dns-history-lookup` | [DNS History](dns/dns-history-lookup.json)        |
| `reverse-dns-lookup` | [Reverse DNS Lookup](dns/reverse-dns-lookup.json) |
| `bulk-dns-lookup`    | [Bulk DNS Lookup](dns/bulk-dns-lookup.json)       |

### Scraper

| Slug          | Spec                                    |
| ------------- | --------------------------------------- |
| `web-scraper` | [Web Scraper](scraper/web-scraper.json) |

### Email validation

| Slug                    | Spec                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| `email-checker`         | [Email Checker](email-validation/email-checker.json)                 |
| `bulk-email-validation` | [Bulk Email Validation](email-validation/bulk-email-validation.json) |

### Phone validation

| Slug                           | Spec                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `phone-validation`             | [Phone Validation](phone-number-validation/phone-validation.json)                  |
| `bulk-phone-number-validation` | [Bulk Phone Validation](phone-number-validation/bulk-phone-number-validation.json) |

### SSL

| Slug                           | Spec                                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| `ssl-certificate-lookup`       | [SSL Certificate Lookup](ssl/ssl-certificate-lookup.json)             |
| `ssl-certificate-chain-lookup` | [SSL Certificate Chain Lookup](ssl/ssl-certificate-chain-lookup.json) |

### Domain

| Slug                             | Spec                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `domain-search`                  | [Domain Availability](domain/domain-search.json)                             |
| `domain-search-with-suggestions` | [Domain Search with Suggestions](domain/domain-search-with-suggestions.json) |
| `subdomain-lookup`               | [Subdomain Finder](domain/subdomain-lookup.json)                             |
| `bulk-domain-checker`            | [Bulk Domain Checker](domain/bulk-domain-checker.json)                       |

### Screenshot

| Slug                 | Spec                                                     |
| -------------------- | -------------------------------------------------------- |
| `website-screenshot` | [Website Screenshot](screenshot/website-screenshot.json) |
| `bulk-screenshot`    | [Bulk Screenshot](screenshot/bulk-screenshot.json)       |

### PDF

| Slug                         | Spec                                                          |
| ---------------------------- | ------------------------------------------------------------- |
| `merge-pdf`                  | [Merge](pdf/merge-pdf.json)                                   |
| `split-pdf`                  | [Split](pdf/split-pdf.json)                                   |
| `pdf-extract-pages`          | [Extract Pages](pdf/pdf-extract-pages.json)                   |
| `delete-pdf-page`            | [Remove Pages](pdf/delete-pdf-page.json)                      |
| `pdf-to-image`               | [Convert to Image](pdf/pdf-to-image.json)                     |
| `pdf-generator`              | [Generate from Template](pdf/pdf-generator.json)              |
| `pdf-generator-bulk`         | [Bulk Generate from CSV](pdf/pdf-generator-bulk.json)         |
| `pdf-compress`               | [Compress](pdf/pdf-compress.json)                             |
| `rotate-pdf-pages`           | [Rotate](pdf/rotate-pdf-pages.json)                           |
| `pdf-encrypt`                | [Encrypt](pdf/pdf-encrypt.json)                               |
| `pdf-restrict`               | [Restrict](pdf/pdf-restrict.json)                             |
| `pdf-decrypt`                | [Decrypt](pdf/pdf-decrypt.json)                               |
| `pdf-unrestrict`             | [Unrestrict](pdf/pdf-unrestrict.json)                         |
| `linearize-pdf`              | [Linearize](pdf/linearize-pdf.json)                           |
| `pdf-task-status`            | [Task Status](pdf/pdf-task-status.json)                       |
| `pdf-file-status`            | [File Status](pdf/pdf-file-status.json)                       |
| `pdf-files`                  | [List Files](pdf/pdf-files.json)                              |
| `pdf-file`                   | [Delete File](pdf/pdf-file.json)                              |
| `pdf-resource-upload`        | [Upload Resource](pdf/pdf-resource-upload.json)               |
| `pdf-resource-upload-binary` | [Upload Binary Resource](pdf/pdf-resource-upload-binary.json) |
| `pdf-resource-download`      | [Download Resource](pdf/pdf-resource-download.json)           |

### Currency

| Slug                               | Spec                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `currency-rate`                    | [Exchange Rates](currency/currency-rate.json)                                |
| `historical-currency-rate`         | [Historical Exchange Rates](currency/historical-currency-rate.json)          |
| `currency-converter`               | [Currency Converter](currency/currency-converter.json)                       |
| `historical-currency-converter`    | [Historical Currency Converter](currency/historical-currency-converter.json) |
| `currency-time-series`             | [Currency Time Series](currency/currency-time-series.json)                   |
| `currency-fluctuation`             | [Currency Fluctuation](currency/currency-fluctuation.json)                   |
| `geolocalized-currency-conversion` | [IP-to-Currency Conversion](currency/geolocalized-currency-conversion.json)  |
| `currency-supported`               | [Supported Currencies](currency/currency-supported.json)                     |
| `currency-symbols`                 | [Currency Symbols](currency/currency-symbols.json)                           |
| `currency-historical-data-limit`   | [Historical Data Limits](currency/currency-historical-data-limit.json)       |

### Commodity

| Slug                          | Spec                                                                      |
| ----------------------------- | ------------------------------------------------------------------------- |
| `commodity-prices`            | [Live Commodity Prices](commodity/commodity-prices.json)                  |
| `historical-commodity-prices` | [Historical Commodity Prices](commodity/historical-commodity-prices.json) |
| `commodity-fluctuation`       | [Commodity Fluctuation](commodity/commodity-fluctuation.json)             |
| `commodity-time-series`       | [Commodity Time Series](commodity/commodity-time-series.json)             |
| `commodity-symbols`           | [Commodity Symbols](commodity/commodity-symbols.json)                     |

### Financial

| Slug                                 | Spec                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `vat-rates-country`                  | [VAT Rates by Country](financial/vat-rates-country.json)                 |
| `bulk-vat-rates-country`             | [Bulk VAT Rates by Country](financial/bulk-vat-rates-country.json)       |
| `vat-rates-by-ip`                    | [VAT Rates by IP](financial/vat-rates-by-ip.json)                        |
| `vat-number-validation`              | [VAT Number Validation](financial/vat-number-validation.json)            |
| `iban-validation`                    | [IBAN Validation](financial/iban-validation.json)                        |
| `swift-code-lookup`                  | [SWIFT/BIC Lookup](financial/swift-code-lookup.json)                     |
| `swift-code-finder`                  | [SWIFT/BIC Finder](financial/swift-code-finder.json)                     |
| `financial-apis-supported-countries` | [Supported Countries](financial/financial-apis-supported-countries.json) |

### ZIP code

| Slug                      | Spec                                                        |
| ------------------------- | ----------------------------------------------------------- |
| `zip-code-api`            | [ZIP / Postal Code Lookup](zip-code/zip-code-api.json)      |
| `zip-codes-radius-search` | [ZIP Radius Search](zip-code/zip-codes-radius-search.json)  |
| `zip-code-distance`       | [ZIP Distance](zip-code/zip-code-distance.json)             |
| `zip-codes-by-city`       | [ZIP Codes by City](zip-code/zip-codes-by-city.json)        |
| `bulk-zip-code-lookup`    | [Bulk ZIP Lookup](zip-code/bulk-zip-code-lookup.json)       |
| `zip-code-distance-match` | [ZIP Distance Match](zip-code/zip-code-distance-match.json) |
| `zip-codes-by-region`     | [ZIP Codes by Region](zip-code/zip-codes-by-region.json)    |

### Weather

| Slug                  | Spec                                                    |
| --------------------- | ------------------------------------------------------- |
| `live-weather`        | [Live Weather](weather/live-weather.json)               |
| `weather-forecast`    | [Weather Forecast](weather/weather-forecast.json)       |
| `historical-weather`  | [Historical Weather](weather/historical-weather.json)   |
| `time-series-weather` | [Time Series Weather](weather/time-series-weather.json) |
| `air-quality`         | [Air Quality](weather/air-quality.json)                 |
| `marine-weather`      | [Marine Weather](weather/marine-weather.json)           |
| `flood-forecast`      | [Flood Forecast](weather/flood-forecast.json)           |
| `bulk-live-weather`   | [Bulk Live Weather](weather/bulk-live-weather.json)     |
| `astronomy-data`      | [Astronomy](weather/astronomy-data.json)                |

### Geography

| Slug                           | Spec                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| `administrative-units-levels`  | [Admin Levels](geography/administrative-units-levels.json)        |
| `administrative-units`         | [Administrative Units](geography/administrative-units.json)       |
| `administrative-units-details` | [Admin Unit Details](geography/administrative-units-details.json) |
| `countries`                    | [Countries](geography/countries.json)                             |
| `countries-details`            | [Country Details](geography/countries-details.json)               |
| `cities`                       | [Cities](geography/cities.json)                                   |
| `regions`                      | [Regions](geography/regions.json)                                 |
| `subregions`                   | [Subregions](geography/subregions.json)                           |
| `flags-supported`              | [Supported Flags](geography/flags-supported.json)                 |
| `flags`                        | [Flags](geography/flags.json)                                     |

### Timezone

| Slug                 | Spec                                                   |
| -------------------- | ------------------------------------------------------ |
| `timezone-lookup`    | [Timezone Lookup](timezone/timezone-lookup.json)       |
| `timezone-converter` | [Timezone Converter](timezone/timezone-converter.json) |

### User agent

| Slug                     | Spec                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| `user-agent-parser`      | [User Agent Parser](user-agent/user-agent-parser.json)           |
| `bulk-user-agent-parser` | [Bulk User Agent Parser](user-agent/bulk-user-agent-parser.json) |

### Billing

| Slug            | Spec                                        |
| --------------- | ------------------------------------------- |
| `usage-credits` | [Credits Usage](billing/usage-credits.json) |

## Docs and support

- Product docs: [apifreaks.com](https://apifreaks.com)
- Contact: [apifreaks.com/contact](https://apifreaks.com/contact) · support@apifreaks.com
