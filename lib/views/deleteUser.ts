import { DeleteViewFn } from "../types";

const deleteUser: DeleteViewFn = (instance, request) => {
  const { user: requestUser } = request;
  if (!requestUser) {
    return [403, "Access denied"];
  }

  const urlParts = request.path.split("/");
  const toDeleteUserID = urlParts[urlParts.length - 1];

  if (!toDeleteUserID) {
    return [400, "Bad request"];
  }

  instance.database.deleteUserByID(toDeleteUserID);

  return [200, ""];
};

export default deleteUser;
