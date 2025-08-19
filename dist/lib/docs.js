"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/docs.ts
var docs_exports = {};
__export(docs_exports, {
  default: () => docs_default
});
module.exports = __toCommonJS(docs_exports);
var import_node_url = require("url");
var import_node_fs = require("fs");
var import_meta = {};
var basePackageJson = (0, import_node_url.fileURLToPath)(new import_node_url.URL("../../package.json", import_meta.url));
var VERSION = JSON.parse((0, import_node_fs.readFileSync)(basePackageJson, "utf8")).version;
var readme = `
![](/meta.jpg)

# Welcome to the API docs

These are the official docs for the [Baibusu.social](https://api.baibusu.social) project.
On the sidebar you will find all available endpoints that the API has to offer.
This documentation is intended for reference as the majority of options require administrative authorization.

The default rate limit for the API is 100 requests per 1000ms.
`;
var docs_default = {
  openapi: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Baibusu API",
      description: readme,
      version: VERSION
    },
    tags: [
      {
        name: "Insults",
        description: "Insult routes."
      }
    ]
  }
};
