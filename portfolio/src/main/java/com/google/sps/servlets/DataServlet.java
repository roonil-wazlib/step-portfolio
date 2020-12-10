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

import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    /*//send a hard coded greeting
    response.setContentType("text/html;");
    response.getWriter().println("<h1>Hello Emma!</h1>");*/

    //hard code some messages
    ArrayList<String> messages = new ArrayList<String>();
    messages.add("This is message 1");
    messages.add("This is message 2");
    messages.add("This is message 3");

    //convert messages to JSON
    String json = convertToJson(messages);

    // Send the JSON as the response
    response.setContentType("application/json;"); //?
    response.getWriter().println(json);
  }

  /**
   * Converts arrayList instance into a JSON string using the Gson library.
   */
  private String convertToJson(ArrayList<String> list) {
    Gson gson = new Gson();
    String json = gson.toJson(list);
    return json;
  }
}
