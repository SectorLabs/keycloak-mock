import { ViewFn } from "../types";
import { MockInstance } from "../instance";

const getUserInfo: ViewFn = (instance, request) => {
  const { user } = request;

  if (!user) {
    return [403, "Access denied"];
  }

  return [200, user];
};

export default getUserInfo;
