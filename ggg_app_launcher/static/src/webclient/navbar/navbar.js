/** @odoo-module */

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
        this.state.gggLauncherOpen = false;
    },
    toggleGggLauncher() {
        this.state.gggLauncherOpen = !this.state.gggLauncherOpen;
    },
    closeGggLauncher() {
        this.state.gggLauncherOpen = false;
    },
});
