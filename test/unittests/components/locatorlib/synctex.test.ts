import * as assert from 'assert'
import {runUnitTestWithFixture} from '../../../utils/ciutils'

suite('unit test suite', () => {

    suiteSetup(() => {
    })

    runUnitTestWithFixture('fixture001', 'test synctex', () => {
        assert.ok(false)
    })

})
