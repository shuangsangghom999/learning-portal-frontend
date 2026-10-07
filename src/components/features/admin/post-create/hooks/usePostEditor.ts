"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { layMucLuc, phanTichNoiDung } from "@/src/lib/article-outline";
import { laHtml, neoHoaTieuDe } from "@/src/lib/post-html";
import { ADMIN_POST_CREATE as C } from "@/src/constants/admin/post-create-page";
import { getErrorMessage } from "@/src/services/apiHelper";
import { postService, type Topic } from "@/src/services/post";

/** Viet bai moi hoac sua bai (?id=...), xem truoc muc luc, luu / dang. */
export function usePostEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const laSua = Boolean(id);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [dangNap, setDangNap] = useState(laSua);

  const [tieuDe, setTieuDe] = useState("");
  const [moTa, setMoTa] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [chuDe, setChuDe] = useState<string>(C.defaultTopic);
  const [tags, setTags] = useState("");
  const [anh, setAnh] = useState("");
  const [daDang, setDaDang] = useState(true);
  const [slug, setSlug] = useState("");

  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");
  const [thanhCong, setThanhCong] = useState("");

  useEffect(() => {
    postService
      .getTopics()
      .then(setTopics)
      .catch(() => setTopics([]));
  }, []);

  // Lay bai cu khi sua. Dung /admin/:id chu khong phai /:slug vi ham cong khai
  // co dinh loc isPublished: true - ban nhap se ra 404.
  useEffect(() => {
    if (!id) return;
    let huy = false;
    postService
      .getAdminPost(id)
      .then((p) => {
        if (huy) return;
        setTieuDe(p.title);
        setMoTa(p.excerpt);
        setNoiDung(p.content ?? "");
        setChuDe(p.topic);
        setTags(p.tags.join(", "));
        setAnh(p.thumbnail ?? "");
        setDaDang(p.isPublished !== false);
        setSlug(p.slug);
      })
      .catch((err) => {
        if (!huy) setLoi(getErrorMessage(err, C.messages.loadFailed));
      })
      .finally(() => {
        if (!huy) setDangNap(false);
      });
    return () => {
      huy = true;
    };
  }, [id]);

  useEffect(() => {
    if (!thanhCong) return;
    const t = setTimeout(() => setThanhCong(""), 4000);
    return () => clearTimeout(t);
  }, [thanhCong]);

  // Muc luc o trang doc duoc dung tu chinh nhung dong nay. Hien ra day de
  // nguoi viet biet ngay dong nao da thanh de muc, thay vi dang xong moi phat
  // hien menu ben trai bai trong khong.
  const mucLuc = useMemo(
    () =>
      laHtml(noiDung)
        ? neoHoaTieuDe(noiDung).mucLuc
        : layMucLuc(phanTichNoiDung(noiDung)),
    [noiDung],
  );

  const luu = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoi("");
    setThanhCong("");

    if (!tieuDe.trim() || !moTa.trim() || !noiDung.trim()) {
      setLoi(C.messages.required);
      return;
    }

    const dl = {
      title: tieuDe.trim(),
      excerpt: moTa.trim(),
      content: noiDung.trim(),
      topic: chuDe,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, C.maxTags),
      thumbnail: anh.trim(),
      isPublished: daDang,
    };

    setDangLuu(true);
    try {
      if (id) {
        const p = await postService.updatePost(id, dl);
        setSlug(p.slug);
        setThanhCong(C.messages.saved);
      } else {
        const p = await postService.createPost(dl);
        setThanhCong(daDang ? C.messages.published : C.messages.drafted);
        // Chuyen sang che do sua, neu khong bam luu lan nua se tao bai thu hai.
        router.replace(C.editHref(p._id));
      }
    } catch (err) {
      // Bai bi bo loc noi dung chan cung ve day - thong bao tu may chu noi ro
      // truong nao vi pham.
      setLoi(getErrorMessage(err, C.messages.saveFailed));
    } finally {
      setDangLuu(false);
    }
  };

  return {
    laSua,
    topics,
    dangNap,
    tieuDe,
    setTieuDe,
    moTa,
    setMoTa,
    noiDung,
    setNoiDung,
    chuDe,
    setChuDe,
    tags,
    setTags,
    anh,
    setAnh,
    daDang,
    setDaDang,
    slug,
    dangLuu,
    loi,
    thanhCong,
    mucLuc,
    luu,
  };
}

export type PostEditorState = ReturnType<typeof usePostEditor>;
