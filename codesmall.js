export default `
/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

{
  // start private scope for gBrowser
  /**
   * A set of known icons to use for internal pages. These are hardcoded so we can
   * start loading them faster than ContentLinkHandler would normally find them.
   */
  const FAVICON_DEFAULTS = {
    "about:newtab": "chrome://branding/content/icon32.png",
    "about:home": "chrome://branding/content/icon32.png",
    "about:welcome": "chrome://branding/content/icon32.png",
    "about:privatebrowsing":
      "chrome://browser/skin/privatebrowsing/favicon.svg",
  };
}
`;