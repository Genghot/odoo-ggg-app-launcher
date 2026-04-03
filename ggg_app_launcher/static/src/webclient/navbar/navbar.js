/** @odoo-module */

import { useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { NavBar } from "@web/webclient/navbar/navbar";
import { AppLauncher } from "@ggg_app_launcher/webclient/app_launcher/app_launcher";

patch(NavBar, {
    components: {
        ...NavBar.components,
        AppLauncher,
    },
});

patch(NavBar.prototype, {
    setup() {
        super.setup();
        this.gggState = useState({ launcherOpen: false });
    },
    toggleGggLauncher() {
        this.gggState.launcherOpen = !this.gggState.launcherOpen;
    },
    closeGggLauncher() {
        this.gggState.launcherOpen = false;
    },
});
