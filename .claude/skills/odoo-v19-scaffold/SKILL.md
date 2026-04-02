---
name: odoo-v19-scaffold
description: >
  Scaffold a new Odoo 19 CE project with Docker and a marketplace-ready module.
  Generates docker-compose.yml (Odoo 19.0 + PostgreSQL 16), config/odoo.conf,
  and a module inside addons/ with marketplace-compliant __manifest__.py,
  Bootstrap 4 index.html, icon placeholder, LICENSE, security CSV.
  Initializes git repo with 19.0 branch for Odoo Apps Store submission.
  Use when a developer wants to start a new Odoo 19 custom module project.
---

# Odoo 19 CE — Project Scaffold

When the developer asks to create, scaffold, or start a new Odoo 19 project
or module, generate the following files **exactly as shown**. Do not improvise
— copy these templates verbatim, replacing only the placeholders marked
with `{{ }}`.

## Generated Structure

```
project-root/
├── docker-compose.yml
├── config/
│   └── odoo.conf
├── addons/
│   └── {{ module_name }}/
│       ├── __manifest__.py
│       ├── __init__.py
│       ├── models/
│       │   └── __init__.py
│       ├── views/
│       ├── security/
│       │   └── ir.model.access.csv
│       ├── data/
│       ├── static/
│       │   └── description/
│       │       ├── index.html
│       │       └── icon.png
│       └── LICENSE
└── .gitignore
```

---

## 1. docker-compose.yml

Create this file at the project root:

```yaml
services:
  odoo:
    image: odoo:19.0
    depends_on:
      - db
    ports:
      - "8069:8069"
    volumes:
      - odoo-data:/var/lib/odoo
      - ./config:/etc/odoo
      - ./addons:/mnt/extra-addons
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_PASSWORD=odoo
      - POSTGRES_USER=odoo
    volumes:
      - db-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  odoo-data:
  db-data:
```

## 2. config/odoo.conf

Create `config/` directory and this file inside it:

```ini
[options]
addons_path = /mnt/extra-addons
data_dir = /var/lib/odoo
; admin_passwd = changeme
```

---

## 3. `addons/{{ module_name }}/__manifest__.py`

```python
{
    'name': '{{ Module Name }}',  # MAX 25 chars, no adjectives, no company name
    'version': '19.0.1.0.0',  # Format: 19.0.major.minor.patch — beta must be < 19.0.1.0.0
    'category': '{{ Category }}',  # e.g. Sales, Inventory, Accounting, Website
    'summary': '{{ Brief feature overview }}',
    'description': '',  # Leave empty — use static/description/index.html instead
    'author': '{{ Author Name }}',
    'website': '{{ https://your-website.com }}',
    'license': 'LGPL-3',  # LGPL-3 (open source) or OPL-1 (proprietary) ONLY
    'price': 0,  # If paid: minimum 9.00 — set 0 for free
    'currency': 'EUR',  # EUR or USD only
    'depends': [
        'base',
        # List ALL dependencies — missing ones cause scan errors
    ],
    'data': [
        'security/ir.model.access.csv',
        # Security XML must load before view XML
    ],
    'assets': {},
    'images': [
        'static/description/banner.png',  # Cover image for marketplace listing
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
```

## 4. `addons/{{ module_name }}/__init__.py`

```python
from . import models
```

## 5. `addons/{{ module_name }}/models/__init__.py`

```python
# from . import your_model
```

---

## 6. `addons/{{ module_name }}/static/description/index.html`

```html
<section class="oe_container">
    <div class="oe_row oe_spaced">
        <h2 class="oe_slogan">{{ Module Name }}</h2>
        <h3 class="oe_slogan">{{ One-line description }}</h3>
    </div>
</section>

<section class="oe_container oe_dark">
    <div class="oe_row oe_spaced">
        <h2 class="oe_slogan">Key Features</h2>
        <div class="oe_span6">
            <p class="oe_mt32">
                <b>{{ Feature 1 }}</b><br/>
                {{ Feature 1 description }}
            </p>
        </div>
        <div class="oe_span6">
            <p class="oe_mt32">
                <b>{{ Feature 2 }}</b><br/>
                {{ Feature 2 description }}
            </p>
        </div>
    </div>
</section>

<section class="oe_container">
    <div class="oe_row oe_spaced">
        <h2 class="oe_slogan">Screenshots</h2>
        <div class="oe_span12">
            <div class="oe_demo oe_picture oe_screenshot">
                <img src="screenshot_01.png" alt="Screenshot"/>
            </div>
        </div>
    </div>
</section>

<section class="oe_container oe_dark">
    <div class="oe_row oe_spaced">
        <h2 class="oe_slogan">Need Help?</h2>
        <div class="oe_span12 text-center">
            <p>Contact us at <a href="mailto:{{ support@example.com }}">{{ support@example.com }}</a></p>
        </div>
    </div>
</section>
```

**Rules for `index.html`:**
- Use only Bootstrap 4 / Odoo `oe_*` CSS classes
- Images must be from `static/description/` folder only (relative paths)
- Only external links allowed: YouTube canonical URLs, `mailto:`, `skype:`
- NO JavaScript, NO custom CSS, NO external links to other sites
- NO promotions or links to other app stores
- All text must be in English

## 7. `addons/{{ module_name }}/static/description/icon.png`

Create an empty placeholder file. This **MUST** be replaced with a real icon
before marketplace submission:
- Format: PNG
- Size: 128x128 pixels
- Content: Module logo/icon representing the app's functionality

## 8. `addons/{{ module_name }}/security/ir.model.access.csv`

```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
```

## 9. `addons/{{ module_name }}/LICENSE`

**For LGPL-3** (default — open source):
```
GNU LESSER GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) {{ Year }} {{ Author Name }}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```

**For OPL-1** (proprietary):
```
Odoo Proprietary License v1.0

This software and associated files (the "Software") may only be used
(executed, modified, executed after modifications) if you have purchased
a valid license from {{ Author Name }} or its affiliates.

The above copyright notice and this permission notice must be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED.

Copyright (C) {{ Year }} {{ Author Name }}
```

---

## 10. .gitignore

Create this file at the project root:

```gitignore
# Python
__pycache__/
*.py[cod]
*.egg-info/

# Odoo
filestore/
sessions/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## 11. Git Repo Setup

After generating all files, initialize the Git repo for marketplace submission.
Odoo Apps Store clones your repo via SSH — it does not accept zip uploads.

```bash
cd project-root
git init
git checkout -b 19.0
git add .
git commit -m "init: {{ module_name }} marketplace module scaffold"
```

Set up the remote (replace with actual repo URL):

```bash
git remote add origin git@github.com:{{ github_user }}/{{ repo_name }}.git
git push -u origin 19.0
```

**Important:** The branch MUST be named `19.0` — Odoo uses the branch name to
determine the target Odoo version.

When registering at apps.odoo.com, the SSH URI format is:

```
ssh://git@github.com:22/{{ github_user }}/{{ repo_name }}#19.0
```

Note: use colon (`:`) only for the port number, use slashes (`/`) to separate
the server from the path.

---

## After Scaffolding

Tell the developer:

1. Run `docker compose up -d` to start Odoo
2. Open `http://localhost:8069` to access the web interface
3. Create a new database from the database manager
4. Enable developer mode, then update the apps list to see your module
5. **Replace `icon.png`** — design a 128x128 PNG icon for your module
6. **Add a cover image** — create `static/description/banner.png` for the listing thumbnail
7. **Fill in `index.html`** — replace all `{{ }}` placeholders with real content and add screenshots
8. **Set the license** — choose `LGPL-3` or `OPL-1` and update both `__manifest__.py` and `LICENSE`
9. **Register** — go to https://apps.odoo.com/apps/upload, sign in, and register your repo SSH URI

### Example Prompts for Next Steps

```
> Add a model called barcode_scan with fields for product_id, location_id, quantity, and scan_date
> Create a form and list view for barcode scans
> Add access rights so only Inventory users can create scans
> I'm ready to publish this module to the Odoo Apps Store
```
