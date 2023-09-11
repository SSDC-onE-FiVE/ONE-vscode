/*
 * Copyright (c) 2022 Samsung Electronics Co., Ltd. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function updateImportUI() {
  const modelType = document.getElementById("importInputModelType");
  const pbBasicOptions = document.getElementById("optionImportPBBasic");
  const pbAdvancedOptions = document.getElementById("optionImportPBAdvanced");
  const savedBasicOptions = document.getElementById("optionImportSAVEDBasic");
  const kerasBasicOptions = document.getElementById("optionImportKERASBasic");
  const tfliteBasicOptions = document.getElementById("optionImportTFLITEBasic");
  const onnxBasicOptions = document.getElementById("optionImportONNXBasic");
  const onnxAdvancedOptions = document.getElementById(
    "optionImportONNXAdvanced"
  );
  const edgeTPUBasicOptions = document.getElementById(
    "optionImportEdgeTPUBasic"
  );
  const edgeTPUAdvancedOptions = document.getElementById(
    "optionImportEdgeTPUAdvanced"
  );
  const edgeTPUMinRuntimeVersionDesc = document.getElementById(
    "EdgeTPUMinRuntimeVersionDesc"
  ); 
  const edgeTPUMinRuntimeVersion = document.getElementById(
    "EdgeTPUMinRuntimeVersion"
  );
  const edgeTPUSearchDelegate = document.getElementById(
    "EdgeTPUSearchDelegate"
  );
  const edgeTPUDelegateSearchStepDiv = document.getElementById(
    "EdgeTPUDelegateSearchStepDiv"
  );

  const versionList = [10, 11, 12, 13, 14];

  pbBasicOptions.style.display = "none";
  pbAdvancedOptions.style.display = "none";
  savedBasicOptions.style.display = "none";
  kerasBasicOptions.style.display = "none";
  tfliteBasicOptions.style.display = "none";
  onnxBasicOptions.style.display = "none";
  onnxAdvancedOptions.style.display = "none";
  edgeTPUBasicOptions.style.display = "none";
  edgeTPUAdvancedOptions.style.display = "none";

  switch (modelType.value) {
    case "pb":
      pbBasicOptions.style.display = "block";
      pbAdvancedOptions.style.display = "block";
      break;
    case "saved":
      savedBasicOptions.style.display = "block";
      break;
    case "keras":
      kerasBasicOptions.style.display = "block";
      break;
    case "tflite":
      tfliteBasicOptions.style.display = "block";
      break;
    case "onnx":
      onnxBasicOptions.style.display = "block";
      onnxAdvancedOptions.style.display = "block";
      break;
    case "edgetpu":
      if (edgeTPUMinRuntimeVersion.childElementCount !== versionList.length) {
        versionList.forEach((version) => {
          var option = new Option(version);
          edgeTPUMinRuntimeVersion.append(option);
        });
      }
      edgeTPUDelegateSearchStepDiv.style.display = edgeTPUSearchDelegate.checked
        ? "block"
        : "none";
      if(edgeTPUMinRuntimeVersion.disabled && !edgeTPUMinRuntimeVersionDesc.classList.contains("disabled-area")){
        edgeTPUMinRuntimeVersionDesc.className += "disabled-area";
      }
      edgeTPUBasicOptions.style.display = "block";
      edgeTPUAdvancedOptions.style.display = "block";
      break;
    default:
      break;
  }
}

export function updateQuantizeUI() {
  const actionType = document.getElementById("quantizeActionType");
  const defaultQuantBasicOptions = document.getElementById(
    "optionQuantizeDefaultQuantBasic"
  );
  const defaultQuantAdvancedOptions = document.getElementById(
    "optionQuantizeDefaultQuantAdvanced"
  );
  const forceQuantBasicOptions = document.getElementById(
    "optionQuantizeForceQuantBasic"
  );
  const forceQuantAdvancedOptions = document.getElementById(
    "optionQuantizeForceQuantAdvanced"
  );
  const copyQuantBasicOptions = document.getElementById(
    "optionQuantizeCopyQuantBasic"
  );
  const copyQuantAdvancedOptions = document.getElementById(
    "optionQuantizeCopyQuantAdvanced"
  );

  defaultQuantBasicOptions.style.display = "none";
  defaultQuantAdvancedOptions.style.display = "none";
  forceQuantBasicOptions.style.display = "none";
  forceQuantAdvancedOptions.style.display = "none";
  copyQuantBasicOptions.style.display = "none";
  copyQuantAdvancedOptions.style.display = "none";

  switch (actionType.value) {
    case "defaultQuant":
      defaultQuantBasicOptions.style.display = "block";
      defaultQuantAdvancedOptions.style.display = "block";
      break;
    case "forceQuant":
      forceQuantBasicOptions.style.display = "block";
      forceQuantAdvancedOptions.style.display = "block";
      break;
    case "copyQuant":
      copyQuantBasicOptions.style.display = "block";
      copyQuantAdvancedOptions.style.display = "block";
      break;
    default:
      break;
  }
}

export function updateStepUI(step) {
  const allOptionPanels = document.querySelectorAll(".optionPanel .options");
  allOptionPanels.forEach(function (panel) {
    panel.style.display = "none";
  });

  const optionPanel = document.getElementById("option" + step);
  optionPanel.style.display = "block";

  const allSteps = document.querySelectorAll(".statusbar .steps .step");
  allSteps.forEach(function (step) {
    step.classList.remove("current");
  });

  const stepbar = document.getElementById("stepbar" + step);
  stepbar.classList.add("current");
}
