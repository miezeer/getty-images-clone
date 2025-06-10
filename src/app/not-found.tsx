import { AlertTriangle, Home, Search, ArrowLeft, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-green-accent/20 rounded-lg">
              <Camera className="h-6 w-6 text-green-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              Miezeer<span className="text-green-accent">Images</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-border shadow-xl">
            <CardContent className="p-12">
              {/* Error Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-green-accent/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-16 w-16 text-green-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">404</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Sorry, we couldn't find the page you're looking for.
                The image or page you requested might have been moved, deleted, or never existed.
              </p>

              {/* Suggestions */}
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Here's what you can try:</h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-accent rounded-full" />
                    Check the URL for any typos or errors
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-accent rounded-full" />
                    Use the search function to find similar content
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-accent rounded-full" />
                    Browse our collections and categories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-accent rounded-full" />
                    Contact support if you believe this is an error
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-green-accent hover:bg-green-accent/90 text-black font-medium">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-border hover:bg-green-accent/10 hover:text-green-accent hover:border-green-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Link href="/collections">
                  <Button
                    variant="outline"
                    className="border-border hover:bg-green-accent/10 hover:text-green-accent hover:border-green-accent"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Collections
                  </Button>
                </Link>
              </div>

              {/* Popular Categories */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Popular Categories
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Business', 'Nature', 'Technology', 'People', 'Travel', 'Food'].map((category) => (
                    <Link
                      key={category}
                      href={`/?category=${category.toLowerCase()}`}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground hover:bg-green-accent/20 hover:text-green-accent transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Still can't find what you're looking for?{' '}
                  <a
                    href="mailto:support@miezeer.com"
                    className="text-green-accent hover:text-green-accent/80 underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
