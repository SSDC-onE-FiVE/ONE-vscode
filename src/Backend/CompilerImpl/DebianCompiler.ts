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

import * as cp from "child_process";
import * as vscode from "vscode";

import { pipedSpawnSync } from "../../Utils/PipedSpawnSync";
import { Command } from "../Command";
import { Compiler } from "../Compiler";
import { PackageInfo, ToolchainInfo, Toolchains } from "../Toolchain";
import {
  DebianArch,
  DebianRepo,
  DebianToolchain,
} from "../ToolchainImpl/DebianToolchain";
import { Version } from "../Version";

export class DebianCompiler implements Compiler {
  private readonly toolchainTypes: string[];
  private readonly toolchainName: string;

  private debianToolchainClass: typeof DebianToolchain;
  private depends: Array<PackageInfo>;
  private prerequisites: string;

  private readonly debianRepo: DebianRepo | undefined;
  private readonly debianArch: DebianArch | undefined;

  constructor(
    toolchainTypes: string[],
    toolchainName: string,
    debianToolchainClass: typeof DebianToolchain,
    depends: Array<PackageInfo>,
    prerequisites: string,
    debianRepo?: DebianRepo,
    debianArch?: DebianArch
  ) {
    this.toolchainTypes = toolchainTypes;
    this.toolchainName = toolchainName;

    this.debianToolchainClass = debianToolchainClass;
    this.depends = depends;
    this.prerequisites = prerequisites;

    this.debianRepo = debianRepo;
    this.debianArch = debianArch;
  }

  getToolchainTypes(): string[] {
    return this.toolchainTypes;
  }

  parseVersion(version: string): Version {
    if (!version.trim()) {
      throw Error("Invalid version format.");
    }

    let _version = version;
    let option = "";

    const optionIndex = version.search(/[~+-]/);
    if (optionIndex !== -1) {
      option = version.slice(optionIndex);
      _version = version.slice(0, optionIndex);
    }

    const splitedVersion = _version.split(".");

    if (splitedVersion.length > 3) {
      throw Error("Invalid version format.");
    }

    let major: number | string;
    let minor: number | string;
    let patch: number | string;

    [major = "0", minor = "0", patch = "0"] = _version.split(".");

    const epochIndex = major.search(/:/);
    if (epochIndex !== -1) {
      major = major.slice(epochIndex + 1);
    }

    major = Number(major);
    minor = Number(minor);
    patch = Number(patch);

    if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
      throw Error("Invalid version format.");
    }
    return new Version(major, minor, patch, option);
  }

  getToolchains(
    _toolchainType: string,
    _start: number,
    _count: number
  ): Toolchains {
    if (_toolchainType !== "latest") {
      throw Error(`Invalid toolchain type : ${_toolchainType}`);
    }

    if (_start < 0) {
      throw Error(`wrong start number: ${_start}`);
    }
    if (_count < 0) {
      throw Error(`wrong count number: ${_count}`);
    }
    if (_count === 0) {
      return [];
    }

    try {
      cp.spawnSync(`apt-cache show ${this.toolchainName}`);
    } catch (error) {
      throw Error(`Getting ${this.toolchainName} package list is failed`);
    }

    let result;
    try {
      result = pipedSpawnSync(
        "apt-cache",
        ["madison", `${this.toolchainName}`],
        { encoding: "utf8" },
        "awk",
        ['{printf $3" "}'],
        { encoding: "utf8" }
      );
    } catch (error) {
      throw Error(
        `Getting ${this.toolchainName} package version list is failed`
      );
    }

    if (result.status !== 0) {
      return [];
    }

    const toolchainVersions: string = result.stdout.toString();
    const versionList = toolchainVersions.trim().split(" ");

    const availableToolchains = new Toolchains();
    for (const version of versionList) {
      const toolchainInfo = new ToolchainInfo(
        this.toolchainName,
        "Description: test",
        this.parseVersion(version)
      );

      const toolchain = new this.debianToolchainClass(
        toolchainInfo,
        this.debianRepo,
        this.debianArch
      );
      availableToolchains.push(toolchain);
    }

    return availableToolchains;
  }

  getInstalledToolchains(_toolchainType: string): Toolchains {
    if (_toolchainType !== "latest") {
      throw Error(`Invalid toolchain type : ${_toolchainType}`);
    }

    let result;
    try {
      result = cp.spawnSync(
        "dpkg-query",
        [
          "--show",
          `--showformat='\${Version} \${Description}'`,
          `${this.toolchainName}`,
        ],
        { encoding: "utf8" }
      );
    } catch (error) {
      throw new Error(
        `Getting installed ${this.toolchainName} package list is failed`
      );
    }

    if (result.status !== 0) {
      return [];
    }

    // NOTE
    // The output format string of dpkg-query is '${Version} ${Description}'.
    // To remove the first and last single quote character of output string, it slices from 1 to -1.
    const installedToolchain: string = result.stdout.toString().slice(1, -1);

    const descriptionIdx = installedToolchain.search(" ");
    const versionStr = installedToolchain.slice(0, descriptionIdx).trim();
    const description = installedToolchain.slice(descriptionIdx).trim();

    // NOTE
    // onecc-docker does not have any explict dependencies,
    // but it has internally dependency to one-compiler and it is seen in depends.

    // TODO
    // onecc-docker's depends should be modified later so that we can read the one-compiler version.

    const toolchainInfo = new ToolchainInfo(
      this.toolchainName,
      description,
      this.parseVersion(versionStr),
      this.depends
    );
    const toolchain = new this.debianToolchainClass(
      toolchainInfo,
      this.debianRepo,
      this.debianArch
    );
    return [toolchain];
  }

  prerequisitesForGetToolchains(): Command {
    const extensionId = "Samsung.one-vscode";
    const ext = vscode.extensions.getExtension(
      extensionId
    ) as vscode.Extension<any>;
    const scriptPath = vscode.Uri.joinPath(
      ext!.extensionUri,
      "script",
      this.prerequisites
    ).fsPath;

    const cmd = new Command("/bin/sh", [`${scriptPath}`]);
    cmd.setRoot();
    return cmd;
  }
}
