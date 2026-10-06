import { GradeProfilePage } from "@/src/components/features/gpa";
import { GRADE_PROFILE_PAGE } from "@/src/constants/gpa-tools";

export const metadata = GRADE_PROFILE_PAGE.metadata;

export default function Page() {
  return <GradeProfilePage />;
}
