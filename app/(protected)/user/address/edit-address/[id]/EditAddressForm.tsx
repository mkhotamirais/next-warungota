"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { addressSchema } from "@/lib/schemas/user";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import useFetchAddress from "@/hooks/useFetchAddress";
import { useAddress } from "@/hooks/tanstack/useAddress";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Address } from "@/lib/generated/prisma";

type inferSchema = z.infer<typeof addressSchema>;

export default function CreateAddressForm({ address }: { address: Address | null }) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label || "",
      recipient: address?.recipient || "",
      phone: address?.phone || "",
      street: address?.street || "",
      province: address?.province || "",
      regency: address?.regency || "",
      district: address?.district || "",
      village: address?.village || "",
      postalCode: address?.postalCode || "",
      isDefault: address?.isDefault || false,
    },
  });

  const watchedValues = useWatch({ control: form.control });

  const province = watchedValues.province || "";
  const regency = watchedValues.regency || "";
  const district = watchedValues.district || "";

  const [provinces, regencies, districts, villages, pendingProvince, pendingRegency, pendingDistrict] = useFetchAddress(
    {
      province,
      regency,
      district,
    },
  );
  const { updateAddress, isUpdating: pending } = useAddress();

  const router = useRouter();

  const onSubmit = async (data: inferSchema) => {
    const result = await updateAddress({ id: address?.id || "", data });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    router.push("/user/address");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="recipient"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recipient">Nama Penerima</FieldLabel>
              <Input
                {...field}
                id="recipient"
                aria-invalid={fieldState.invalid}
                placeholder="misal: ahmad"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col md:flex-row gap-x-4 gap-y-8 items-center">
          <Controller
            name="label"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="label">Label</FieldLabel>
                <Input
                  {...field}
                  id="label"
                  aria-invalid={fieldState.invalid}
                  placeholder="misal: rumah / kantor"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
                <Input
                  {...field}
                  id="phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="misal: 081231231231"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="street"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="street">Alamat Jalan / Kampung</FieldLabel>
              <Input
                {...field}
                id="street"
                aria-invalid={fieldState.invalid}
                placeholder="misal: jl jendral sudirman no. 1 / kp kota"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col md:flex-row gap-x-4 gap-y-8 items-center">
          <Controller
            name="province"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="province">Provinsi</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Provinsi</SelectLabel>
                      {provinces.map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="regency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="regency">Kabupaten / Kota</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={!province || pendingProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a regency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Regency</SelectLabel>
                      {regencies.map((regency) => (
                        <SelectItem key={regency.value} value={regency.value}>
                          {regency.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-x-4 gap-y-8 items-center">
          <Controller
            name="district"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="district">Kecamatan</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={!regency || pendingRegency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Kecamatan</SelectLabel>
                      {districts.map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="village"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="village">Kelurahan</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={!district || pendingDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a villge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Kelurahan</SelectLabel>
                      {villages.map((village) => (
                        <SelectItem key={village.value} value={village.value}>
                          {village.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="postalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="postalCode">Kode Pos</FieldLabel>
              <Input
                {...field}
                id="postalCode"
                aria-invalid={fieldState.invalid}
                placeholder="misal: 12345"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isDefault"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <Checkbox id="isDefault" checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel htmlFor="isDefault">Jadikan Default</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending && <Spinner />}
        Save Address
      </Button>
    </form>
  );
}
