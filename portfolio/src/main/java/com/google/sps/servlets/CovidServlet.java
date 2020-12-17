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

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.google.gson.Gson;
import java.util.LinkedHashMap;
import java.util.Scanner;

/** Returns data on cases per million by country as a JSON object, e.g. {"New Zealand": 2100, ...}] */
@WebServlet("/covid")
public class CovidServlet extends HttpServlet {

  private LinkedHashMap<String, Float> covidCases = new LinkedHashMap<>();

  @Override
  public void init() {
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream(
        "/WEB-INF/covid-data.csv"));
    scanner.nextLine(); //skip title row of data
    scanner.nextLine(); //skip global row
    while (scanner.hasNextLine()) {
        String line = scanner.nextLine();
        String[] cells = line.split(",");
        String country = cells[0];
        float casesPerMillion = Float.parseFloat(cells[3]);
        covidCases.put(country, casesPerMillion);
    }
    scanner.close();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(covidCases);
    response.getWriter().write(json);
  }
}
