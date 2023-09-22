/*
 * Copyright (c) 2023 Samsung Electronics Co., Ltd. All Rights Reserved
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

import { assert } from "chai";
import * as ini from "ini";

import { EdgeTpuCfgData } from "../../CfgEditor/EdgeTpuCfgData";

// NOTE
// sampleEdgeTpuCfgText and sampleEdgeTpuCfgText1 are the same.
// But others are different.
const sampleEdgeTpuCfgText = `
[edgetpu-compiler]
edgetpu-compile=True
edgetpu-profile=False

[edgetpu-compile]
input_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model.tflite
output_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model_edgetpu.tflite
`;

const sampleEdgeTpuCfgText1 = `
[edgetpu-compile]
input_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model.tflite
output_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model_edgetpu.tflite

[edgetpu-compiler]
edgetpu-compile=True
edgetpu-profile=False
`;

const sampleEdgeTpuCfgText2 = `
[edgetpu-compiler]
edgetpu-compile=True
edgetpu-profile=False

[edgetpu-compile]
input_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model.tflite
output_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model_edgetpu.tflite
intermediate_tensors=opr1
show_operations=True
`;

const sampleEdgeTpuCfgText3 = `
[edgetpu-compiler]
edgetpu-compile=True
edgetpu-profile=False

[edgetpu-compile]
input_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model.tflite
output_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model_edgetpu.tflite
show_operations=True
search_delegate=True
delegate_search_step=1
`;

const duplicateEdgeTpuCfgText = `
[edgetpu-compiler]
edgetpu-compile=True
edgetpu-profile=False

[edgetpu-compile]
input_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model.tflite
output_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model_edgetpu.tflite
intermediate_tensors=opr1
show_operations=True
search_delegate=True
delegate_search_step=1
`;

const duplicateEdgeTpuCfgText2 = `
[edgetpu-compiler]
edgetpu-compile=True
edgetpu-profile=False

[edgetpu-compile]
input_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model.tflite
output_path=/home/sohee/ONE-vscode/res/modelDir/truediv/model_edgetpu.tflite
intermediate_tensors=opr1
show_operations=True
search_delegate=True
`;

suite("EdgetpuCfgEditor", function () {
  suite("EdgetpuCfgData", function () {
    suite("#constructor()", function () {
      test("is constructed", function () {
        const data = new EdgeTpuCfgData();
        assert.instanceOf(data, EdgeTpuCfgData);
      });
    });

    suite("#updateSectionWithKeyValue()", function () {
      test("update key of section which already exists-1", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText2);
        data.updateSectionWithKeyValue(
          "edgetpu-compile",
          "intermediate_tensors",
          "opr1, opr2"
        );
        const cfg = data.getAsConfig();
        assert.strictEqual(
          cfg["edgetpu-compile"]["intermediate_tensors"],
          "opr1, opr2"
        );
      });
      test("update key of section which already exists-2", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText3);
        data.updateSectionWithKeyValue(
          "edgetpu-compile",
          "delegate_search_step",
          "3"
        );
        const cfg = data.getAsConfig();
        assert.strictEqual(cfg["edgetpu-compile"]["delegate_search_step"], "3");
      });
      test("update section which is not written", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        data.updateSectionWithKeyValue(
          "edgetpu-compile",
          "intermediate_tensors",
          "opr1, opr2"
        );
        const cfg = data.getAsConfig();
        assert.strictEqual(
          cfg["edgetpu-compile"]["intermediate_tensors"],
          "opr1, opr2"
        );
      });
      test("NEG: try to update 'search_delegate' value when 'intermediate_tensors' value exists", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText2);
        data.updateSectionWithKeyValue(
          "edgetpu-compile",
          "search_delegate",
          "True"
        );
        const cfg = data.getAsConfig();
        assert.strictEqual(
          cfg["edgetpu-compile"]["intermediate_tensors"],
          undefined
        );
        assert.strictEqual(
          cfg["edgetpu-compile"]["search_delegate"],
          undefined
        );
      });
    });

    suite("#updateSectionWithValue()", function () {
      test("update section of config with value encoded/stringified", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        const stringified: string = `
input_path=./inception_v3.tflite
output_path=./inception_v3_edgetpu.tflite
intermediate_tensors=opr1
show_operations=True
          `;
        data.updateSectionWithValue("edgetpu-compile", stringified);
        const cfg = data.getAsConfig();
        assert.strictEqual(
          cfg["edgetpu-compile"]["input_path"],
          "./inception_v3.tflite"
        );
        assert.strictEqual(
          cfg["edgetpu-compile"]["output_path"],
          "./inception_v3_edgetpu.tflite"
        );
        assert.strictEqual(
          cfg["edgetpu-compile"]["intermediate_tensors"],
          "opr1"
        );
        assert.strictEqual(cfg["edgetpu-compile"]["show_operations"], "True");
      });

      test("NEG: try to update 'intermediate_tensors' and 'search_delegate' together", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        const stringified: string = `
input_path=./inception_v3.tflite
output_path=./inception_v3_edgetpu.tflite
intermediate_tensors=opr1
show_operations=True
search_delegate=True
delegate_search_step=1
          `;
        data.updateSectionWithValue("edgetpu-compile", stringified);
        const cfg = data.getAsConfig();
        assert.strictEqual(
          cfg["edgetpu-compile"]["input_path"],
          "./inception_v3.tflite"
        );
        assert.strictEqual(
          cfg["edgetpu-compile"]["output_path"],
          "./inception_v3_edgetpu.tflite"
        );
        assert.strictEqual(cfg["edgetpu-compile"]["show_operations"], "True");
        assert.strictEqual(
          cfg["edgetpu-compile"]["intermediate_tensors"],
          undefined
        );
        assert.strictEqual(
          cfg["edgetpu-compile"]["search_delegate"],
          undefined
        );
        assert.strictEqual(
          cfg["edgetpu-compile"]["delegate_search_step"],
          undefined
        );
      });
    });

    suite("#isSame()", function () {
      test("is same to string encoded/stringified", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        const isSame: boolean = data.isSame(sampleEdgeTpuCfgText1);
        assert.isTrue(isSame);
      });
      test("is not same to string encoded/stringified", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        const isSame: boolean = data.isSame(sampleEdgeTpuCfgText2);
        assert.isNotTrue(isSame);
      });
      test("is not same to string encoded/stringified - 2", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        const isSame: boolean = data.isSame(sampleEdgeTpuCfgText3);
        assert.isNotTrue(isSame);
      });
    });

    suite("#sorted()", function () {
      test("sorts config", function () {
        let data = new EdgeTpuCfgData();
        data.setWithString(sampleEdgeTpuCfgText);
        data.sort();
        const isSame: boolean = data.isSame(sampleEdgeTpuCfgText1);
        assert.isTrue(isSame);
      });
    });
  });
});
