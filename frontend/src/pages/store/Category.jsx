import React, { useState } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { FaBook, FaVideo, FaImage, FaFileAlt } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetProductsQuery } from "../../services/store/productServices";
import { AspectRatio } from "@/components/ui/aspect-ratio"
const categories = [
  { name: "eBooks", icon: <FaBook /> },
  { name: "Video Courses", icon: <FaVideo /> },
  { name: "Design Assets", icon: <FaImage /> },
  { name: "Software Tools", icon: <FaFileAlt /> },
  { name: "PDF Guides", icon: <FaFileAlt /> },
];


import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Image from "../../components/Shared/ImageLoading";
import { url } from "../../utils/service";

export default function TooltipButton({props,children,lable}) {
  const [hovered, setHovered] = useState(false);

  const right="right-0 ml-4"
  return (
    <div className="relative border flex items-center justify-center">
      {/* Button with icon */}
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="shadow transition"
        {...props}
      >
       {children}
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {1 && (
          <motion.div
            // initial={{ opacity: 0, y: 35, scale: 0.95 }}
            // animate={{ opacity: 1, y: 40, scale: 1 }}
            // exit={{ opacity: 0, y: 35, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${right}   min-w-[200px] left-full px-3 py-2 bg-gray-800 z-500 text-white text-sm text-center rounded shadow-md`}
          >
            {lable || "This is a tooltip!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


const products = {
  "eBooks": [
    { title: "JavaScript Essentials", price: "₹199", oldPrice: "₹499", img: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
    { title: "Mastering React", price: "₹299", oldPrice: "₹599", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
    { title: "JavaScript Essentials", price: "₹199", oldPrice: "₹499", img: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
    { title: "Mastering React", price: "₹299", oldPrice: "₹599", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
    { title: "JavaScript Essentials", price: "₹199", oldPrice: "₹499", img: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
    { title: "Mastering React", price: "₹299", oldPrice: "₹599", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
     { title: "JavaScript Essentials", price: "₹199", oldPrice: "₹499", img: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
    { title: "Mastering React", price: "₹299", oldPrice: "₹599", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
    { title: "JavaScript Essentials", price: "₹199", oldPrice: "₹499", img: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
    { title: "Mastering React", price: "₹299", oldPrice: "₹599", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
    { title: "JavaScript Essentials", price: "₹199", oldPrice: "₹499", img: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
    { title: "Mastering React", price: "₹299", oldPrice: "₹599", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
  ],
  "Video Courses": [
    { title: "Full-Stack Dev Bootcamp", price: "₹699", oldPrice: "₹1499", img: "/products/video1.jpg" },
    { title: "UI/UX Design Mastery", price: "₹499", oldPrice: "₹999", img: "/products/video2.jpg" },
  ],
  "Design Assets": [
    { title: "Startup UI Kit", price: "₹149", oldPrice: "₹299", img: "/products/design1.jpg" },
    { title: "Icons Bundle", price: "₹99", oldPrice: "₹199", img: "/products/design2.jpg" },
  ],
  "Software Tools": [
    { title: "Invoice Generator", price: "₹399", oldPrice: "₹899", img: "/products/tool1.jpg" },
    { title: "AI Writing Tool", price: "₹599", oldPrice: "₹1299", img: "/products/tool2.jpg" },
  ],
  "PDF Guides": [
    { title: "Startup Funding Guide", price: "₹89", oldPrice: "₹149", img: "/products/pdf1.jpg" },
    { title: "Digital Marketing Strategy", price: "₹129", oldPrice: "₹199", img: "/products/pdf2.jpg" },
  ],
};
// const products = [
//   { title: "Mastering React", type: "eBook", image: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
//   { title: "UI Design Kit", type: "Design File", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
//   { title: "Pro Coding Course", type: "Video", image: "https://royaledu.co.in/wp-content/uploads/2022/08/programming-language-2-1024x483.png" },
//   { title: "Ultimate Templates", type: "File Bundle", image: "https://designshack.net/wp-content/uploads/mobile-app-template-368x246.jpg" },
// ];

export  function CategoryPage() {
  const [selected, setSelected] = useState("eBooks");
  const navigate=useNavigate();
const { data, refetch,isLoading } = useGetProductsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: false,
  })
//   const products=data['data'];

  
  return (
    <div className="flex  max-h-screen overflow-hidden light:bg-light dark:bg-primary">
      {/* Sidebar */}
      <aside className="w-15 md:w-60 bg-white dark:bg-slate-800 shadow sm:p-4 px-2 py-4 space-y-4 sticky top-0 h-screen ">
        <h2 className="text-md md:text-xl font-bold hidden md:block">Categories</h2>
       {/* < TooltipButton/> */}
        <ul className="flex flex-col  gap-4">
          {categories.map((cat) => (
            <li key={cat.name} className="flex justify-center md:justify-start">
                {/* <TooltipButton lable={cat.name}> */}
 <button
                onClick={() => setSelected(cat.name)}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-2 p-2 rounded-lg w-full text-sm font-medium transition",
                  selected === cat.name
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="hidden md:inline">{cat.name}</span>
              </button>

                {/* </TooltipButton> */}
             
            </li>
          ))}
        </ul>
      </aside>

      {/* Product Grid */}
      {/* <main className="flex-1 overflow-auto p-4 grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] max-sm:grid-cols-2 gap-4 gap-y-2">
        {products[selected] && products[selected].length > 0 ? (
          products[selected].map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
               className=" max-h-[250px] rounded-2xl max-w-[250px]"
               onClick={()=>{navigate(`/product/${product?.id || '682debf5808b6c6876cadf64'}`)}} 
            >
              <span className="p-0 flex flex-col h-full max-h-[250px] rounded-2xl max-w-[250px] shadow hover:shadow-xl transition bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 gap-0">

                    <img
                  src={product.img}
                  alt={product.title}
                  className="w-full  h-full max-h-28 object-contian rounded-t-2xl"
                />

            <span className="flex flex-col flex-1 p-2 sm:p-4">
  <h3 className="text-lg truncate font-semibold mb-1">{product.title}</h3>
  <div className="flex items-center gap-2 mb-2">
    <span className="text-green-600 font-bold">{product.price}</span>
    <span className="line-through text-sm text-gray-400 dark:text-gray-500">
      {product.oldPrice}
    </span>
  </div>
  <div className="">
    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-semibold transition">
      Buy Now
    </button>
  </div>
</span>
              </span>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No products available in this category.
          </p>
        )}
      </main> */}

 <main className="flex-1 overflow-auto p-4 grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] max-sm:grid-cols-2 gap-4 gap-y-2">
        {data && data?.data?.product ? (
          data?.data?.product.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
               className=" max-h-[250px] rounded-2xl max-w-[250px]"
               onClick={()=>{navigate(`/product/${product?.prdId || '682debf5808b6c6876cadf64'}`)}} 
            >
              <span className="p-0 flex flex-col h-full max-h-[250px] rounded-2xl max-w-[250px] shadow hover:shadow-xl transition bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 gap-0 overflow-hidden cursor-pointer">

                {/* <AspectRatio ratio={16 / 9} className=" border max-h-[100px]"> */}

                <Image containerClassName={'w-full md:max-h-[120px] max-h-[100px] min-h-[100px] '} imageClassName={"w-full h-full object-contain bg-gray-400/20"} src={ `${url}/api/dashboard/product/files/${product?.thumbnails[0]?.id}?mimeType=${product?.thumbnails[0]?.mimeType}` || `https://drive.google.com/thumbnail?id=${product?.thumbnails[0]?.id}` || "https://www.morpher.com/blog/optimizedImages/httpsi0wpcommorpherhomewpcomstagingcomwpcontentuploads202407Untitleddesign6pngw600h380.webp"} alt="Product Thumbnail"
                        loading='lazy'/>
                    {/* <img
                  src={product.img}
                  alt={product.title}
                  className="w-full  h-full max-h-28 object-contian rounded-t-2xl"
                /> */}
                {/* </AspectRatio> */}
                
    <span className="flex flex-col flex-1 p-2 sm:p-4">
  <h3 className="text-lg truncate font-semibold mb-1">{product.title}</h3>
  <div className="flex items-center gap-2 mb-2">
    <span className="text-green-600 font-bold">{product.price}</span>
    <span className="line-through text-sm text-gray-400 dark:text-gray-500">
      {product.discountPrice}
    </span>
  </div>
  <div className="">
    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-semibold transition">
      Buy Now
    </button>
  </div>
</span>
              </span>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No products available in this category.
          </p>
        )}
      </main>
      
    </div>
  );
}
