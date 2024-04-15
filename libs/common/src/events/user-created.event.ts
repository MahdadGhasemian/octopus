export class UserCreatedEvent {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly full_name: string,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      email: this.email,
      full_name: this.full_name,
    });
  }
}
