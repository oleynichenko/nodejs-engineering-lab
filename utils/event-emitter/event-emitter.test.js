const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert");
const { EventEmitter } = require("./event-emitter");

// node --test --test-only
// node --test

describe("EventEmitter", () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe("on()", () => {
    it("adds listener for a new event", () => {
      const listener = () => {};

      emitter.on("Event 1", listener);

      assert.ok(emitter.events.get("Event 1").includes(listener));
    });

    it("does not add the same listener for an event twice", () => {
      const listener = () => {};

      emitter.on("Event 1", listener);
      emitter.on("Event 1", listener);

      assert.strictEqual(emitter.events.get("Event 1").length, 1);
    });

    it("allows to have multiple listeners for one event", () => {
      const listener1 = () => {};
      const listener2 = () => {};

      emitter.on("Event 1", listener1);
      emitter.on("Event 1", listener2);

      assert.strictEqual(emitter.events.get("Event 1").length, 2);
    });
  });

  describe("emit()", () => {
    it("calls all listeners", () => {
      let callsCounter = 0;

      const listener1 = () => {
        callsCounter++;
      };
      const listener2 = () => {
        callsCounter++;
      };

      emitter.on("Event 1", listener1);
      emitter.on("Event 1", listener2);

      emitter.emit("Event 1");

      assert.strictEqual(callsCounter, 2);
    });

    it("does nothing for missing event", () => {
      let callsCounter = 0;

      const listener1 = () => {
        callsCounter++;
      };

      emitter.on("Event 1", listener1);
      emitter.emit("Event 2");

      assert.strictEqual(callsCounter, 0);
    });
  });

  it.only("pass the same arguments to all listeners", () => {
    let args1;
    let args2;

    const listener1 = (...args) => {
      args1 = args;
    };

    const listener2 = (...args) => {
      args2 = args;
    };

    emitter.on("Event 1", listener1);
    emitter.on("Event 1", listener2);

    emitter.emit("Event 1", "user", 42);

    assert.deepStrictEqual(args1, ["user", 42]);
    assert.deepStrictEqual(args2, ["user", 42]);
  });
});
