import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import styleToCSS from "./utils/react-to-css";
import cssToStyle from "./utils/css-to-style";

import { Uri, ExtensionContext, commands } from "vscode";
import JsonToTS from "json-to-ts";
import {
  handleError,
  getClipboardText,
  parseJson,
  pasteToMarker,
  getSelectedText,
  getViewColumn,
  validateLength,
} from "./lib";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      "vscode-css-transformer.styleToCssFromSelection",
      styleToCssFromSelection
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      "vscode-css-transformer.styleToCssFromClipboard",
      styleToCssFromClipboard
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      "vscode-css-transformer.cssToStyleFromSelection",
      cssToStyleFromSelection
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      "vscode-css-transformer.cssToStyleFromClipboard",
      cssToStyleFromClipboard
    )
  );
}

function jsonToTsFromSelection() {
  const tmpFilePath = path.join(os.tmpdir(), "json-to-ts.ts");
  const tmpFileUri = Uri.file(tmpFilePath);

  getSelectedText()
    .then(validateLength)
    .then(parseJson)
    .then((json) => {
      return JsonToTS(json).reduce((a, b) => `${a}\n\n${b}`);
    })
    .then((interfaces) => {
      fs.writeFileSync(tmpFilePath, interfaces);
    })
    .then(() => {
      commands.executeCommand("vscode.open", tmpFileUri, getViewColumn());
    })
    .catch(handleError);
}

function styleToCssFromClipboard() {
  getClipboardText()
    .then(validateLength)
    .then(parseJson)
    .then((json) => {
      return styleToCSS(json);
    })
    .then((result) => {
      pasteToMarker(result);
    })
    .catch(handleError);
}

function styleToCssFromSelection() {
  getSelectedText()
    .then(validateLength)
    .then(parseJson)
    .then((json) => {
      return styleToCSS(json);
    })
    .then((result) => {
      pasteToMarker(result);
    })
    .catch(handleError);
}

function cssToStyleFromClipboard() {
  getClipboardText()
    .then(validateLength)
    .then((cssString) => {
      return JSON.stringify(cssToStyle(cssString));
    })
    .then((result) => {
      pasteToMarker(result);
    })
    .catch(handleError);
}

function cssToStyleFromSelection() {
  getSelectedText()
    .then(validateLength)
    .then((cssString) => {
      return JSON.stringify(cssToStyle(cssString));
    })
    .then((result) => {
      pasteToMarker(result);
    })
    .catch(handleError);
}
