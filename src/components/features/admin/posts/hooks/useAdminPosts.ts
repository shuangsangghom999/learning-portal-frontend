"use client";

import { useEffect, useState } from "react";

import {
  ADMIN_POSTS as C,
  type PostStatusFilter,
} from "@/src/constants/admin/posts-page";
import { getErrorMessage } from "@/src/services/apiHelper";
import { postService, type BlogPost, type Topic } from "@/src/services/post";

/** Danh sach bai viet cam nang: loc trang thai / chu de, tim, phan trang, xoa. */
export function useAdminPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tong, setTong] = useState(0);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const [trangThai, setTrangThai] = useState<PostStatusFilter>("");
  const [chuDe, setChuDe] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [tuKhoaDangDung, setTuKhoaDangDung] = useState("");

  const tai = async (p: number, tt: PostStatusFilter, cd: string, q: string) => {
    setDangTai(true);
    setLoi("");
    try {
      const res = await postService.getAdminPosts({
        page: p,
        limit: C.pageSize,
        status: tt || undefined,
        topic: cd || undefined,
        q,
      });
      setPosts(res.posts);
      setTong(res.total);
      setTrang(res.page);
      setTongTrang(res.totalPages);
    } catch (err) {
      setLoi(getErrorMessage(err, C.messages.loadFailed));
    } finally {
      setDangTai(false);
    }
  };

  // Lan tai dau tien. Khong goi tai() o day vi ham do dat setDangTai(true)
  // ngay lap tuc - dat state thang trong than effect gay them mot vong ve lai.
  // dangTai da la true san tu dau nen chi can dat lai state trong callback.
  useEffect(() => {
    let huy = false;

    postService
      .getTopics()
      .then((t) => {
        if (!huy) setTopics(t);
      })
      .catch(() => {
        if (!huy) setTopics([]);
      });

    postService
      .getAdminPosts({ page: 1, limit: C.pageSize })
      .then((res) => {
        if (huy) return;
        setPosts(res.posts);
        setTong(res.total);
        setTrang(res.page);
        setTongTrang(res.totalPages);
      })
      .catch((err) => {
        if (!huy) setLoi(getErrorMessage(err, C.messages.loadFailed));
      })
      .finally(() => {
        if (!huy) setDangTai(false);
      });

    return () => {
      huy = true;
    };
  }, []);

  // Doi bo loc thi luon ve trang 1: giu nguyen trang 3 khi bo loc chi con mot
  // trang se ra danh sach rong ma khong ro tai sao.
  const doiTrangThai = (v: PostStatusFilter) => {
    setTrangThai(v);
    tai(1, v, chuDe, tuKhoaDangDung);
  };

  const doiChuDe = (v: string) => {
    setChuDe(v);
    tai(1, trangThai, v, tuKhoaDangDung);
  };

  const timKiem = (e: React.FormEvent) => {
    e.preventDefault();
    setTuKhoaDangDung(tuKhoa);
    tai(1, trangThai, chuDe, tuKhoa);
  };

  const sangTrang = (p: number) => tai(p, trangThai, chuDe, tuKhoaDangDung);

  const xoa = async (p: BlogPost) => {
    if (!window.confirm(C.messages.confirmDelete(p.title))) return;
    try {
      await postService.deletePost(p._id);
      // Xoa bai cuoi cung cua trang -> lui ve trang truoc, khong de trang rong.
      const conLai = posts.length - 1;
      sangTrang(conLai === 0 && trang > 1 ? trang - 1 : trang);
    } catch (err) {
      alert(getErrorMessage(err, C.messages.deleteFailed));
    }
  };

  const tenChuDe = (slug: string) => topics.find((t) => t.slug === slug)?.name ?? slug;

  return {
    posts,
    tong,
    trang,
    tongTrang,
    topics,
    dangTai,
    loi,
    trangThai,
    chuDe,
    tuKhoa,
    setTuKhoa,
    tuKhoaDangDung,
    doiTrangThai,
    doiChuDe,
    timKiem,
    sangTrang,
    xoa,
    tenChuDe,
  };
}

export type AdminPostsState = ReturnType<typeof useAdminPosts>;
