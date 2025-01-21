declare module '@okta/okta-signin-widget'

declare module '@okta/okta-auth-js' {
  export interface OktaAuthConfig {
    issuer: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  }

  export class OktaAuth {
    constructor(config: OktaAuthConfig);
    signInWithRedirect(): void;
    signOut(): Promise<void>;
    getUser(): Promise<any>;
  }
}
