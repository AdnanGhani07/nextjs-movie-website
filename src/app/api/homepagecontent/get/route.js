import HomePageContent from "@/lib/models/homePageContent.model";

import {connect} from "@/lib/mongodb/mongoose";

export const POST = async (req) => {
    try {
        await connect();
        const homePageContent = await HomePageContent.find();
        return new Response(JSON.stringify(homePageContent), {
            status: 200,
        });
    } catch (error) {
        console.error("Error getting the home page content", error);
        return new Response(JSON.stringify({error: "Error getting the home page content"}, {
            status: 500,
        }));
    }
}