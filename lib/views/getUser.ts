import { ViewFn } from "../types";

const getUser: ViewFn = (instance, request) => {
  const { user: requestUser } = request;
  if (!requestUser) {
    return [403, "Access denied"];
  }

  return [
    200,
    {
      ...requestUser.profile,
      // TODO: make these configurable
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
