---
name: odoo-v19-marketplace-guard
description: >
  Odoo Apps Marketplace compliance guardrail. Prevents marketplace rejection
  by enforcing vendor guidelines: manifest field constraints (name ≤25 chars,
  version 19.0.x.y.z, license LGPL-3/OPL-1, price ≥9 EUR), HTML description
  rules (Bootstrap 4 only, no external links), forbidden practices (no
  obfuscated code, no activation keys, no vendor lock-in). Use when developing
  any module intended for the Odoo Apps Store.
---

# Odoo Apps Marketplace — Compliance Guardrail

Apply these rules whenever developing a module for the Odoo Apps Marketplace.
Violations cause rejection or scoring penalties during marketplace review.

Reference: https://apps.odoo.com/apps/vendor-guidelines

---

## Hard Rejections — Manifest

### `name` must be ≤ 25 characters, no adjectives or company names
```python
# WRONG — too long, contains adjective
'name': 'Amazing Advanced Inventory Barcode Scanner Pro',

# CORRECT
'name': 'Inventory Barcode',  # 18 chars, descriptive, no fluff
```

### `version` must follow `19.0.X.Y.Z` format
```python
# WRONG — missing Odoo version prefix
'version': '1.0.0',

# WRONG — wrong prefix
'version': '17.0.1.0.0',

# CORRECT
'version': '19.0.1.0.0',

# CORRECT — beta (version < 19.0.1.0.0)
'version': '19.0.0.9.0',
```

### `license` must be `LGPL-3` or `OPL-1`
```python
# WRONG — these values cause scan errors
'license': 'LGPL-3.0',
'license': 'GPL-3',
'license': 'MIT',
'license': 'AGPL-3',

# CORRECT
'license': 'LGPL-3',   # Open source
'license': 'OPL-1',    # Proprietary
```

### `price` minimum is 9 EUR if paid
```python
# WRONG — below minimum
'price': 5.00,

# CORRECT — free
'price': 0,

# CORRECT — paid
'price': 9.00,
'currency': 'EUR',  # EUR or USD only
```

### `currency` must be `EUR` or `USD`
```python
# WRONG — causes scan error
'currency': 'GBP',

# CORRECT
'currency': 'EUR',
'currency': 'USD',
```

### `depends` must list ALL dependencies
Missing dependencies cause scan errors. Always verify every model, field, or
view you inherit from has its module listed in `depends`.

---

## Hard Rejections — Description

### Description must be `static/description/index.html`, not markdown
```
WRONG:
  static/description/README.md
  static/description/README.rst
  README.md (in module root)

CORRECT:
  static/description/index.html
```
Non-HTML descriptions are demoted in ranking and may be rejected.

### No external links except YouTube, mailto, and skype
```html
<!-- WRONG — external links cause rejection -->
<a href="https://github.com/myrepo">Source Code</a>
<a href="https://mywebsite.com/docs">Documentation</a>
<a href="https://other-appstore.com/myapp">Also available here</a>
<img src="https://external-site.com/image.png"/>

<!-- CORRECT — allowed link types -->
<a href="https://www.youtube.com/watch?v=XXXXX">Watch Demo</a>
<a href="mailto:support@example.com">Contact Support</a>
<a href="skype:support.user">Skype Support</a>
<img src="screenshot_01.png"/>  <!-- relative path from static/description/ -->
```

### No JavaScript in description
```html
<!-- WRONG — any JS causes rejection -->
<script>alert('hello')</script>
<div onclick="doSomething()">Click</div>
<a href="javascript:void(0)">Link</a>

<!-- CORRECT — no JS at all in index.html -->
```

### Use only Bootstrap 4 / Odoo `oe_*` CSS classes
```html
<!-- WRONG — custom CSS, inline styles -->
<style>.my-class { color: red; }</style>
<div style="background: blue; padding: 20px;">Content</div>
<link rel="stylesheet" href="https://cdn.example.com/styles.css"/>

<!-- CORRECT — Bootstrap 4 and oe_* classes only -->
<section class="oe_container">
    <div class="oe_row oe_spaced">
        <div class="oe_span6">
            <p class="oe_mt32">Content</p>
        </div>
    </div>
</section>
```

### All descriptions and screenshots must be in English

---

## Hard Rejections — Forbidden Practices

### No obfuscated, minified, or encrypted code
All Python source code must be readable. The marketplace scanner rejects:
- Obfuscated variable names (`a`, `b`, `c` for business logic)
- Base64-encoded code blocks that get exec'd
- Encrypted source files
- Compiled `.pyc` without corresponding `.py`

### No activation keys or license validation
```python
# WRONG — vendor lock-in, causes rejection
def check_license(self):
    response = requests.get('https://myserver.com/validate', params={'key': self.license_key})
    if not response.json().get('valid'):
        raise UserError('Invalid license key')

# WRONG — feature gating via external server
if not self.env['ir.config_parameter'].get_param('mymodule.activated'):
    raise UserError('Please activate the module')
```
Customers must own their data and functionality. No vendor lock-in mechanisms.

### External data transmission requires disclosure and opt-in
If your module sends data to external services (API calls, webhooks, analytics),
you MUST:
1. Disclose in `__manifest__.py` `description` field what data is sent and where
2. Disclose in `static/description/index.html` prominently
3. Require explicit user opt-in before any data transmission
4. Link to a Data Privacy Policy

```python
# WRONG — silent data transmission
def action_sync(self):
    requests.post('https://api.external.com/data', json=self.read())

# CORRECT — disclosed, opt-in, privacy policy linked
def action_sync(self):
    if not self.env['ir.config_parameter'].get_param('mymodule.data_sync_consent'):
        raise UserError('Please enable data sync in Settings and review our Privacy Policy.')
    requests.post('https://api.external.com/data', json=self.read())
```

---

## Scoring Penalties

These won't reject your module but will lower its marketplace ranking:

| Missing Element | Impact |
|----------------|--------|
| `static/description/icon.png` (128×128) | Lower ranking |
| Cover image / thumbnail in `images` manifest key | Lower ranking |
| `license` field in manifest | Lower ranking + possible rejection |
| HTML description (`index.html`) | Demoted vs HTML descriptions |
| Rating below 3 stars | Lower ranking |

Always include: **icon**, **cover image**, **license**, **HTML description**.

---

## Enterprise Compliance

### Do NOT clone Odoo Enterprise modules
Creating a module that duplicates the functionality of an existing Odoo
Enterprise module violates the Odoo Enterprise Subscription Agreement.

Examples of what NOT to do:
- Reimplementing Enterprise-only features (e.g., studio, approvals, quality)
- Porting Enterprise modules to Community as "alternatives"
- Copying Enterprise module code under a different name

This can result in permanent removal from the marketplace.
