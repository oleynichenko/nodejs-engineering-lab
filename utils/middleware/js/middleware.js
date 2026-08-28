function createMiddlewarePipeline(middlewares) {
  return function (ctx) {
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        middlewares[index++](ctx, next);
      }
    };

    next();
  };
}

module.exports = createMiddlewarePipeline;
