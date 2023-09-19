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

export interface ICfgData {
  // returns data decoded or parsed as object
  getAsConfig(): any;
  // returns data encoded or stringfied as stringz
  getAsString(): string;
  // sets data with object decoded or parsed
  setWithConfig(cfg: any): void;
  // sets data with string encoded or stringfied
  setWithString(text: string): void;
  updateSectionWithKeyValue(section: string, key: string, value: string): void;
  updateSectionWithValue(section: string, value: string): void;
  isSame(textStringified: string): boolean;
  sort(): void;

  // this function provides ViewType for each config type
  getViewType(): string;

  // this function provides Extension Type for each config type
  getExtType(): string;

  // this function provides the default content for each config type when one-explorer creates a new config file.
  getContent(modelName: string | null, extName: string | null): string;
}
