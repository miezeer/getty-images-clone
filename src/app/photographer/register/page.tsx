"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  Camera,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  ChevronRight,
  FileImage,
  DollarSign
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Link from "next/link";

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  city: string;

  // Professional Info
  photographyType: string;
  experience: string;
  specialties: string[];
  bio: string;
  website: string;
  instagram: string;
  linkedin: string;
  twitter: string;

  // Portfolio & Samples
  portfolioUrl: string;
  sampleImages: File[];

  // Business Info
  businessName: string;
  taxId: string;
  payoutMethod: string;
  bankAccount: string;
  paypalEmail: string;

  // Agreements
  termsAccepted: boolean;
  photographerAgreement: boolean;
  marketingEmails: boolean;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  country: "",
  city: "",
  photographyType: "",
  experience: "",
  specialties: [],
  bio: "",
  website: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  portfolioUrl: "",
  sampleImages: [],
  businessName: "",
  taxId: "",
  payoutMethod: "",
  bankAccount: "",
  paypalEmail: "",
  termsAccepted: false,
  photographerAgreement: false,
  marketingEmails: false
};

const steps = [
  { id: 1, title: "Personal Info", description: "Basic contact information" },
  { id: 2, title: "Professional Details", description: "Photography background" },
  { id: 3, title: "Portfolio", description: "Upload sample work" },
  { id: 4, title: "Business Setup", description: "Payment & tax information" },
  { id: 5, title: "Verification", description: "Review and submit" }
];

const photographyTypes = [
  "Portrait Photography",
  "Landscape Photography",
  "Event Photography",
  "Wedding Photography",
  "Street Photography",
  "Fashion Photography",
  "Product Photography",
  "Architecture Photography",
  "Wildlife Photography",
  "Sports Photography",
  "Travel Photography",
  "Stock Photography",
  "Commercial Photography",
  "Other"
];

const specialties = [
  "People", "Nature", "Architecture", "Business", "Technology", "Food",
  "Fashion", "Sports", "Travel", "Lifestyle", "Abstract", "Automotive",
  "Animals", "Healthcare", "Education", "Real Estate"
];

const experienceLevels = [
  "Beginner (0-2 years)",
  "Intermediate (3-5 years)",
  "Advanced (6-10 years)",
  "Professional (10+ years)"
];

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Australia", "Japan", "Brazil", "India", "Other"
];

export default function PhotographerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string | boolean | string[] | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        if (!formData.country) newErrors.country = "Country is required";
        break;
      case 2:
        if (!formData.photographyType) newErrors.photographyType = "Photography type is required";
        if (!formData.experience) newErrors.experience = "Experience level is required";
        if (formData.specialties.length === 0) newErrors.specialties = "At least one specialty is required";
        if (!formData.bio || formData.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters";
        break;
      case 3:
        if (formData.sampleImages.length < 3) newErrors.sampleImages = "Please upload at least 3 sample images";
        break;
      case 4:
        if (!formData.payoutMethod) newErrors.payoutMethod = "Payout method is required";
        if (formData.payoutMethod === "bank" && !formData.bankAccount) newErrors.bankAccount = "Bank account is required";
        if (formData.payoutMethod === "paypal" && !formData.paypalEmail) newErrors.paypalEmail = "PayPal email is required";
        break;
      case 5:
        if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";
        if (!formData.photographerAgreement) newErrors.photographerAgreement = "You must accept the photographer agreement";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, submit to API
    console.log("Registration data:", formData);

    setIsLoading(false);
    // Redirect to success page or photographer dashboard
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const current = formData.specialties;
    if (current.includes(specialty)) {
      updateFormData("specialties", current.filter(s => s !== specialty));
    } else if (current.length < 5) {
      updateFormData("specialties", [...current, specialty]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.sampleImages.length <= 10) {
      updateFormData("sampleImages", [...formData.sampleImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.sampleImages.filter((_, i) => i !== index);
    updateFormData("sampleImages", newImages);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Let's start with your basic details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="John"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Doe"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  placeholder="Enter secure password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                  <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="New York"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Professional Details</h2>
              <p className="text-muted-foreground">Tell us about your photography background</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="photographyType">Primary Photography Type *</Label>
                <Select value={formData.photographyType} onValueChange={(value) => updateFormData("photographyType", value)}>
                  <SelectTrigger className={errors.photographyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select photography type" />
                  </SelectTrigger>
                  <SelectContent>
                    {photographyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.photographyType && <p className="text-red-500 text-sm mt-1">{errors.photographyType}</p>}
              </div>

              <div>
                <Label htmlFor="experience">Experience Level *</Label>
                <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
                  <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <Label>Specialties * (Select up to 5)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {specialties.map((specialty) => (
                    <Button
                      key={specialty}
                      type="button"
                      variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`text-xs ${
                        formData.specialties.includes(specialty)
                          ? "bg-green-accent text-black"
                          : "border-border hover:bg-green-accent/10"
                      }`}
                      disabled={!formData.specialties.includes(specialty) && formData.specialties.length >= 5}
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
                {errors.specialties && <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {formData.specialties.length}/5
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio * (Min 50 characters)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Tell us about your photography journey, style, and what makes your work unique..."
                  rows={4}
                  className={errors.bio ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/50 minimum
                </p>
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => updateFormData("instagram", e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Portfolio Samples</h2>
              <p className="text-muted-foreground">Upload 3-10 of your best images for review</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="portfolioUrl">Portfolio URL (Optional)</Label>
                <Input
                  id="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={(e) => updateFormData("portfolioUrl", e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <Label>Sample Images * (3-10 images)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your images here, or click to browse
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: JPG, PNG, WebP (Max 10MB each)
                  </p>
                </div>

                {formData.sampleImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {formData.sampleImages.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Sample ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {errors.sampleImages && <p className="text-red-500 text-sm mt-1">{errors.sampleImages}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.sampleImages.length}/10 images uploaded
                </p>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Image Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• High resolution (minimum 1920×1080)</li>
                  <li>• Professional quality and composition</li>
                  <li>• Properly exposed and in focus</li>
                  <li>• Original work with proper licensing</li>
                  <li>• No visible watermarks or logos</li>
                </ul>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Business & Payment Setup</h2>
              <p className="text-muted-foreground">Configure your payout preferences</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateFormData("businessName", e.target.value)}
                    placeholder="Your Photography Business LLC"
                  />
                </div>

                <div>
                  <Label htmlFor="taxId">Tax ID (Optional)</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => updateFormData("taxId", e.target.value)}
                    placeholder="EIN or SSN"
                  />
                </div>
              </div>

              <div>
                <Label>Preferred Payout Method *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <Card
                    className={`p-4 cursor-pointer border-2 transition-all ${
                      formData.payoutMethod === "bank"
                        ? "border-green-accent bg-green-accent/5"
                        : "border-border hover:border-green-accent/50"
                    }`}
                    onClick={() => updateFormData("payoutMethod", "bank")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Bank Transfer</h4>
                        <p className="text-sm text-muted-foreground">Direct deposit to your bank</p>
                      </div>
                      <DollarSign className="h-5 w-5 text-green-accent" />
                    </div>
                  </Card>

                  <Card
                    className={`p-4 cursor-pointer border-2 transition-all ${
                      formData.payoutMethod === "paypal"
                        ? "border-green-accent bg-green-accent/5"
                        : "border-border hover:border-green-accent/50"
                    }`}
                    onClick={() => updateFormData("payoutMethod", "paypal")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">PayPal</h4>
                        <p className="text-sm text-muted-foreground">Receive via PayPal</p>
                      </div>
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                  </Card>
                </div>
                {errors.payoutMethod && <p className="text-red-500 text-sm mt-1">{errors.payoutMethod}</p>}
              </div>

              {formData.payoutMethod === "bank" && (
                <div>
                  <Label htmlFor="bankAccount">Bank Account Details *</Label>
                  <Input
                    id="bankAccount"
                    value={formData.bankAccount}
                    onChange={(e) => updateFormData("bankAccount", e.target.value)}
                    placeholder="Account number and routing number"
                    className={errors.bankAccount ? "border-red-500" : ""}
                  />
                  {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>}
                </div>
              )}

              {formData.payoutMethod === "paypal" && (
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email *</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={formData.paypalEmail}
                    onChange={(e) => updateFormData("paypalEmail", e.target.value)}
                    placeholder="paypal@example.com"
                    className={errors.paypalEmail ? "border-red-500" : ""}
                  />
                  {errors.paypalEmail && <p className="text-red-500 text-sm mt-1">{errors.paypalEmail}</p>}
                </div>
              )}

              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Revenue Sharing:</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Your Earnings:</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>30%</span>
                  </div>
                  <div className="pt-2 border-t border-green-300">
                    <p className="text-xs">Payouts processed monthly on the 15th for previous month's earnings.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">Please review your information and accept our terms</p>
            </div>

            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Personal Details</h4>
                  <div className="text-sm space-y-1">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.city}, {formData.country}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Professional Info</h4>
                  <div className="text-sm space-y-1">
                    <p>{formData.photographyType}</p>
                    <p>{formData.experience}</p>
                    <p>{formData.specialties.length} specialties selected</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Portfolio</h4>
                  <div className="text-sm space-y-1">
                    <p>{formData.sampleImages.length} sample images</p>
                    {formData.portfolioUrl && <p>Portfolio URL provided</p>}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Payment Setup</h4>
                  <div className="text-sm space-y-1">
                    <p>Method: {formData.payoutMethod === "bank" ? "Bank Transfer" : "PayPal"}</p>
                    <p>70% revenue share</p>
                  </div>
                </Card>
              </div>

              {/* Terms and Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={(e) => updateFormData("termsAccepted", e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="termsAccepted" className="text-sm">
                    I agree to the <Link href="/terms" className="text-green-accent hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-green-accent hover:underline">Privacy Policy</Link> *
                  </Label>
                </div>
                {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="photographerAgreement"
                    checked={formData.photographerAgreement}
                    onChange={(e) => updateFormData("photographerAgreement", e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="photographerAgreement" className="text-sm">
                    I agree to the <Link href="/photographer-agreement" className="text-green-accent hover:underline">Photographer License Agreement</Link> and confirm that all submitted content is my original work *
                  </Label>
                </div>
                {errors.photographerAgreement && <p className="text-red-500 text-sm">{errors.photographerAgreement}</p>}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={(e) => updateFormData("marketingEmails", e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="marketingEmails" className="text-sm">
                    I'd like to receive marketing emails about new features and opportunities
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />

      <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          {/* Mobile Progress */}
          <div className="md:hidden mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</span>
              <span className="text-sm font-medium text-foreground">
                {steps[currentStep - 1]?.title}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-green-accent border-green-accent text-black"
                    : "border-border text-muted-foreground"
                }`}>
                  {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-4 sm:p-6 lg:p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 sm:px-6 order-2 sm:order-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-green-accent hover:bg-green-accent/90 text-black px-4 sm:px-6 order-1 sm:order-2"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-accent hover:bg-green-accent/90 text-black px-6 sm:px-8 order-1 sm:order-2"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a href="mailto:creators@miezeer.com" className="text-green-accent hover:underline">
              creators@miezeer.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
