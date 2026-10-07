import type { HomeFeaturesData } from "@/src/types/home";

import styles from "./HomeFeatures.module.scss";

/**
 * Hai muc "hinh mot ben, chu mot ben", dao qua dao lai.
 *
 * Hinh o day KHONG phai anh chup man hinh. No la chinh giao dien that,
 * dung bang the va CSS. Duoc ba dieu:
 *
 *   - Khong ton mot byte anh nao, va net o moi do phan giai.
 *   - Sua giao dien that thi cho nay sua theo, khong bi lac hau nhu anh
 *     chup tu thang truoc.
 *   - Nguoi doc man hinh doc duoc noi dung ben trong, khac han mot tam PNG.
 */

function DanhSachDiem({ diem }: { diem: readonly string[] }) {
  return (
    <ul className={styles.list}>
      {diem.map((d) => (
        <li key={d} className={styles.item}>
          <i className={styles.grid}>✓</i>
          {d}
        </li>
      ))}
    </ul>
  );
}

function KhungHinh({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div
        aria-hidden="true"
        className={styles.floating}
        style={{
          background:
            "radial-gradient(60% 60% at 70% 10%, rgb(79 43 255 / .10), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

export default function HomeFeatures({
  lessons,
  progressLabel,
  progressValue,
  lessonBlock,
  certificateBlock,
  certificate,
}: HomeFeaturesData) {
  return (
    <section className={styles.section}>
      <div className={styles.col}>
        {/* --- Muc 1: hinh trai, chu phai --- */}
        <div className={styles.grid2}>
          <KhungHinh>
            <div className={styles.card2}>
              {lessons.map((b, i) => (
                <div
                  key={b.title}
                  className={`${styles.row3} ${
                    i > 0 && b.state !== "current" ? styles.box : ""
                  } ${b.state === "current" ? styles.box2 : ""} ${
                    b.state === "locked" ? styles.box3 : ""
                  }`}
                >
                  <span
                    className={`${styles.grid3} ${
                      b.state === "done"
                        ? styles.label
                        : b.state === "current"
                          ? styles.label2
                          : styles.label3
                    }`}
                  >
                    {b.state === "done" ? "✓" : b.state === "current" ? i + 1 : "🔒"}
                  </span>
                  {b.title}
                  <span className={styles.label4}>{b.time}</span>
                </div>
              ))}

              <div className={styles.box4}>
                <div className={styles.row}>
                  <span>{progressLabel}</span>
                  <span>{progressValue}</span>
                </div>
                <div className={styles.box5}>
                  <i className={styles.box6} />
                </div>
              </div>
            </div>
          </KhungHinh>

          <div>
            <h2 className={styles.heading}>{lessonBlock.heading}</h2>
            <p className={styles.text}>{lessonBlock.text}</p>
            <DanhSachDiem diem={lessonBlock.points} />
          </div>
        </div>

        {/* --- Muc 2: chu trai, hinh phai --- */}
        <div className={styles.grid2}>
          <div className={styles.box7}>
            <h2 className={styles.heading}>{certificateBlock.heading}</h2>
            <p className={styles.text}>{certificateBlock.text}</p>
            <DanhSachDiem diem={certificateBlock.points} />
          </div>

          <div className={styles.box8}>
            <KhungHinh>
              <div className={styles.card3}>
                <div className={styles.card4}>{certificate.mark}</div>
                <h3 className={styles.subheading}>{certificate.title}</h3>
                <div className={styles.box9}>{certificate.learner}</div>
                <div className={styles.box10}>{certificate.course}</div>
                <div className={styles.row2}>
                  <span>
                    {certificate.codeLabel}
                    <b className={styles.box11}>{certificate.code}</b>
                  </span>
                  <span>
                    {certificate.dateLabel}
                    <b className={styles.box11}>{certificate.date}</b>
                  </span>
                </div>
              </div>
            </KhungHinh>
          </div>
        </div>
      </div>
    </section>
  );
}
