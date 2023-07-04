import * as vscode from 'vscode';
import * as wandb from '@wandb/sdk';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'vscode-wandb.registerAPIKey',
    async () => {
      const apiKey = await vscode.window.showInputBox({
        placeHolder: 'Please enter your WandB API key',
        ignoreFocusOut: true, // Keeps the input box open when losing focus
      });

      if (apiKey) {
      } else {
        vscode.window.showErrorMessage('You need to provide an API key!');
      }

      // TODO: use apiKey to authenticate with WandB API and verify valid connection

      // Fetch experiments
      //   const runs = await api.runs('user/project');  #  TODO: fetch any experiment/run from WandB by http requests or sdk if available

      //   showExperimentTable(runs);  #  TODO:  make the implementation
    }
  );

  context.subscriptions.push(disposable);
}
