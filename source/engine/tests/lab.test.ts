import { expect, test } from '@jest/globals';

test("functions", () => {
    const logText = (text: string | string[]) => {
        console.log(text)
    }

    const actionBuilder = {
        buildSimpleTextAction: (text: string | string[]) => {
            return { execute: () => logText(text), meta: { text } }
        }
    }

    const action = actionBuilder.buildSimpleTextAction('hello')

    expect(action.meta.text).toBe('hello')
})
