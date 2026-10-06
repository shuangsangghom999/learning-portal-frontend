import { AlertCircle, CheckCircle, X } from "lucide-react";

import { ADMIN_DOCUMENT_SUBJECTS as C } from "@/src/constants/admin-document-subjects";

import type { DocumentCatalogState } from "../hooks/useDocumentCatalog";
import styles from "../AdminDocumentSubjects.module.scss";

/** Bang bao loi / thanh cong, co nut dong. */
export default function CatalogAlerts({ s }: { s: DocumentCatalogState }) {
  return (
    <>
      {s.loi && (
        <div className={styles.bangLoi} role="alert">
          <AlertCircle size={16} />
          {s.loi}
          <button
            type="button"
            onClick={() => s.setLoi(null)}
            aria-label={C.closeAria}
            className={styles.dong}
          >
            <X size={14} />
          </button>
        </div>
      )}
      {s.ok && (
        <div className={styles.bangOk} role="status">
          <CheckCircle size={16} />
          {s.ok}
          <button
            type="button"
            onClick={() => s.setOk(null)}
            aria-label={C.closeAria}
            className={styles.dong}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
