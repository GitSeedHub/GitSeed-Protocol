/**
 * Optional GitHub OAuth integration stub.
 * GitNut can operate with wallet auth alone.
 *
 * To complete this integration: implement a proper OAuth flow with CSRF state, token exchange,
 * and mapping GitHub identity to a GitNut account model.
 */
import { env } from "../config/env.js";

export function githubAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID || "",
    redirect_uri: env.GITHUB_OAUTH_CALLBACK_URL || "",
    scope: "read:user user:email",
    state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
