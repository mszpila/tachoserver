import { Sort } from './Sort';

export class PageRequest {
  constructor(
    private _page: number,
    private _size: number,
    private _sort?: Sort,
  ) {
    if (!this._sort) {
      this._sort = new Sort();
    }
  }

  get page() {
    return this._page;
  }

  get size() {
    return this._size;
  }

  get sort() {
    return this._sort;
  }
}
