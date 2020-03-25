import { PostFn } from "../types";

const postToken: PostFn = (instance, request, requestBody) => {
  if (typeof requestBody !== "object") {
    return [403, "Access denied"];
  }

  const { username, password, client_id } = (requestBody as unknown) as Record<
    string,
    any
  >;
  if (!username || !password || instance.params.clientID !== client_id) {
    return [403, "Access denied"];
  }

  let user = instance.database.findUserByEmail(username);
  if (!user || password !== user.password) {
    return [403, "Access denied"];
  }

  return [
    200,
    {
      access_token: "access-token-mock",
      expires_in: 300,
      refresh_expires_in: 1800,
      refresh_token: "refresh-token-mock",
      token_type: "bearer",
      "not-before-policy": 0,
      session_state: "39b4a1a3-3900-412f-82d3-bf538da5658e",
      scope: "email profile",
    },
  ];
};

export default postToken;
