# Error-handling
ALL normal errors should be caught, and return a record `{error: "the error message"}` to allow proper future synchronization with useful errors. When implementating actions, be sure to return errors when requirements are not met. Be clear in error messages.

Be sure to handle return types by including `| { error: string }`. For example,
async function exampleAction(...): Promise<{ result: T } | { error: string }> { ... }
