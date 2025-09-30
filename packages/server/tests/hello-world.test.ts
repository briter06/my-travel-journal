import greeter from '../src/greeter';

describe('Test Greeter', () => {
  it('Greeter function', () => {
    const result = greeter('John');
    expect(result).toEqual('Hello John from App 1!');
  });
});
