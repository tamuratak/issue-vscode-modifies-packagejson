import * as path from 'path'
import * as process from 'process'
import { runTests } from '@vscode/test-electron'

async function runTestsOnEachFixture() {
    const extensionDevelopmentPath = path.resolve(__dirname, '..', '..')
    const extensionTestsPath = path.resolve(__dirname, `./unittest.index`)
    await runTests({
        version: '1.68.1',
        extensionDevelopmentPath,
        extensionTestsPath,
        launchArgs: [
            '--lang=C',
            '--disable-keytar',
            '--disable-telemetry',
            '--disable-gpu'
        ],
        extensionTestsEnv: {
            LATEXWORKSHOP_CI_ENABLE_DOCKER: process.argv.includes('--enable-docker') ? '1' : undefined,
            LATEXWORKSHOP_CI: '1'
        }
    })
}

async function main() {
    try {
        await runTestsOnEachFixture()
    } catch (err) {
        console.error('Failed to run tests')
        process.exit(1)
    }
}

void main()
