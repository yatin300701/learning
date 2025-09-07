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

## Literal Inference in TypeScript

- When initializing an object, TypeScript assumes its properties may change later.
  ```ts
  const obj = { counter: 0 };
  obj.counter = 1; // ✅ counter inferred as number, not 0
  ```

By default, properties are inferred as wider types (number, string) instead of literal types (0, "GET").

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
// ❌ Error: req.method inferred as string, not "GET"
```

### Workarounds

#### Type assertion on property or usage

```ts
const req = { url: "https://example.com", method: "GET" as "GET" };
// OR
handleRequest(req.url, req.method as "GET");
```

#### Use as const to lock object properties to literals

```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method); // ✅
```

### Key Point

Default inference → wider types (flexible for mutation).

as const → literal types (fixed values, immutable at type level).

## Non-null Assertion Operator (`!`)

- `!` (postfix operator) removes `null` and `undefined` from a type **without explicit checks**.
- It’s a **type assertion**: “I know this value is not `null` or `undefined`”.

### Example

```ts
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed()); // ✅ No type error
}
```

## Enums

Enums let you define a set of named constants.  
Unlike most TypeScript features, enums exist at both the **type level** and the **runtime level** (they emit JS code).

### Example: Numeric Enums

```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

let dir: Direction = Direction.Up;

- Values auto-increment if not assigned (Down = 2, Left = 3, ...).

- At runtime, enums create an object with forward and reverse mapping.

```ts
{
  1: "Up",
  2: "Down",
  3: "Left",
  4: "Right",
  Up: 1,
  Down: 2,
  Left: 3,
  Right: 4
}
```

** Example: String Enums **

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

- No auto-increment, must assign all values.

- At runtime, enum is just an object with string values.

```ts
{
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT"
}
```

** Const Enums**

Use const enum to remove runtime overhead — values are inlined at compile time.

```ts
const enum Direction {
  Up,
  Down,
}

let dir = Direction.Up; // compiled to: var dir = 0;
```

### When to Use?

Numeric enums → when you care about values (e.g., bit flags).

String enums → when you want readable and stable values.

Const enums → for performance, avoid JS output.

In modern code, often better to use union of string literals instead of enums:

```ts
type Direction = "Up" | "Down" | "Left" | "Right";
```

## Narrowing

### typeof type guards

TypeScript expects this to return a certain set of strings:

- "string"
- "number"
- "bigint"
- "boolean"
- "symbol"
- "undefined"
- "object"
- "function"

## typeof null quirk

- In JavaScript, `typeof null === "object"` (a historical bug that can’t be fixed).
- Arrays are also objects, so a check like `typeof strs === "object"` can mistakenly include `null`.
- Example:

```ts
function printAll(strs: string[] | null) {
  if (typeof strs === "object") {
    // strs is still string[] | null, not just string[]
  }
}
```

In JavaScript, typeof value === "object" is very broad — it returns "object" for plain objects, arrays, dates, regex, class instances, built-ins like Map/Set, and even null (a historical bug)

"object" is too generic to reliably distinguish types.

Use more precise checks:

- Array.isArray(value) → arrays
- value === null → null
- value instanceof Date → Date
- Object.prototype.toString.call(value) → detailed tag

## Truthiness Narrowing

- In JavaScript, conditionals (`if`, `&&`, `||`, `!`) don’t require `boolean` — any value is coerced to true/false.
- Falsy values:
  - `0`, `NaN`, `""`, `0n`, `null`, `undefined` → `false`
- Everything else → `true`.

### Example

```ts
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

- Useful for guarding against null/undefined.
- But ⚠️ be careful: empty strings or 0 are also falsy and can lead to subtle bugs.

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) console.log(s);
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

**_ Truthiness is convenient, but avoid overusing it — always consider edge cases like "" or 0. _**
