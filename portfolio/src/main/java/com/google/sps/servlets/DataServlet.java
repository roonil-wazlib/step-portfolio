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
import java.util.Iterator;

import com.google.sps.data.Comment;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.repackaged.com.google.common.collect.Iterables;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

/** Servlet that returns some example content. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Retrieve data from datastore
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    // Retrieve number of comments requested
    int numComments = Integer.parseInt(getParameter(request, "num-comments", "5"));

    //prepare empty list to insert comment objects into
    ArrayList<Comment> comments = new ArrayList<Comment>();

    //get first n comment entities as an iterable
    Iterable<Entity> firstNComments = Iterables.limit(results.asIterable(), numComments);

    //loop through entities and prepare list of comment objects
    for (Entity entity : firstNComments) {
      long id = entity.getKey().getId();
      String screenName = (String) entity.getProperty("screen-name");
      String commentText = (String) entity.getProperty("comment-text");
      Comment comment = new Comment(id, screenName, commentText);
      comments.add(comment);
    }

    // Convert comments to JSON
    String json = convertToJson(comments);

    // Send the JSON as the response
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String commentText = getParameter(request, "comment", "");
    long timestamp = System.currentTimeMillis();
    String email;

    // Get user email
    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
        email = userService.getCurrentUser().getEmail();
    } else {
        // Something has gone wrong
        email = null;
    }

    if (!commentText.isEmpty() && email != null) {
        Entity commentEntity = new Entity("Comment");
        commentEntity.setProperty("screen-name", email);
        commentEntity.setProperty("comment-text", commentText);
        commentEntity.setProperty("timestamp", timestamp);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(commentEntity);
    }
    response.sendRedirect("/index.html");
  }

  /**
   * Converts arrayList instance into a JSON string using the Gson library.
   */
  private String convertToJson(ArrayList<Comment> list) {
    Gson gson = new Gson();
    String json = gson.toJson(list);
    return json;
  }

  /**
   * @return the request parameter, or the default value if the parameter
   * was not specified by the client
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null || value.isEmpty()) {
        return defaultValue;
    } else {
        return value;
    }
  }
}
