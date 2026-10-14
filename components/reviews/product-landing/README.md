# SP-COMP-001G | Product Landing Reviews

**Status:** Component Lab preview, not approved for Shopify production.  
**Reference:** https://sabpuja.com/products/navratri-puja-kit  
**Lab preview:** /components/reviews/product-landing/  
**Scope:** One reusable review section for all product landing pages. This augments existing 001A to 001F variants; it does not replace homepage or collection layouts.

## Design and interactions

- Warm ivory #FAF5EA, deep maroon #681E30, antique gold #BE9148, champagne beige #E9D9BA, charcoal #2F2926.
- Two-column review summary plus review/media list on desktop. Stacked summary, reviews, filters and touch-friendly media on mobile.
- Responsive viewport simulation via the lab's Desktop / Tablet / Mobile controls.
- Product context selector: Navratri, Daily Puja, Diwali and Astrology Remedy Kit. A product selector is **for design review only**, not a storefront customer control.
- Topic chips, sample sorting, expandable review list, six sample media slots and accessible lightbox close via Escape.
- 'Write a review' goes to support email in the lab. It is not a review submission API.
- Production-safe switch demonstrates an empty state without fabricated social proof.

## The data contract for staging/production

At runtime, the section must receive an explicit Shopify product identifier. Never match reviews by loose title text or share SKU-linked records between products.

Proposed adapter shape (field presence is not asserted):

```json
{
  "product_id": "<Shopify product ID>",
  "summary": {
    "rating_average": null,
    "rating_count": null,
    "rating_distribution": null
  },
  "reviews": [
    {
      "id": "<provider review ID>",
      "product_id": "<Shopify product ID>",
      "author_display_name": null,
      "rating": null,
      "title": null,
      "body": null,
      "created_at": null,
      "verified_purchase": null,
      "media": [],
      "approved": false
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false
  }
}
```

**Strict source rules:**

1. Render only approved reviews whose product ID exactly matches the requested product.
2. Show **ratings, averages and distribution** only if sourced from the authoritative review provider, with mathematically consistent counts. Hide missing fields rather than substituting example numbers.
3. Show a **verified purchase** badge only when the review provider explicitly confirms it. Missing/unknown/false stays unbadged.
4. Show date only when an authentic date is supplied. Show customer photos only when associated approved review media exist; include useful alt text and lazy loading.
5. Hide the entire media rail if no authenticated customer media exist. Demo tiles are never production images.
6. Do not render JSON-LD Review or AggregateRating schema unless valid, verifiable review records support it.
7. Handle zero reviews, sparse reviews, long text, missing authors, pagination failures, Hindi copy and narrow 320px viewports.
8. Make any topic chips an actual filter over approved review records. Hide unsupported filters, sorting modes, percentage breakdowns or counts.
9. The lab's **Illustrative layout** mode uses fabricated demonstration UI data and must **never** be shipped to Shopify. The sample label must never be removed while those values are present.
10. The production-safe mode is an illustrative empty-state behavior. The actual Shopify theme must load provider data securely and server-side or via an approved frontend endpoint, with appropriate error handling.

## Shopify integration plan (later, staging theme only)

- Package UI as a reusable theme section/snippet rather than copying static HTML into each product landing page.
- Bind the section to `product.id` and section settings (heading, supporting copy, section order, color and review page size).
- Connect the selected review provider (or existing approved source), map source fields to adapter, and add pagination/filtering only for available fields.
- Provide a real review submission flow, or visibly route to an existing supported contact method while the provider is not configured.
- Mount under the editorial product sections before FAQ/related products on Navratri first; use the same section for all other product templates.
- Audit Shopify Translate & Adapt for Hindi and any locale-specific labels. Avoid hardcoded per-product review counts.
- Preserve the existing live theme until staging preview, functionality QA and explicit approval.
- No GitHub Actions are required for this review component work.

## QA acceptance

- Desktop, tablet and mobile at 320, 390, 768, 1024 and 1440 px without overflow.
- Topic and sort controls update sample cards, and Show more / Show fewer works; no controls are inert.
- Media preview opens and closes via button, backdrop and Escape with focus restored.
- Mode switch never leaks demonstration ratings into the safe state.
- Product switching updates the product context and email subject, without attributing sample reviews to the selected SKU.
- Accessibility: labelled controls, visible keyboard focus, semantic headings, meaningful screen-reader labels, no missing media alt text in production.
- Performance: CSS and JS scoped to component; lazy load authenticated review thumbnails; no heavy third-party script until needed.
- Staging review QA checks aggregate totals, author and product provenance, verified badge truth, duplicate reviews, negative filters and Hindi.
