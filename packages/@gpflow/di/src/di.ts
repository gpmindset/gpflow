import "reflect-metadata"
export type Constructable<T> = new (...args: any[]) => T
export { container as Container, injectable as Service } from "tsyringe" 