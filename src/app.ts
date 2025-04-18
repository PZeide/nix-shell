import { App } from "astal/gtk4";
import { initStyle } from "./lib/style";
import { syncWithMonitors } from "./lib/utils";
import { handleRequest } from "./request";
import styleDependencies from "./style";
import { BarBuilder } from "./widgets/bar/Bar";
import {
  BarCornerLeftBuilder,
  BarCornerRightBuilder,
} from "./widgets/bar/BarCorner";

async function startShell() {
  console.debug("Starting shell!");

  await initStyle(`${SRC}/styles/main.scss`, styleDependencies);
  syncWithMonitors([BarBuilder, BarCornerLeftBuilder, BarCornerRightBuilder]);
}

App.start({
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
    console.error("instance already running!");
    App.quit(1);
  },
});
