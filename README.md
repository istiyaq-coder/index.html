# TechHub India — Flask Prototype

A full-stack prototype implementing the business plan pillars:
- Bulk Tech Procurement (catalog, filters, comparison, cart)
- Specialized Services Marketplace
- Advanced Equipment Rentals
- Vendor network with profiles
- Escrow-style checkout (demo) and basic analytics dashboard

## Quickstart

```bash
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Visit http://127.0.0.1:5000
```

## Notes
- Tailwind is loaded via CDN for fast iteration.
- All data is mock JSON in `/data`. Replace with your DB later.
- Global search uses `/api/search` (client-side).

## Project Structure
```
techhub_india_prototype/
  app.py
  requirements.txt
  data/*.json
  templates/*.html
  static/css, js, img
```
