'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('decorator sample is activated');

	// create a decorator type that we use to decorate small numbers
	const loggerDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255,165,0,0.2)',
	});

	// create a decorator type that we use to decorate large numbers
	const assertionDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(0,255,0,0.2)',
	});

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	var timeout = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	function updateDecorations() {
    decorateAssertions();
    decorateLoggers();
  }

  function decorateLoggers() {
    const loggerRegex = /this\.logger\.(info|debug|warn)/g;
    decorateMatches(loggerRegex, loggerDecoration);
  }

  function decorateAssertions() {
    const assertionRegex = /(assert|expect)/g;
    decorateMatches(assertionRegex, assertionDecoration);
  }

  function decorateMatches(regex, decorator) {
    console.log("Updating decorations");
		if (!activeEditor) {
			return;
    }

		const text = activeEditor.document.getText();
		const decors: vscode.DecorationOptions[] = [];
		let match;
		while (match = regex.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos) }; //, hoverMessage: 'Number **' + match[0] + '**' };

      decors.push(decoration);
    }

		activeEditor.setDecorations(decorator, decors);
  }
}
