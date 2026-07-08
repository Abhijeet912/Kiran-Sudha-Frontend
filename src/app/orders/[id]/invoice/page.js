import InvoiceView from "@/components/orders/InvoiceView";
import { decodeParam } from "@/lib/listing";

export const metadata = {
  title: "Invoice",
  description: "Tax invoice for your Kiran Sudha order.",
};

export default async function InvoicePage({ params }) {
  const { id } = await params;
  return <InvoiceView orderId={decodeParam(id)} />;
}
