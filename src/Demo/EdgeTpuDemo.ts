import * as vscode from "vscode";
import { EdgeTpuDemoPanel } from "./EdgeTpuDemoPanel";
export class EdgeTpuDemo {
  static register(context: vscode.ExtensionContext) {
    // const instance = new EdgeTpuDemo();
    const disposable = vscode.commands.registerCommand(
      "one.explorer.runDemo",
      () => {
        EdgeTpuDemoPanel.render(context);
      }
    );
    context.subscriptions.push(disposable);
  }
}
