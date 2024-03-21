import {ClassConstructor, plainToInstance} from 'class-transformer';

export function fillDTO<T, V>(dtoClass: ClassConstructor<T>, plainData: V[]): T[];
export function fillDTO<T, V>(dtoClass: ClassConstructor<T>, plainData: V): T;
export function fillDTO<T, V>(dtoClass: ClassConstructor<T>, plainData: V | V[]): T | T[] {
  return plainToInstance(dtoClass, plainData, {excludeExtraneousValues: true});
}
