const mockAsyncStorage = (() => {
    let store = {};
  
    return {
      getItem: jest.fn((key) => {
        return Promise.resolve(store[key] || null);
      }),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => {
        return Promise.resolve(Object.keys(store));
      }),
    };
  })();
  
  export default mockAsyncStorage;
  