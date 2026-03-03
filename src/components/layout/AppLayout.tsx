import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    // <SidebarProvider>
    <div className="min-h-screen flex w-full">
      {/* <AppSidebarContent /> */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b border-border/50 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          {/* <SidebarTrigger className="mr-4" /> */}
          <Button>
            <Menu />
          </Button>
        </header>

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
    // </SidebarProvider>
  );
};

export default AppLayout;
