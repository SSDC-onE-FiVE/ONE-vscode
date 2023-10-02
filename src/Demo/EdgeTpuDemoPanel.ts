import * as vscode from "vscode";

export class EdgeTpuDemoPanel {
  public static currentPanel: EdgeTpuDemoPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    model: string
  ) {
    this._panel = panel;
    this._panel.onDidDispose(this.dispose, null, this._disposables);
    this._panel.webview.html = this._getWebviewContent();
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "run":
            //TODO : Receives input and output file paths from the user for EdgeTPU Model inference and executes it.
            vscode.commands.executeCommand(
              "one.explorer.runDemoBash",
              message.text.inputPath,
              message.text.outputPath,
              model
            );
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  }

  //TODO : Display the existing panel if it exists, or create a new one if it doesn't and then display it.
  public static render(context: vscode.ExtensionContext, model: string) {
    if (EdgeTpuDemoPanel.currentPanel) {
      EdgeTpuDemoPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(
        "EdgeTPU",
        "EdgeTPU",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      EdgeTpuDemoPanel.currentPanel = new EdgeTpuDemoPanel(
        panel,
        context,
        model
      );
    }
  }

  //TODO : When the webview panel is closed, perform cleanup.
  public dispose() {
    EdgeTpuDemoPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  //TODO : Return the content to be applied to the WebView.
  private _getWebviewContent() {
    return `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener("load", init);

          function init() {
            const btnRun = document.getElementById("btn-run");
            btnRun.addEventListener("click", run);
          }

          function run() {
            const inputPath = document.getElementById("input-path").value;
            const outputPath = document.getElementById("output-path").value;
            vscode.postMessage({
              command: "run",
              text: {
                inputPath,
                outputPath
              },
            });
          }

        </script>
      </head>
      <body class="App">
        <div>Input경로 : <input id="input-path" value="owl.jpg" /><div>
        <div>Output경로 : <input id="output-path" value="output.jpg" /></div>
        <button id="btn-run">실행하기</button>
      </body>
    </html>
  `;
  }
}
