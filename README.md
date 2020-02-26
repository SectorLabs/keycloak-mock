# Keycloak Mock

[![License](https://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![NPM version](https://badge.fury.io/js/keycloak-mock.svg)](http://badge.fury.io/js/keycloak-mock)
![test](https://github.com/SectorLabs/keycloak-mock/workflows/test/badge.svg)

A minimal mock for a Keycloak server to be used in unit tests.

## About
This does not launch an actual HTTP server. It uses [`nock`](https://github.com/nock/nock) to patch Node.js HTTP client to intercept requests.

### What works
* `/auth/[realm]/protocol/openid-connect/certs`
* `/auth/[realm]/protocol/openid-connect/userinfo`

## Usage
### Basic
    import * as KeycloakMock from "keycloak-node-mock";

    const keycloak = await KeycloakMock.createMockInstance({
        authServerURL: "https://myserver.com/auth",
        realm: "myrealm",
        clientID: "client-1",
    });

    // all requests to `https://myserver.com/auth` will now be
    // intercepted and replied to
    const mock = KeycloakMock.activateMock(keycloak);

    // create a user and a token for it
    const user = keycloak.database.createUser({ name: "test", email: "hello@hello.com" });
    const token = keycloak.createBearerToken(user.sub);

    // get active mock without a reference
    const sameMock = KeycloakMock.getMock("https://myserver.com/auth");

    // clear user database
    mock.instance.database.clear();

    // find user profile
    const sameUser = mock.instance.database.findUserByID(user.sub);

    // de-activate the mock
    KeycloakMock.deactivateMock(sameMock);

## Custom handlers

    import * as KeycloakMock from "keycloak-node-mock";

    const keycloak = await KeycloakMock.createMockInstance({
        authServerURL: "https://myserver.com/auth",
        realm: "myrealm",
        clientID: "client-1",
    });

    keycloak.activateMock(keycloak, {
       listCertificatesView: (instance, request) => {
           return Promise.resolve([500, ""]);
       },
       getUserInfoView: (instance, request) => {
           return Promise.resolve([500, ""]);
       },
    })
