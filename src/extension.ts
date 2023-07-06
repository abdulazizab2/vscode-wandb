import * as vscode from 'vscode';
import * as wandb from '@wandb/sdk';

export async function activate(context: vscode.ExtensionContext) {
  await context.globalState.update('apiKey', undefined); // workaround for resetting API key value during extension activation
  // Check if API key is in global state
  let apiKey = context.globalState.get<string>('apiKey');

  // If API key doesn't exist or is invalid, prompt the user for it
  while (!apiKey || !(await isValidApiKey(apiKey))) {
    apiKey = await vscode.window.showInputBox({
      placeHolder: 'Please enter your WandB API key',
      ignoreFocusOut: true, // Keeps the input box open when losing focus
    });

    if (apiKey && (await isValidApiKey(apiKey))) {
      // Store API key in global state
      await context.globalState.update('apiKey', apiKey);
      const fetchingMessage = vscode.window.setStatusBarMessage(
        'Fetching projects...'
      );

      try {
        // get all user projects
      } finally {
        fetchingMessage.dispose(); // Hide the status bar message
      }
    } else {
      vscode.window.showErrorMessage('You need to provide a valid API key!');
    }
  }
}

async function isValidApiKey(apiKey: string): Promise<boolean> {
  // TODO: replace with your actual validation logic
  // This could involve making a request to the API and checking if it succeeds, or calling a method from the SDK

  return true;
}
