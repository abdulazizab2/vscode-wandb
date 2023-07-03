import * as vscode from 'vscode';
import * as wandb from '@wandb/sdk';

export function activate(context: vscode.ExtensionContext) {

   let disposable = vscode.commands.registerCommand('extension.showExperiments', async () => {

      // Set up the WandB API
    //   const api = new wandb.Api();  #  TODO: get user API by prompt if required

      // Fetch experiments
    //   const runs = await api.runs('user/project');  #  TODO: fetch any experiment/run from WandB by http requests or sdk if available

    //   showExperimentTable(runs);  #  TODO:  make the implementation
   });

   context.subscriptions.push(disposable);
}
