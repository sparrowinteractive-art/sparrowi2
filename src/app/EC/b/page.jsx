import ECPage from "@components/ECPage";
import { getECProject, getNextECProject } from "@lib/ecProjects";

export const metadata = {
  title: "Inversa | Sparrow",
  description:
    "A digital experience for Inversa — environmental intelligence and field-driven ecological restoration.",
};

export default function ECBPage() {
  const study = getECProject("b");
  const next = getNextECProject("b");
  return <ECPage study={study} next={next} />;
}
