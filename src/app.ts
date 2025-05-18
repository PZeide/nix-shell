import app from "ags/gtk4/app";
import { initStyle } from "./lib/style";
import { syncWithMonitors } from "./lib/utils/glib";
import { handleRequest } from "./request";
import styleDependencies from "./style";
import { BarBuilder } from "./widgets/bar/Bar";
import {
  BarCornerLeftBuilder,
  BarCornerRightBuilder,
} from "./widgets/bar/BarCorner";
import { OnScreenDisplayBuilder } from "./widgets/osd/OnScreenDisplay";

async function startShell() {
  console.debug("Starting zeide-shell!");

  app.add_icons(`${SRC}/assets/icons`);

  await initStyle(`${SRC}/styles/main.scss`, styleDependencies);

  syncWithMonitors([
    BarBuilder,
    BarCornerLeftBuilder,
    BarCornerRightBuilder,
    OnScreenDisplayBuilder,
  ]);
}

app.start({
  instanceName: "zeide-shell",
  main() {
    startShell().catch((e) => console.error(`Failed to start shell: ${e}.`));
  },
  requestHandler(request, res) {
    handleRequest(request)
      .then(res)
      .catch(() => res("failed to handle request"));
  },
  client() {
    console.error("Instance already running!");
    app.quit(1);
  },
});
