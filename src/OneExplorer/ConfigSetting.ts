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

import * as path from "path";

import { Logger } from "../Utils/Logger";
import { Artifact, LocatorRunner } from "./ArtifactLocator";

export abstract class ConfigSetting {
  baseModelsLocatorRunner: LocatorRunner;
  productsLocatorRunner: LocatorRunner;
  // TODO: make sections for updateBaseModelField method

  /**
   * @brief Parse base models written in the ini object and return the absolute path.
   *
   * @param uri cfg uri is required to calculate absolute path
   *
   * ABOUT MULTIPLE BASE MODELS
   *
   * onecc doesn't support multiple base models.
   * However, OneExplorer will show the config node below multiple base models
   * to prevent a case that users cannot find their faulty config files on ONE explorer.
   *
   * TODO Move to backend
   */
  public parseBaseModels = (filePath: string, iniObj: object): Artifact[] => {
    const dir = path.dirname(filePath);

    let locatorRunner = this.baseModelsLocatorRunner;

    let artifacts: Artifact[] = locatorRunner.run(iniObj, dir);

    if (artifacts.length > 1) {
      // TODO Notify the error with a better UX
      // EX. put question mark next to the config icon
      Logger.debug(
        "OneExplorer",
        `There are multiple input models in the configuration(${filePath}).`
      );
    }
    if (artifacts.length === 0) {
      // TODO Notify the error with a better UX
      // EX. showing orphan nodes somewhere
      Logger.debug(
        "OneExplorer",
        `There is no input model in the configuration(${filePath}).`
      );
    }

    // Return as list of uri
    return artifacts;
  };

  /**
   * @brief Find derived models written in the ini object and return the absolute path.
   *
   * @param filePath cfg file path is required to calculate absolute path
   *
   * TODO Move to backend
   */
  public parseProducts = (filePath: string, iniObj: object): Artifact[] => {
    const dir = path.dirname(filePath);

    let locatorRunner = this.productsLocatorRunner;

    /**
     * When you add a new product type, please append the ext type to
     * OneTreeDataProvider.fileWatcher too, to prevent a bug.
     *
     * TODO Provide better structure to remove this extra work
     */

    let artifacts: Artifact[] = locatorRunner.run(iniObj, dir);

    return artifacts;
  };

  constructor() {
    this.baseModelsLocatorRunner = new LocatorRunner();
    this.productsLocatorRunner = new LocatorRunner();
  }

  public init(): void {
    this._initBaseModelsLocatorRunner();
    this._initProductsLocatorRunner();
  }

  protected abstract _initBaseModelsLocatorRunner(): void;
  protected abstract _initProductsLocatorRunner(): void;
}
