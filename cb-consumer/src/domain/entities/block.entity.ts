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
  private readonly _data: ValueData;
  private readonly _previousHash: string | null;
  private readonly _timestamp: number = Date.now();

  private _hash: string | null = null;
  private _pow: number = 0;

  private constructor(params: IConstructor) {
    const { previousHash, pow, data, hash, timestamp } = params;

    this._data = data;
    this._previousHash = previousHash;

    this._pow = pow || 0;
    this._hash = hash || null;
    this._timestamp = timestamp || Date.now();
  }

  static createBlock(data: ValueData, previousHash: string | null) {
    return new Block({ data, previousHash });
  }

  static createMinedBlock(params: Required<IConstructor>) {
    return new Block(params);
  }

  get data(): ValueData {
    return this._data;
  }

  get pow(): number {
    return this._pow;
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
      this._pow++;
      this._hash = this.calculateHash();
    }
  };

  public calculateHash = (): string => {
    const data = JSON.stringify(this._data.message);
    const blockData =
      data + this._previousHash + this._timestamp + this._pow.toString();

    return createHash('sha256').update(blockData).digest('hex');
  };
}
