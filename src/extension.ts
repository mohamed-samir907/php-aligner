import * as vscode from 'vscode';

/**
 * This method is called when your extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
	// Register manual command
	const alignCommand = vscode.commands.registerCommand('php-aligner.align', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			alignDocument(editor);
		}
	});

	// Register automatic alignment on file save
	const onSaveHook = vscode.workspace.onWillSaveTextDocument(event => {
		const editor = vscode.window.activeTextEditor;
		const config = vscode.workspace.getConfiguration('php-aligner');

		const autoAlignEnabled = config.get<boolean>('autoAlignOnSave', true);

		// Ensure correct editor and file type
		if (
			autoAlignEnabled &&
			editor &&
			editor.document === event.document &&
			editor.document.languageId === 'php'
		) {
			alignDocument(editor);
		}
	});

	const openSupportCommand = vscode.commands.registerCommand('php-aligner.support', () => {
		vscode.env.openExternal(vscode.Uri.parse('https://github.com/sponsors/mohamed-samir907'));
	});

	context.subscriptions.push(alignCommand, onSaveHook, openSupportCommand);
}

/**
 * Aligns all relevant lines in the document based on `=` and `=>` operators.
 * @param editor The currently active text editor.
 */
function alignDocument(editor: vscode.TextEditor) {
	const document = editor.document;
	const fullText = document.getText();
	const lines = fullText.split('\n');

	let startIndex = -1;
	let currentOperator: string | null = null;

	for (let i = 0; i <= lines.length; i++) {
		const line = lines[i] ?? '';
		const operator = detectOperator(line);

		const isAlignable = operator !== null;

		if (isAlignable) {
			if (currentOperator === null) {
				currentOperator = operator;
				startIndex = i;
			} else if (operator !== currentOperator) {
				alignBlock(lines, startIndex, i - 1, currentOperator);
				startIndex = i;
				currentOperator = operator;
			}
		} else if (startIndex !== -1 && currentOperator !== null) {
			alignBlock(lines, startIndex, i - 1, currentOperator);
			startIndex = -1;
			currentOperator = null;
		}
	}

	// Replace entire document with aligned lines
	const fullRange = new vscode.Range(
		document.positionAt(0),
		document.positionAt(fullText.length)
	);

	editor.edit(editBuilder => {
		editBuilder.replace(fullRange, lines.join('\n'));
	});
}

/**
 * Aligns a block of lines based on the given operator (`=` or `=>`).
 * @param lines The full list of document lines.
 * @param start The starting index of the block.
 * @param end The ending index of the block.
 * @param operator The operator to align around.
 */
function alignBlock(lines: string[], start: number, end: number, operator: string) {
	const replacements = new Map<number, string>();

	const block = lines.slice(start, end + 1);

	const parsedLines = block.map((line, idx) => {
		const parts = line.split(operator);
		if (parts.length < 2) return null;

		const lhs = parts[0].replace(/\s+$/, '');
		const rhs = parts.slice(1).join(operator).trimStart();
		const index = start + idx;

		// ✅ Trim but skip alignment if rhs starts with `[`
		if (operator === '=>' && rhs.startsWith('[')) {
			const trimmedLine = `${lhs} ${operator} ${rhs}`;
			return { index, newLine: trimmedLine };
		}

		return { index, lhs, rhs };
	});

	// Find lines eligible for alignment
	const alignable = parsedLines.filter(
		(item): item is { index: number; lhs: string; rhs: string } =>
			item !== null && 'rhs' in item
	);

	// Align if we have lines to align
	let maxLhsLength = 0;
	if (alignable.length > 0) {
		maxLhsLength = Math.max(...alignable.map(item => item.lhs.length));
		for (const { index, lhs, rhs } of alignable) {
			const padding = ' '.repeat(maxLhsLength - lhs.length);
			replacements.set(index, `${lhs}${padding} ${operator} ${rhs}`);
		}
	}

	// Add trimmed-only lines
	for (const item of parsedLines) {
		if (item && 'newLine' in item && typeof item.newLine === 'string') {
			replacements.set(item.index, item.newLine);
		}
	}

	// Apply replacements
	for (const [index, newLine] of replacements.entries()) {
		lines[index] = newLine;
	}
}

/**
 * Detects whether a line contains an alignable operator and returns it.
 * @param line A single line of code.
 * @returns The operator (`=` or `=>`) if present, otherwise null.
 */
function detectOperator(line: string): string | null {
	if (line.includes('=>')) return '=>';
	if (line.includes('=')) return '=';
	return null;
}

/**
 * Called when your extension is deactivated.
 */
export function deactivate() { }
