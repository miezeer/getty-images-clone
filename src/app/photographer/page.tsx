"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  Camera,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Upload,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Link from "next/link";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Up to 70% Revenue",
    description: "Keep the majority of your earnings with our competitive revenue sharing model.",
    color: "text-green-600"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Your work reaches millions of customers worldwide through our platform.",
    color: "text-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Track your performance with detailed analytics and sales reports.",
    color: "text-purple-600"
  },
  {
    icon: Shield,
    title: "Copyright Protection",
    description: "We protect your intellectual property with advanced security measures.",
    color: "text-red-600"
  },
  {
    icon: Award,
    title: "Quality Recognition",
    description: "Get featured and recognized for exceptional work on our platform.",
    color: "text-yellow-600"
  },
  {
    icon: Users,
    title: "Creator Community",
    description: "Join a community of professional photographers and creators.",
    color: "text-indigo-600"
  }
];

const stats = [
  { label: "Active Contributors", value: "50K+", icon: Users },
  { label: "Total Earnings Paid", value: "$12M+", icon: DollarSign },
  { label: "Images Downloaded", value: "5M+", icon: Camera },
  { label: "Average Monthly Earnings", value: "$1,200", icon: TrendingUp }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Travel Photographer",
    earnings: "$3,500/month",
    quote: "Miezeer Images has transformed my photography into a sustainable income. The platform is intuitive and the support team is fantastic.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Michael Chen",
    role: "Event Photographer",
    earnings: "$2,800/month",
    quote: "The analytics dashboard helps me understand what sells best. I've tripled my income since joining the platform.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Emma Rodriguez",
    role: "Stock Photographer",
    earnings: "$4,200/month",
    quote: "The upload process is seamless and the approval times are quick. I love seeing my work reach customers globally.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  }
];

const uploadProcess = [
  {
    step: 1,
    title: "Create Account",
    description: "Sign up and complete your photographer profile with portfolio samples."
  },
  {
    step: 2,
    title: "Upload Content",
    description: "Submit your high-quality images with proper keywords and descriptions."
  },
  {
    step: 3,
    title: "Review Process",
    description: "Our team reviews your content for quality and compliance within 24-48 hours."
  },
  {
    step: 4,
    title: "Start Earning",
    description: "Once approved, your images go live and start earning revenue immediately."
  }
];

export default function PhotographerLandingPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-green-accent/20 text-green-accent border-green-accent">
                Creator Portal
              </Badge>
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Turn Your Photography Into
                <span className="text-green-accent"> Passive Income</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of photographers earning money by selling their images on Miezeer Images.
                Upload once, earn forever with our global marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/photographer/register">
                  <Button
                    size="lg"
                    className="bg-green-accent hover:bg-green-accent/90 text-black font-semibold px-8 py-4 text-lg"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Earning Today
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/photographer/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-accent text-green-accent hover:bg-green-accent/10 px-8 py-4 text-lg"
                  >
                    Contributor Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                    alt="Photography sample 1"
                    className="rounded-lg shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=300&h=300&fit=crop"
                    alt="Photography sample 2"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop"
                    alt="Photography sample 3"
                    className="rounded-lg shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
                    alt="Photography sample 4"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-accent text-black p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">$1,200</div>
                <div className="text-sm">Avg. Monthly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 text-green-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Miezeer Images?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the platform that puts creators first with industry-leading benefits and support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 border-border hover:border-green-accent/50 transition-all duration-300">
                  <Icon className={`h-12 w-12 ${benefit.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Getting started is simple. Follow these steps to begin earning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uploadProcess.map((process, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-green-accent text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    {process.step}
                  </div>
                  {index < uploadProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-green-accent/30"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{process.title}</h3>
                <p className="text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Hear from our top-earning photographers about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-border">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                  <Badge className="ml-3 bg-green-accent/20 text-green-accent">
                    {testimonial.earnings}
                  </Badge>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-green-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of photographers who are already earning passive income with their photography.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/photographer/register">
              <Button
                size="lg"
                className="bg-green-accent hover:bg-green-accent/90 text-black font-semibold px-8 py-4 text-lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Your First Photo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-green-accent text-green-accent hover:bg-green-accent/10 px-8 py-4 text-lg"
            >
              View Upload Guidelines
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Free to join • No upfront costs • Keep up to 70% of earnings
          </p>
        </div>
      </section>
    </div>
  );
}
