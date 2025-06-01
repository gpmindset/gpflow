import { ContextEntry, ContextValidator } from "../types/context";

export abstract class BaseContextManager<T extends Record<string, any>> {
  private context: Map<keyof T, ContextEntry<T[keyof T]>> = new Map();
  private readonly listeners: Set<(key: keyof T, value: T[keyof T]) => void> = new Set();
  private initialized: boolean = false;


  /**
   * Initialize the context manager
   */
  protected init(): void {
    this.initialized = true;
  }

  /**
   * Check if the context manager is initialized
   */
  protected isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Sets a value in the context with optional validation
   */
  protected setValue<K extends keyof T>(
    key: K,
    value: T[K],
    validator?: ContextValidator<T[K]>
  ): void {
    if (validator && !validator.validate(value)) {
      throw new Error(`Invalid value for context key: ${String(key)}`);
    }

    const entry: ContextEntry<T[K]> = {
      value,
      timestamp: Date.now(),
      validator
    };

    this.context.set(key, entry);
    this.notifyListeners(key, value);
  }

  /**
   * Gets a value from the context
   */
  protected getValue<K extends keyof T>(key: K): T[K] | undefined {
    const entry = this.context.get(key);
    return entry?.value;
  }

  /**
   * Checks if a key exists in the context
   */
  protected hasKey(key: keyof T): boolean {
    return this.context.has(key);
  }

  /**
   * Removes a value from the context
   */
  protected removeValue(key: keyof T): void {
    this.context.delete(key);
  }

  /**
   * Clears all values from the context
   */
  protected clearContext(): void {
    this.initialized = false;
    this.context.clear();
  }

  /**
   * Gets the timestamp of when a value was last updated
   */
  protected getLastUpdated(key: keyof T): number | undefined {
    return this.context.get(key)?.timestamp;
  }

  /**
   * Adds a listener for context changes
   */
  public addListener(listener: (key: keyof T, value: T[keyof T]) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Removes a listener
   */
  public removeListener(listener: (key: keyof T, value: T[keyof T]) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(key: keyof T, value: T[keyof T]): void {
    this.listeners.forEach(listener => listener(key, value));
  }

  /**
   * used to serialize context data
   * @returns object
   */
  toJSON(): Record<string, any> {
    return Object.fromEntries(this.context.entries());
  }
}