interface ErrorReporter {
    line: number;
    where: string;
    message: string;
}

export function error(line: number, message: string) {
    report({ line, where: "", message });
}

function report(err: ErrorReporter) {
    console.log(`[Line ${err.line}] Error ${err.where}: ${err.message}`);
}
