import * as vscode from "vscode";
import * as os from "os";
import * as fs from "fs";
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

            let cnt = 0;
            const timer = setInterval(() => {
              if(fs.existsSync(`${os.homedir()}/output.jpg`)){
                this._panel.webview.postMessage({ command: 'success' });
                clearInterval(timer);
              }else{
                cnt++;
                if(cnt >= 5){
                  this._panel.webview.postMessage({ command: 'fail' });
                  clearInterval(timer);
                }
              }
            }, 1000);
            
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
        <style>
          #App{
            position:relative;
          }
          #btn-run{
            margin : 10px 0;
          }
          .loading-container {
            position:absolute;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            display:none;
            flex-direction:column;
            justify-content : center;
            align-items:center;
            background-color:rgba(0, 0, 0, 0.5);
          }
        
          .loader {
            box-sizing: border-box;
            display: inline-block;
            width: 50px;
            height: 80px;
            border-top: 5px solid #fff;
            border-bottom: 5px solid #fff;
            position: relative;
            background: linear-gradient(#FF3D00 30px, transparent 0) no-repeat;
            background-size: 2px 40px;
            background-position: 50% 0px;
            animation: spinx 5s linear infinite;
          }
          .loader:before, .loader:after {
            content: "";
            width: 40px;
            left: 50%;
            height: 35px;
            position: absolute;
            top: 0;
            transform: translatex(-50%);
            background: rgba(255, 255, 255, 0.4);
            border-radius: 0 0 20px 20px;
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: 0 0px;
            animation: lqt 5s linear infinite;
          }
          .loader:after {
            top: auto;
            bottom: 0;
            border-radius: 20px 20px 0 0;
            animation: lqb 5s linear infinite;
          }
          
          @keyframes lqt {
            0%, 100% {
              background-image: linear-gradient(#FF3D00 40px, transparent 0);
              background-position: 0% 0px;
            }
            50% {
              background-image: linear-gradient(#FF3D00 40px, transparent 0);
              background-position: 0% 40px;
            }
            50.1% {
              background-image: linear-gradient(#FF3D00 40px, transparent 0);
              background-position: 0% -40px;
            }
          }
          @keyframes lqb {
            0% {
              background-image: linear-gradient(#FF3D00 40px, transparent 0);
              background-position: 0 40px;
            }
            100% {
              background-image: linear-gradient(#FF3D00 40px, transparent 0);
              background-position: 0 -40px;
            }
          }
          @keyframes spinx {
            0%, 49% {
              transform: rotate(0deg);
              background-position: 50% 36px;
            }
            51%, 98% {
              transform: rotate(180deg);
              background-position: 50% 4px;
            }
            100% {
              transform: rotate(360deg);
              background-position: 50% 36px;
            }
          }

          #outputImg{
            display:none;
          }
        </style>
        <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener("load", init);

          function init() {
            const loading = document.querySelector('.loading-container');
            const outputImg = document.getElementById("outputImg");
            const btnRun = document.getElementById("btn-run");
            btnRun.addEventListener("click", run);

            // 메시지 이벤트 리스너 등록
            window.addEventListener('message', event => {
                const message = event.data; // 수신한 메시지 데이터

                // 메시지 타입에 따라 처리
                if (message.command === 'success') {
                  loading.style.display="none";
                  outputImg.style.display="block";
                }
                else if (message.command === 'fail') {
                  loading.style.display="none";
                }
            });
          }
        
          function run() {
            const inputPath = document.getElementById("input-path").value;
            const outputPath = document.getElementById("output-path").value;
            const loading = document.querySelector('.loading-container');
            const outputImg = document.getElementById("outputImg");

            loading.style.display = 'flex';
            outputImg.style.display = 'none';
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
      <body id="App">
        <div>Input경로 : <input id="input-path" value="owl.jpg" /><div>
        <div>Output경로 : <input id="output-path" value="output.jpg" /></div>
        <button id="btn-run">실행하기</button>
        <div class="loading-container">
          <div class="loader"></div>
          <p>Loading...</p>
        </div>
        <img id="outputImg" src="${this._panel.webview.asWebviewUri(vscode.Uri.file(os.homedir()+'/output.jpg'))}">
      </body>
    </html>
  `;
  }
}
