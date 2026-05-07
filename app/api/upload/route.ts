import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const title = form.get("title") as string;
    const subtitle = (form.get("subtitle") as string) || null;
    const description = form.get("description") as string;
    const caseStudy = (form.get("case_study") as string) || null;
    const mapCategory = form.getAll("map_category") as string[];

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const timestamp = Date.now();

    // Upload map JPEG
    let mapImageUrl: string | null = null;
    const mapImageFile = form.get("map_image") as File | null;
    if (mapImageFile && mapImageFile.size > 0) {
      const buf = Buffer.from(await mapImageFile.arrayBuffer());
      const ext = mapImageFile.name.split(".").pop() ?? "jpg";
      mapImageUrl = await uploadToS3(
        buf,
        `maps/${timestamp}-map.${ext}`,
        mapImageFile.type
      );
    }

    // Upload map PDF
    let mapPdfUrl: string | null = null;
    const mapPdfFile = form.get("map_pdf") as File | null;
    if (mapPdfFile && mapPdfFile.size > 0) {
      const buf = Buffer.from(await mapPdfFile.arrayBuffer());
      mapPdfUrl = await uploadToS3(
        buf,
        `maps/${timestamp}-map.pdf`,
        "application/pdf"
      );
    }

    // Upload associated photos
    const photos: { url: string; description: string }[] = [];
    let photoIndex = 0;
    while (form.has(`photo_file_${photoIndex}`)) {
      const photoFile = form.get(`photo_file_${photoIndex}`) as File | null;
      const photoDesc =
        (form.get(`photo_desc_${photoIndex}`) as string) || "";

      if (photoFile && photoFile.size > 0) {
        const buf = Buffer.from(await photoFile.arrayBuffer());
        const ext = photoFile.name.split(".").pop() ?? "jpg";
        const url = await uploadToS3(
          buf,
          `photos/${timestamp}-${photoIndex}.${ext}`,
          photoFile.type
        );
        photos.push({ url, description: photoDesc.trim() });
      }
      photoIndex++;
    }

    // Save to Supabase
    const { error } = await supabaseAdmin.from("map_uploads").insert({
      title: title.trim(),
      subtitle: subtitle?.trim() || null,
      description: description.trim(),
      map_image_url: mapImageUrl,
      map_pdf_url: mapPdfUrl,
      photos,
      case_study: caseStudy?.trim() || null,
      map_category: mapCategory,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
