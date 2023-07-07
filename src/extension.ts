import * as vscode from 'vscode';
import wandb from '@wandb/sdk';
import { InitOptions } from '@wandb/sdk/dist/sdk/wandb_init';

export async function activate(context: vscode.ExtensionContext) {
  await context.globalState.update('WANDB_API_KEY', undefined); // workaround for resetting API key value during extension activation
  // Check if API key is in global state
  let apiKey = context.globalState.get<string>('WANDB_API_KEY');

  // If API key doesn't exist or is invalid, prompt the user for it
  while (!apiKey || !(await isValidApiKey(apiKey))) {
    apiKey = await vscode.window.showInputBox({
      placeHolder: 'Please enter your WandB API key',
      ignoreFocusOut: true, // Keeps the input box open when losing focus
    });
    process.env['WANDB_API_KEY'] = apiKey;

    if (apiKey && (await isValidApiKey(apiKey))) {
      // Store API key in global state
      await context.globalState.update('apiKey', apiKey);
      const fetchingMessage = vscode.window.setStatusBarMessage(
        'Fetching projects...'
      );

      try {
        vscode.window.showInformationMessage('API Key Validated'); //  TODO: remove after getting projects
        //
        // TODO: get all user projects. This is not straightforward as wandb-js doesnt support this natively as of date
        // either use python API with call via HTTP requests (FastAPI as a wrapper)
        // or scrape wandb after successful API authentifcation
      } finally {
        fetchingMessage.dispose(); // Hide the status bar message
      }
    } else {
      vscode.window.showErrorMessage('You need to provide a valid API key!');
    }
  }
}

async function isValidApiKey(apiKey: string): Promise<boolean> {
  const initOptions: InitOptions = {
    project: 'vscode-wandb-connection',
  };
  try {
    await wandb.init(initOptions);
    return true;
  } catch {
    return false;
  }
}
