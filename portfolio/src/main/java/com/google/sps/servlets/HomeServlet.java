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

package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.sps.data.LoginInfo;
import com.google.gson.Gson;

@WebServlet("/log-in")
public class HomeServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");

    //get user status
    UserService userService = UserServiceFactory.getUserService();

    boolean isLoggedIn = false;
    String email = null;
    String html;

    if (userService.isUserLoggedIn()) {
      //if user is logged in return a greeting and log out button
      isLoggedIn = true;
      email = userService.getCurrentUser().getEmail();

      String urlToRedirectToAfterUserLogsOut = "/";
      String logoutUrl = userService.createLogoutURL(urlToRedirectToAfterUserLogsOut);
      html = "<p>Logout <a href=\"" + logoutUrl + "\">here</a>.</p>";
    } else {
      //if user is not logged in, return a log in button
      String urlToRedirectToAfterUserLogsIn = "/";
      String loginUrl = userService.createLoginURL(urlToRedirectToAfterUserLogsIn);
      html = "<p>Login <a href=\"" + loginUrl + "\">here</a>.</p>";
    }

    // Get log in info in JSON form
    LoginInfo info = new LoginInfo(isLoggedIn, html, email);
    Gson gson = new Gson();
    String json = gson.toJson(info);

    // Send the JSON as the response
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}