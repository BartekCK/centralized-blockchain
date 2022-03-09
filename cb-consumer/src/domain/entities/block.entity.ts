import { ValueData } from '../value-objects/value-data';
import { createHash } from 'crypto';

interface IConstructor {
  timestamp?: number;
  hash?: string | null;
  pow?: number;
  data: ValueData;
  previousHash: string | null;
}

export class Block {
  private readonly data: ValueData;
  private readonly _previousHash: string | null;
  private readonly _timestamp: number = Date.now();

  private _hash: string | null = null;
  private pow: number = 0;

  private constructor(params: IConstructor) {
    const { previousHash, pow, data, hash, timestamp } = params;

    this.data = data;
    this._previousHash = previousHash;

    this.pow = pow || 0;
    this._hash = hash || null;
    this._timestamp = timestamp || Date.now();
  }

  static createBlock(data: ValueData, previousHash: string | null) {
    return new Block({ data, previousHash });
  }

  static createMinedBlock(params: Required<IConstructor>) {
    return new Block(params);
  }

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
      return;
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
