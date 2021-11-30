interface ResultBase<T, E> {
  isOk(): boolean;
  isErr(): boolean;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<U>(fn: (value: E) => U): Result<T, U>
}

export type Result<T, E> = OkType<T> | ErrType<E>;

export const Ok = <T>(value: T) => new OkType(value);
export const Err = <E>(value: E) => new ErrType(value);

export class OkType<T> implements ResultBase<T, never> {
  constructor(private readonly val: T) { }

  isOk(): this is OkType<T> {
    return true;
  }

  isErr(): this is OkType<T> {
    return false;
  }

  map<U>(fn: (value: T) => U): OkType<U> {
    return Ok(fn(this.val));
  }

  mapErr<U>(fn: unknown): OkType<T> {
    return this;
  }
}

export class ErrType<E> implements ResultBase<never, E> {
  constructor(private readonly val: E) { }

  isOk(): this is ErrType<E> {
    return true;
  }

  isErr(): this is ErrType<E> {
    return false;
  }

  map<U>(fn: unknown): ErrType<E> {
    return this;
  }

  mapErr<U>(fn: (value: E) => U): ErrType<U> {
    return Err(fn(this.val));
  }
}
