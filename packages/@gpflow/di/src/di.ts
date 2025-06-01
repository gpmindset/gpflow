import "reflect-metadata"
export type Constructable<T> = new (...args: any[]) => T
import { container } from "tsyringe"
export { singleton as Service, injectable as Injectable, inject as Inject } from "tsyringe" 
export const Container = container