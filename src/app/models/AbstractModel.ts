import { Id } from "../interfaces/apiInterfaces";
import { Meta } from "../services/baw-api/baw-api.service";

/**
 * BAW Server Abstract Model
 */
export abstract class AbstractModel {
  constructor(raw: object) {
    return Object.assign(this, raw);
  }

  /**
   * Create model from JSON
   */
  public static fromJSON: (obj: any) => AbstractModel;

  /**
   * Hidden meta symbol
   */
  private static metaKey = Symbol("meta");

  /**
   * Model ID
   */
  public readonly id?: Id;

  /**
   * Create model
   * @param _new Class Builder
   * @param raw Raw object json
   */
  public static Create<T extends AbstractModel>(
    _new: new (_: object) => T,
    raw: object
  ): T {
    return new _new(raw);
  }

  /**
   * Redirect path to view model on website. This is a string which can be
   * used by `Router.navigateByUrl()` without any processing. For example,
   * for the project abstract model, this path should direct to the project page.
   * @param args Url arguments
   */
  public abstract redirectPath(...args: any): string;

  /**
   * Convert model to JSON
   */
  public abstract toJSON(): object;

  /**
   * Add hidden metadata to model
   * @param meta Metadata
   */
  public addMetadata(meta: Meta) {
    this[AbstractModel.metaKey] = meta;
  }

  /**
   * Get hidden model metadata
   */
  public getMetadata(): Meta {
    return this[AbstractModel.metaKey];
  }

  /**
   * Add property to object if it exists (not undefined/null)
   * @param object Output object
   * @param key Key name
   * @param value Key value
   */
  protected addIfExists(object: any, key: string, value: any) {
    if (value) {
      object[key] = value;
    }
  }
}
