export function tokenizePythonAsciiLine(src) {
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