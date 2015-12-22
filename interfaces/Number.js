declare class Number {
  toFixed(fractionDigits?: number): string;
  toExponential(fractionDigits?: number): string;
  toPrecision(precision?: number): string;
  toString(radix?: number): string;
  valueOf(): number;
  static isFinite(value: any): boolean;
  static isInteger(value: any): boolean;
  static isNaN(value: any): boolean;
  static isSafeInteger(value: any): boolean;
  static parseInt(string: string, radix?: number): number;
  static parseFloat(string: string): number;
  static (value:any):number;
  static EPSILON: number;
  static MAX_SAFE_INTEGER: number;
  static MAX_VALUE: number;
  static MIN_SAFE_INTEGER: number;
  static MIN_VALUE: number;
  static NaN: number;
  static NEGATIVE_INFINITY: number;
  static POSITIVE_INFINITY: number;
}
