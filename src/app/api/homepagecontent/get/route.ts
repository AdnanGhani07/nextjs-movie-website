import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (_req: Request): Promise<Response> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("home_page_content")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Error getting the home page content:", error);
    return NextResponse.json(
      { error: "Error getting the home page content" },
      { status: 500 }
    );
  }
};
