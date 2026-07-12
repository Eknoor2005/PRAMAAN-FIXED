import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary to-background p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-semibold text-xl text-foreground">PRAMAAN</span>
        </Link>
        
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">
            Your Voice. Recorded Once. Protected Forever.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            A safe space for survivors to record their testimony once, 
            transforming fragmented memories into legally structured documentation.
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>End-to-End Encrypted</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>Trauma-Informed</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>Legally Compliant</span>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground">PRAMAAN</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
