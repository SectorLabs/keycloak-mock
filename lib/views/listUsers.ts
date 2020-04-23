import { ViewFn } from "../types";

const listUsers: ViewFn = (instance, request) => {
  const { user } = request;
  if (!user) {
    return [403, "Access denied"];
  }

  const users = instance.database.allUsers();

  return [
    200,
    users.map((user) => ({
      ...user.profile,
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
    })),
  ];
};

export default listUsers;
