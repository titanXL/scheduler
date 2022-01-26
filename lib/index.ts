export interface Schedulable {
  schedule: (fn: Function, ...args: Array<unknown>) => void;
  executeAll: () => Promise<Function[]>;
}

export interface Storable {
  enqueue: (callback: Function) => void;
  data: Array<Function>;
}

export class Storage implements Storable {
  private _data: Array<Function> = [];

  enqueue(callback: Function) {
    this._data.push(callback);
  }

  get data() {
    return this._data;
  }
}

export class Scheduler implements Schedulable {
  constructor(public storage: Storable) {}

  schedule(callback: Function, ...args: unknown[]) {
    this.storage.enqueue(() => callback(...args));
  }

  executeAll() {
    const unpack = (cb: Function): Function => cb();
    return Promise.all(this.storage.data.map(unpack));
  }
}
