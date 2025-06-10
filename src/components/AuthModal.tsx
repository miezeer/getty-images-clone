"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: User) => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onAuthenticated, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Name validation for signup
    if (mode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required';
    }

    // Confirm password for signup
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful authentication
      const user: User = {
        id: `user-${Date.now()}`,
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        role: 'user',
        status: 'active',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        downloads: 0,
        uploads: 0,
        revenue: 0,
        metadata: {
          emailVerified: false,
          twoFactorEnabled: false
        }
      };

      onAuthenticated(user);
      onClose();

      // Reset form
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setErrors({});

    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 bg-card border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-accent/20 rounded-lg">
              <Camera className="h-5 w-5 text-green-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {mode === 'login' ? 'Welcome back' : 'Join Miezeer Images'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Sign in to download high-quality images'
                  : 'Create your free account to get started'
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Benefits */}
          <div className="mb-6 p-4 bg-green-accent/5 rounded-lg border border-green-accent/20">
            <h3 className="font-semibold text-foreground mb-2">What you get:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Free downloads of watermark-free images</li>
              <li>• Access to premium content library</li>
              <li>• Personal collections and favorites</li>
              <li>• Download history and license tracking</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 bg-background border-border text-foreground"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-background border-border text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-background border-border text-foreground"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {errors.general && (
              <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-accent hover:bg-green-accent/90 text-black font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-green-accent hover:text-green-accent/80 font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Social proof */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Badge variant="outline" className="bg-green-accent/10 text-green-accent border-green-accent">
                50K+ Users
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">
                1M+ Downloads
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
