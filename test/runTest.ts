import * as path from 'path'
import * as process from 'process'
import { runTests } from '@vscode/test-electron'
import { getExtensionDevelopmentPath } from './utils/runnerutils'


async function runTestsOnEachFixture(targetName: 'build' | 'rootfile' | 'viewer' | 'completion' | 'multiroot-ws' | 'unittest') {
    const extensionDevelopmentPath = getExtensionDevelopmentPath()
    const extensionTestsPath = path.resolve(__dirname, `./${targetName}.index`)
    await runTests({
        version: '1.68.1',
        extensionDevelopmentPath,
        extensionTestsPath,
        launchArgs: [
            'test/fixtures/unittest/fixture001',
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
        await runTestsOnEachFixture('unittest')
    } catch (err) {
        console.error('Failed to run tests')
        process.exit(1)
    }
}

void main()
