import { redirect } from "next/navigation";

/** The Fashion Vault is our blog — keep the footer link honest. */
export default function BlogsPage() {
  redirect("/vault");
}
