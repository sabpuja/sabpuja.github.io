# Sabpuja Component Lab

Live preview surface for reusable Sabpuja storefront components, blocks, foundations and image-performance tooling.

## Preview routes
- `/components/` — reusable storefront sections
- `/components/reviews/` — SP-COMP-001 Customer Reviews and its variants
- `/blocks/` — reusable UI primitives
- `/foundations/` — color, typography, spacing and layout rules
- `/tools/image-lab/` — image budgets and optimization reports

## Architecture
This repository is the **visual showroom**, not the production storefront.

- Design rules and canonical specifications: `sabpuja/design-system`
- Visual preview gallery: `sabpuja/sabpuja.github.io`
- Shopify implementation: `sabpuja/theme`

## Image pipeline
High-quality source images placed in `assets/images/source/` are processed by GitHub Actions into responsive AVIF and WebP variants in `assets/images/optimized/`. The optimizer never upscales images and produces a JSON manifest with real before/after byte sizes.

## Safety
The site is marked `noindex` and `robots.txt` disallows crawling. Do not place secrets, credentials, private customer data or confidential assets in this repository.
