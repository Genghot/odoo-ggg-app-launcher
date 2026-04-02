---
name: odoo-v19-marketplace-publish
description: >
  Pre-submission checklist for publishing an Odoo 19 module to the Odoo Apps
  Store. Validates required files, manifest fields, description format, repo
  cleanliness, and branch naming. Use when a developer is ready to submit,
  publish, or upload their module to apps.odoo.com.
---

# Odoo 19 — Marketplace Pre-Submission Checklist

When the developer asks to publish, submit, or upload their module to the Odoo
Apps Store, walk through this checklist. Report each item as PASS or FAIL.
Do not skip items — every check matters for marketplace acceptance.

---

## 1. Required Files

Check that all of these exist in the module directory:

| # | File | Required |
|---|------|----------|
| 1.1 | `__manifest__.py` | Yes — module won't be detected without it |
| 1.2 | `static/description/icon.png` | Yes — PNG format, 128×128 pixels. Missing = lower ranking |
| 1.3 | `static/description/index.html` | Yes — HTML description. NOT markdown, NOT RST |
| 1.4 | `LICENSE` | Yes — at module root or repo root. LGPL-3 or OPL-1 text |
| 1.5 | `security/ir.model.access.csv` | Yes — even if empty (header row only), must exist if declared in manifest `data` |

If any file is missing, report FAIL and tell the developer what to create.

---

## 2. Manifest Field Validation

Open `__manifest__.py` and verify:

| # | Field | Rule | FAIL if |
|---|-------|------|---------|
| 2.1 | `name` | Max 25 characters, no adjectives, no company name | Longer than 25 chars |
| 2.2 | `version` | Format `19.0.X.Y.Z` | Does not start with `19.0.` or wrong segment count |
| 2.3 | `license` | `LGPL-3` or `OPL-1` only | Missing, or any other value (`LGPL-3.0`, `GPL-3`, `MIT`, `AGPL-3`) |
| 2.4 | `price` | 0 for free, minimum 9.00 if paid | Between 0.01 and 8.99 |
| 2.5 | `currency` | `EUR` or `USD` only | Any other currency code |
| 2.6 | `depends` | All dependencies listed | Module inherits models/views from unlisted dependencies |
| 2.7 | `images` | Cover image path for marketplace thumbnail | Missing — causes lower ranking |

---

## 3. Description Validation

Open `static/description/index.html` and verify:

| # | Rule | FAIL if |
|---|------|---------|
| 3.1 | HTML format | File is `.md`, `.rst`, or `.txt` instead of `.html` |
| 3.2 | Images are PNG, GIF, or JPEG only | References `.svg`, `.webp`, or other formats |
| 3.3 | Images use relative paths from `static/description/` | References external URLs for images |
| 3.4 | No external links except YouTube, `mailto:`, `skype:` | Links to GitHub, docs sites, other app stores |
| 3.5 | No JavaScript | Any `<script>`, `onclick`, or `javascript:` found |
| 3.6 | No custom CSS | Any `<style>` tags, inline `style=`, or external stylesheets |
| 3.7 | Uses Bootstrap 4 / `oe_*` classes only | Custom class names in markup |
| 3.8 | All text in English | Non-English content in description |

---

## 4. Repo Cleanliness

Check the Git repository state:

| # | Check | FAIL if |
|---|-------|---------|
| 4.1 | Branch is `19.0` | Current branch is `main`, `master`, or anything else |
| 4.2 | No `.pyc` files tracked | `git ls-files '*.pyc'` returns results |
| 4.3 | No IDE files tracked | `git ls-files '.idea' '.vscode' '*.swp'` returns results |
| 4.4 | `.gitignore` exists | Missing — junk files will end up in the repo |
| 4.5 | No uncommitted changes | `git status` shows dirty working tree |

---

## 5. Deploy Key & Submission

After all checks pass, guide the developer:

### 5.1 Deploy Key (if not already set up)

Odoo clones your repo via SSH. You need a deploy key:

1. Generate an SSH key pair (if you don't have one for this repo):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/odoo_deploy_key -C "odoo-apps-deploy"
   ```
2. Add the **public key** (`~/.ssh/odoo_deploy_key.pub`) as a deploy key in your Git host:
   - **GitHub:** Repo → Settings → Deploy keys → Add deploy key (read-only)
   - **GitLab:** Repo → Settings → Repository → Deploy keys
   - **Bitbucket:** Repo → Settings → Access keys
3. Do NOT add this key to your personal SSH keys — keep it repo-scoped

### 5.2 Register on Odoo Apps Store

1. Go to https://apps.odoo.com/apps/upload
2. Sign in (or create a vendor account)
3. Paste your SSH URI:
   ```
   ssh://git@github.com:22/{{ user }}/{{ repo }}#19.0
   ```
   Format: `ssh://git@host(:port)/path#version`
   - Use colon (`:`) only for the port number
   - Use slashes (`/`) to separate server from path
4. Odoo will clone your repo and scan the module
5. Fix any scan errors and push fixes to the `19.0` branch
6. Once the scan passes, your app is published
