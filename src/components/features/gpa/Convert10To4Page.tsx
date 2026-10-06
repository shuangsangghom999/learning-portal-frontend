import { Repeat } from "lucide-react";

import Convert10To4 from "@/src/components/gpa/Convert10To4";
import FeatureLinks from "@/src/components/gpa/FeatureLinks";
import { CONVERT_10_TO_4_PAGE as C } from "@/src/constants/gpa-tools";

import GpaToolPage from "./parts/GpaToolPage";

/** Trang /convert-10-to-4. */
export default function Convert10To4Page() {
  return (
    <GpaToolPage icon={Repeat} title={C.title} intro={C.intro} stats={C.stats}>
      {/* Phan "tinh nang lien quan" nam giua cong cu va huong dan */}
      <Convert10To4>
        <FeatureLinks
          title={C.related.title}
          subtitle={C.related.subtitle}
          items={C.related.items}
        />
      </Convert10To4>
    </GpaToolPage>
  );
}
