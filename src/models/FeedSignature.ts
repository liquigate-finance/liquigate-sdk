enum SignatureStatus {
  Done = 'done',
  Pending = 'pending',
  InProgress = 'in_progress',
}

export class FeedSignature {
  static Status = SignatureStatus;
  status?: SignatureStatus;
  content?: string;

  constructor(partial: Partial<FeedSignature>) {
    Object.assign(this, partial);
  }

  static createPending(content: string) {
    return new FeedSignature({
      content,
      status: SignatureStatus.Pending,
    });
  }

  start() {
    this.status = SignatureStatus.InProgress;
  }

  done() {
    this.status = SignatureStatus.Done;
  }

  isDone() {
    return this.status === SignatureStatus.Done;
  }

  isPending() {
    return this.status === SignatureStatus.Pending;
  }

  isInProgress() {
    return this.status === SignatureStatus.InProgress;
  }
}

export class FeedSignatureFlow {
  signatures: FeedSignature[];
  private curSigIndex: number;

  constructor(signatures: string[]) {
    this.signatures = signatures.map((signature) => FeedSignature.createPending(signature));
    this.curSigIndex = 0;
  }

  startStep() {
    if (this.curSigIndex > this.signatures.length - 1) {
      return;
    }
    const signature = this.getCurrentSignature();
    signature.start();
  }

  completeStep() {
    if (this.curSigIndex > this.signatures.length - 1) {
      return;
    }

    const signature = this.getCurrentSignature();
    signature.done();
    this.curSigIndex++;
  }

  getCurrentSignature() {
    return this.signatures[this.curSigIndex];
  }
}
