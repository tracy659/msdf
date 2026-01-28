import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { t, language, isRTL } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [qid, setQid] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(qid, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError(language === 'ar' ? 'بيانات غير صحيحة' : 'Invalid credentials');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-primary/20 shadow-xl overflow-hidden">
            {/* Decorative Header Background */}
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <CardHeader className="text-center pt-8">
              <motion.div 
                className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <LogIn className="w-10 h-10 text-primary-foreground" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>
              </motion.div>
              <CardTitle className="text-2xl font-bold">{t('loginTitle')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدخل بياناتك للوصول إلى خدماتك'
                  : 'Enter your credentials to access your services'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* QID Input */}
                <div className="space-y-2">
                  <Label htmlFor="qid" className="text-sm font-medium">
                    {language === 'ar' ? 'الرقم الشخصي (QID)' : 'Qatar ID (QID)'}
                  </Label>
                  <div className="relative">
                    <User className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="qid"
                      type="text"
                      value={qid}
                      onChange={(e) => setQid(e.target.value)}
                      placeholder="28400000001"
                      className="ps-10 h-12 border-primary/20 focus:border-primary/50"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="ps-10 h-12 border-primary/20 focus:border-primary/50"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive text-center bg-destructive/10 py-2 px-3 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 me-2 animate-spin" />
                      {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 me-2" />
                      {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Note */}
              <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  {language === 'ar' 
                    ? 'ملاحظة: هذا نظام تجريبي. أدخل أي بيانات للدخول.'
                    : 'Note: This is a demo system. Enter any data to login.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
