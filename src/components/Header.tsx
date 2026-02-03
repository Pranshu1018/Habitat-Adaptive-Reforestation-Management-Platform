import { Leaf, User, Settings, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface HeaderProps {
  simulationMode: boolean;
  onSimulationToggle: (enabled: boolean) => void;
}

const Header = ({ simulationMode, onSimulationToggle }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-border/50"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground">Habitat</span>
        </div>

        {/* Page Title */}
        <h1 className="text-lg font-medium text-foreground hidden md:block">
          Explore Restoration Regions
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Simulation Mode Toggle */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/50">
            <Label htmlFor="simulation" className="text-sm text-muted-foreground cursor-pointer">
              Simulation
            </Label>
            <Switch
              id="simulation"
              checked={simulationMode}
              onCheckedChange={onSimulationToggle}
              className="data-[state=checked]:bg-warning"
            />
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
