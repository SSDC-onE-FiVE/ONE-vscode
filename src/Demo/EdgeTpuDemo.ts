import * as os from "os";
import * as fs from "fs";
import * as cp from "child_process";
import * as path from "path";
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

    path.isAbsolute(inputPath) || (inputPath = `${os.homedir()}/${inputPath}`);
    path.isAbsolute(outputPath) ||
      (outputPath = `${os.homedir()}/${outputPath}`);

    const extensionId = "Samsung.one-vscode";
    const ext = vscode.extensions.getExtension(
      extensionId
    ) as vscode.Extension<any>;
    const bashPath = vscode.Uri.joinPath(
      ext!.extensionUri,
      "script/demo",
      "runDemo.sh"
    ).fsPath;
    const scriptPath = vscode.Uri.joinPath(
      ext!.extensionUri,
      "script/demo",
      "semantic_segmentation.py"
    ).fsPath;

    const cmd = `bash ${bashPath} "${scriptPath}" "${model}" "${inputPath}" "${outputPath}"`;
    console.log(cmd);
    try {
      // const stdout = cp.execSync(cmd);
      // console.log(`stdout: ${stdout}`);
    } catch (error) {
      console.error(error);
    }

    // TODO: print output(outputPath) to webview...
  }
}
