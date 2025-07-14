import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
// import './App.css'
import { getUserRole } from './utils/getUserRole';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from './dashboard/layout/MainLayout';
import AdminIndex from './dashboard/pages/AdminIndex';
import ProtectDashboard from './middleware/ProtectDashboard';
import ProtectRole from './middleware/ProtectRole';
import Unauthorized from './pages/Unauthorized';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import Home from './pages/home/Home';
import HomePage from './pages/home/HomePage';
import HomeNavbar from './components/home/navbar/HomeNavbar';
import NotFound from './pages/NotFound';
import HomeNews from './pages/homenews/HomeNews';
import HomeThree from './pages/homethree/HomeThree';
import HomeFive from './pages/homefive/HomeFive';
import HomeNine from './pages/homenine/HomeNine';
import HomeNewsApp from './pages/homenewsapp/HomeNewsApp';
import HomeNewsSampleUI from './pages/homenewssampleui/HomeNewsSampleUI';
import NewsHomePage from './pages/newshomepage/NewsHomePage';

import About from './pages/About';
import PostsPage from './pages/allposts/PostsPage';
import AllPostsPage from './pages/allposts/AllPostsPage';
import SinglePostPage from './pages/singlepost/SinglePostPage';
import PostDetail from './pages/singlepost/PostDetail';
import SinglePostDetail from './pages/singlepost/SinglePostDetail';
import Detail from './pages/singlepost/Detail';
import ListPage from './pages/ListPage';
import GridPage from './pages/GridPage';
import CategoryPost from './pages/postbycategorytag/CategoryPost';
import TagPost from './pages/postbycategorytag/TagPost';
import UserHome from './pages/home/UserHome';

import DashboardMain from './dashboard/pages/DashboardMain';
import DashboardStats from './dashboard/pages/DashboardStats';
import DashboardAllPostsList from './dashboard/pages/DashboardAllPostsList';
import DashboardAllPostsView from './dashboard/pages/DashboardAllPostsView';
import DashboardAddPost from './dashboard/pages/DashboardAddPost';
import DashboardAllPosts from './dashboard/pages/DashboardAllPosts';
import DashboardPosts from './dashboard/pages/DashboardPosts';
import DashboardAllPostList from './dashboard/pages/DashboardAllPostList';
import DashboardPostsDetail from './dashboard/pages/DashboardPostsDetail';
import DashboardEditPost from './dashboard/pages/DashboardEditPost';
import DashboardPostEdit from './dashboard/pages/DashboardPostEdit';
import DashboardPostDetailUI from './dashboard/pages/DashboardPostDetailUI';
import DashboardAllSegment from './dashboard/pages/DashboardAllSegment';
import DashboardAddSegment from './dashboard/pages/DashboardAddSegment';
import DashboardAllOption from './dashboard/pages/DashboardAllOption';
import DashboardAddOption from './dashboard/pages/DashboardAddOption';
import DashboardAllCategoryType from './dashboard/pages/DashboardAllCategoryType';
import DashboardAddCategoryType from './dashboard/pages/DashboardAddCategoryType';

import CategoryManager from './dashboard/managers/CategoryManager';
import CategoryManagerAlt from './dashboard/managers/CategoryManagerAlt';
import CategoryManagerUI from './dashboard/managers/CategoryManagerUI';
import ItemManager from './dashboard/managers/ItemManager';
import PostManager from './dashboard/managers/PostManager';
import SingleCategoryManager from './dashboard/managers/SingleCategoryManager';
import SingleSubcategoryManager from './dashboard/managers/SingleSubcategoryManager';
import StoryManager from './dashboard/managers/StoryManager';
import TaskManager from './dashboard/managers/TaskManager';
import NewCategoryManager from './dashboard/managers/NewCategoryManager';

import AllBlogList from './pages/blogs/AllBlogList';
import AddBlog from './pages/blogs/AddBlog';
import BlogView from './pages/blogs/BlogView';
import EditBlog from './pages/blogs/EditBlog';
import AllBlogsList from './pages/blogs/AllBlogsList';
import AllBlogPosts from './pages/blogs/AllBlogPosts';
import AddBlogPost from './pages/blogs/AddBlogPost';
import EditBlogPost from './pages/blogs/EditBlogPost';
import BlogPostView from './pages/blogs/BlogPostView';

import AddNoteInBlogPost from './pages/blogs/AddNoteInBlogPost';
import ViewNoteInBlogPost from './pages/blogs/ViewNoteInBlogPost';
import EditNoteInBlogPost from './pages/blogs/EditNoteInBlogPost';


import AddPostNote from './dashboard/pages/AddPostNote';
import ViewPostNote from './dashboard/pages/ViewPostNote';
import EditPostNote from './dashboard/pages/EditPostNote';
import AddPostNoteWrapper from './dashboard/pages/AddPostNoteWrapper';

import Apps from './apps/Apps';
import NotesApp from './apps/notesapp/NotesApp';
import ViewNotes from './apps/notesapp/notesappcomponents/ViewNotes';
import ViewNoteById from './apps/notesapp/notesappcomponents/ViewNoteById';
import TodosApp from './apps/todosapp/TodosApp';
import ToDoApp from './apps/todosapp/ToDoApp';
import EditorContextProvider from './apps/notesapp/notesappcomponents/EditorContext';
import DraftManager from './dashboard/pages/DraftManager';
import DashboardDrafts from './dashboard/pages/DashboardDrafts';
import DashboardHome from './pages/dashboard/DashboardHome';
import Dashboard from './pages/dashboard/Dashboard';
import CustomPdfFlipbook from './pages/pdf/CustomPdfFlipbook';
import PdfUploader from './pages/pdf/PdfUploader';
import PdfViewer from './pages/pdf/PdfViewer';
import DynamicImageFlipbook from './pages/pdf/DynamicImageFlipbook';
import HomePageAlt from './pages/home/HomePageAlt';
import MainApp from './main/MainApp';
import HomeMain from './pages/homemain/HomeMain';
import Privacy from './pages/Privacy';
import CategoryBlogs from './pages/blogsbycategorytag/CategoryBlogs';
import TagBlogs from './pages/blogsbycategorytag/TagBlogs';

import TaskDashboard from './apps/taskmanagerapp/TaskDashboard';
import AdminCreateTask from './apps/taskmanagerapp/AdminCreateTask';
import TaskDetails from './apps/taskmanagerapp/taskmanagerappcomponents/TaskDetails';

import SharedNotes from './apps/notesapp/notesappcomponents/SharedNotes';
import AllNotes from './apps/notesapp/notesappcomponents/AllNotes';

import NotesAppAlt from './apps/notesapp/NotesAppAlt';
import AllNotesAlt from './apps/notesapp/notesappcomponents/AllNotesAlt';
import PostCreator from './dashboard/components/PostCreator';
import DashboardAiPost from './dashboard/components/DashboardAiPost';
import BannerEditor from './dashboard/components/BannerEditor';
import NoteDetails from './pages/blogs/NoteDetails';




function App() {
  
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);

  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const fetchedRole = await getUserRole(user.uid);
        setRole(fetchedRole || "guest");
      } else {
        setUser(null);
        setRole("guest");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // if (loading) return <div>Loading...</div>;

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive("sign-in");
      Navigate("/sign-in");
    });
  };




  const hideNavbarRoutes = ["/","/sign-in","/sign-up","/search"
                              // "/admin","/dashboard",
                              //"/dashboard","/admin-dashboard"
                            ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || 
  location.pathname.startsWith("/sign-in",'/sign-up');

  return (
    <BrowserRouter>

      {/*<ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />*/}

      {
        !shouldHideNavbar && 
        <HomeNavbar
            setActive={setActive}
            active={active}
            user={user} 
            handleLogout={handleLogout}
              role={role}
          />
      }
      <Routes>
        {/* Authentication */}
        <Route path='/sign-in' element={<SignInPage setActive={setActive} setUser={setUser} />} />
        <Route path='/sign-up' element={<SignUpPage setActive={setActive} />} />

        {/* Public / Guest */}
        <Route path='/' element={<HomeMain 
                      setActive={setActive} 
                      active={active} 
                      user={user} 
                      handleLogout={handleLogout}
                      role={role}  />} 
                    />
        <Route
          path="/search"
          element={<HomeMain  setActive={setActive}  user={user}   />}
        />
        <Route path="/home-page" element={<HomePage setActive={setActive} active={active} user={user}  />} />
          <Route path="/home-alt" element={<HomePageAlt />} />
          <Route path="/home-three" element={<HomeThree />} />
          <Route path="/home-five" element={<HomeFive />} />
          <Route path="/home-nine" element={<HomeNine />} />
          <Route path="/home-news" element={<HomeNews />} />
          <Route path="/home-news-ui" element={<HomeNewsSampleUI />} />
          <Route path="/home-news-app" element={<HomeNewsApp />} />
          <Route path="/home-news-oage" element={<NewsHomePage />} />

        <Route path='/main-app' element={<MainApp />} />
        <Route path='/about-us' element={<About />} />
        
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/allposts" element={<AllPostsPage />} />

        <Route path="/post/:id" element={<SinglePostPage />} />          
        <Route path="/post-detail/:id" element={<PostDetail />} />
        <Route path="/singlepost/:id" element={<SinglePostDetail />} />
        <Route path="/details/:id" element={<Detail setActive={setActive} user={user} />}/>

        <Route path="/category/posts/:category" element={<CategoryPost  />} />
        <Route path="/tag/posts/:tag" element={<TagPost />} />

        <Route  path="/category/:categoryId" element={<CategoryBlogs user={user} />} />
        <Route path="/tag/:tag" element={<TagBlogs setActive={setActive} />} />

        <Route path="/listpage" element={<ListPage />} />
        <Route path="/gridpage" element={<GridPage />} />

        {/* User-only route */}
        <Route path="/user-home" element={<UserHome />} />

        <Route path="/all-blog" element={<AllBlogList />} />
        <Route path="/all-blogs" element={<AllBlogsList user={user} />} />
        <Route path="/add-blog" element={<AddBlog user={user} />} />
        <Route path="/view-blog/:id" element={<BlogView />} />
        <Route path="/edit-blog/:id" element={<EditBlog user={user} />} />

        <Route path="/blog-posts" element={<AllBlogPosts user={user} />} />
        <Route path="/add-blog-post" element={
            <EditorContextProvider>
              <AddBlogPost user={user} />
            </EditorContextProvider>
            } 
          />
        <Route path="/edit-blog-post/:id" element={
            <EditorContextProvider>  
              <EditBlogPost user={user} />
            </EditorContextProvider>
            } 
          />
        <Route path="/blog-posts/:id" element={<BlogPostView />} />

        <Route path="/add-note/blog-post/:id" element={<AddNoteInBlogPost user={user} />} />
        <Route path="/view-notes/blog-post/:id" element={<ViewNoteInBlogPost user={user} />} />
        <Route path="/edit-note/blog-post/:noteId" element={<AddNoteInBlogPost user={user} />} />

        <Route path="/note-details/:noteId" element={<NoteDetails />} />

        <Route path="/add-note/post/:id" element={<AddPostNoteWrapper user={user} />} />
        <Route path="/view-notes/post/:id" element={<ViewPostNote user={user} />} />
        <Route path="/edit-note/post/:noteId" element={<AddPostNoteWrapper user={user} />} />
        
        <Route path="/apps/notes" element={<NotesApp user={user} />} />
        <Route path="/apps/notes-alt" element={<NotesAppAlt user={user} />} />
        <Route path="/view-notes/:id" element={<ViewNoteById user={user} />} />
        <Route path="/shared" element={<SharedNotes />} />

        
        <Route path="/apps/todosapp" element={<TodosApp user={user} />} />
        <Route path="/apps/todoapp" element={<ToDoApp user={user} />} />
        
        <Route path="/apps/taskboard" element={<TaskDashboard user={user} />} />
        <Route path="/apps/create-task" element={<AdminCreateTask user={user} />} />
        <Route path="/task/:taskId"  element={  <TaskDetails user={user} role={role} /> } />
        
        {/* user dashboard */}
        <Route path="/dashboard/user" element={<DashboardHome user={user} />} />
        <Route path="/user" element={<Dashboard user={user} />} />
        <Route path="/edit-blogpost/:postId" element={<EditBlogPost user={user} />} />
        
        <Route path="/upload-pdf" element={<PdfUploader />} />
        <Route path="/view-pdf/:docId" element={<PdfViewer />} />
        <Route path="/view/book" element={<DynamicImageFlipbook />} />
        <Route path="/view-book" element={<CustomPdfFlipbook  />} />

        {/* Fallback route */} 
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />

        <Route path='/dashboard' element={<ProtectDashboard />} >
          <Route path='' 
            element={<MainLayout 
              setActive={setActive}
              active={active}
              user={user} 
              handleLogout={handleLogout}
              role={role} 
            />} 
          >
            <Route path='' element={<Navigate to='/dashboard/admin' />} />
            <Route path='unauthorized' element={<Unauthorized />} />
            <Route path='' element={<ProtectRole role='admin' />} >
              <Route path='admin' element={<AdminIndex />} />
              <Route path='post-creator' element={<PostCreator />} />
              <Route path='ai-posts' element={<DashboardAiPost />} />
              {<Route path='banner-editor' element={<BannerEditor />} />}
              <Route path="main" element={<DashboardMain />} />
              <Route path="stats" element={<DashboardStats />} />
              <Route path="category-manager" element={<CategoryManager />} />
              <Route path="category-manager-alt" element={<CategoryManagerAlt />} />
              <Route path="category-manager-ui" element={<CategoryManagerUI />} />
              <Route path="single-category-manager" element={<SingleCategoryManager />} />
              <Route path="single-subcategory-manager" element={<SingleSubcategoryManager />} />
              <Route path="new-category-manager" element={<NewCategoryManager />} />
              <Route path="item-manager" element={<ItemManager />} />
              <Route path="post-manager"  element={<PostManager />} />
              <Route path="story-manager" element={<StoryManager />} />
              <Route path="taskmanager" element={<TaskManager />} />

              <Route path="all-segment" element={<DashboardAllSegment />} />
              <Route path="add-segment" element={<DashboardAddSegment />} />
              <Route path="all-category-type" element={<DashboardAllCategoryType />} />
              <Route path="add-category-type" element={<DashboardAddCategoryType />} />
              <Route path="all-option" element={<DashboardAllOption />} />
              <Route path="add-option" element={<DashboardAddOption />} />

              <Route path="all-posts-list" element={<DashboardAllPostsList />} />
              <Route path="all-posts-view" element={<DashboardAllPostsView />} />
              <Route path="all-post-list" element={<DashboardAllPostList />} />
              <Route path="posts/:slug" element={<DashboardPostsDetail />} />
              <Route path="postsui/:slug" element={<DashboardPostDetailUI />} />
              <Route path="posts/edit/:slug" element={
                    <EditorContextProvider>
                      <DashboardEditPost user={user} />
                    </EditorContextProvider>
                  } 
                />
              <Route path="posts-edit/:slug" element={<DashboardPostEdit />} />
              <Route path="all-post" element={<DashboardAllPosts />} />
              <Route path="posts" element={<DashboardPosts />} />
              <Route path="add-post" element={
                    <EditorContextProvider>
                      <DashboardAddPost user={user} />
                    </EditorContextProvider>
                  } 
              />
              {/*<Route path="add-post/:draftId" element={
                    <EditorContextProvider>
                      <DashboardAddPost user={user} />
                    </EditorContextProvider>
                  } 
              />*/}
              <Route path="posts/drafts" element={<DraftManager user={user}  />} />
              <Route path="post/drafts" element={<DashboardDrafts user={user}  />} />
              {/* APPS */}
              <Route path="apps" element={<Apps />} />   


            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
