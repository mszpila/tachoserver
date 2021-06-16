export interface AuthRequest<T> extends Request {
  readonly user: T;
}
