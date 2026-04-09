// src/MainApp.jsx
import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/homemain/Topbar";
import MarqueeBar from "../../components/homemain/MarqueeBar";
import HeroSection from "../../components/homemain/HeroSection";
import FeaturedPostSlider from "../../components/homemain/FeaturedPostSlider";
import TwoSidePosts from "../../components/homemain/TwoSidePosts";
import TrendingSlider from "../../components/homemain/TrendingSlider";
import Sidebar from "../../components/homemain/Sidebar";
import Footer from "../../components/homemain/Footer";
import { useLocation } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  startAfter,
} from "firebase/firestore";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";
import { isEmpty, isNull } from "lodash";
import NavbarHome from "../../components/homemain/NavbarHome";
import BlogsList from "../../components/homemain/BlogsList";
import { toast } from "react-toastify";
import HeroVideoBackground from "../../components/homemain/HeroVideoBackground";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function HomeMain({ setActive, user, active, handleLogout, role }) {
  
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState([]);
  const [hide, setHide] = useState(false);

  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [catblogs, setCatBlogs] = useState([]);
  const [counts, setCounts] = useState({}); // Map id => count
  const [categoryCounts, setCategoryCounts] = useState({});
  const [subcategoryCounts , setSubCategoryCounts] = useState({});

  // Compute categoryCount from totalBlogs (category names and counts)
  const categoryCount = useMemo(() => {
    const map = {};
    totalBlogs.forEach((blog) => {
      if (blog.category) {
        map[blog.category] = (map[blog.category] || 0) + 1;
      }
    });
    return Object.keys(map).map((k) => ({ category: k, count: map[k] }));
  }, [totalBlogs]);

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogsArr = [];
    querySnapshot.forEach((doc) => {
      trendBlogsArr.push({ id: doc.id, ...doc.data() });
    });
    setTrendBlogs(trendBlogsArr);
  };

  useEffect(() => {
    getTrendingBlogs();
    setSearch("");
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tagsArr = [];
        snapshot.docs.forEach((doc) => {
          tagsArr.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tagsArr)];
        setTags(uniqueTags);
        setTotalBlogs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      // DO NOT call getTrendingBlogs here in cleanup
    };
  }, [setActive, active]);

  useEffect(() => {
    getBlogs();
    setHide(false);
  }, [active]);

  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const firstBatch = query(blogRef, orderBy("title"), limit(20));
    const docSnapshot = await getDocs(firstBatch);
    setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const catSnap = await getDocs(collection(db, "categories"));
      const allCats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const blogSnap = await getDocs(collection(db, "blogs"));
      const allBlogs = blogSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setCategories(allCats);
      setBlogs(allBlogs);

      const counts = {}; // Total counts for all category IDs (sub + parent)

      // Count how many blogs reference each categoryId
      allBlogs.forEach(blog => {
        // const catId = blog.categoryId;
        const catId = blog.subcategoryId || blog.categoryId;

        if (catId) {
          counts[catId] = (counts[catId] || 0) + 1;
        }
      });

      // Build parentId → subcategoryId[] map
      const subMap = {};
      allCats.forEach(cat => {
        if (cat.parentId) {
          if (!subMap[cat.parentId]) subMap[cat.parentId] = [];
          subMap[cat.parentId].push(cat.id);
        }
      });

      // Merge parent + subcategory counts
      const combinedCounts = {};

      allCats.forEach(cat => {
        if (!cat.parentId) {
          // Parent category
          const selfCount = counts[cat.id] || 0;
          const subIds = subMap[cat.id] || [];
          const subCount = subIds.reduce((sum, subId) => sum + (counts[subId] || 0), 0);
          combinedCounts[cat.id] = selfCount + subCount;
        } else {
          // Subcategory
          combinedCounts[cat.id] = counts[cat.id] || 0;
        }
      });

      setCounts(combinedCounts); // Final count includes both parent+subcat
    };

    fetchData();
  }, []);


  // Separate top-level and subcategories
  const topCategories = categories.filter(cat => !cat.parentId);
  const subCategories = categories.filter(cat => !!cat.parentId);

  // Helper to get subcategories of a category
  const getSubcategories = (parentId) =>
  subCategories.filter((sub) => sub.parentId === parentId);

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const blogsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs((prevBlogs) => [...prevBlogs, ...blogsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more blog to display");
      setHide(true);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const nextBatch = query(blogRef, orderBy("title"), limit(4), startAfter(lastVisible));
    const docSnapshot = await getDocs(nextBatch);
    updateState(docSnapshot);
    setLoading(false);
  };

  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const searchTitleQuery = query(blogRef, where("title", "==", searchQuery));
    const searchTagQuery = query(blogRef, where("tags", "array-contains", searchQuery));
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);

    let searchTitleBlogs = [];
    let searchTagBlogs = [];
    titleSnapshot.forEach((doc) => {
      searchTitleBlogs.push({ id: doc.id, ...doc.data() });
    });
    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({ id: doc.id, ...doc.data() });
    });
    const combinedSearchBlogs = searchTitleBlogs.concat(searchTagBlogs);
    setBlogs(combinedSearchBlogs);
    setHide(true);
    setActive("");
  };

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);


  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure wanted to delete that blog ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      getBlogs();
      setHide(false);
    }
    setSearch(value);
  };

  return (
    <div className="bg-light text-dark">
      <NavbarHome
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
        role={role}
        search={search}
        handleChange={handleChange}
      />
      <Topbar />
      <MarqueeBar />
      
      {/*<HeroSection />*/}
      <HeroVideoBackground />

      <div className="container-fluid my-4">
        <FeaturedPostSlider />
        <TwoSidePosts />
        <TrendingSlider blogs={trendBlogs} />

        <div className="row mt-4" style={{ minHeight: "180vh" }}>
          <div>
            <div className="text-start py-2 mb-4">Daily Blogs</div>
            {blogs.length === 0 && location.pathname !== "/" && (
              <>
                <h4>
                  No Blog found with search keyword: <strong>{searchQuery}</strong>
                </h4>
              </>
            )}
          </div>

          <div className="col-md-8">
            <BlogsList blogs={blogs} user={user} handleDelete={handleDelete} />
          </div>
          <div className="col-md-4">
            <Sidebar 
              tags={tags} 
              blogs={blogs} 
              // categories={categories}
              // subcategories={subcategories}
              categories={topCategories}
              catCount={categoryCounts}
              subcategories={subCategories}
              subcatCount={subcategoryCounts}
              counts={counts}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
