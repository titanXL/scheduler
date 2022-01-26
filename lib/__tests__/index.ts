import { Scheduler, Storable, Schedulable } from '../index';

let scheduler: Schedulable;

class MockStorage implements Storable {
  data: Array<Function> = [];
  enqueue = jest.fn((item: Function) => {
    this.data.push(item);
  });
}

let mockStorage: Storable;

beforeEach(() => {
  mockStorage = new MockStorage();

  scheduler = new Scheduler(mockStorage);
});

describe('Scheduler', () => {
  test('Stores items correctly', () => {
    const mockItem = jest.fn();
    scheduler.schedule(mockItem);
    expect(mockStorage.data.length).toBe(1);
    expect(mockStorage.enqueue).toHaveBeenCalledTimes(1);
  });

  test('Storage does not execute items on store', () => {
    const mockFn = jest.fn();
    scheduler.schedule(mockFn);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test('Stores callbacks with correct number of arguments', async () => {
    const mockFn = jest.fn();
    const mockArgs = [1, 2, 3];
    scheduler.schedule(mockFn, ...mockArgs);
    const mockFn1 = jest.fn();
    scheduler.schedule(mockFn1);
    await scheduler.executeAll();
    expect(mockFn).toHaveBeenCalledWith(...mockArgs);
    const args = mockFn1.mock.calls[0] as Array<any>;
    expect(args.length).toBe(0);
  });

  test('Async functions are stored and executed correctly', async () => {
    const mockResult = 3;
    const mockFn = jest.fn(async () => mockResult);
    const mockArgs = [1, 2, 3];

    scheduler.schedule(mockFn, ...mockArgs);
    const result = await scheduler.executeAll();
    expect(mockFn).toHaveBeenCalledWith(...mockArgs);
    expect(result[0]).toBe(mockResult);
  });

  test('Scheduler executeAll return correct result', async () => {
    const mockFn = jest.fn((a: number, b: number) => a + b);
    const mockFn1 = jest.fn((a: number, b: number) => a * b);
    const mockArgs = [1, 2];
    scheduler.schedule(mockFn, ...mockArgs);
    scheduler.schedule(mockFn1, ...mockArgs);
    const result = await scheduler.executeAll();

    const mockResult1 = mockFn(mockArgs[0], mockArgs[1]);
    const mockResult2 = mockFn1(mockArgs[0], mockArgs[1]);

    expect(result[0]).toBe(mockResult1);
    expect(result[1]).toBe(mockResult2);

    expect(result).toStrictEqual(expect.arrayContaining([mockResult1, mockResult2]));
  });
});
