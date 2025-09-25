"use client";

import { SlideUpDiv } from "@/components/slide-up-div";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  Target,
  Timer,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const features = [
    {
      icon: <Target className="h-7 w-7 text-blue-700" />,
      title: "Realistic Practice Tests",
      description:
        "Full-length TOEIC and IELTS simulations with authentic question types",
    },
    {
      icon: <Timer className="h-7 w-7 text-red-500" />,
      title: "Timed Sections",
      description: "Practice under real exam conditions with automatic timing",
    },
    {
      icon: <CheckCircle className="h-7 w-7 text-purple-600" />,
      title: "Instant Scoring",
      description: "Get immediate results for Listening and Reading sections",
    },
    {
      icon: <BarChart3 className="h-7 w-7 text-green-600" />,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and reports",
    },
    {
      icon: <Users className="h-7 w-7 text-cyan-500" />,
      title: "AI Feedback",
      description: "Receive detail AI-powered insights and evaluations",
    },
    {
      icon: <BookOpen className="h-7 w-7 text-amber-500" />,
      title: "Comprehensive Coverage",
      description: "All four skills for IELTS and complete TOEIC preparation",
    },
  ];

  const certifications = [
    {
      name: "TOEIC",
      description: "Test of English for International Communication",
      skills: ["Listening", "Reading"],
      color: "bg-blue-500",
    },
    {
      name: "IELTS",
      description: "International English Language Testing System",
      skills: ["Listening", "Reading", "Writing", "Speaking"],
      color: "bg-green-500",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <SlideUpDiv>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      🎯 Achieve Your Target Score
                    </Badge>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    Master Your Language Certification
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Prepare for TOEIC and IELTS exams with realistic practice
                    tests, instant feedback, and AI-powered insights. Join
                    thousands of successful learners.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700
                       hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.9)] 
              hover:-translate-x-[5px] hover:-translate-y-[5px] transition-all duration-150"
                    >
                      <Link href={"/sign-in"}>Start Free Practice</Link>
                      <ArrowRight className="animate-bounce-x" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.9)] 
              hover:-translate-x-[5px] hover:-translate-y-[5px] transition-all duration-150"
                    >
                      Watch Demo
                    </Button>
                  </div>
                  <div className="flex items-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Free to start
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        No credit card required
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative w-full lg:h-full min-h-[400px]">
                  <Image
                    src="/student-view.jpeg"
                    alt={`Students studying`}
                    fill
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="font-semibold">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">92%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SlideUpDiv>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SlideUpDiv>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Everything You Need to Succeed
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our comprehensive platform provides realistic practice and
                  detailed feedback to help you achieve your target band score.
                </p>
              </div>
            </SlideUpDiv>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <SlideUpDiv key={index}>
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="mx-auto mb-4">{feature.icon}</div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </SlideUpDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <SlideUpDiv>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-primary mb-4">
                Supported Certifications
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive preparation for the world&apos;s most recognized
                English proficiency tests
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {certifications.map((cert) => (
                <Card key={cert.name} className="relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-full h-2 ${cert.color}`}
                  />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {cert.name}
                      <Badge variant="secondary">
                        {cert.skills.length} Skills
                      </Badge>
                    </CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SlideUpDiv>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Achieve Your Target Score?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have improved their skills with our
              platform
            </p>
            <Button
              size="lg"
              className="bg-white  hover:bg-gray-100 text-lg px-8 py-6
              hover:shadow-[5px_5px_0px_0px_rgba(30,136,229,1)] 
              hover:-translate-x-[5px] hover:-translate-y-[5px] transition-all duration-150"
            >
              <Link
                href={"/sign-in"}
                className="flex items-center text-blue-600"
              >
                Get Started Free
                <ArrowRight className="ml-2 animate-bounce-x" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
