import "reflect-metadata"
export type Constructable<T> = new (...args: any[]) => T
import { container } from "tsyringe"
export { singleton as Service } from "tsyringe" 
export const Container = container