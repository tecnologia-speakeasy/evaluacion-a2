import { redirect } from "next/navigation";

// La evaluación vive en /a2; la raíz redirige para no romper enlaces viejos.
export default function Page() {
  redirect("/a2");
}
