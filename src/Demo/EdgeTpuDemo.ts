import * as vscode from "vscode";

export class EdgeTpuDemo {
  msg: string;

  constructor() {
    this.msg = "onE FiVE run Demo... :-D";
  }

  runDemo() {
    console.log(this.msg);
  }

  static register(context: vscode.ExtensionContext) {
    const instance = new EdgeTpuDemo();
    const disposable = vscode.commands.registerCommand(
      "one.explorer.runDemo",
      () => {
        instance.runDemo();
      }
    );
    context.subscriptions.push(disposable);
  }
}
