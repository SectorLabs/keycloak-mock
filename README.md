# Keycloak Mock

[![License](https://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![NPM version](https://badge.fury.io/js/keycloak-mock.svg)](http://badge.fury.io/js/keycloak-mock)

A minimal mock for a Keycloak server to be used in unit tests.

## About
This does not launch an actual HTTP server. It uses [`nock`](https://github.com/nock/nock) to patch Node.js HTTP client to intercept requests.

### What works
* `/auth/[realm]/protocol/openid-connect/certs`
* `/auth/[realm]/protocol/openid-connect/userinfo`

## Usage
### Basic
    import * as KeycloakMock from "keycloak-node-mock";

    const keycloak = KeycloakMock.createMockInstance({
        authServerURL: "https://myserver.com/auth",
        realm: "myrealm",
        clientID: "client-1",
    })

    // all requests to `https://myserver.com/auth` will now be
    // intercepted and replied to
    const mock = KeycloakMock.activateMock(keycloak);

    // create a user and a token for it
    const user = keycloak.database.createUser({ name: 'test', email: 'hello@hello.com' });
    const token = keycloak.createBearerToken(user.sub);

    // de-activate the mock
    KeycloakMock.deactivateMock(mock);

## Custom handlers

    import * as KeycloakMock from "keycloak-node-mock";

    const keycloak = KeycloakMock.createMockInstance({
        authServerURL: "https://myserver.com/auth",
        realm: "myrealm",
        clientID: "client-1",
    })

    keycloak.activateMock(keycloak, {
       listCertificatesView: (instance, request) => {
           return Promise.resolve([500, '']);
       },
       getUserInfoView: (instance, request) => {
           return Promise.resolve([500, '']);
       },
    })
