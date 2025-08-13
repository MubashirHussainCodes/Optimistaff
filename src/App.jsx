import React, { useMemo, useState } from "react";
import { Check, ArrowRight, Users2, Briefcase, Building2, Sparkles, ShieldCheck, Clock, Phone, Mail, MapPin, Linkedin, Send, Menu, X, Globe2 } from "lucide-react";

// Smooth scroll helper
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const nav = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "industries", label: "Industries" },
  { id: "why", label: "Why Us" },
  { id: "process", label: "Process" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

const badge = (text) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm bg-white/10 border-white/20 text-white">
    <Sparkles className="h-3.5 w-3.5" /> {text}
  </span>
);

const GradientBg = () => (
  <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-br from-fuchsia-500/30 to-indigo-500/30" />
    <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl bg-gradient-to-tr from-cyan-400/30 to-emerald-400/30" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.05),transparent_40%)]" />
  </div>
);

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{value}</div>
    <div className="mt-1 text-xs md:text-sm text-white/70">{label}</div>
  </div>
);

// Button Component
const Button = ({ children, variant = "primary", size = "default", className = "", disabled = false, type = "button", onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "border border-white/20 text-white hover:bg-white/5"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 py-3 text-base"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Input Components
const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white resize-none ${className}`}
    {...props}
  />
);

// Toast system
const Toast = ({ title, description, onClose }) => (
  <div className="fixed bottom-4 right-4 z-50 bg-white text-black p-4 rounded-lg shadow-lg border min-w-[300px]">
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{description}</div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = ({ title, description }) => {
    setToast({ title, description });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastProvider = () => (
    toast ? <Toast {...toast} onClose={() => setToast(null)} /> : null
  );

  return { toast: showToast, ToastProvider };
}

function useForm(initial = {}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const validate = () => {
    if (!data.name || data.name.length < 2) return "Please enter your full name.";
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return "Please enter a valid email.";
    if (!data.company || data.company.length < 2) return "Please enter your company name.";
    if (!data.message || data.message.length < 10) return "Please add a short message (10+ chars).";
    return null;
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    const err = validate();
    if (err) {
      toast({ title: "Check your form", description: err });
      return;
    }

    try {
      setLoading(true);
      // In a real app, POST this to your backend or a service
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Thanks!", description: "We'll get back to you within 1 business day." });
      setData(initial);
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again or email hello@Optimistaff.com" });
    } finally {
      setLoading(false);
    }
  };

  return { data, onChange, submit, loading };
}

export default function Optimistaff() {
  const { data, onChange, submit, loading } = useForm({ name: "", email: "", phone: "", company: "", message: "" });
  const { ToastProvider } = useToast();
  const [open, setOpen] = useState(false);

  const features = useMemo(
    () => [
      { icon: Users2, title: "Contingent & Contract Hiring", desc: "Flexible, on‑demand staffing for seasonal spikes and special projects." },
      { icon: Briefcase, title: "Permanent Recruitment", desc: "End‑to‑end search for non‑IT roles across functions and seniority levels." },
      { icon: Building2, title: "RPO / Bulk Hiring", desc: "Scalable recruiting process outsourcing with SLA‑backed delivery." },
      { icon: ShieldCheck, title: "Background Checks", desc: "ID, address, employment & criminal verification via vetted partners." },
      { icon: Clock, title: "Recruiting On‑Retainer", desc: "Dedicated recruiters embedded with your team for predictable pipelines." },
      { icon: Globe2, title: "PAN‑India Reach", desc: "Sourcing across metros & tier‑2 cities—fast turnaround, quality shortlists." },
    ],
    []
  );

  const industries = [
    { name: "Manufacturing", roles: ["Plant Ops", "Quality", "EHS", "Stores"] },
    { name: "Logistics & Warehousing", roles: ["Supervisors", "Pick/Pack", "Dispatch", "Fleet"] },
    { name: "Retail & QSR", roles: ["Store Staff", "ASM/SM", "Cashiers", "Training"] },
    { name: "Healthcare", roles: ["Pharmacy", "Front Desk", "Technicians", "Admin"] },
    { name: "BFSI", roles: ["Telesales", "Collections", "Relationship Mgrs", "Back Office"] },
    { name: "Hospitality", roles: ["F&B", "Housekeeping", "Front Office", "Kitchen"] },
  ];

  const steps = [
    { t: "Brief", d: "Deep‑dive on role, must‑haves & timelines." },
    { t: "Sourcing", d: "Programmatic ads + database + referral engine." },
    { t: "Screening", d: "Skill & attitude checks; shortlist within 48–72h." },
    { t: "Interviews", d: "We schedule & prep; your panel meets only the best." },
    { t: "Offer & Join", d: "Offer negotiation, docs, onboarding support." },
    { t: "Guarantee", d: "Free replacement within 60 days if a hire exits." },
  ];

  const stats = [
    { value: "2,500+", label: "Curated candidates/week" },
    { value: "7–12 days", label: "Avg time‑to‑hire" },
    { value: "95%", label: "Offer‑to‑join ratio" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ToastProvider />
      <GradientBg />

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center ring-1 ring-white/20">
              <Users2 className="h-5 w-5" />
            </div>
            <div className="font-extrabold tracking-tight text-lg">Optimistaff<span className="text-fuchsia-400">staff</span></div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            {nav.map((n) => (
              <button key={n.id} onClick={() => scrollToId(n.id)} className="hover:text-white transition">{n.label}</button>
            ))}
            <Button onClick={() => scrollToId("contact")} className="rounded-2xl">Hire Talent</Button>
          </nav>

          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="md:hidden px-4 pb-4 grid gap-3 text-white/90">
            {nav.map((n) => (
              <button key={n.id} onClick={() => { setOpen(false); scrollToId(n.id); }} className="text-left py-2 border-b border-white/10">{n.label}</button>
            ))}
            <Button onClick={() => { setOpen(false); scrollToId("contact"); }} className="w-full rounded-2xl">Hire Talent</Button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 md:pt-24 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            {badge("Non‑IT Recruiting & Staffing, done right")}
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
              Build high‑performing teams—
              <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent"> fast</span>
            </h1>
            <p className="mt-4 text-white/80 max-w-xl">
              Optimistaff is a specialist non‑IT recruitment partner across Manufacturing, Logistics, Retail, Healthcare, BFSI and Hospitality. We deliver vetted shortlists in days—not weeks.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-2xl" onClick={() => scrollToId("contact")}>Request Shortlist <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button size="lg" variant="secondary" className="rounded-2xl" onClick={() => scrollToId("services")}>Explore Services</Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {stats.map((s) => <Stat key={s.label} value={s.value} label={s.label} />)}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-3xl overflow-hidden ring-1 ring-white/10 bg-gradient-to-br from-white/10 to-white/5">
              <img src="https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=1200&auto=format&fit=crop" alt="Recruitment meeting" className="h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 right-4 grid gap-2">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <ShieldCheck className="h-4 w-4" /> SLA‑backed delivery
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Clock className="h-4 w-4" /> Shortlists in 72h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold">What we do</h2>
              <p className="mt-2 text-white/70 max-w-2xl">Designed for speed, quality and scale—our offerings cover the entire hiring lifecycle.</p>
            </div>
            <Button variant="secondary" className="hidden md:inline-flex rounded-2xl" onClick={() => scrollToId("contact")}>Get a Proposal</Button>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="bg-white/5 border-white/10 rounded-3xl hover:bg-white/10 transition">
                <CardHeader>
                  <div className="h-12 w-12 rounded-2xl grid place-items-center bg-white/10 ring-1 ring-white/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-4xl font-bold">Industries we serve</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {industries.map((i) => (
              <Card key={i.name} className="bg-white/5 border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle>{i.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-white/70">
                    {i.roles.map((r) => (
                      <li key={r} className="flex items-center gap-2"><Check className="h-4 w-4" /> {r}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold">Why choose Optimistaff?</h2>
            <ul className="mt-6 space-y-4 text-white/80">
              <li className="flex gap-3"><div className="pt-1"><Sparkles className="h-5 w-5 text-fuchsia-300" /></div><div><span className="font-semibold">Quality first:</span> every profile is human‑screened for skills, attitude and stability.</div></li>
              <li className="flex gap-3"><div className="pt-1"><Clock className="h-5 w-5 text-cyan-300" /></div><div><span className="font-semibold">Speed at scale:</span> curated shortlists in 72 hours for most roles.</div></li>
              <li className="flex gap-3"><div className="pt-1"><ShieldCheck className="h-5 w-5 text-emerald-300" /></div><div><span className="font-semibold">SLA & replacement:</span> transparent SLAs and 60‑day free replacement guarantee.</div></li>
              <li className="flex gap-3"><div className="pt-1"><Building2 className="h-5 w-5 text-indigo-300" /></div><div><span className="font-semibold">Domain depth:</span> recruiters specialised by function & industry.</div></li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button className="rounded-2xl" onClick={() => scrollToId("process")}>See our process</Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => scrollToId("contact")}>Start hiring</Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden ring-1 ring-white/15 bg-white/5">
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop" alt="Team collaboration" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-4xl font-bold">Hiring, simplified</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <Card key={s.t} className="bg-white/5 border-white/10 rounded-3xl">
                <CardHeader>
                  <div className="text-sm text-white/60">Step {i + 1}</div>
                  <CardTitle>{s.t}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-4xl font-bold">What clients say</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[{
              name: "A. Menon, HR Head (Manufacturing)",
              quote: "Optimistaff closed 30+ roles for our new plant within 6 weeks. Solid quality and communication.",
            }, {
              name: "R. Singh, COO (3PL)",
              quote: "The RPO model gave us predictable hiring for peak season. They're now our long‑term partner.",
            }, {
              name: "S. Iyer, Retail Director",
              quote: "Quick turnarounds and dependable replacements. Exactly what we needed across our stores.",
            }].map((t) => (
              <Card key={t.name} className="bg-white/5 border-white/10 rounded-3xl">
                <CardContent className="pt-6">
                  <p className="text-white/90">"{t.quote}"</p>
                  <div className="mt-4 text-sm text-white/60">{t.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold">Let's talk hiring</h2>
            <p className="mt-3 text-white/75 max-w-prose">Share your requirements and we'll revert with a tailored proposal and sample profiles within one business day.</p>

            <div className="mt-6 grid gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4" /> +91 98765 43210</div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4" /> hello@Optimistaff.com</div>
              <div className="flex items-center gap-3"><Linkedin className="h-4 w-4" /> linkedin.com/company/Optimistaff</div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4" /> Mumbai • Bengaluru • Delhi NCR</div>
            </div>
          </div>

          <Card className="bg-white/5 border-white/10 rounded-3xl">
            <CardHeader>
              <CardTitle>Contact form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70">Your name</label>
                    <Input name="name" value={data.name} onChange={onChange} placeholder="Jane Doe" className="mt-1 bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Company</label>
                    <Input name="company" value={data.company} onChange={onChange} placeholder="Acme Pvt Ltd" className="mt-1 bg-white/10 border-white/20" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70">Work email</label>
                    <Input name="email" type="email" value={data.email} onChange={onChange} placeholder="jane@acme.com" className="mt-1 bg-white/10 border-white/20" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Phone (optional)</label>
                    <Input name="phone" value={data.phone} onChange={onChange} placeholder="+91" className="mt-1 bg-white/10 border-white/20" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/70">What roles do you want to hire?</label>
                  <Textarea name="message" value={data.message} onChange={onChange} placeholder="e.g., 15 store associates in Pune, 2 shift supervisors in Nashik…" className="mt-1 bg-white/10 border-white/20 min-h-[120px]" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-white/60">By submitting, you agree to our terms and privacy policy.</p>
                  <Button type="submit" disabled={loading} className="rounded-2xl" onClick={submit}>
                    {loading ? "Sending…" : <>Send request <Send className="ml-2 h-4 w-4" /></>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8 items-start text-sm">
          <div>
            <div className="font-extrabold tracking-tight text-lg">Optimistaff<span className="text-fuchsia-400">staff</span></div>
            <p className="mt-2 text-white/70">Specialist non‑IT hiring across India. Fast. Reliable. SLA‑driven.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-white/90">Company</div>
              <ul className="mt-3 space-y-2 text-white/70">
                <li><button onClick={() => scrollToId("services")} className="hover:text-white">Services</button></li>
                <li><button onClick={() => scrollToId("industries")} className="hover:text-white">Industries</button></li>
                <li><button onClick={() => scrollToId("why")} className="hover:text-white">Why Us</button></li>
                <li><button onClick={() => scrollToId("process")} className="hover:text-white">Process</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white/90">Contact</div>
              <ul className="mt-3 space-y-2 text-white/70">
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@Optimistaff.com</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> linkedin.com/company/Optimistaff</li>
              </ul>
            </div>
          </div>
          <div className="md:text-right text-white/60">© {new Date().getFullYear()} Optimistaff. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}