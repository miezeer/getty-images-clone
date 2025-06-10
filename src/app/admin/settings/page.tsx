"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  Settings,
  Globe,
  Users,
  Image,
  CreditCard,
  Bell,
  Shield,
  Code,
  Palette,
  BarChart3,
  Database,
  Save,
  Upload,
  Mail,
  Key,
  Monitor,
  Server
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const settingsCategories = [
  { id: "platform", name: "Platform", icon: Globe },
  { id: "users", name: "Users", icon: Users },
  { id: "content", name: "Content", icon: Image },
  { id: "payments", name: "Payments", icon: CreditCard },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
  { id: "api", name: "API & Integrations", icon: Code },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "maintenance", name: "Maintenance", icon: Database },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("platform");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasUnsavedChanges(false);
    setIsLoading(false);
  };

  const handleInputChange = () => {
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              Unsaved Changes
            </Badge>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Settings Navigation */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full h-auto p-1 bg-gray-50">
              {settingsCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Platform Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      defaultValue="Miezeer Images"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      defaultValue="https://miezeer.com"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      defaultValue="support@miezeer.com"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                        <SelectItem value="cet">CET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Default Language</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                        <SelectItem value="jpy">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  defaultValue="Professional stock photos, illustrations, and vectors for your creative projects."
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Site Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback className="bg-green-100 text-green-700 text-xl font-bold">M</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-gray-300">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow User Registration</Label>
                      <p className="text-sm text-gray-500">Enable new users to create accounts</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Verification Required</Label>
                      <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Admin Approval Required</Label>
                      <p className="text-sm text-gray-500">New accounts require admin approval</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      defaultValue="60"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      defaultValue="5"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      defaultValue="8"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-green-600" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      defaultValue="50"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowedTypes">Allowed File Types</Label>
                    <Input
                      id="allowedTypes"
                      defaultValue="jpg, jpeg, png, gif, svg, mp4, mov"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUploadsPerDay">Max Uploads Per Day (Per User)</Label>
                    <Input
                      id="maxUploadsPerDay"
                      type="number"
                      defaultValue="100"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Moderation</Label>
                      <p className="text-sm text-gray-500">Automatically moderate uploaded content</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Watermark Images</Label>
                      <p className="text-sm text-gray-500">Add watermarks to preview images</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Generate Thumbnails</Label>
                      <p className="text-sm text-gray-500">Auto-generate image thumbnails</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="standardPrice">Standard License Price</Label>
                    <Input
                      id="standardPrice"
                      type="number"
                      defaultValue="49"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="extendedPrice">Extended License Price</Label>
                    <Input
                      id="extendedPrice"
                      type="number"
                      defaultValue="199"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subscriptionPrice">Monthly Subscription</Label>
                    <Input
                      id="subscriptionPrice"
                      type="number"
                      defaultValue="29"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentProvider">Payment Provider</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      defaultValue="8.5"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Free Downloads</Label>
                      <p className="text-sm text-gray-500">Allow free downloads with attribution</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      defaultValue="smtp.gmail.com"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      defaultValue="587"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">From Email Address</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      defaultValue="noreply@miezeer.com"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New User Notifications</Label>
                      <p className="text-sm text-gray-500">Email admins about new registrations</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Upload Notifications</Label>
                      <p className="text-sm text-gray-500">Email notifications for new uploads</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Notifications</Label>
                      <p className="text-sm text-gray-500">Email notifications for payments</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Security & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-gray-500">Restrict admin access by IP</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SSL/HTTPS Required</Label>
                      <p className="text-sm text-gray-500">Force HTTPS connections</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="jwtSecret">JWT Secret Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="jwtSecret"
                        type="password"
                        defaultValue="************************"
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" />
                API & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiVersion">API Version</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">v1.0</SelectItem>
                        <SelectItem value="v2">v2.0 (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rateLimitPerHour">Rate Limit (requests/hour)</Label>
                    <Input
                      id="rateLimitPerHour"
                      type="number"
                      defaultValue="1000"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://your-app.com/webhook"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public API Access</Label>
                      <p className="text-sm text-gray-500">Allow public API access</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Documentation</Label>
                      <p className="text-sm text-gray-500">Enable public API docs</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Third-party Integrations</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                        <span className="text-sm">Google Analytics</span>
                        <Switch onChange={handleInputChange} />
                      </div>
                      <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                        <span className="text-sm">Facebook Pixel</span>
                        <Switch onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-green-600" />
                Appearance & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Color Scheme</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <button
                        className="p-3 border-2 border-green-500 rounded-lg bg-green-50"
                        onClick={handleInputChange}
                      >
                        <div className="w-full h-6 bg-green-600 rounded mb-1"></div>
                        <span className="text-xs">Green (Current)</span>
                      </button>
                      <button
                        className="p-3 border border-gray-200 rounded-lg"
                        onClick={handleInputChange}
                      >
                        <div className="w-full h-6 bg-blue-600 rounded mb-1"></div>
                        <span className="text-xs">Blue</span>
                      </button>
                      <button
                        className="p-3 border border-gray-200 rounded-lg"
                        onClick={handleInputChange}
                      >
                        <div className="w-full h-6 bg-purple-600 rounded mb-1"></div>
                        <span className="text-xs">Purple</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="customCss">Custom CSS</Label>
                    <Textarea
                      id="customCss"
                      placeholder="Add your custom CSS here..."
                      onChange={handleInputChange}
                      className="mt-1 font-mono text-sm"
                      rows={4}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode Support</Label>
                      <p className="text-sm text-gray-500">Enable dark mode toggle</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Layout</Label>
                      <p className="text-sm text-gray-500">Use compact spacing</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="itemsPerPage">Items Per Page</Label>
                    <Select onValueChange={handleInputChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select items per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                        <SelectItem value="96">96</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Analytics & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      placeholder="GA-XXXXXXXXX-X"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                    <Input
                      id="googleTagManager"
                      placeholder="GTM-XXXXXXX"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hotjarId">Hotjar Site ID</Label>
                    <Input
                      id="hotjarId"
                      placeholder="1234567"
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Track Downloads</Label>
                      <p className="text-sm text-gray-500">Track download events</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Track Search Queries</Label>
                      <p className="text-sm text-gray-500">Track user search behavior</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cookie Consent</Label>
                      <p className="text-sm text-gray-500">Show cookie consent banner</p>
                    </div>
                    <Switch defaultChecked onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Maintenance & System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Enable maintenance mode</p>
                    </div>
                    <Switch onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      defaultValue="We're currently performing maintenance. Please check back soon."
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>System Actions</Label>
                    <div className="mt-2 space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Server className="h-4 w-4 mr-2" />
                        Optimize Database
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>System Status</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm">Storage</span>
                        <Badge className="bg-green-100 text-green-800">75% Free</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-sm">Memory</span>
                        <Badge className="bg-yellow-100 text-yellow-800">85% Used</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Last Backup</Label>
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm font-medium">January 15, 2024 at 3:00 AM</p>
                      <p className="text-xs text-gray-500">Size: 2.3 GB • Duration: 45 minutes</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Download Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
