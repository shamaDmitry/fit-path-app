import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import { createTrainer, fetchSpecialties } from "@/store/slices/trainersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Check, Plus, X, Loader2 } from "lucide-react";
import { trainerColors } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const colorOptions = Object.entries(trainerColors).map(([key, value]) => ({
  key,
  value,
}));

const AddTrainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { specialties } = useAppSelector((s) => s.trainers);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [certInput, setCertInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);

  useEffect(() => {
    if (specialties.length === 0) {
      dispatch(fetchSpecialties());
    }
  }, [dispatch, specialties.length]);

  const addCertification = () => {
    const trimmed = certInput.trim();

    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications([...certifications, trimmed]);

      setCertInput("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter((c) => c !== cert));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !specialtyId || !email || !password) {
      toast.error("Name, specialty, email and password are required");

      return;
    }

    setLoading(true);
    try {
      // 1. Sign up the trainer
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "trainer",
            phone: phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // 2. Update the trainer record with the extra fields
      await dispatch(
        createTrainer({
          id: authData.user.id,
          full_name: name,
          bio,
          avatar_url: "",
          specialty_id: specialtyId,
          rating: 5.0,
          experience_years: parseInt(experience) || 0,
          color: selectedColor,
          certifications,
          phone: phone || undefined,
          email: email || undefined,
        })
      ).unwrap();

      toast.success(`${name} added as trainer`);
      navigate("/admin/trainers");
    } catch (error: any) {
      toast.error(error.message || "Failed to add trainer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Button
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="font-display">Add New Trainer</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Full Name *
              </Label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-10 bg-muted/50 border-border/50"
                disabled={loading}
              />
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email *</Label>

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trainer@fitpath.com"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Password *</Label>

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Specialty */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Specialty *
                </Label>

                <Select value={specialtyId} onValueChange={setSpecialtyId} disabled={loading}>
                  <SelectTrigger className="h-10 bg-muted/50 border-border/50 w-full">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>

                  <SelectContent>
                    {specialties.map((specialty) => {
                      return (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Years of Experience
                </Label>

                <Input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="5"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Phone</Label>

              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0100"
                className="h-10 bg-muted/50 border-border/50"
                disabled={loading}
              />
            </div>

            {/* Color Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Trainer Color
              </Label>

              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => {
                  return (
                    <Button
                      size={"icon"}
                      key={color.key}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      disabled={loading}
                      className={cn(
                        "w-8 h-8 rounded-full border-3 transition-all duration-200",
                      )}
                      style={{
                        backgroundColor: `hsl(${color.value})`,
                        borderColor: `hsl(${color.value})`,
                        boxShadow:
                          selectedColor === color.value
                            ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(${color.value})`
                            : "none",
                      }}
                    >
                      {selectedColor === color.value && (
                        <Check className="size-5 font-bold" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Certifications
              </Label>

              <div className="flex gap-2">
                <Input
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="e.g. NASM-CPT"
                  className="h-10 bg-muted/50 border-border/50"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={addCertification}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {certifications.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {certifications.map((cert) => (
                    <Badge
                      key={cert}
                      variant="secondary"
                      className="gap-1 pr-1 text-sm"
                    >
                      {cert}
                      <Button
                        variant={"destructive"}
                        size={"icon-xs"}
                        onClick={() => removeCertification(cert)}
                        className="ml-0.5 transition-colors rounded-2xl"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bio</Label>

              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief description..."
                className="bg-muted/50 border-border/50 min-h-25"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Trainer...
                </>
              ) : (
                "Add Trainer"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTrainer;