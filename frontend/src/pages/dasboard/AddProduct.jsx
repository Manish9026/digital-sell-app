// import React from 'react'
import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { UploadCloud, X } from 'lucide-react';
// import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, FileVideo2, FileAudio, FileText, Upload, Wand2, FileBox } from 'lucide-react';
import axios from 'axios';
import { url } from '../../utils/service';
import { Input } from "@/components/ui/input";

const FileTypeIcon = ({ type }) => {
  if (type.startsWith("image/")) return <ImageIcon className="text-blue-400" />;
  if (type.startsWith("video/")) return <FileVideo2 className="text-pink-400" />;
  if (type.startsWith("audio/")) return <FileAudio className="text-green-400" />;
  return <FileText className="text-yellow-400" />;
};

export const FilePreview = ({ file, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="relative bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 shadow hover:shadow-lg transition-all w-full sm:w-40"
  >
    <div className="flex justify-between items-center mb-2">
      <FileTypeIcon type={file.type} />
      <button
        type="reset"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
    <div className="h-24 overflow-hidden rounded-md mb-1 flex justify-center items-center bg-gray-100 dark:bg-gray-700">
      {file.type.startsWith("image/") ? (
        <img src={URL.createObjectURL(file)} alt="preview" className="h-full object-cover" />
      ) : file.type.startsWith("video/") ? (
        <video src={URL.createObjectURL(file)} className="h-full" controls />
      ) : file.type.startsWith("audio/") ? (
        <audio src={URL.createObjectURL(file)} className="w-full" controls />
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-300 truncate text-center">{file.name}</p>
      )}
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-300 truncate text-center">{file.name}</p>
  </motion.div>
);

export const FileUploader = ({ label, files, onChange, onRemove, accept, multiple }) => (
  <div className="space-y-2">
    <label className="block font-medium light:text-gray-700 dark:text-gray-300">{label}</label>
    <div className="w-full border-2 border-dashed light:border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-900 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
        id={label.replace(/\s/g, "")}
      />
      <label
        htmlFor={label.replace(/\s/g, "")}
        className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300"
      >
        <Upload size={24} />
        <span className="text-sm">Click to upload or drag & drop</span>
      </label>
    </div>

    <motion.div layout className=" max-[500px]:grid max-[600px]:grid-cols-2  flex flex-wrap  gap-4 mt-4 overflow-hidden">
      <AnimatePresence>
        {files.map((file, idx) => (
          <FilePreview key={file.name + idx} file={file} onRemove={() => onRemove(idx)} />
        ))}
      </AnimatePresence>
    </motion.div>
  </div>
);
import {
  // X,
  // Upload,
  BadgePercent,
  DollarSign,
  Percent,
  Tag,
  Plus,
  Trash2,
} from "lucide-react";
import { LoadingScreen } from '../../components/Shared/LoadingComponent';
import { toast } from 'react-toastify';
import { useGetCategoryQuery, useUploadPoductOnDriveMutation } from '../../services/dashboad/driveServices';
import AIProductGenerator from './AiGen';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { lazy } from 'react';

// const InputSearch =lazy(()=>import('../../components/Shared/InputSearch').then((m=>({default:m.InputSearch}))))
const AnimatedInput = ({ label, icon: Icon, inputClass, lableClass, containerClass, ...props }) => (
  <div className="space-y-1 w-full">
    <label className={`${lableClass} text-sm font-medium light:text-gray-700 dark:text-gray-300`}>{label}</label>
    <div className={` flex mt-1 p-2 items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 ${containerClass}`}>
      {Icon && <Icon className="w-5 h-5 text-gray-400 mr-2" />}
      <input
        className={`sm:p-2 p-1 bg-transparent flex-1 outline-none text-sm text-gray-800 dark:text-white ${inputClass}`}
        {...props}
      />
    </div>
  </div>
);

// import React, { useState, useEffect } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SearchCheck } from 'lucide-react'
import { useGetCouponsQuery, useLazyGetCouponsQuery } from '../../services/dashboad/dashProductServices';

const dummy=[
  {
    "code": "WELCOME10",
    "discountType": "percentage",
    "discountValue": 10,
    "applicableProducts": [],
    "usageLimit": 100,
    "usedBy": [],
    "expiresAt": { "$date": "2025-12-31T00:00:00Z" },
    "isActive": true
  },
  {
    "code": "SAVE50",
    "discountType": "fixed",
    "discountValue": 50,
    "applicableProducts": [
      { "$oid": "662f1fd2e12a3c0df1234567" },
      { "$oid": "662f1fd2e12a3c0df1234568" }
    ],
    "usageLimit": 50,
    "usedBy": [
      { "$oid": "662f1fd2e12a3c0df1239999" }
    ],
    "expiresAt": { "$date": "2025-06-30T00:00:00Z" },
    "isActive": true
  },
  {
    "code": "NEWYEAR25",
    "discountType": "percentage",
    "discountValue": 25,
    "applicableProducts": [],
    "usageLimit": 200,
    "usedBy": [],
    "expiresAt": { "$date": "2026-01-10T00:00:00Z" },
    "isActive": true
  },
  {
    "code": "DESIGN20",
    "discountType": "fixed",
    "discountValue": 20,
    "applicableProducts": [
      { "$oid": "662f1fd2e12a3c0df1234570" }
    ],
    "usageLimit": 20,
    "usedBy": [
      { "$oid": "662f1fd2e12a3c0df1239991" },
      { "$oid": "662f1fd2e12a3c0df1239992" }
    ],
    "expiresAt": { "$date": "2025-08-15T00:00:00Z" },
    "isActive": false
  },
  {
    "code": "GLOBAL5",
    "discountType": "fixed",
    "discountValue": 5,
    "applicableProducts": [],
    "usageLimit": null,
    "usedBy": [],
    "expiresAt": { "$date": "2026-12-31T00:00:00Z" },
    "isActive": true
  }
]


export default function SearchCategory({ lableClass, label = "Category", onSelect = () => { },placeholder,data,fields=["code"],title=["code"] }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  // const { data, isLoading, refetch } = useGetCategoryQuery("", {
  //   refetchOnMountOrArgChange: true,
  // })
  const [isActive, setIsActive] = useState(false);

  console.log(data);

  useEffect(() => {
    // if (data && data?.categories.length > 0) {
    //   if (query.trim().length > 0) {
    //     // 🧠 Use regex to filter objects by name or slug
    //     const regex = new RegExp(query, "i");
    //     const results = data?.categories.filter(item => regex.test(item.name) || regex.test(item.slug));
    //     setFiltered(results);
    //   }
    //   else {
    //     setFiltered(data?.categories)
    //   }
    // }
    if(data)
    setFiltered(filterBySearch());


  }, [query,data]);

 const filterBySearch = ()=> {
  if (!query?.trim()) return data;
  const regex = new RegExp(query.trim(), 'i');

  return data.filter((item) =>
    fields.some((field) => regex.test(item?.[field] ?? ''))
  );
};

  const handleSelect = (item) => {

    console.log(item, typeof onSelect);
    if (onSelect && typeof onSelect === "function")
      onSelect(item)
    setQuery(item[title[0]])
    setIsActive(false)
  }

  return (
    <div className="relative w-full  mx-auto">
      {/* Search Box */}
      <div className="flex flex-col gap-2 ">
        <label className={`${lableClass} text-sm font-medium light:text-gray-700 dark:text-gray-300`}>{label || "Category"}</label>
        <span className="flex flex-1 items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md px-4 py-3 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500">
          <SearchCheck className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder ||"Search categories..."}
            className="ml-3 w-full bg-transparent focus:outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400"
          />
        </span>

      </div>


      {/* Results Dropdown */}
      <AnimatePresence>
        {isActive && filtered?.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
          >
            {filtered.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer transition text-sm text-gray-800 dark:text-gray-100"
                onClick={() => handleSelect(item)}
              // onClick={()=>set}
              >
                {item[title[0]]}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}


const CourseUploadForm = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [courseFiles, setCourseFiles] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  // const [isLoading,setIsLoading]=useState(false)
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    discountPercent: "",
    priceConvertType: null
  });
  const [uploadFiles, { isLoading, isError, isSuccess }] = useUploadPoductOnDriveMutation();

  const {data:getCoupon}=useGetCouponsQuery({
    refetchOnReconnect:true
  })
  console.log(getCoupon,"getcoupons");
  
  const { data:categoryData} = useGetCategoryQuery("", {
    refetchOnMountOrArgChange: true,
  })
  useEffect(() => {
    const { price, discountPrice, discountPercent } = form;
    const priceNum = parseFloat(price);
    const discountNum = parseFloat(discountPrice);
    const percentNum = parseFloat(discountPercent);


    const timeout = setTimeout(() => {
      if (priceNum && form?.priceConvertType === "discountPrice") {
        const percent = ((discountNum) / priceNum) * 100;
        setForm((prev) => ({ ...prev, discountPercent: percent ? percent.toFixed(2) : 0 }));
      }

      if (priceNum && form?.priceConvertType === "discountPercent") {
        const discount = ((percentNum / 100) * priceNum);
        setForm((prev) => ({ ...prev, discountPrice: discount ? discount.toFixed(2) : 0 }));
      }
    }, 1000)


    return () => clearTimeout(timeout)
  }, [form.price, form.discountPrice, form.discountPercent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    if (name === "discountPrice" | name == "discountPercent")
      return setForm((prev) => ({ ...prev, [name]: value, priceConvertType: name }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = () => {
    if (couponInput && !coupons.includes(couponInput)) {
      setCoupons((prev) => [...prev, couponInput]);
      setCouponInput("");
    }
  };

  const handleRemoveCoupon = (index) => {
    setCoupons((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fileHandleChange = (e, setter) => {
    const files = Array.from(e.target.files);
    setter((prev) => [...prev, ...files]);
  };

  const fileHandleRemove = (i, setter) => {
    setter((prev) => prev.filter((_, index) => index !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form:", form);
    console.log("Thumbnails:", thumbnails);
    console.log("Files:", courseFiles);
    const formData = new FormData();
    formData.append('title', form.name);
    formData.append('description', form.description);
    formData.append('category', JSON.stringify(form.category));
    formData.append('price', form.price);
    formData.append('discountPrice', form.discountPrice);
    formData.append("discountPercent", form.discountPercent)
    formData.append("actualPrice", (form.price - form.discountPrice).toFixed(2))
    formData.append("coupons",JSON.stringify(coupons));

    for (const file of thumbnails) formData.append('thumbnails', file);
    for (const file of courseFiles) formData.append('files', file);
    // setIsLoading(true)
    // console.log(url);
    uploadFiles(formData);

    // await axios.post(`${url}/api/dashboard/drive/upload-products`, formData,{headers: { 'Content-Type': 'multipart/form-data' }}).then((res)=>{
    //     console.log(res.data);
    //   // setIsLoading(false)
    //   toast.success("✅✅ Product detail uploaded !!")

    //   }
    // ).catch((err)=>{
    //   console.log(err);
    //   setIsLoading(false)
    //   toast.error("❌ Product not uploaded !!")

    // })

  };

  return (
    <motion.form
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: .6, }}

      onSubmit={handleSubmit}
      className="max-w-6xl flex flex-col w-full p-4 sm:p-6 lg:p-10  shadow-xl rounded-xl  relative overflow-hidden border light:border-primary light:text-primary"
    >
      {isLoading && <LoadingScreen title={"Uploading on you drive, waiting...."} />}
      <h2 className="min-w-full text-2xl font-semibold mb-4 flex items-center gap-2">
        <FileBox className='text-purple-500 texl-2xl' /> Create Course
      </h2>

      <div className="lg:grid lg:grid-cols-2 flex-1 gap-6">
        <div className="grid grid-cols2 gap-2 lg:max-h-[600px]   min-h-[500px]">
          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatedInput label="Course Name" name="name" value={form.name} onChange={handleChange} icon={Tag} placeholder="Ex: MERN Stack" />
            {/* <AnimatedInput label="Category" name="category" value={form.category} onChange={handleChange} icon={BadgePercent} />
        <InputSearch/> */}
            <SearchCategory onSelect={(value)=>{console.log("value",value);setForm(prev=>({...prev,category:{id:value?._id,name:value?.name}}))}
            } data={(categoryData && categoryData?.categories ) || []} fields={["name"]} title={["name"]}/>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <AnimatedInput label="Price (₹)" name="price" value={form.price} onChange={handleChange} icon={DollarSign} placeholder="0.0" />
            <AnimatedInput label="Discount Price (₹)" name="discountPrice" value={form.discountPrice} onChange={handleChange} icon={DollarSign} placeholder="0.0" />
            <AnimatedInput label="Discount %" name="discountPercent" value={form.discountPercent} placeholder="0 %" onChange={handleChange} icon={Percent} />
          </div>



          {/* Coupon Section */}
          <div>
            <label className="text-sm font-medium light:text-gray-700 dark:text-gray-300">Add Coupons</label>
            <div className="flex gap-3 items-center mt-1">
              {/* <AnimatedInput
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
              // className=""
              /> */}
              <SearchCategory placeholder={"Search coupons...."} lableClass={"hidden"} data={getCoupon?.coupons} fields={["code"]} onSelect={(value)=>{console.log("value",value);setCoupons(prev=>[...prev,{name:value?.code,id:value?._id}])}
            }/>
              {/*  */}
            </div>
            <div className="flex flex-wrap mt-3 gap-2">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-800 text-sm rounded-full text-blue-800 dark:text-white"
                >
                  {coupon?.name}
                  <button onClick={() => handleRemoveCoupon(index)} className="ml-2">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>




          <div>
            <label className="block font-medium light:text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              rows="4"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder='Ex: This course covers...'
            ></textarea>
          </div>

        </div>
        {/* </form> */}
        <div className="">
          <FileUploader
            label="Upload Thumbnails"
            files={thumbnails}
            accept="image/*"
            multiple={true}
            onChange={(e) => fileHandleChange(e, setThumbnails)}
            onRemove={(i) => fileHandleRemove(i, setThumbnails)}
          />

          <FileUploader
            label="Upload Course Files"
            files={courseFiles}
            accept="image/*,video/*,audio/*,application/pdf"
            multiple={true}
            onChange={(e) => fileHandleChange(e, setCourseFiles)}
            onRemove={(i) => fileHandleRemove(i, setCourseFiles)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-lg"
      >
        Submit Course
      </button>
    </motion.form>
  );
};

export const AddProduct = () => {
  return (

    <section className="primary-p ">

      <Tabs defaultValue="manual" className=" center  flex-1 w-full ">
        <TabsList className="grid  w-full grid-cols-2 mb-0 border max-w-4xl">
          <TabsTrigger value="manual" className="flex items-center gap-1 dark:data-[state=active]:bg-slate-600 light:data-[state=active]:bg-purple-600 text-white">
            <Upload className="w-4 h-4" /> Manual Upload
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1 dark:data-[state=active]:bg-slate-600">
            <Wand2 className="w-4 h-4" /> Generate with AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-2 md:mt-4 flex-1 w-full">
          <CourseUploadForm />
        </TabsContent>

        <TabsContent value="ai" className="mt-2 md:mt-4 flex flex-wrap flex-1 w-full">
          <AIProductGenerator />
        </TabsContent>
      </Tabs>

      {/* <AIProductGenerator> </AIProductGenerator> */}
    </section>
  )
}

