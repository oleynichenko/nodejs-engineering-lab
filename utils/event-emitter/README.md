### Requirements for `EventEmitter`

1. The class must store listeners separately for each event.

2. Each event can have **multiple listeners**:

```ts
emitter.on("user.created", listener1);
emitter.on("user.created", listener2);
```

3. `on(event, listener)` must add a listener to the event.

4. The same listener registered twice with `on()` **must not be added twice**.

5. `emit(event, ...args)` must call **all listeners** registered for that event.

6. `emit()` must pass the same arguments to all listeners:

```ts
emitter.emit("user.created", user, timestamp);
```

7. If the event does not exist, `emit()` must do nothing and must not throw an error.

8. `off(event, listener)` must remove a **specific listener**.

9. When a listener is removed, the other listeners for that event must remain.

10. If no listeners remain for an event after `off()`, the event entry should preferably be removed from the internal storage.

11. `once(event, listener)` must register a listener that is executed **only once**.

12. After the first `emit()`, the listener registered with `once()` must be automatically removed.

13. `removeAllListeners(event)` must remove all listeners for a specific event.

14. `removeAllListeners()` without an argument must remove **all events and all listeners**.

15. `listenerCount(event)` must return the number of registered listeners.
