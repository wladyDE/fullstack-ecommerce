import { TokenManager } from "@okta/okta-auth-js";

declare module '@okta/okta-signin-widget'

declare module '@okta/okta-auth-js' {
  export interface OktaAuthConfig {
    issuer: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  }

  export class OktaAuth {
    tokenManager: TokenManager
    constructor(config: OktaAuthConfig);
    signInWithRedirect(): void;
    signOut(): Promise<void>;
    getUser(): Promise<any>;
  }
}
