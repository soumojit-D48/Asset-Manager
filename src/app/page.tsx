import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Share, Share2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 py-24 md:32 relative">
      <div className="container flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <div className="mb-6 p-4 rounded-full bg-blue-500">
            <Package className="text-white h-8 w-8"/>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-blue-600">
            Asset manager platform
          </h1>
        </div>
        
        <p className="mt-6 mx-w-[600px] text-lg text-slate-700">Upload, manage and share your assets</p>
        <div className="mt-12 flex flex-wrap gap-6 justify-center">
        <Link href='/gallery'>
          <Button className="bg-blue-500 text-white px-8 py-6 text-lg ">
            Browse Gallery
          </Button>
        </Link>
      </div>
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl ">
        <Card className="shadow">
          <CardHeader className="pb-2 flex flex-col items-center">
            <div className="p-3 rounded-full bg-blue-100 mb-2"> 
              <Package className="w-6 h-6 text-blue-600"/>
            </div>
            <CardTitle className="text-lg font-semibold text-center">
              Organize
            </CardTitle>
          </CardHeader>
          <CardContent className=" text-center mt-[-18px]">
            <p className="text-sm font-semibold text-blue-600">
              Categories and tag your assets
            </p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader className="pb-2 flex flex-col items-center">
            <div className="p-3 rounded-full bg-blue-100 mb-2"> 
              <Upload className="w-6 h-6 text-blue-600"/>
            </div>
            <CardTitle className="text-lg font-semibold text-center">
              Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center mt-[-18px]">
            <p className="text-sm font-semibold text-blue-600">
              Upload your assets
            </p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader className="pb-2 flex flex-col items-center">
            <div className="p-3 rounded-full bg-blue-100 mb-2"> 
              <Share2 className="w-6 h-6 text-blue-600"/>
            </div>
            <CardTitle className="text-lg font-semibold text-center">
              Share
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center mt-[-18px]">
            <p className="text-sm font-semibold text-blue-600">
              Share your assets
            </p>
          </CardContent>
        </Card>

      </div>
      </div>
      
    </section>
  );
}
