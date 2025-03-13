import { Editor } from "@tinymce/tinymce-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import api from "../../../api/api";
import {
  addBlog,
  fetchBlogById,
  updateBlog,
} from "../../../features/blog/blogSlice";
import { fetchBlogCategories } from "../../../features/blogCategory/blogCategorySlice";
import { fetchTags } from "../../../features/tag/tagSlice";
import { fetchUsers } from "../../../features/users/userSlice";
import { AppDispatch, RootState } from "../../../store";
import { BlogRequest } from "../../../types";
import { uploadImage } from "../../../utils/uploadImage";
import "../Brand/AddBrand.css"; // Sử dụng cùng file CSS với AddBrand

const AddBlog = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { blog } = useSelector((state: RootState) => state.blogs);
  const { categories } = useSelector(
    (state: RootState) => state.blogCategories
  );
  const { tags } = useSelector((state: RootState) => state.tags);
  const { users } = useSelector((state: RootState) => state.users);

  // State cho form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | string | null,
    status: "Nháp",
    categoryId: "",
    authorId: "",
    tagIds: [] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newTag, setNewTag] = useState(""); // Tag mới từ input

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi content từ TinyMCE
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Xử lý thay đổi tag (multiple select)
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
       option.value
    );
    setFormData((prev) => ({ ...prev, tagIds: selectedOptions }));
  };

  // Xử lý nhập tag mới
  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  // Thêm tag mới
  const addNewTag = () => {
    if (newTag.trim() !== "") {
      const newTagObject = { id: Date.now(), name: newTag };
      setFormData((prev) => ({
        ...prev,
        tagIds: [...prev.tagIds, newTagObject.name],
      }));
      setNewTag("");

      toast.success("Added new tag successfully");
    } else {
      toast.error("Tag name cannot be empty");
    }
  };

  // Xử lý khi nhấn Enter trong input tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    dispatch(fetchBlogCategories({ page: 1, search: "", size: 100 }));
    dispatch(fetchTags({ page: 1, search: "", size: 100 }));
    dispatch(
      fetchUsers({
        page: 1,
        search: "",
        size: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(Number(id))).then((action) => {
        if (fetchBlogById.fulfilled.match(action)) {
          const blog = action.payload;
          setFormData({
            title: blog.title,
            content: blog.content,
            image: blog.image,
            status: blog.status,
            categoryId: blog?.category?.id?.toString(),
            authorId: blog.author.id.toString(),
            tagIds: blog.tags.map((tag) => tag.name),
          });
          setImagePreview(blog.image);
        }
      });
    }
  }, [id, dispatch]);

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = imagePreview;
      if (formData.image && typeof formData.image !== "string") {
        const formDataImage = new FormData();
        formDataImage.append("file", formData.image);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + "/api" + image;
      }

      const newBlog: BlogRequest = {
        id: blog ? blog.id : Date.now(),
        title: formData.title,
        content: formData.content.toString(),
        image: imageUrl!,
        status: formData.status,
        createdDate: blog ? blog.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        categoryId: categories.find(
          (cat) => cat.id === Number(formData.categoryId)
        )?.id!,
        author: users.find((user) => user.id === Number(formData.authorId))
          ?.id!,
        tags: tags
          .filter((tag) => formData.tagIds.includes(tag.name))
          .map((tag) => tag.name),
      };
console.log(newBlog)
      if (blog?.id) {
        await dispatch(updateBlog(newBlog)).unwrap();
        toast.success("Updated blog successfully");
      } else {
        await dispatch(addBlog(newBlog)).unwrap();
        toast.success("Added blog successfully");
      }
      navigate("/admin/blog");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="form-header">
        <h1 className="form-title">
          {blog ? "Chỉnh sửa Blog" : "Thêm Blog Mới"}
        </h1>
        <NavLink to="/admin/blog" className="form-back-link">
          <span className="form-back-link-text">Quay lại danh sách Blog</span>
        </NavLink>
      </div>
  
      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <div className="space-y-6">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
  
          {/* Content Editor */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Nội dung
            </label>
            <div className="border rounded-md overflow-hidden">
              <Editor
                apiKey="btnhknzsdtdbu8ck8nwda9fxjxrlb2euoccuw6rfr5otxf02"
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
          </div>
  
          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Hình ảnh
            </label>
            <div className="space-y-3">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-file-input"
              />
              {imagePreview && (
                <div className="form-image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="border p-1 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
  
          {/* Status and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Không hoạt động">Không hoạt động</option>
                <option value="Hoạt động">Hoạt động</option>
              </select>
            </div>
  
            {/* Category */}
            <div className="form-group">
              <label htmlFor="categoryId" className="form-label">
                Danh mục
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
         {/* Author and Tags */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Author */}
  <div className="form-group">
    <label
      htmlFor="authorId"
      className="block text-sm font-medium text-gray-700"
    >
      Tác giả
    </label>
    <select
      id="authorId"
      name="authorId"
      value={formData.authorId}
      onChange={handleInputChange}
      required
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      <option value="">Chọn tác giả</option>
      {users &&
        users.map((author) => (
          <option key={author.id} value={author.id}>
            {author.username}
          </option>
        ))}
    </select>
  </div>

  {/* Tags */}
  <div className="form-group">
    <label
      htmlFor="tagIds"
      className="block text-sm font-medium text-gray-700"
    >
      Thẻ
    </label>
    <div className="space-y-2">
      <select
        id="tagIds"
        name="tagIds"
        multiple
        value={formData.tagIds.map(String)}
        onChange={handleTagChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32"
      >
        {tags.map((tag) => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
      
      <p className="text-sm text-gray-500">
        Giữ Ctrl (hoặc Cmd) để chọn nhiều thẻ
      </p>

      {/* New Tag Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={handleNewTagChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập thẻ mới"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={addNewTag}
          className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 whitespace-nowrap"
        >
          Thêm
        </button>
      </div>
    </div>
  </div>
</div>
  
          {/* Buttons */}
          <div className="form-buttons">
            <NavLink to="/admin/blog" className="form-cancel-button">
              Hủy
            </NavLink>
            <button type="submit" className="form-submit-button">
              {blog ? "Cập nhật Blog" : "Lưu Blog"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
