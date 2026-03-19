import EditAddressWrapper from "./EditAddressWrapper";

// export const generateStaticParams = async () => {
//   const { addresses } = await fetch(`${baseUrl}/api/account/address`, { cache: "no-cache" }).then((res) => res.json());
//   return addresses.map((address: Address) => ({ id: address.id }));
// };

export default async function EditAddress({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  return <EditAddressWrapper id={id} />;
}
