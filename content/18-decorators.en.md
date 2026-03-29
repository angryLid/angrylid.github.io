---
title: "Dive into JavaScript Decorators"
slug: decorators
created-time: 2025-02-27
tags: ["dev"]
---

# Dive into JavaScript Decorators: Step by Step to Method Enhancements

This came from one of my technical sharing. At at time we're reading the *Head First Design Patterns* book.


## An Example: the Notifier class

Consider a social media platform that alerts users about new messages and friend requests. We're going to create a Notifier class to handle these notifications effectively.

```javascript
class EmailNotifier {
  nofify() {
    console.log("We will send an Email to the user.")
  }
}
```

Meanwhile, users can subscribe to notifications on other platforms, such as Microsoft Teams. Subclassing is the most straightforward approach to extending a method and achieving our goal.

```javascript
class EmailNotifier { /* */ }

class TeamsEmailNotifier extends EmailNotifier {
  nofify() {
    super.nofify()
    console.log("We will send a notification on Teams")
  }
}
```

Things become more complicated when the user wants to receive notifications from Jira at the same time.

```javascript
class EmailNotifier { /* */ }

class TeamsEmailNotifier extends EmailNotifier { /* */ }

class JiraTeamsEmailNotifier extends TeamsEmailNotifier {
  nofify() {
    super.nofify()
    console.log("We will send a notification on Jira")
  }
}
```

The challenge now lies in maintaining these classes to support a variety of platforms. Additionally, users must be able to cancel any subscription.

For instance, should we create a separate class to handle users who receive notifications from Jira and Teams, but not email?

```javascript
class EmailNotifier { /* */ }

class TeamsEmailNotifier extends EmailNotifier { /* */ }

class JiraTeamsEmailNotifier extends TeamsEmailNotifier { /* */ }

class TeamsNotifier { /* */ }

class JiraTeamsNotifier extends TeamsNotifier { /* */ }
```

The number of required classes increases exponentially with each supported platform. Implementing notifications for 6 platforms would necessitate 64 classes, which is clearly unsustainable.

## Has-One rather than Is-One

Let's take a break and reconsider our code. It doesn't make sense to regard the Teams Notifier as a special type of Email Notifier. Indeed these classes should have a parallel relationship rather than a belong-to relationship.

Let's refactor the code as follows:

```typescript
interface Notifier {
  notify(): void
}

class EmailNotifier implements Notifier {
  constructor(private notifier?: Notifier){}
  notify() {
    this.notifier?.notify()
    console.log("We will send an Email to the user.")
  }
}

class TeamsNotifier implements Notifier {
  constructor(private notifier?: Notifier){}
  notify() {
    this.notifier?.notify()
    console.log("We will send a notification on Teams")
  }
}

class JiraNotifier implements Notifier {
  constructor(private notifier?: Notifier){}
  notify() {
    this.notifier?.notify()
    console.log("We will send a notification on Jira")
  }
}
```

Now we can compose these classes arbitrarily:

```javascript
new JiraNotifier(new TeamsNotifier()).notify()

new EmailNotifier(new JiraNotifier()).notify()
```

## Wrapping instead of Holding

Our code is getting more flexible and maintainable. However, there are still some deficiencies in the snippets.

The Notifiers don't need to know each other. What's more, do you remember that a class is actually syntactic sugar in JavaScript? We can implement the notification services in a more JavaScript-style way.

We will implement a function that receives a class and returns it with its methods wrapped.

```typescript
function makeJiraNotifier($class) { /* TODO */ }

class _Notifier {
	notify() {}
}

export const JiraNotifier = makeJiraNotifier(_Notifier)
```

In the `makeJiraNotifier` function, we need to get the original method first.

```typescript
function makeJiraNotifier($class) {
  const { notify } = $class.prototype
}
```

And then redefine this property as a new function.

```javascript
function makeJiraNotifier($class) {
  const { notify } = $class.prototype
  Object.defineProperty($class.prototype, 'notify', {
    value(...args) {

    }
  })
}
```

The new function first calls the original function. Then, it executes the enhancement logic we want to implement.

```javascript
function makeJiraNotifier($class) {
  const { notify } = $class.prototype
  Object.defineProperty($class.prototype, 'notify', {
    value(...args) {
      notify.apply(this, args)
      console.log('Send message by Jira')
    }
  })
}
```

Finally, we can implement other wrappers in a similar manner.

```typescript
function makeJiraNotifier($class) {
  const { notify } = $class.prototype
  Object.defineProperty($class.prototype, 'notify', {
    value(...args) {
      notify.apply(this, args)
      console.log('Send message by Jira')
    }
  })
}

class _Notifier {
	notify() {}
}

export const JiraNotifier = makeJiraNotifier(_Notifier)
```

## Decorator Syntax in TypeScript

TypeScript provides a more elegant approach to maintaining your decorators.

```typescript
function jira(target, propertyKey, descriptor) {
  return {
    value(...args) {
      descriptor.value.apply(this, args)
      console.log('jira')
    }
  }
}


class N {
  @jira
  notify() {

  }
}
```

```typescript
function jira<This, Args extends any[], Return>(
    target: (this: This, ...arg: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    return function (this: This, ...args: Args) {
        target.apply(this, args)
        console.log('notify jira')
    }
}

class N {
    @jira
    notify() {

    }
}
```

## A Real-World App with Decorators

## Reference

- [装饰器 - Java教程 - 廖雪峰的官方网站](https://liaoxuefeng.com/books/java/design-patterns/structural/decorator/index.html)
- [JavaScript metaprogramming with the 2022-03 decorators API](https://2ality.com/2022/10/javascript-decorators.html)
- [Decorator](https://refactoring.guru/design-patterns/decorator)
- [Announcing TypeScript 5.0 - TypeScript](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)
- [Documentation - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [GitHub - tc39/proposal-decorators: Decorators for ES6 classes](https://github.com/tc39/proposal-decorators?tab=readme-ov-file)