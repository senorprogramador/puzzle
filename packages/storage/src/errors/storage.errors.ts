export class StorageCapabilityError extends Error {
  readonly capability: string;

  constructor(capability: string, message = `Storage adapter does not support required capability: ${capability}`) {
    super(message);
    this.name = "StorageCapabilityError";
    this.capability = capability;
  }
}

export class StorageConflictError extends Error {
  constructor(message = "The storage operation conflicted with the current record state.") {
    super(message);
    this.name = "StorageConflictError";
  }
}
