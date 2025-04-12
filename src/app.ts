import { App } from "astal/gtk4";
import { initStyle, styleDep } from "./lib/style";
import options from "./options";
import { handleRequest } from "./request";

import { syncWithMonitors } from "./lib/utils";
import style from "./styles/main.scss";
import Bar from "./widgets/Bar";
const styleDependencies = [styleDep(options.theme.primary, "theme-primary")];

async function startShell() {
  console.debug("Starting shell!");

  await initStyle(style, styleDependencies);
  syncWithMonitors([Bar]);
}

App.start({
  instanceName: "zeide-shell",
  main() {
    startShell().catch((e) => `Failed to start shell: ${e}.`);
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
