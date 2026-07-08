import OrderDetailView from "@/components/orders/OrderDetailView";
import { decodeParam } from "@/lib/listing";

export const metadata = {
  title: "Order Details",
  description: "Order status, items and bill breakup.",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  return <OrderDetailView orderId={decodeParam(id)} />;
}
