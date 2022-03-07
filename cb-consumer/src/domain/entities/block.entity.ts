import { ValueData } from '../value-objects/value-data';
import { createHash } from 'crypto';

export class Block {
  private readonly _timestamp: number = Date.now();
  private _hash: string | null = null;
  private pow: number = 0;

  constructor(
    private readonly data: ValueData,
    private readonly _previousHash: string | null,
  ) {}

  get hash(): string | null {
    return this._hash;
  }

  get previousHash(): string | null {
    return this._previousHash;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  public mine = (difficulty: number = 1): void => {
    if (this.hash) {
    }

    const regex = new RegExp(`^(0){${difficulty}}.*`);
    while (!this._hash || !this._hash.match(regex)) {
      this.pow++;
      this._hash = this.calculateHash();
    }
  };

  public calculateHash = (): string => {
    const data = JSON.stringify(this.data.message);
    const blockData =
      data + this._previousHash + this._timestamp + this.pow.toString();

    return createHash('sha256').update(blockData).digest('hex');
  };
}
