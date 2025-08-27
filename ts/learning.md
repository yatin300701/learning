## Imp things to learn?

TypeScript can **downlevel** newer JS features to older ones (like ES3/ES5).

```ts
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

By default, TypeScript targets **ES5**.
If we set `--target es2015`, the output keeps template strings as they are:

```bash
tsc --target es2015 hello.ts

```

### Why avoid `String`, `Number`, `Boolean`?

- Lowercase `string`, `number`, `boolean` are **primitive types**.
- Capitalized `String`, `Number`, `Boolean` are **wrapper object types** created with `new String()`, `new Number()`, `new Boolean()`.

Example:

```ts
let a: string = "hello"; // primitive
let b: String = new String("hi"); // object wrapper
```

At runtime:

```
typeof "hello"   // "string"
typeof new String("hi") // "object"
```

Using wrappers can cause bugs (e.g. truthiness checks) and add unnecessary objects.

## noImplicitAny

If you don’t specify a type and TS can’t infer it, the type becomes `any` by default.  
`any` skips type-checking, so mistakes go unnoticed.

Example:

```ts
function log(msg) {
  // msg: any
  console.log(msg.toFixed()); // no error at compile time, but may crash
}
```

tsconfig.json

```
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}
```

## Working with Union Types

Union = a value can be one of several types.

Example:

```ts
function printId(id: number | string) {
  console.log(id.toUpperCase()); // ❌ Error: not valid on both number & string
}
```

TS only allows operations valid for every member of the union.
To use member-specific operations, you must narrow the type.

Narrowing with typeof

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // ok
  } else {
    console.log(id); // number
  }
}
```

ommon properties (no narrowing needed)

If all union members share a property, you can use it directly

Rule: TS unions appear to have only the intersection of properties available.

## Type Aliases

A **type alias** gives a name to any type (object, union, primitive, etc.).

```ts
type Point = { x: number; y: number };

function printCoord(pt: Point) {
  console.log("x:", pt.x, "y:", pt.y);
}
printCoord({ x: 100, y: 200 });
```

Aliases can also name unions:

```
type ID = number | string;
```

Aliases don’t create new distinct types — they’re just names

## Interfaces

Another way to name object types:

```
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("x:", pt.x, "y:", pt.y);
}

```

Both type and interface work similarly for objects.
TypeScript only cares about the shape of the type (structural typing).

## Type vs Interface

- **Error messages**

  - Before TS 4.2, `type` names sometimes disappear (replaced with raw type).
  - `interface` names always show up.

- **Declaration merging**

  - `interface` ✅ supports merging.
  - `type` ❌ cannot merge.

- **What they can define**

  - `type` can alias anything (objects, unions, primitives).
  - `interface` only for object shapes.

- **Extending**
  - `interface` uses `extends`, often faster for compiler.
  - `type` uses intersections (`&`).

👉 Rule of thumb:

- Use **interface** for object shapes you expect to extend/merge.
- Use **type** for unions, primitives, or when you need flexibility.
