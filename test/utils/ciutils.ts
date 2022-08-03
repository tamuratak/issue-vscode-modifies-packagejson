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
                await sleep(1000)
                throw e
            }
        })
    }
}
