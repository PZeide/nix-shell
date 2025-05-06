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

async function startShell() {
  console.debug("Starting zeide-shell!");

  await initStyle(`${SRC}/styles/main.scss`, styleDependencies);
  syncWithMonitors([BarBuilder, BarCornerLeftBuilder, BarCornerRightBuilder]);
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
