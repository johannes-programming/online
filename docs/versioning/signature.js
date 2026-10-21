export function fixAllSignatures(realm = document.body) {
    realm.querySelectorAll(".signature > .literal").forEach(fixSignatureCode);
}

function fixSignatureCode(container) {
    if (container.children.length > 0) {
        return;
    }

    const text = container.textContent;
    const children = spansSignatureCodeText(text);

    container.textContent = "";
    for (const child of children) {
        container.appendChild(child);
    }
}

function spansSignatureCodeText(text) {
    // The tokenizer is intentionally ASCII-only. This keeps the previous
    // behavior of discarding non-ASCII characters before formatting.
    const ascii = text
        .replaceAll("-&gt;", "->")
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");

    const tokens = tokenizePythonAsciiLine(ascii);

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

    const ans = spansH4OpeningTokens(opening);
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

function spansH4OpeningTokens(tokens) {
    if (tokens.length === 0) {
        return [];
    }

    const genericStart = findTrailingGenericStart(tokens);
    const classical = genericStart === -1 ? tokens : tokens.slice(0, genericStart);
    const generic = genericStart === -1 ? [] : tokens.slice(genericStart);

    const ans = spansH4OpeningClassicalTokens(classical);
    pushIfText(ans, formatPythonTokens(generic), "signature-plain");
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

function findTrailingGenericStart(tokens) {
    if (tokens.at(-1) !== "]") {
        return -1;
    }

    let depth = 0;

    for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i] === "]") {
            depth++;
        } else if (tokens[i] === "[") {
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

function formatPythonTokens(tokens) {
    let ans = "";
    const stack = [];
    let previous = null;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const next = tokens[i + 1] ?? null;
        const inSquareBrackets = stack.at(-1) === "[";

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
            ans = ans.trimEnd() + (inSquareBrackets ? ":" : ": ");
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

function tokenizePythonAsciiLine(src) {
    const tokens = [];
    let i = 0;

    const isDigit = c => c >= '0' && c <= '9';
    const isHexDigit = c =>
        isDigit(c) ||
        (c >= 'a' && c <= 'f') ||
        (c >= 'A' && c <= 'F');

    const isIdentStart = c =>
        (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c === '_';

    const isIdentPart = c =>
        isIdentStart(c) || isDigit(c);

    // Longest operators first.
    const operators = [
        "**=", "//=", "<<=", ">>=", ":=",
        "==", "!=", "<=", ">=",
        "**", "//", "<<", ">>",
        "+=", "-=", "*=", "/=", "%=",
        "@=", "&=", "|=", "^=",
        "->",
        "+", "-", "*", "/", "%", "@",
        "&", "|", "^", "~",
        "<", ">", "=",
        "(", ")", "[", "]", "{", "}",
        ",", ":", ".", ";"
    ];

    function readWhile(predicate) {
        const start = i;
        while (i < src.length && predicate(src[i])) {
            i++;
        }
        return src.slice(start, i);
    }

    function readDigits(predicate = isDigit) {
        // Python permits underscores inside numeric literals.
        while (
            i < src.length &&
            (predicate(src[i]) || src[i] === '_')
        ) {
            i++;
        }
    }

    function readNumber() {
        const start = i;

        // Hexadecimal, binary, octal.
        if (
            src[i] === '0' &&
            i + 1 < src.length
        ) {
            const p = src[i + 1];

            if (p === 'x' || p === 'X') {
                i += 2;
                readDigits(isHexDigit);
                return src.slice(start, i);
            }

            if (p === 'b' || p === 'B') {
                i += 2;
                readDigits(c => c === '0' || c === '1');
                return src.slice(start, i);
            }

            if (p === 'o' || p === 'O') {
                i += 2;
                readDigits(c => c >= '0' && c <= '7');
                return src.slice(start, i);
            }
        }

        // Integer part, or ".123".
        if (src[i] === '.') {
            i++;
            readDigits();
        } else {
            readDigits();

            if (src[i] === '.') {
                i++;
                readDigits();
            }
        }

        // Exponent.
        if (src[i] === 'e' || src[i] === 'E') {
            const exponentStart = i;
            i++;

            if (src[i] === '+' || src[i] === '-') {
                i++;
            }

            const digitsStart = i;
            readDigits();

            // If exponent has no digits, don't consume it.
            if (i === digitsStart) {
                i = exponentStart;
            }
        }

        // Imaginary-number suffix.
        if (src[i] === 'j' || src[i] === 'J') {
            i++;
        }

        return src.slice(start, i);
    }

    function readString() {
        const start = i;
        const quote = src[i];

        // Triple-quoted strings can still exist on one physical line.
        const triple =
            src[i + 1] === quote &&
            src[i + 2] === quote;

        if (triple) {
            i += 3;

            while (i < src.length) {
                if (
                    src[i] === quote &&
                    src[i + 1] === quote &&
                    src[i + 2] === quote
                ) {
                    i += 3;
                    return src.slice(start, i);
                }

                if (src[i] === '\\') {
                    i += 2;
                } else {
                    i++;
                }
            }

            throw new SyntaxError("Unterminated triple-quoted string");
        }

        i++;

        while (i < src.length) {
            if (src[i] === '\\') {
                i += 2;
            } else if (src[i] === quote) {
                i++;
                return src.slice(start, i);
            } else {
                i++;
            }
        }

        throw new SyntaxError("Unterminated string literal");
    }

    while (i < src.length) {
        const c = src[i];

        // Whitespace is not returned as a token.
        if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
            i++;
            continue;
        }

        // String literal.
        if (c === '"' || c === "'") {
            tokens.push(readString());
            continue;
        }

        // Identifier / keyword.
        if (isIdentStart(c)) {
            tokens.push(readWhile(isIdentPart));
            continue;
        }

        // Number.
        if (
            isDigit(c) ||
            (c === '.' && isDigit(src[i + 1]))
        ) {
            tokens.push(readNumber());
            continue;
        }

        // Operator / punctuation.
        let matched = false;

        for (const op of operators) {
            if (src.startsWith(op, i)) {
                tokens.push(op);
                i += op.length;
                matched = true;
                break;
            }
        }

        if (matched) {
            continue;
        }

        throw new SyntaxError(
            `Unexpected character ${JSON.stringify(c)} at index ${i}`
        );
    }

    return tokens;
}

function span(text, kind) {
    const ans = document.createElement("span");
    ans.classList.add(kind);
    ans.textContent = text;
    return ans;
}
