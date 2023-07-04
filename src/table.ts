import * as vscode from 'vscode';

// #  TODO: better explicit typing
export function showExperimentTable(runs: any) {
  const panel = vscode.window.createWebviewPanel(
    'experimentTable',
    'Experiment Table',
    vscode.ViewColumn.One
  );

  let html = '<table>';

  // Add table headers
  html += '<tr><th>Experiment Name</th><th>Metrics</th></tr>';

  // Add a row for each experiment
  for (const run of runs) {
    html += `<tr><td>${run.name}</td><td>${JSON.stringify(
      run.config.metrics
    )}</td></tr>`;
  }

  html += '</table>';

  panel.webview.html = html;
}
