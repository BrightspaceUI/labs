import { DataLayerGroup, DataLayerItem } from './index.js';

class FooData extends DataLayerGroup {
	static actions = {
		flushBar() { this.getItem('bar').flush(); },
	};

	static data = {
		foo: 'foo',
		async bar() {
			this.declareDependencies(this.foo);
			await new Promise(resolve => setTimeout(resolve, 1000));
			return `${this.foo}bar`;
		},
		baz() { return `${this.bar}baz`; },
	};
}

const dataLayer = new FooData();

const immediate = false;
dataLayer.getItem('bar').subscribe(v => console.log('!!! bar changed', v.value, v.evaluating, v._dependenciesEvaluating.size), immediate);
dataLayer.getItem('baz').subscribe(v => console.log('!!! baz changed', v.value, v.evaluating, v._dependenciesEvaluating.size), immediate);

console.log('requesting foo');
console.log('foo', dataLayer.foo); // foo
console.log('bar', dataLayer.bar); // null
console.log('baz', dataLayer.baz); // null
await new Promise(resolve => setTimeout(resolve, 2000));
console.log('bar', dataLayer.bar); // foobar
console.log('baz', dataLayer.baz); // foobarbaz

const q = new DataLayerItem(5);
console.log(q.value);

console.log('updating foo');
dataLayer.foo = 'foo2'; // foo2bar, foo2barbaz

await new Promise(resolve => setTimeout(resolve, 2000));

console.log('flushing bar');
dataLayer.flushBar(); // foo2bar, foo2barbaz

try { dataLayer.bar = 'bar'; } catch (e) { console.log('caught', e.message); }
try {
	new class extends DataLayerGroup {
		static data = { getItem: 'foo' };
	}()
	// new FooData2();
} catch (e) { console.log('caught', e.message); }
