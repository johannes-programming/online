import { tokenizePythonAsciiLine } from "https://www.johannes-programming.online/versioning/tokenizing.js";

export function fixAllSignatures(realm = document.body) {
    realm.querySelectorAll(".signature > .literal").forEach(fixSignatureCode);
}

function fixSignatureCode(container) {
    // Reformat spans produced by an earlier run, but preserve unrelated markup.
    // Skipping every element-bearing signature leaves old formatting unfixed.
    if ([...container.children].some(child =>
        child.tagName !== "SPAN" ||
        ![...child.classList].some(name => name.startsWith("signature-"))
    )) {
        return;
    }

    const text = container.textContent;
    const ascii = text
        .replaceAll("-&gt;", "->")
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");

    // The tokenizer is intentionally ASCII-only. This keeps the previous
    // behavior of discarding non-ASCII characters before formatting.
    const tokens = normalizePythonTokens(tokenizePythonAsciiLine(ascii));
    const children = spansSignatureCodeText(tokens);

    container.textContent = "";
    for (const child of children) {
        container.appendChild(child);
    }
}

function spansSignatureCodeText(tokens) {

    if (tokens.length === 0) {
        return [];
    }

    const iOpen = findTopLevelToken(tokens, "(");
    const iEqual = findTopLevelToken(tokens, "=");

    if (iEqual !== -1 && (iOpen === -1 || iEqual < iOpen)) {
        return spansH4VariableTokens(tokens);
    }

    if (iOpen !== -1) {
        const iClose = findMatchingBracket(tokens, iOpen);
        if (iClose !== -1) {
            return spansH4CallableTokens(tokens, iOpen, iClose);
        }
    }

    return spansH4NonCallableColonTokens(tokens);
}

function spansH4VariableTokens(tokens) {
    const parts = splitTopLevel(tokens, "=");
    const ans = spansH4OpeningTokens(parts[0] ?? []);

    for (let i = 1; i < parts.length; i++) {
        ans.push(span(" = ", "signature-separator"));
        pushIfText(ans, formatPythonTokens(parts[i]), "signature-plain");
    }

    return ans;
}

function spansH4NonCallableColonTokens(tokens) {
    const parts = splitTopLevel(tokens, ":");
    const ans = spansH4OpeningTokens(parts[0] ?? []);

    for (let i = 1; i < parts.length; i++) {
        ans.push(span(": ", "signature-separator"));
        pushIfText(ans, formatPythonTokens(parts[i]), "signature-plain");
    }

    return ans;
}

function spansH4CallableTokens(tokens, iOpen, iClose) {
    const opening = tokens.slice(0, iOpen);
    const core = tokens.slice(iOpen + 1, iClose);
    const closing = tokens.slice(iClose + 1);

    const ans = spansH4OpeningTokens(opening, { callable: true });
    ans.push(span("(", "signature-bracket"));
    ans.push(...spansH4CoreTokens(core));
    ans.push(span(")", "signature-bracket"));
    ans.push(...spansH4ClosingTokens(closing));
    return ans;
}

function spansH4ClosingTokens(tokens) {
    if (tokens.length === 0) {
        return [];
    }

    if (tokens[0] === "->") {
        const ans = [span(" -> ", "signature-separator")];
        pushIfText(ans, formatPythonTokens(tokens.slice(1)), "signature-parameter");
        return ans;
    }

    const ans = [];
    pushIfText(ans, formatPythonTokens(tokens), "signature-parameter");
    return ans;
}

function spansH4OpeningTokens(tokens, { callable = false } = {}) {
    if (tokens.length === 0) {
        return [];
    }

    // Split at the FIRST type-parameter group, not the last. Some rendered
    // overload signatures contain successive [...] groups, and using only the
    // last one incorrectly styles "class package.Name[...]" as one name.
    const genericStart = findTopLevelToken(tokens, "[");
    const classical = genericStart === -1 ? tokens : tokens.slice(0, genericStart);
    const generic = genericStart === -1 ? [] : tokens.slice(genericStart);

    const ans = spansH4OpeningClassicalTokens(classical);
    const typeParameters = callable || classical.includes("class") || classical.includes("type");
    pushIfText(ans, formatPythonTokens(generic, { typeParameters }), "signature-plain");
    return ans;
}

function spansH4OpeningClassicalTokens(tokens) {
    if (tokens.length === 0) {
        return [];
    }

    const nameStart = findQualifiedNameStart(tokens);
    if (nameStart === -1) {
        return [span(formatPythonTokens(tokens), "signature-name")];
    }

    const titleTokens = tokens.slice(0, nameStart);
    const nameTokens = tokens.slice(nameStart);
    const ans = [];

    for (const token of titleTokens) {
        pushIfText(ans, formatPythonTokens([token]), "signature-title");
        ans.push(span(" ", "signature-separator"));
    }

    for (let i = 0; i < nameTokens.length; i++) {
        const token = nameTokens[i];

        if (token === ".") {
            ans.push(span(".", "signature-separator"));
            continue;
        }

        const hasAnotherName = nameTokens.slice(i + 1).includes(".");
        ans.push(span(token, hasAnotherName ? "signature-plain" : "signature-name"));
    }

    return ans;
}

function spansH4CoreTokens(tokens) {
    if (tokens.length === 0) {
        return [];
    }

    const parts = splitTopLevel(tokens, ",");
    const ans = [];

    for (let i = 0; i < parts.length; i++) {
        pushIfText(ans, formatPythonTokens(parts[i]), "signature-parameter");

        if (i < parts.length - 1) {
            ans.push(span(", ", "signature-separator"));
        }
    }

    return ans;
}

function pushIfText(ans, text, kind) {
    if (text !== "") {
        ans.push(span(text, kind));
    }
}

function findTopLevelToken(tokens, target) {
    const stack = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (stack.length === 0 && token === target) {
            return i;
        }

        if (isOpeningBracket(token)) {
            stack.push(token);
        } else if (isClosingBracket(token)) {
            popMatchingBracket(stack, token);
        }
    }

    return -1;
}

function splitTopLevel(tokens, separator) {
    const parts = [];
    const stack = [];
    let start = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (stack.length === 0 && token === separator) {
            parts.push(tokens.slice(start, i));
            start = i + 1;
            continue;
        }

        if (isOpeningBracket(token)) {
            stack.push(token);
        } else if (isClosingBracket(token)) {
            popMatchingBracket(stack, token);
        }
    }

    parts.push(tokens.slice(start));
    return parts;
}

function findMatchingBracket(tokens, iOpen) {
    const open = tokens[iOpen];
    const close = matchingClose(open);

    if (close === null) {
        return -1;
    }

    let depth = 0;

    for (let i = iOpen; i < tokens.length; i++) {
        if (tokens[i] === open) {
            depth++;
        } else if (tokens[i] === close) {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }

    return -1;
}

function findQualifiedNameStart(tokens) {
    if (tokens.length === 0 || !isIdentifierToken(tokens.at(-1))) {
        return -1;
    }

    let start = tokens.length - 1;

    while (
        start >= 2 &&
        tokens[start - 1] === "." &&
        isIdentifierToken(tokens[start - 2])
    ) {
        start -= 2;
    }

    return start;
}

function isIdentifierToken(token) {
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
}

function isStringToken(token) {
    return token.startsWith("\"") || token.startsWith("'");
}

function isStringPrefixToken(token) {
    return /^(?:r|u|b|br|rb|f|fr|rf)$/i.test(token);
}

function isOpeningBracket(token) {
    return token === "(" || token === "[" || token === "{";
}

function isClosingBracket(token) {
    return token === ")" || token === "]" || token === "}";
}

function matchingClose(open) {
    if (open === "(") return ")";
    if (open === "[") return "]";
    if (open === "{") return "}";
    return null;
}

function matchingOpen(close) {
    if (close === ")") return "(";
    if (close === "]") return "[";
    if (close === "}") return "{";
    return null;
}

function popMatchingBracket(stack, close) {
    if (stack.at(-1) === matchingOpen(close)) {
        stack.pop();
    }
}

// The ASCII tokenizer may return an ellipsis as three separate dots.
// Unify it so "tuple[T, ...]" gets the same spacing as other comma lists.
function normalizePythonTokens(tokens) {
    const ans = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "." && tokens[i + 1] === "." && tokens[i + 2] === ".") {
            ans.push("...");
            i += 2;
        } else {
            ans.push(tokens[i]);
        }
    }
    return ans;
}

function formatPythonTokens(tokens, { typeParameters = false } = {}) {
    let ans = "";
    const stack = [];
    let previous = null;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const next = tokens[i + 1] ?? null;
        const inSquareBrackets = stack.at(-1) === "[";
        const inTypeParameters = typeParameters && stack.length === 1 && inSquareBrackets;

        if (isOpeningBracket(token)) {
            ans += token;
            stack.push(token);
        } else if (isClosingBracket(token)) {
            ans = ans.trimEnd() + token;
            popMatchingBracket(stack, token);
        } else if (token === ".") {
            ans = ans.trimEnd() + ".";
        } else if (token === ",") {
            ans = ans.trimEnd() + ", ";
        } else if (token === ";") {
            ans = ans.trimEnd() + "; ";
        } else if (token === ":") {
            // Slices use a tight colon (a[1:3]); type-variable bounds use a
            // spaced colon (class A[T: Hashable]).
            ans = ans.trimEnd() + (inSquareBrackets && !inTypeParameters ? ":" : ": ");
        } else if (token === "->") {
            ans = ans.trimEnd() + " -> ";
        } else if (isOperatorToken(token)) {
            if (isUnaryOperator(tokens, i)) {
                ans += token;
            } else {
                ans = ans.trimEnd() + " " + token + " ";
            }
        } else {
            const attachToStringPrefix =
                isStringToken(token) &&
                isStringPrefixToken(previous);

            const followsUnary =
                previous !== null &&
                isOperatorToken(previous) &&
                isUnaryOperator(tokens, i - 1);

            if (
                ans !== "" &&
                !ans.endsWith(" ") &&
                previous !== "." &&
                !isOpeningBracket(previous) &&
                !attachToStringPrefix &&
                !followsUnary
            ) {
                ans += " ";
            }

            ans += token;
        }

        previous = token;

        // Avoid a trailing space before a closing delimiter.
        if (next !== null && isClosingBracket(next)) {
            ans = ans.trimEnd();
        }
    }

    return ans.trim();
}

function isOperatorToken(token) {
    return new Set([
        "**=", "//=", "<<=", ">>=", ":=",
        "==", "!=", "<=", ">=",
        "**", "//", "<<", ">>",
        "+=", "-=", "*=", "/=", "%=",
        "@=", "&=", "|=", "^=",
        "+", "-", "*", "/", "%", "@",
        "&", "|", "^", "~", "<", ">", "="
    ]).has(token);
}

function isUnaryOperator(tokens, i) {
    const token = tokens[i];

    if (token === "~") {
        return true;
    }

    if (token !== "+" && token !== "-" && token !== "*" && token !== "**") {
        return false;
    }

    const previous = tokens[i - 1] ?? null;

    return (
        previous === null ||
        isOpeningBracket(previous) ||
        previous === "," ||
        previous === ":" ||
        previous === "=" ||
        previous === ":=" ||
        previous === "->" ||
        isOperatorToken(previous)
    );
}

function span(text, kind) {
    const ans = document.createElement("span");
    ans.classList.add(kind);
    ans.textContent = text;
    return ans;
}
