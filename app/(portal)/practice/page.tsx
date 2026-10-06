import PracticeHome from "@/src/components/practice/PracticeHome";
import { PRACTICE_PAGE } from "@/src/constants/practice";

export const metadata = PRACTICE_PAGE.metadata;

export default function PracticePage() {
  return <PracticeHome />;
}
