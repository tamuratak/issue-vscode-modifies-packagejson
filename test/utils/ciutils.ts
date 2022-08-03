import * as path from 'path'
import * as vscode from 'vscode'

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getWorkspaceRootDir(): string | undefined {
    let rootDir: string | undefined
    if (vscode.workspace.workspaceFile) {
        rootDir = path.dirname(vscode.workspace.workspaceFile.fsPath)
    } else {
        rootDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    }
    return rootDir
}

/**
 * Runs `cb` as a test if the basename of the working directory is equal to `fixtureName`.
 *
 * @param fixtureName The name of a fixture directory of the current test.
 * @param label Used as the title of test.
 * @param cb Callback executing tests.
 * @param skip `cb` is skipped if `true` returned.
 */
 export function runUnitTestWithFixture(
    fixtureName: string,
    label: string,
    cb: () => unknown,
    skip?: () => boolean
) {
    const rootPath = getWorkspaceRootDir()
    const shouldSkip = skip && skip()
    if (rootPath && path.basename(rootPath) === fixtureName && !shouldSkip) {
        test( fixtureName + ': ' + label, async () => {
            try {
                await cb()
            } catch (e) {
                await printLogMessages()
                throw e
            }
        })
    }
}

export async function printLogMessages() {
//    await vscode.commands.executeCommand('latex-workshop.log')
    await sleep(1000)
    await vscode.commands.executeCommand('workbench.action.output.toggleOutput')
    await sleep(1000)
    const logMessage = vscode.window.activeTextEditor?.document.getText()
    console.log(logMessage)
//    await vscode.commands.executeCommand('latex-workshop.log', true)
    await sleep(1000)
//    const compilerLogMessage = vscode.window.activeTextEditor?.document.getText()
//    console.log(compilerLogMessage)
}

