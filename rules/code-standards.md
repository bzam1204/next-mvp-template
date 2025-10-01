# Code Standards

## Language Requirements

  - All source code must be written in **English**.
  - This includes variable names, comments, and user-facing strings like error messages.

<!-- end list -->

```typescript
// Good
throw new InvalidOperationException('Tournament not found.');

// Avoid - Error message is not in English
throw new InvalidOperationException('Torneio não encontrado.');
```

-----

## Naming Conventions

### Case Styles

  - **camelCase**: Methods, functions, and variables
      - `getUserById()`, `calculateTotal()`, `isActive`
  - **PascalCase**: Classes and interfaces
      - `UserService`, `OrderRepository`, `IPaymentGateway`
  - **kebab-case**: Files and directories
      - `user-service.ts`, `order-repository.ts`, `payment-gateway/`

### Naming Guidelines

  - Avoid abbreviations. Write full, descriptive names to improve clarity.
  - Keep names descriptive but concise (max 30 characters).
  - Use meaningful, self-documenting names.

### Examples

```typescript
// Good
const userAuthenticationToken = '...';
const calculateOrderTotal = () => {};
class CustomerRepository {}
const featuredTournamentRepository: FeaturedTournamentRepository;

// Avoid
const usrAuthTkn = '...';
const calc = () => {};
class CustRepo {}
const repo: FeaturedTournamentRepository; // Abbreviation is not clear
```

-----

## Code Organization

### Constants and Magic Numbers

  - Declare constants for all magic numbers.
  - Use descriptive names that explain the value's purpose.

<!-- end list -->

```typescript
// Good
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;
const TAX_RATE = 0.08;

// Avoid
if (retries > 3) { ... }
const pageSize = 20;
```

-----

## Functions and Methods

### Naming Rules

  - Start with a verb that clearly describes the action.
  - Never start with a noun.

<!-- end list -->

```typescript
// Good
function createUser() {}
function validateEmail() {}
function isValidDate() {}

// Avoid
function userCreation() {}
function emailValidation() {}
```

### Parameter Guidelines

  - Limit to 3 parameters maximum.
  - For complex parameters, especially in public methods (like Use Cases), define a dedicated `interface` or `type`.

<!-- end list -->

```typescript
// Good
function createOrder(
  customerId: string,
  items: OrderItem[],
  options?: OrderOptions
) {}

// Better (when many parameters)
interface CreateOrderInput {
  customerId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  discountCode?: string;
}

function createOrder(input: CreateOrderInput) {}
```

-----

## Clean Code Principles

### Side Effects

  - Avoid side effects in functions.
  - A function should either return data OR cause a side effect, never both.

<!-- end list -->

```typescript
// Good - Query
function getUser(id: string): User {
  return database.findUser(id);
}

// Good - Command
function updateUser(id: string, data: UserData): void {
  database.updateUser(id, data);
}

// Avoid - Mixed responsibility
function getUserAndLog(id: string): User {
  const user = database.findUser(id);
  logger.info(`User ${id} accessed`); // Side effect in query
  return user;
}
```

### Explicitness and Debuggability

  - Assign the result of a function call to a descriptively named variable before returning it. This makes the code easier to read and debug (e.g., you can place a breakpoint and inspect the value before it's returned).

<!-- end list -->

```typescript
// Good
async function createEntity(data: EntityData): Promise<Entity> {
  const newEntity = await repository.save(data);
  return newEntity;
}

// Avoid
async function createEntity(data: EntityData): Promise<Entity> {
  // Harder to debug the return value
  return await repository.save(data);
}
```

### Control Flow

#### Early Returns

  - Use early returns (guard clauses) to avoid deep nesting.
  - Maximum nesting level: 2.

<!-- end list -->

```typescript
// Good
function processOrder(order: Order): void {
  if (!order) throw new Error('Order is required');
  if (!order.items.length) throw new Error('Order must have items');

  // Process order
}

// Avoid
function processOrder(order: Order): void {
  if (order) {
    if (order.items.length) {
      // Process order
    } else {
      throw new Error('Order must have items');
    }
  } else {
    throw new Error('Order is required');
  }
}
```

#### Flag Parameters

  - Never use boolean flags to control function behavior.
  - Create separate, explicitly named functions instead.

<!-- end list -->

```typescript
// Good
function saveUser(user: User): void {}
function saveUserAsDraft(user: User): void {}

// Avoid
function saveUser(user: User, isDraft: boolean): void {
  if (isDraft) {
    // Save as draft
  } else {
    // Save normally
  }
}
```

-----

## Code Size Limits

### Methods and Functions

  - Maximum 50 lines per function.
  - If exceeding, consider extracting helper functions.

### Classes

  - Maximum 300 lines per class.
  - If exceeding, consider splitting responsibilities.

-----

## Dependency Management

### Dependency Inversion

  - Invert dependencies for external resources (HTTP, storage).
  - Define small interfaces and inject implementations.

<!-- end list -->

```typescript
interface PaymentGateway {
  processPayment(amount: number): Promise<PaymentResult>;
}

class PaymentService {
  constructor(private readonly gateway: PaymentGateway) {}
  async processOrder(order: Order): Promise<void> {
    await this.gateway.processPayment(order.total);
  }
}
```

-----

## Code Formatting

### Blank Lines

  - Avoid blank lines within methods and functions.
  - Use blank lines to separate methods, functions, and logical blocks of code.

### Comments

  - Write self-documenting code. Avoid comments that explain *what* the code does.
  - Use comments only to explain *why* a particular implementation was chosen, especially for:
      - Complex algorithms.
      - Clarification of non-obvious business rules.
      - `TODO`/`FIXME` tags with ticket references.

### Variable Declaration

  - Never declare multiple variables on the same line.
  - Declare variables as close as possible to where they are first used.

<!-- end list -->

```typescript
// Good
const firstName = user.firstName;
const lastName = user.lastName;

// Avoid
const firstName = user.firstName,
  lastName = user.lastName;
```

-----

## Design Principles

### Composition Over Inheritance

  - Prefer composition to class inheritance.
  - Use interfaces for contracts and compose behaviors through dependency injection.

<!-- end list -->

```typescript
interface Logger {
  log(message: string): void;
}

class UserService {
  constructor(private readonly logger: Logger) {}
}
```

-----