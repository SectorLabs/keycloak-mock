import { ViewFn } from "../types";
import { MockInstance } from "../instance";

const getUser: ViewFn = (instance, request) => {
  const { user } = request;

  if (!user) {
    return [403, "Access denied"];
  }

  return [
    200,
    {
      id: user.sub,
      firstName: user.given_name,
      lastName: user.family_name,
      username: user.preferred_username,
      email: user.email,
      enabled: true,
      totp: false,
      emailVerified: user.email_verified,
      createdTimestamp: user.created_at,
      attributes: user.attributes,
      disableableCredentialTypes: ["password"],
      requiredActions: [],
      federatedIdentities: [],
      notBefore: 0,
      access: {
        manageGroupMembership: true,
        view: true,
        mapRoles: true,
        impersonate: false,
        manage: true,
      },
    },
  ];
};

export default getUser;
