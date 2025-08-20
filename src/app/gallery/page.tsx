import { getAssetByIdAction, getPublicAssetsAction } from "@/actions/admin-actions";
import { getCategoriesAction } from "@/actions/dashboard-actions";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface GallaryPageProps {
  searchParams: {
    category?: string
  }
}

async function GallaryPage({ searchParams }: GallaryPageProps) { // this will be a public page for user not for admin

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session && session?.user?.role === 'admin') { // cant access the gallary page for admin
    redirect('/')
  }



  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] ">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      }
    >
      <GalleryContent searchParams={searchParams} />

    </Suspense>
  );
}

export default GallaryPage;

async function GalleryContent({ searchParams }: GallaryPageProps) {

  // const sp = await searchParams
  // const categoryId = sp.category? Number.parseInt(sp.category) : undefined

  const { category } = await searchParams;
  const categoryId = category ? Number.parseInt(category) : undefined;



  const categories = await getCategoriesAction()
  const assets = await getPublicAssetsAction(categoryId)

  return (
    <div className="min-h-screen container px-4 bg-white">
      <div className="sticky top-0 z-30 bg-white border-b py-3 px-4">
        <div className="container flex overflow-x-auto gap-2">
          <Button variant={!categoryId ? 'default' : 'outline'}
            size="sm"
            className={!categoryId ? "bg-black text-white": ""}
          >
            <Link href="/gallery">
              All
            </Link>

          </Button>

          {
            categories.map(c => (
              <Button 
                key={c.id} 
                variant={categoryId === c.id ? 'default' : 'outline'}
                size='sm'
                className={categoryId === c.id ? 'bg-black text-white' : ""}
                asChild
                >
                  <Link href={`/gallery?category=${c.id}`} >
                    {c.name}
                  </Link>

              </Button>
            ))
          }
        </div>
      </div>

      <div className="container py-12">
        {
          assets.length === 0 
          ? <p className="text-xl text-center font-bold">No assets uploaded! Please check in sometime!</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {
              assets.map(({asset, categoryName, userName}) => (
                <Link 
                  href={`/gallery/${asset.id}`}
                  key={asset.id}
                  className="block"
                  >
                    <div className="group relative overflow-hidden rounded-lg aspect-square">
                      <Image
                        src={asset.fileUrl}
                        alt={asset.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-medium text-lg">
                            {asset?.title}
                          </h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-white/80 text-sm">{userName}</span>
                            {/* {userName} */}
                            {
                              categoryName && (
                                <span className="bg-white/25 text-white text-xs px-3 py-1.5 rounded-full ">
                                  {categoryName}
                                </span>
                              )
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                </Link>
              ))
            }
          </div>
        }

      </div>
    </div>
  )
}


// async function GalleryContent({ searchParams }: GallaryPageProps) {
//   const { category } = searchParams;
//   const categoryId = category ? Number.parseInt(category) : undefined; // use null if no category

//   const categories = await getCategoriesAction();

//   // ✅ if categoryId is null → fetch all assets
//   const assets = await getPublicAssetsAction(categoryId);

//   return (
//     <div className="min-h-screen container px-4 bg-white">
//       <div className="sticky top-0 z-30 bg-white border-b py-3 px-4">
//         <div className="container flex overflow-x-auto gap-2">
//           <Button
//             variant={!categoryId ? "default" : "outline"}
//             size="sm"
//             className={!categoryId ? "bg-black text-white" : ""}
//             asChild
//           >
//             <Link href="/gallery">All</Link>
//           </Button>

//           {categories.map((c) => (
//             <Button
//               key={c.id}
//               variant={categoryId === c.id ? "default" : "outline"}
//               size="sm"
//               className={categoryId === c.id ? "bg-black text-white" : ""}
//               asChild
//             >
//               <Link href={`/gallery?category=${c.id}`}>{c.name}</Link>
//             </Button>
//           ))}
//         </div>
//       </div>

//       <div className="container py-12">
//         {assets.length === 0 ? (
//           <p className="text-xl text-center font-bold">
//             No assets uploaded! Please check in sometime!
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {assets.map(({ asset, categoryName, userName }) => (
//               <Link href={`/gallery/${asset.id}`} key={asset.id} className="block">
//                 <div className="group relative overflow-hidden rounded-lg aspect-square">
//                   <Image
//                     src={asset.fileUrl}
//                     alt={asset.title}
//                     fill
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
