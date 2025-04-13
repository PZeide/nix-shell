import { App } from "astal/gtk4";
import { initStyle, styleDep } from "./lib/style";
import { syncWithMonitors } from "./lib/utils";
import options from "./options";
import { handleRequest } from "./request";
import Bar from "./widgets/bar/Bar";

import style from "./styles/main.scss";
const styleDependencies = [
  styleDep(options.theme.bgColor, "zs-theme-bg-color"),
];

async function startShell() {
  console.debug("Starting shell!");

  await initStyle(style, styleDependencies);
  syncWithMonitors([Bar]);
}

App.start({
  instanceName: "zeide-shell",
  main() {
    startShell().catch((e) => `Failed to start shell: ${e.message}.`);
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
