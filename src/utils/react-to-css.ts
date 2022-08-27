import { isUnitlessNumber } from "./css-property";
import hyphenateStyleName from "./hyphenate-style-name";

// Follows syntax at https://developer.mozilla.org/en-US/docs/Web/CSS/content,
// including multiple space separated values.
const unquotedContentValueRegex =
  /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;

function buildRule(key: string, value: string) {
  if (!isUnitlessNumber[key] && typeof value === "number") {
    value = "" + value + "px";
  } else if (key === "content" && !unquotedContentValueRegex.test(value)) {
    value = "'" + value.replace(/'/g, "\\'") + "'";
  }

  return hyphenateStyleName(key) + ": " + value + ";  ";
}

function styleToCssString(rules: Record<string, any>) {
  var result = "";
  if (!rules || Object.keys(rules).length === 0) {
    return result;
  }
  var styleKeys = Object.keys(rules);
  for (var j = 0, l = styleKeys.length; j < l; j++) {
    var styleKey = styleKeys[j];
    var value = rules[styleKey];

    if (Array.isArray(value)) {
      for (var i = 0, len = value.length; i < len; i++) {
        result += buildRule(styleKey, value[i]);
      }
    } else {
      result += buildRule(styleKey, value);
    }
  }
  return result;
}

export default styleToCssString;
