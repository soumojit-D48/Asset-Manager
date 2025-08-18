import { getCategoriesAction } from "@/actions/dashboard-actions";
import AssetGrid from "@/components/dashboard/asset-grid";
import UploadAsset from "@/components/dashboard/upload-asset";

async function AssetsPage() {

    const [categries] = await Promise.all([getCategoriesAction()])
    return ( 
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">My Assets</h1>
                <UploadAsset categories={categries || []}/>
            </div>
            <AssetGrid/>

        </div>
     );
}

export default AssetsPage;