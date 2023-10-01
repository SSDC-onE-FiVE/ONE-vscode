import * as fs from "fs";
import * as cp from "child_process";
import * as vscode from "vscode";

import { Node } from "../OneExplorer/OneExplorer";
import { EdgeTpuDemoPanel } from "./EdgeTpuDemoPanel";

export class EdgeTpuDemo {
  static register(context: vscode.ExtensionContext) {
    const instance = new EdgeTpuDemo();
    const registrations = [
      vscode.commands.registerCommand("one.explorer.runDemo", (node: Node) => {
        EdgeTpuDemoPanel.render(context, node.uri.fsPath);
      }),
      vscode.commands.registerCommand(
        "one.explorer.runDemoBash",
        (inputPath, outputPath, model) => {
          instance.runDemoBash(inputPath, outputPath, model);
        }
      ),
    ];

    registrations.forEach((disposable) =>
      context.subscriptions.push(disposable)
    );
  }

  runDemoBash(inputPath: string, outputPath: string, model: string) {
    console.log("rundemobash", inputPath, outputPath, model);
    console.log(fs.existsSync(model));

    const extensionId = "Samsung.one-vscode";
    const ext = vscode.extensions.getExtension(
      extensionId
    ) as vscode.Extension<any>;
    const scriptPath = vscode.Uri.joinPath(
      ext!.extensionUri,
      "script",
      "runDemo.sh"
    ).fsPath;
    console.log(scriptPath);

    const stdout = cp.execSync(
      `bash ${scriptPath} "${model}" "${inputPath}" "${outputPath}"`
    );
    console.log(`stdout: ${stdout}`);

    // const path = "${HOME}/demo/segmentation_result.jpg";
    // const rpath = vscode.Uri.parse(path).fsPath;
    // const rpath = fs.realpathSync(path);
    // console.log(rpath);
    // console.log(fs.existsSync(rpath));
  }
}
