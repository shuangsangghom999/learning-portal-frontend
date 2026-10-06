import { Calculator } from "lucide-react";

import CalcPoint from "@/src/components/gpa/CalcPoint";
import CalcPointGuide from "@/src/components/gpa/CalcPointGuide";
import FeatureLinks from "@/src/components/gpa/FeatureLinks";
import { CALC_POINT_PAGE as C } from "@/src/constants/gpa-tools";

import GpaToolPage from "./parts/GpaToolPage";

/** Trang /calc-point. */
export default function CalcPointPage() {
  return (
    <GpaToolPage icon={Calculator} title={C.title} intro={C.intro} stats={C.stats}>
      <CalcPoint />

      <FeatureLinks
        title={C.related.title}
        subtitle={C.related.subtitle}
        items={C.related.items}
      />

      <CalcPointGuide />
    </GpaToolPage>
  );
}
