'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, Building2, ShieldCheck, Settings2, UserCircle2 } from 'lucide-react';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageShell } from '@/components/shared/ui/page-shell';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const sections = [
  { key: 'profile', title: 'Profil pengguna', icon: UserCircle2, description: 'Kelola identitas akun, foto, dan kontak utama.' },
  { key: 'company', title: 'Informasi perusahaan', icon: Building2, description: 'Perbarui nama kantor, alamat, dan kontak resmi.' },
  { key: 'notifications', title: 'Notifikasi', icon: Bell, description: 'Atur pengingat, update, dan pemberitahuan penting.' },
  { key: 'security', title: 'Keamanan', icon: ShieldCheck, description: 'Kelola akses, kata sandi, dan pengaturan proteksi akun.' },
  { key: 'language', title: 'Bahasa', icon: UserCircle2, description: 'Pilih bahasa antarmuka yang nyaman untuk tim Anda.' },
  { key: 'theme', title: 'Tema', icon: Building2, description: 'Atur tampilan dashboard sesuai preferensi visual.' },
];

type Language = 'id' | 'en';

const translations = {
  id: {
    badge: 'Pengaturan',
    title: 'Preferensi dan konfigurasi kantor',
    description: 'Sesuaikan profil, informasi perusahaan, dan preferensi operasional di satu tempat.',
    action: 'Simpan perubahan',
    languageTitle: 'Bahasa tampilan',
    languageDescription: 'Pilih bahasa yang paling nyaman untuk tim Anda.',
    languageId: 'Bahasa Indonesia',
    languageEn: 'English',
    languageIdHelper: 'Gunakan antarmuka bahasa Indonesia',
    languageEnHelper: 'Use the English interface',
    currentFirm: 'Identitas kantor saat ini',
    currentFirmValue: 'Aisyah Tax Consultant • Jakarta, Indonesia',
    themeTitle: 'Preferensi tema',
    themeValue: 'Mode gelap aktif sebagai pengalaman kerja yang lebih nyaman.',
    sectionTitleProfile: 'Profil utama',
    sectionTitleCompany: 'Detail perusahaan',
    sectionTitleNotifications: 'Preferensi notifikasi',
    sectionTitleSecurity: 'Keamanan akun',
    sectionTitleLanguage: 'Pengaturan bahasa',
    sectionTitleTheme: 'Pengaturan tema',
    profileName: 'Aisyah Lestari',
    profileRole: 'Partner / Kepala Kantor',
    profileEmail: 'aisyah@aisyahconsulting.id',
    profilePhone: '+62 812 3456 7890',
    profileLocation: 'Jakarta Selatan',
    companyName: 'Aisyah Tax Consultant',
    companyNpwp: '01.234.567.8-901.000',
    companyAddress: 'Jl. Sudirman No. 12, Jakarta Pusat',
    companyContact: '021-555-0123',
    notificationSummary: 'Notifikasi deadline, invoice, dan dokumen masuk dikirim melalui email dan dashboard.',
    securityStatus: '2FA aktif • sesi terakhir 12 menit lalu',
    securityPassword: 'Kata sandi terakhir diperbarui 30 hari lalu',
    securityBackup: 'Cadangan email pemulihan aktif',
  },
  en: {
    badge: 'Settings',
    title: 'Preferences and firm configuration',
    description: 'Fine-tune profile, company details, and operational preferences in one place.',
    action: 'Save changes',
    languageTitle: 'Display language',
    languageDescription: 'Choose the language that feels most comfortable for your team.',
    languageId: 'Bahasa Indonesia',
    languageEn: 'English',
    languageIdHelper: 'Use the Indonesian interface',
    languageEnHelper: 'Use the English interface',
    currentFirm: 'Current firm identity',
    currentFirmValue: 'Aisyah Tax Consultant • Jakarta, Indonesia',
    themeTitle: 'Theme preference',
    themeValue: 'Dark mode is enabled for a premium workspace experience.',
    sectionTitleProfile: 'Primary profile',
    sectionTitleCompany: 'Company details',
    sectionTitleNotifications: 'Notification preferences',
    sectionTitleSecurity: 'Account security',
    sectionTitleLanguage: 'Language settings',
    sectionTitleTheme: 'Theme settings',
    profileName: 'Aisyah Lestari',
    profileRole: 'Partner / Office Head',
    profileEmail: 'aisyah@aisyahconsulting.id',
    profilePhone: '+62 812 3456 7890',
    profileLocation: 'South Jakarta',
    companyName: 'Aisyah Tax Consultant',
    companyNpwp: '01.234.567.8-901.000',
    companyAddress: 'Jl. Sudirman No. 12, Central Jakarta',
    companyContact: '021-555-0123',
    notificationSummary: 'Deadline, invoice, and document reminders are delivered through email and the dashboard.',
    securityStatus: '2FA enabled • last session 12 minutes ago',
    securityPassword: 'Password was last updated 30 days ago',
    securityBackup: 'Recovery email backup is active',
  },
} as const;

export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  const [language, setLanguage] = useState<Language>('id');
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setProfileEmail(data.user.email || '');
        setProfileName(data.user.user_metadata?.full_name || '');
      }
    }
    loadUser();
  }, [supabase.auth]);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('tax-office-language');
    if (savedLanguage === 'id' || savedLanguage === 'en') {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('tax-office-language', language);
  }, [language]);

  const text = translations[language];

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profileName }
    });
    setLoading(false);
    if (error) setMessage({ text: error.message, type: 'error' });
    else setMessage({ text: 'Profil berhasil diperbarui.', type: 'success' });
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({
      password
    });
    setLoading(false);
    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      setMessage({ text: 'Kata sandi berhasil diperbarui.', type: 'success' });
      setPassword('');
    }
  }

  async function handleTestNotification() {
    setLoading(true);
    toast.loading('Mengirim notifikasi test...', { id: 'test-notif' });
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Pesan Percobaan',
          message: 'Ini adalah notifikasi percobaan dari pengaturan dashboard.'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Notifikasi berhasil dikirim! Silakan periksa email Anda.', { id: 'test-notif' });
      } else {
        toast.error(data.error || 'Gagal mengirim notifikasi.', { id: 'test-notif' });
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan.', { id: 'test-notif' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageShell
        badge={text.badge}
        title={text.title}
        description={text.description}
        action={
          <Link href="/dashboard/settings" className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Settings2 className="mr-2 h-4 w-4" />
            {text.action}
          </Link>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Settings area</h2>
            <div className="mt-4 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button key={section.key} onClick={() => setActive(section.key)} className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${active === section.key ? 'border-primary/40 bg-primary/10' : 'border-border/70 bg-background/70 hover:bg-muted/60'}`}>
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{section.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">{active === 'profile' ? text.sectionTitleProfile : active === 'company' ? text.sectionTitleCompany : active === 'notifications' ? text.sectionTitleNotifications : active === 'security' ? text.sectionTitleSecurity : active === 'language' ? text.sectionTitleLanguage : text.sectionTitleTheme}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{active === 'profile' ? 'Informasi akun sudah lengkap dan siap digunakan oleh tim Anda.' : active === 'company' ? 'Detail kantor sudah terisi secara lengkap untuk kebutuhan administrasi serta komunikasi.' : active === 'notifications' ? 'Preferensi pemberitahuan telah disusun agar tidak ada deadline yang terlewat.' : active === 'security' ? 'Akun Anda sudah terlindungi dengan langkah keamanan yang sesuai standar operasional.' : active === 'language' ? 'Ganti bahasa tampilan untuk kenyamanan pengguna dan tim Anda.' : 'Sesuaikan nuansa visual dashboard agar lebih nyaman dipakai sepanjang hari.'}</p>
            
            {message && (
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}>
                {message.text}
              </div>
            )}

            <div className="mt-5 space-y-3">
              {active === 'profile' ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Nama lengkap</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={e => setProfileName(e.target.value)}
                      className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" 
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Email (Tidak bisa diubah)</label>
                    <input 
                      type="email" 
                      value={profileEmail} 
                      disabled
                      className="w-full rounded-2xl border border-border/70 bg-muted/50 px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" 
                    />
                  </div>
                  <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Profil
                  </button>
                </form>
              ) : null}

              {active === 'company' ? (
                <>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">{text.currentFirm}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{text.currentFirmValue}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">NPWP</p>
                    <p className="mt-2 text-sm text-muted-foreground">{text.companyNpwp}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">Alamat kantor</p>
                    <p className="mt-2 text-sm text-muted-foreground">{text.companyAddress}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text.companyContact}</p>
                  </div>
                </>
              ) : null}

              {active === 'notifications' ? (
                <>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">Status notifikasi</p>
                    <p className="mt-2 text-sm text-muted-foreground">{text.notificationSummary}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">Saluran aktif</p>
                    <p className="mt-2 text-sm text-muted-foreground">Email • Dashboard • Push reminder</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/70">
                    <button 
                      type="button" 
                      onClick={handleTestNotification}
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Kirim Notifikasi Percobaan (Email & Pop-up)
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">Ini akan memunculkan pop-up di layar dan mengirimkan email ke alamat terdaftar Anda.</p>
                  </div>
                </>
              ) : null}

              {active === 'security' ? (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      minLength={8}
                      className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" 
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Perbarui Kata Sandi
                  </button>
                  <div className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">Status perlindungan akun</p>
                    <p className="mt-2 text-sm text-muted-foreground">{text.securityStatus}</p>
                  </div>
                </form>
              ) : null}

              {active === 'language' ? (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm font-medium text-foreground">{text.languageTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{text.languageDescription}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setLanguage('id')} className={`rounded-2xl border px-3 py-3 text-left transition ${language === 'id' ? 'border-primary/40 bg-primary/10' : 'border-border/70 bg-background/80 hover:bg-muted/60'}`}>
                      <p className="font-medium text-foreground">{text.languageId}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{text.languageIdHelper}</p>
                    </button>
                    <button type="button" onClick={() => setLanguage('en')} className={`rounded-2xl border px-3 py-3 text-left transition ${language === 'en' ? 'border-primary/40 bg-primary/10' : 'border-border/70 bg-background/80 hover:bg-muted/60'}`}>
                      <p className="font-medium text-foreground">{text.languageEn}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{text.languageEnHelper}</p>
                    </button>
                  </div>
                </div>
              ) : null}

              {active === 'theme' ? (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm font-medium text-foreground">{text.themeTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{text.themeValue}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </PageShell>
    </DashboardShell>
  );
}
