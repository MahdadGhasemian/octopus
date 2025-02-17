export class AuthAndCheckAccessRequestEvent {
  constructor(
    public readonly Authentication: string,
    public readonly path: string,
    public readonly method: string,
  ) {}
}
