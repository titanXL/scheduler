import { Greeter } from '../index';

describe('Greeter', () => {
  test('Should greet', () => {
    expect(Greeter('Test')).toBe('Hello Test');
  });
});
