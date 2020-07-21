export function JsonParse() {
  return function(target, name) {
    console.warn('内容', target, name);
    console.log(arguments);
    let val;
    Object.defineProperty(target, name, {
      set: (value) => {
        val = value;
        console.log('设置', value);
      },
      get: () => {
        return val;
      },
    });
  };
}
