// tslint:disable:no-implicit-dependencies
import ava, { ExecutionContext, TestInterface } from 'ava';

interface Context {
    text: string;
}
const test: TestInterface<Context> = <TestInterface<Context>>ava;

test.before('Set hello', (t: ExecutionContext<Context>) => {
    t.context.text = 'Hello!';
});

test('Say hello', (t: ExecutionContext<Context>) => {
    t.is(t.context.text, 'Hello!');
});
