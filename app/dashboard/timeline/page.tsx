"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  MapPin,
  User,
  Clock,
  Edit3,
  Link2,
  ChevronDown,
  ChevronUp,
  FileText,
  Image,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for AI-structured timeline
const timelineEvents = [
  {
    id: 1,
    date: "Approximately 3 weeks ago",
    time: "Evening, around 7-8 PM",
    description: "Initial encounter at the location. Street lights had just turned on.",
    location: "Near the main market area",
    people: ["Unknown male, white sneakers with red stripe"],
    linkedFragments: [1, 3],
    linkedEvidence: ["photo_001.jpg"],
    importance: "high",
    expanded: false,
  },
  {
    id: 2,
    date: "Same evening",
    time: "Shortly after initial encounter",
    description: "Verbal interaction followed by physical contact.",
    location: "Alley adjacent to main road",
    people: ["Same individual"],
    linkedFragments: [2, 4],
    linkedEvidence: [],
    importance: "high",
    expanded: false,
  },
  {
    id: 3,
    date: "Same evening",
    time: "Later",
    description: "Sound of car horn noted. Escape opportunity.",
    location: "Near the intersection",
    people: ["Unknown vehicle passed by"],
    linkedFragments: [5],
    linkedEvidence: [],
    importance: "medium",
    expanded: false,
  },
  {
    id: 4,
    date: "Following day",
    time: "Morning",
    description: "Physical injuries noted. Medical attention sought.",
    location: "Local clinic",
    people: ["Dr. identified in records"],
    linkedFragments: [6],
    linkedEvidence: ["medical_report.pdf"],
    importance: "high",
    expanded: false,
  },
];

const keyFacts = [
  { id: 1, category: "person", content: "Male, wearing white sneakers with red stripe", importance: "high" },
  { id: 2, category: "location", content: "Near main market, alley adjacent", importance: "high" },
  { id: 3, category: "detail", content: "Street lights had just turned on - evening time", importance: "medium" },
  { id: 4, category: "detail", content: "Strong smell of cigarettes noted", importance: "medium" },
  { id: 5, category: "evidence", content: "Medical report from following day", importance: "high" },
];

const summary = `Based on the recorded testimonies, the incident occurred approximately three weeks ago in the evening near the main market area. The survivor encountered an unknown male individual near the market when street lights had just turned on. The perpetrator was noted to be wearing white sneakers with a distinctive red stripe.

The incident progressed from verbal interaction to physical contact in an adjacent alley. A passing vehicle (car horn heard) created an opportunity for the survivor to escape. Medical attention was sought the following morning, with injuries documented in medical records.

Key identifying details include the distinctive footwear and the location near the market. The timeline is consistent across all recorded fragments, with normal trauma-related variations in sequential recall.`;

export default function TimelinePage() {
  const [events, setEvents] = useState(timelineEvents);
  const [showSummary, setShowSummary] = useState(true);

  const toggleEvent = (id: number) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, expanded: !e.expanded } : e)));
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return <Badge className="bg-destructive/10 text-destructive border-0">Critical</Badge>;
      case "medium":
        return <Badge className="bg-warning-soft/20 text-warning-soft-foreground border-0">Important</Badge>;
      default:
        return <Badge variant="secondary">Detail</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "person":
        return <User className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      case "detail":
        return <Clock className="w-4 h-4" />;
      case "evidence":
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">AI-Structured Timeline</h1>
          <p className="text-muted-foreground mt-1">
            Your memories organized into a coherent chronological narrative
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Timeline
          </Button>
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Document
          </Button>
        </div>
      </div>

      {/* AI Processing Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">AI Analysis Complete</p>
              <p className="text-sm text-muted-foreground">
                This timeline was generated from 6 recorded fragments. The AI has identified 4 key events 
                and 5 important facts. You can edit any part of this timeline.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Case Summary</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  {showSummary ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showSummary && (
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {summary}
                </p>
              </CardContent>
            )}
          </Card>

          {/* Timeline Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chronological Timeline</CardTitle>
              <CardDescription>
                Events organized in sequence based on your recorded memories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-6">
                  {events.map((event, index) => (
                    <div key={event.id} className="relative pl-12">
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                          event.importance === "high"
                            ? "bg-destructive border-destructive"
                            : event.importance === "medium"
                            ? "bg-warning-soft border-warning-soft"
                            : "bg-primary border-primary"
                        }`}
                      />

                      <div
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          event.expanded
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleEvent(event.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground">
                                {event.date}
                              </span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{event.time}</span>
                            </div>
                            <p className="text-foreground">{event.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getImportanceBadge(event.importance)}
                            {event.expanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {event.expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-border space-y-4"
                          >
                            {/* Location */}
                            <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Location</p>
                                <p className="text-sm text-muted-foreground">{event.location}</p>
                              </div>
                            </div>

                            {/* People */}
                            {event.people.length > 0 && (
                              <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">People Involved</p>
                                  <ul className="text-sm text-muted-foreground">
                                    {event.people.map((person, i) => (
                                      <li key={i}>{person}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* Linked Evidence */}
                            {event.linkedEvidence.length > 0 && (
                              <div className="flex items-start gap-3">
                                <Link2 className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">Linked Evidence</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {event.linkedEvidence.map((evidence, i) => (
                                      <Badge key={i} variant="secondary" className="gap-1">
                                        <Image className="w-3 h-3" />
                                        {evidence}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit3 className="w-4 h-4" />
                              Edit Event
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Facts Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Facts</CardTitle>
              <CardDescription>
                Important details extracted from your testimony
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keyFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className={`p-3 rounded-lg border ${
                      fact.importance === "high"
                        ? "border-destructive/20 bg-destructive/5"
                        : "border-border bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          fact.importance === "high"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {getCategoryIcon(fact.category)}
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{fact.content}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {fact.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consistency Check */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                Consistency Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <span className="text-sm text-foreground">Timeline Consistency</span>
                  <Badge className="bg-primary/10 text-primary border-0">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <span className="text-sm text-foreground">Location Details</span>
                  <Badge className="bg-primary/10 text-primary border-0">Consistent</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning-soft/10">
                  <span className="text-sm text-foreground">Time References</span>
                  <Badge className="bg-warning-soft/20 text-warning-soft-foreground border-0">
                    Normal Variation
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Minor time variations are normal for trauma memories and do not affect credibility.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
