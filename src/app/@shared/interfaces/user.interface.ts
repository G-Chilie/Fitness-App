/**
 * Employee Schema.
 * @author Kader Fasid (fasidmpm@gmail.com)
 */
export interface IUserRest {
  /**
   * User Id.
   */
  id: string;
  /**
   * User Name.
   */
  username: string;
  /**
   * Status of user account.
   */
  status: AccountStatus;
  /**
   * Discount code.
   */
  discountCode: string | null;
  /**
   * Email of User.
   */
  email: string;
}

/**
 * User Account status.
 */
export enum AccountStatus {
  /**
   * De-Activated.
   */
  Deactivated = 'DEACTIVATED',
  /**
   * Activated.
   */
  Activated = 'ACTIVATED',
  /**
   * Admin.
   */
  Admin = 'ADMIN',
  /**
   * Pending.
   */
  Pending = 'PENDING',
}
