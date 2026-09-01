import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import logoAurora from "@/assets/logo-aurora.png.asset.json";

interface MobileNavItem {
  label: string;
  href: string;
}

const defaultItems: MobileNavItem[] = [
  { label: "Funcionalidades", href: "#recursos" },
  { label: "Como Funciona", href: "#depoimentos" },
  { label: "Preços", href: "#planos" },
  { label: "Blog", href: "#pagamentos" },
];

export function MobileNav({ items = defaultItems }: { items?: MobileNavItem[] }) {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm border-l border-white/10 bg-[#0a0a0a] p-0 font-space-grotesk text-slate-100 [&>button]:hidden">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
            <Link
              to="/homepage"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setOpen(false);
              }}
              className="flex items-center gap-2 font-bold text-xl text-white"
            >
              <img src={logoAurora.url} alt="NEXT PRO" className="h-8 w-8 shrink-0 rounded-full object-cover" />
              <span>
                NEXT <span className="text-[#004DFF]">PRO</span>
              </span>
            </Link>
            <SheetClose asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={handleNavClick}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-white/30" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-white/10 p-6">
            <Link to="/auth" onClick={handleNavClick} className="block text-center text-[15px] font-medium text-white/70 hover:text-white">
              Entrar
            </Link>
            <Link to="/auth" onClick={handleNavClick} className="block">
              <Button className="w-full rounded-xl bg-[#004DFF] py-6 text-base font-bold text-white hover:bg-[#0040d6]">
                Começar grátis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
