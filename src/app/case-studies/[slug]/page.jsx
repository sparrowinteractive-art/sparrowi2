import { notFound } from "next/navigation";
import CaseStudyPage from "@components/CaseStudyPage";
import { getCaseStudy, listCaseStudySlugs } from "@/lib/caseStudies";

export function generateStaticParams() {
  return listCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study | Sparrow" };
  return {
    title: `${study.name} ${study.subtitle} | Sparrow`,
    description: study.intro?.lede,
  };
}

export default async function CaseStudyRoute({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
