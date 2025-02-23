export class UserCreatedEvent {
  constructor(public readonly user: any) {}
}

export class UserUpdatedEvent extends UserCreatedEvent {}
