
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tag as TagIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CustomerFormProps {
  customer?: {
    id?: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    tags: string[];
    lat?: number;
    lng?: number;
    placeId?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  address: string;
  email: string;
  phone: string;
  tags: string;
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState<{
    lat: number; 
    lng: number;
    placeId?: string;
  } | undefined>(
    customer?.lat && customer?.lng 
      ? { 
          lat: customer.lat, 
          lng: customer.lng,
          placeId: customer.placeId
        } 
      : undefined
  );
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      name: customer?.name || "",
      address: customer?.address || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      tags: customer?.tags ? customer.tags.join(", ") : "",
    },
  });

  const handleAddressChange = (value: string, placeData?: { lat: number; lng: number; placeId?: string }) => {
    form.setValue("address", value);
    
    if (placeData) {
      setAddressData(placeData);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const customerData = {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        tags,
        lat: addressData?.lat,
        lng: addressData?.lng,
        placeId: addressData?.placeId,
        // In a real app, this would come from the authenticated user
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };

      let error;

      if (customer?.id) {
        // Update existing customer
        ({ error } = await supabase
          .from("customers")
          .update(customerData)
          .eq("id", customer.id));
      } else {
        // Create new customer
        ({ error } = await supabase.from("customers").insert([customerData]));
      }

      if (error) throw error;

      toast({
        title: `Customer ${customer?.id ? "updated" : "created"} successfully`,
        description: `${data.name} has been ${customer?.id ? "updated" : "added"} to your customer list.`,
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error saving customer:", error);
      toast({
        title: "Error saving customer",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Customer name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter customer name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address field using Google Places Autocomplete */}
        <div className="space-y-2">
          <AddressAutocomplete
            value={form.watch("address")}
            onChange={handleAddressChange}
            error={form.formState.errors.address?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Email address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="relative">
                  <TagIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input {...field} className="pl-8" placeholder="e.g. VIP, Monthly, Garden" />
                </div>
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Separate tags with commas (e.g. "VIP, Monthly, Garden")
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              `${customer?.id ? "Update" : "Create"} Customer`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
