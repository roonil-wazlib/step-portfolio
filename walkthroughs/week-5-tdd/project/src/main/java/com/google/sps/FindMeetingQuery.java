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

package com.google.sps;

import java.util.Collection;
import java.util.Arrays;
import java.util.*;

public final class FindMeetingQuery {
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

        Collection<String> requiredAttendees = request.getAttendees();
        int requestedDuration = (int) request.getDuration();

        Collection<TimeRange> possibleTimes = new ArrayList<TimeRange>();

        TimeRange eventTime;
        Collection<String> eventAttendees;
        boolean isAttendeeOverlap;

        int potentialStartTime = TimeRange.START_OF_DAY;
        TimeRange potentialTimeRange = TimeRange.fromStartDuration(
            potentialStartTime, requestedDuration
        );

        ArrayList<Event> eventArray = new ArrayList<>(events);
        sortEventsByStart(eventArray);

        for (Event event : eventArray) {
            //if overlaps with time-range and has attendees in common, not an option
            eventTime = event.getWhen();
            eventAttendees = event.getAttendees();
            isAttendeeOverlap = isAttendeeOverlap(requiredAttendees, eventAttendees);
            if (potentialStartTime >= eventTime.end()) {
                //skip this event
            } else {
                if (potentialTimeRange.overlaps(eventTime) && isAttendeeOverlap) {
                    // this timeframe does not work
                    // adjust to next potential timeframe
                    potentialStartTime = eventTime.end();
                    potentialTimeRange = TimeRange.fromStartDuration(potentialStartTime, requestedDuration);
                } else if (isAttendeeOverlap) {
                    // all start times from potential start time up to this event are free for a meeting
                    possibleTimes.add(TimeRange.fromStartEnd(potentialStartTime, eventTime.start(), false));
                    // adjust to next potential timeframe
                    potentialStartTime = eventTime.end();
                    potentialTimeRange = TimeRange.fromStartDuration(potentialStartTime, requestedDuration);
                }
            }
        }
        //now check end of day:
        if (TimeRange.END_OF_DAY - potentialStartTime >= requestedDuration) {
            possibleTimes.add(TimeRange.fromStartEnd(potentialStartTime, TimeRange.END_OF_DAY, true));
        }
        return possibleTimes;
    }

    private boolean isAttendeeOverlap(Collection<String> event1Attendees, Collection<String> event2Attendees) {
        for (String attendee : event2Attendees) {
            if (event1Attendees.contains(attendee)) {
                return true;
            }
        }
        return false;
    }

    private void sortEventsByStart(ArrayList<Event> events) {
        Collections.sort(events, new Comparator<Event>() {
            @Override
            public int compare(Event e1, Event e2) {
                return e1.getWhen().start() - e2.getWhen().start();
            }
        });
    }
}
