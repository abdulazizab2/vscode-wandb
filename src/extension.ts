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
        //
        // TODO: get all user projects. This is not straightforward as wandb-js doesnt support this natively as of date
        // either use python API with call via HTTP requests (FastAPI as a wrapper)
        // or scrape wandb after successful API authentifcation
        // or using bare HTTP requests supported by wandb
        // then add to tree
        vscode.window.showInformationMessage('API Key Validated'); //  TODO: remove after getting projects
        const wandbTreeProvider = new WandbTreeProvider();
        context.subscriptions.push(
          vscode.window.registerTreeDataProvider(
            'projectsView',
            wandbTreeProvider
          )
        );

        context.subscriptions.push(
          vscode.commands.registerCommand(
            'extension.openProject',
            async (projectName: string) => {
              const doc = await vscode.workspace.openTextDocument({
                language: 'markdown',
                content: `# Project: ${projectName}\n\nDetails of the project...`,
              });
              vscode.window.showTextDocument(doc, { preview: false }); // TODO:  show some results, images or anything for proof of concept
            }
          )
        );
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

class WandbTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.command = {
      command: 'extension.openProject',
      title: 'Open Project',
      arguments: [this.label],
    };
  }

  contextValue = 'wandbTreeItem';
}

class WandbTreeProvider implements vscode.TreeDataProvider<WandbTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    WandbTreeItem | undefined | null | void
  > = new vscode.EventEmitter<WandbTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    WandbTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: WandbTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: WandbTreeItem): Thenable<WandbTreeItem[]> {
    // Create an empty array to store our project items
    let projects: WandbTreeItem[] = [];

    // Loop to create 5 project items
    for (let i = 1; i <= 2; i++) {
      let project = new WandbTreeItem(
        `Project ${i}`,
        vscode.TreeItemCollapsibleState.None
      );
      projects.push(project);
    }

    return Promise.resolve(projects);
  }
}
