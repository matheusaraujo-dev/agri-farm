import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Users,
  Sprout,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Button from "../atoms/Button";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();

  const navItems = [
    { to: "/", label: "Dashboard", icon: BarChart3 },
    { to: "/producers", label: "Produtores", icon: Users },
    { to: "/farms", label: "Fazendas", icon: Building2 },
    { to: "/crops", label: "Culturas", icon: Sprout },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const NavItem: React.FC<{ item: (typeof navItems)[0]; mobile?: boolean }> = ({
    item,
    mobile = false,
  }) => (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={mobile ? () => setIsOpen(false) : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
          mobile && "w-full justify-start"
        )
      }
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AgriManager</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User info and logout for desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm hidden lg:inline text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="text-left">Navegação</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 space-y-2">
                    {navItems.map((item) => (
                      <NavItem key={item.to} item={item} mobile />
                    ))}

                    {/* User info and logout for mobile */}
                    <div className="border-t pt-4 mt-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Logado como: {user?.email}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
