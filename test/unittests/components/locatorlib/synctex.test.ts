import * as assert from 'assert'

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

 export function runUnitTestWithFixture(
    fixtureName: string,
    label: string,
    cb: () => unknown,
    _skip?: () => boolean
) {

        test( fixtureName + ': ' + label, async () => {
            try {
                await cb()
            } catch (e) {
                await sleep(1000)
                throw e
            }
        })
//    }
}

suite('unit test suite', () => {

    suiteSetup(() => {
    })

    test( 'fixture001', async () => {
        try {
            assert.ok(false)
        } catch (e) {
            await sleep(1000)
            throw e
        }
    })

})
