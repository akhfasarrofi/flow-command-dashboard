import { Bell, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NavLink } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

export function Header() {
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/80 px-6 py-3 backdrop-blur-sm lg:px-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <Zap className="h-full w-full fill-current" />
          </div>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight">
            Fintech Trading
          </h2>
        </div>
        <nav className="hidden items-center gap-6 md:flex lg:gap-9">
          {/* <NavParams to="/dashboard" label="Dashboard" /> */}
          <NavParams label="Market" to="/market" />
          {/* <NavParams to="/portfolio" label="Portfolio" />
          <NavParams to="/settings" label="Settings" /> */}
        </nav>
      </div>
      <div className="flex items-center justify-end gap-4 lg:gap-8">
        <div className="flex items-center gap-2">
          <Button
            className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            size="icon"
            variant="ghost"
          >
            <Bell className="size-5" />
          </Button>
          <Avatar className="size-10 ring-2 ring-muted">
            <AvatarImage
              alt="User"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAELCjBPGlCcP7haiCFVwoDTWOeshEK5WFP58jmRnTuMs5uTp--9o_qWD3uvdS410J38vlvw-ObfQN3dTOQ-6xcySfAHGTNhd6CggZMWfKYMmMDIaRdO9sNY1e7CXoRTRbFapMP0A_bXp9gEf-8tyK_EjTRI9MkXyw3BNn61RxjQC3_TA-5s-gC0lG_0ObieCwyzDFsrhpDU5j8nrZWx764YycMkSlFLi4_GoErzomA0wjfDp55QM3DVHCH69r2-rrLV0B8hKDwuuo"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

function NavParams({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? 'text-primary text-sm font-medium transition-colors'
          : 'text-muted-foreground hover:text-primary transition-colors text-sm font-medium'
      }
      to={to}
    >
      {label}
    </NavLink>
  );
}
