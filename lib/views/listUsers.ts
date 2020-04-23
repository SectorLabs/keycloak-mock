import url from "url";
import qs from "qs";

import { ViewFn } from "../types";

const listUsers: ViewFn = (instance, request) => {
  const { user } = request;
  if (!user) {
    return [403, "Access denied"];
  }

  const filterParams = qs.parse(url.parse(request.path).query || "");
  const matchingUsers = instance.database.filterUsers((user) => {
    if (filterParams.username) {
      return user.profile.username === filterParams.username;
    }

    return true;
  });

  return [
    200,
    matchingUsers.map((user) => ({
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
