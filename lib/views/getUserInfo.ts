import { ViewFn } from "../types";
import { MockInstance } from "../instance";

const getUserInfo: ViewFn = (instance, request) => {
  const { user } = request;

  if (!user) {
    return [403, "Access denied"];
  }

  return [
    200,
    {
      sub: user.id,
      email_verified: user.emailVerified,
      gender: (user.attributes.gender || [])[0] || null,
      name: `${user.firstName} ${user.lastName}`,
      preferred_username: user.username,
      given_name: user.firstName,
      family_name: user.lastName,
      email: user.email,
    },
  ];
};

export default getUserInfo;
