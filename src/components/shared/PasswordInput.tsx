import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string;
  setPassword: (password: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const PasswordInput = ({
  id,
  value,
  setPassword,
  isLoading,
  placeholder,
  className,
  inputClassName,
  ...props
}: PasswordInputProps) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <Input
        id={id}
        type={showPass ? "text" : "password"}
        placeholder={placeholder || "••••••••"}
        value={value}
        onChange={(e) => setPassword(e.target.value)}
        className={cn("h-10 bg-muted/50 border-border/50", inputClassName)}
        required
        disabled={isLoading}
        {...props}
      />

      <Button
        size={"icon-sm"}
        className="absolute right-1 top-1/2 -translate-y-1/2"
        type="button"
        variant={"default"}
        onClick={() => setShowPass((prev) => !prev)}
      >
        {showPass ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordInput;
