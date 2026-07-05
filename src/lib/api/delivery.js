/**
 * Delivery / pincode API (v9 §11).
 * GET /api/delivery/check?pincode= → serviceability, COD availability,
 * estimated delivery days, delivery charge for the given pincode.
 */

import { apiFetch } from "./client";

export const checkPincode = (pincode) =>
  apiFetch("/api/delivery/check", { params: { pincode } });
