# PropertyVal UK

AI-powered UK property valuation tool. Enter a postcode to get an instant estimated market value, rental yield, EPC rating, and comparable sold prices — all powered by Claude AI and open government data.

## Data Sources

| Source | Data |
|--------|------|
| [Land Registry](https://landregistry.data.gov.uk) | Sold prices via SPARQL |
| [EPC Open Data](https://epc.opendatacommunities.org) | Energy Performance Certificates |
| [Postcodes.io](https://api.postcodes.io) | Postcode lookup & geocoding |
| [Anthropic Claude](https://anthropic.com) | AI valuation analysis |

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |----------|-------------|
   | `ANTHROPIC_API_KEY` | Get from [console.anthropic.com](https://console.anthropic.com) |
   | `EPC_API_EMAIL` | Register free at [epc.opendatacommunities.org](https://epc.opendatacommunities.org) |
   | `EPC_API_KEY` | Provided after EPC registration |

3. **Run locally**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deploy to Railway

1. Push this repo to GitHub
2. Create a new project on [Railway](https://railway.app) and connect the repo
3. Add environment variables in Railway's dashboard:
   - `ANTHROPIC_API_KEY`
   - `EPC_API_EMAIL`
   - `EPC_API_KEY`
4. Railway auto-detects the `Procfile` and sets `PORT` automatically

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/valuation` | Proxy to Anthropic Claude API |
| `GET` | `/api/epc?postcode=SW1A1AA` | Proxy to EPC Open Data API |

Both endpoints keep API credentials server-side — they are never exposed to the browser.

## Disclaimer

Valuations are AI-generated estimates for informational purposes only and do not constitute professional property advice.
