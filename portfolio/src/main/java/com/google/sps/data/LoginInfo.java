// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.data;


/**
 * Class representing each comment object
 */
public class LoginInfo {

  /** boolean of whether user is loggedin or not */
  private boolean isLoggedIn;

  /** html content for logging in or out */
  private String logInOrOut;

  /** Email of current user or None if not logged in */
  private String email;

  public LoginInfo(boolean isLoggedIn, String logInOrOut, String email) {
      this.isLoggedIn = isLoggedIn;
      this.logInOrOut = logInOrOut;
      this.email = email;
  }
}
