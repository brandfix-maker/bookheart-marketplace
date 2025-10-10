'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff, Heart } from 'lucide-react';

interface PasswordStrength {
  score: number;
  feedback: string[];
}

interface RegistrationSurvey {
  whatBringsYouHere?: string;
  interests?: string[];
  heardAboutUs?: string;
}

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [surveyData, setSurveyData] = useState<RegistrationSurvey>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Required criteria (must have all 4)
    const hasLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (hasLength) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (hasLower) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (hasUpper) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (hasDigit) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special characters are optional but give bonus points
    if (hasSpecial) {
      score += 1;
    }

    return { score, feedback };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSurveyChange = (field: keyof RegistrationSurvey, value: string | string[]) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be at most 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation - must match server requirements
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        registrationSurvey: Object.keys(surveyData).length > 0 ? surveyData : undefined,
      });
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 3) return 'bg-orange-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return 'Weak';
    if (score < 3) return 'Fair';
    if (score < 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Benefits */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <img src="/Logo.png" alt="BookHeart Logo" className="h-8 w-8 mr-2" />
              <img src="/Logo/Text_purple.png" alt="BookHeart" className="h-6 w-auto" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Join the Inner Circle
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Connect with fellow romantasy enthusiasts and discover your next favorite read.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Curated Collection</h3>
                <p className="text-gray-300">Access exclusive romantasy books and special editions</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Community Driven</h3>
                <p className="text-gray-300">Connect with readers who share your passion</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure Trading</h3>
                <p className="text-gray-300">Buy and sell books with confidence and protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <Card className="p-8 shadow-2xl border-0 bg-gray-800/90 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
            <p className="text-gray-300">Join the BookHeart community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Optional Survey */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-200">What brings you here? (Optional)</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="e.g., Looking for rare romantasy books, Want to sell my collection..."
                  value={surveyData.whatBringsYouHere || ''}
                  onChange={(e) => handleSurveyChange('whatBringsYouHere', e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400">This helps us personalize your experience</p>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Choose a username"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-gray-300">
                      <p>Password should include:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Acceptance */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-200">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/signin?callbackUrl=/'}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-gray-200 font-medium">Sign up with Google</span>
          </button>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
