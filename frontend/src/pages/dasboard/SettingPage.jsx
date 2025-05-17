import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Loader2 } from 'lucide-react';


// const linkLable=[
//     { label: "setting", href: "setting" },
//     { label: "Authentication" ,herf:"authentication"},
//     { label: "" },
// ]
// const initialLable={
//     lable:"setting",href:"setting"
// }
export function BreadcrumbCollapsed() {
  const location = useLocation();

  const [label, setLabel] = useState([])

  useEffect(() => {
    const pathnames = window.location.pathname.split("/").filter(Boolean);

    const breadcrumbItems = pathnames.map((segment, index) => {
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: "/" + pathnames.slice(0, index + 1).join("/"),
      };
    });

    setLabel(breadcrumbItems);

  }, [location.pathname])
  return (
    <Breadcrumb className="primary-p">
      <BreadcrumbList>
        {label?.length > 0 &&
          label.map((path, index) => {
            const isLast = index === label.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={index}>
                {!isFirst && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className=" after:absolute relative after:w-full after:-bottom-1 after:border-green-500 after:h-0.5 after:bg-sky-500 after:left-0 after:rounded-xl">{path.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={path.href}>{path.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>

  )
}
export const SettingLayout = () => {
  return (
    <Suspense fallback={<div className='flex-1 center '><Loader2 /> Loading...</div>}>

      <BreadcrumbCollapsed />
      <Outlet />
    </Suspense>
  )
}
