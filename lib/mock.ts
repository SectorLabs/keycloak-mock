import nock, { Scope } from "nock";

import { MockInstance } from "./instance";

import { ViewFn, listCertificates, getUserInfo } from "./views";

export interface Mock {
  scope: Scope;
}

export interface MockOptions {
  listCertificatesView?: ViewFn;
  getUserInfoView?: ViewFn;
}

const activateMock = (instance: MockInstance, options?: MockOptions): Mock => {
  const scope = nock(instance.params.authServerURL)
    .persist()
    .get(`/realms/${instance.params.realm}/protocol/openid-connect/certs`)
    .reply(function() {
      if (options && options.listCertificatesView) {
        return options.listCertificatesView(instance, this.req);
      }

      return listCertificates(instance, this.req);
    })
    .get(`/realms/${instance.params.realm}/protocol/openid-connect/userinfo`)
    .reply(function() {
      if (options && options.getUserInfoView) {
        return options.getUserInfoView(instance, this.req);
      }

      return getUserInfo(instance, this.req);
    });

  return { scope };
};

const deactivateMock = (mock: Mock): void => {
  mock.scope.persist(false);

  // @ts-ignore
  mock.scope.keyedInterceptors = {};

  // @ts-ignore
  mock.scope.interceptors = [];
};

export { activateMock, deactivateMock };
