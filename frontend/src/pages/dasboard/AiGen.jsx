import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, Image, Loader, Upload, Wand2, Sun, Moon, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilePreview, FileUploader } from "./AddProduct";



const AIProductGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "React-Basics.pdf",
      mimeType: "application/pdf",
      viewLink: "#",
      downloadLink: "#",
    },
    {
      id: "2",
      name: "CoverImage.png",
      mimeType: "image/png",
      viewLink: "#",
      downloadLink: "#",
    },
  ]);
  const [thumbnailFiles,setThumbnailFiles]=useState([])

  // For live chat prompt/response
  const [chatPrompt, setChatPrompt] = useState("");
  const [aiResponse, setAIResponse] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

  // Simulated AI response function - replace with real API call
  const getAIResponse = (prompt) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`AI-generated content based on: "${prompt}"`);
      }, 2000);
    });
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Content Generated! (Stub)");
    }, 2000);
  };

  const handleSendPrompt = async () => {
    if (!chatPrompt.trim()) return;
    setResponseLoading(true);
    setAIResponse(null);
    setConfirmed(false);
    try {
      const response = await getAIResponse(chatPrompt);
      setAIResponse(response);
    } catch (error) {
      setAIResponse("Error generating response.");
    } finally {
      setResponseLoading(false);
    }
  };

   const fileHandleChange = (e, setter) => {
    const files = Array.from(e.target.files);
    setter((prev) => [...prev, ...files]);
  };

  const fileHandleRemove = (i, setter) => {
    setter((prev) => prev.filter((_, index) => index !== i));
  };

  return (
    <div className="flex  flex-col   transition-colors duration-300  light:text-black dark:text-white  min-h-screen w-full pt-4">

    {/* <div className="flex   gap-4 flex-1 flex-wrap"> */}
 <motion.h2 
 initial={{y:-10,opacity:0}}
 animate={{y:0,opacity:1}}
 transition={{duration:0.5}}
  className="min-w-full text-2xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="text-purple-500" /> AI Product Generator
        </motion.h2>
<motion.span 
initial={{y:-10,opacity:0}}
 animate={{y:0,opacity:1}}
 transition={{duration:0.5,delay:.1}}
className="p-4 grid lg:grid-cols-2 gap-2 lg:gap-4 flex-col border rounded-lg min-w-[300px]">
           

        <span className="flex flex-col gap-4">
            <div className="grid  grid-cols-2 sm:grid-cols-2 gap-4 mb-0">
          <Input placeholder="Enter Price (e.g. 199)" className="dark:bg-slate-700 dark:border-slate-600" />
          <Select className="w-full flex ">
            <SelectTrigger className="dark:bg-slate-700 w-full flex-1 dark:border-slate-600">
              <SelectValue placeholder="Select Format" />
            </SelectTrigger>
            <SelectContent className="flex gap-1 dark:bg-slate-700 dark:text-white ">

            {    ["pdf","epub","slides","images"].map((item)=>

              <SelectItem key={item} value={item} className="border border-slate-400/0 hover:border-slate-400   cursor-pointer  hover:text-blue-400 capitalize tansition-all ease duration-300 ">{item}</SelectItem>
            )}
              {/* <SelectItem value="epub">eBook (EPUB)</SelectItem>
              <SelectItem value="slides">Slides</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="manual" className=" flex-1 w-full m-0">
          <TabsList className="grid w-full grid-cols-2 dark:bg-slate-700">
            <TabsTrigger value="manual" className="flex items-center gap-1 dark:data-[state=active]:bg-slate-600">
              <Upload className="w-4 h-4" /> Manual Thumbnail
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1 dark:data-[state=active]:bg-slate-600">
              <Wand2 className="w-4 h-4" /> Generate with AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-4">
            {/* <Input type="file" accept="image/*" className="dark:bg-slate-700 dark:border-slate-600" /> */}
            <FileUploader
                    label="Upload Thumbnails"
                    files={thumbnailFiles}
                    accept="image/*"
                    multiple={true}
                    onChange={(e) =>{fileHandleChange(e,setThumbnailFiles)}}
                    onRemove={(i) =>{fileHandleRemove(i,setThumbnailFiles)}}
                  />
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <Textarea placeholder="Describe thumbnail image..." className="min-h-[80px] mb-2 dark:bg-slate-700 dark:border-slate-600" />
            <Button variant="outline" className="gap-2 dark:border-purple-500 hover:bg-purple-300/20 transition-color duration-500">
              <Wand2 className="w-4 h-4" /> Generate Thumbnail
            </Button>
          </TabsContent>
        </Tabs>
        </span>


         <Card className="p-2">
        <h3 className="text-xl font-semibold  flex items-center gap-2">
          <Wand2 className="text-purple-500" /> Chat with AI for Content Generation
        </h3>

        <Textarea
          placeholder="Type your prompt here..."
          rows={3}
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt();
            }
          }}
          className="dark:bg-slate-700 dark:border-slate-600 min-h-[200px]"
          disabled={responseLoading || confirmed}
        />

        <div className="flex justify-end mt-2">
          <Button
            onClick={handleSendPrompt}
            disabled={responseLoading || confirmed || !chatPrompt.trim()}
            className="flex items-center gap-2 border border-purple-500"
          >
            {responseLoading ? <Loader className="animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </Button>
        </div>

        {aiResponse && !confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600"
          >
            <p className="whitespace-pre-wrap">{aiResponse}</p>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setConfirmed(true)}>
                Confirm AI Response
              </Button>
            </div>
          </motion.div>
        )}

        {confirmed && (
          <div className="mt-6 flex flex-col items-center">
            <p className="mb-2 text-green-600 dark:text-green-400 font-semibold">
              Response confirmed! You can now upload your file.
            </p>
            <Input type="file" accept="image/*,application/pdf" className="dark:bg-slate-700 dark:border-slate-600" />
            <Button className="mt-2" variant="primary">
              Upload
            </Button>
          </div>
        )}
      </Card>

</motion.span>

    {/* </div> */}
    

      {/* LIVE CHAT PROMPT + AI RESPONSE SECTION */}
     

      {/* GENERATED FILES */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 ,delay:.2}}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold mb-4">Generated Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="p-4 bg-white dark:bg-slate-800 dark:text-white">
                <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
                  {file.mimeType.includes("pdf") ? (
                    <FileText className="text-red-500" />
                  ) : (
                    <Image className="text-blue-500" />
                  )}
                  {file.name}
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <a href={file.viewLink} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    View
                  </a>
                  <a href={file.downloadLink} className="text-green-600 hover:underline" target="_blank" rel="noreferrer">
                    Download
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

//   <Card className="p-6 w-full flex flex-wrap space-y-6   light:bg-white dark:bg-slate-800 dark:text-white">


//         {/* <Textarea placeholder="Describe your digital product..." className="min-h-[120px] dark:bg-slate-700 dark:border-slate-600" /> */}

        





//         <Button className="w-full gap-2 mt-4" onClick={handleGenerate} disabled={loading}>
//           {loading ? <Loader className="animate-spin" /> : <Sparkles />} Generate Content
//         </Button>
//       </Card>
export default AIProductGenerator;
