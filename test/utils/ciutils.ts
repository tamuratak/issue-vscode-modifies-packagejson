import * as assert from 'assert'
import * as path from 'path'
import * as process from 'process'
import * as vscode from 'vscode'
import {activate} from '../../src/main'

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

export function getFixtureDir(): string {
    const fixtureDir = getWorkspaceRootDir()
    if (fixtureDir) {
        return fixtureDir
    } else {
        assert.fail('fixtureDir is undefined.')
    }
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
    // await vscode.commands.executeCommand('workbench.action.output.toggleOutput')
    await sleep(1000)
//    const logMessage = vscode.window.activeTextEditor?.document.getText()
//    console.log(logMessage)
//    await vscode.commands.executeCommand('latex-workshop.log', true)
    await sleep(1000)
//    const compilerLogMessage = vscode.window.activeTextEditor?.document.getText()
//    console.log(compilerLogMessage)
}

export async function execCommandThenPick(
    command: () => Thenable<unknown>,
    pick: () => Thenable<undefined>
) {
    let done = false
    setTimeout(async () => {
        while (!done) {
            await pick()
            await sleep(1000)
        }
    }, 3000)
    await command()
    done = true
}



export function isDockerEnabled() {
    return process.env['LATEXWORKSHOP_CI_ENABLE_DOCKER'] ? true : false
}

type PickTruthy<T> = T | false | undefined | null

/**
 * Executes `command` repeatedly until a certain result obtained.
 * Since `command` is executed repeatedly until timeout, it must not have any side effects.
 *
 * @param command Callback to be executed.
 * @param errMessage A string to be displayed as an error message.
 */
export async function waitUntil<T>(
    command: () => PickTruthy<T> | Thenable<PickTruthy<T>>,
    limit = 70
): Promise<T> {
    for (let i = 0; i < limit; i++) {
        const result = await command()
        if (result) {
            return result
        }
        await sleep(300)
    }
    await printLogMessages()
    assert.fail('Timeout Error at waitUntil')
}



export function obtainLatexWorkshop() {
    const extension = vscode.extensions.getExtension<ReturnType<typeof activate>>('James-Yu.latex-workshop')
    if (extension) {
        return extension
    } else {
        throw new Error('LaTeX Workshop not activated.')
    }
}

export async function waitLatexWorkshopActivated() {
    await vscode.commands.executeCommand('latex-workshop.activate')
    return obtainLatexWorkshop()
}


export function waitGivenRootFile(file: string) {
    return waitUntil( async () => {
        const extension = await waitLatexWorkshopActivated()
        const rootFile = extension.exports.realExtension?.manager.rootFile
        return rootFile === file
    })
}

export async function executeVscodeCommandAfterActivation(command: string) {
    await waitLatexWorkshopActivated()
    return vscode.commands.executeCommand(command)
}
