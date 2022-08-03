import * as assert from 'assert'

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

suite('unit test suite', () => {

    test('fixture001', async () => {
        try {
            assert.ok(false)
        } catch (e) {
            await sleep(1000)
            throw e
        }
    })

})
