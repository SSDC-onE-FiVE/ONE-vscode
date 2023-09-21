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
