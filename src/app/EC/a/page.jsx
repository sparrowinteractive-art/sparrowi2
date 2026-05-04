import ECPage from "@components/ECPage";
import { getECProject, getNextECProject } from "@lib/ecProjects";

export const metadata = {
  title: "Fluid Glass | Sparrow",
  description:
    "A digital experience for Fluid Glass — structural and architectural glazing for the UK's most prestigious construction projects.",
};

export default function ECAPage() {
  const study = getECProject("a");
  const next = getNextECProject("a");
  return <ECPage study={study} next={next} />;
}
