import { headers } from "next/headers";

export async function GET(request) {
  const headersList = headers();
  const lang = headersList.get("Accept-Language") ?? 'en';
  let response = {};
  let status;
  try {
    const url =
      process.env.GEO_ENDPOINT + "/ip.json?key=" + process.env.GEO_API_KEY;
    const res = await fetch(url);
    status = res.status;
    if (res.status === 200) {
      response = await res.json();
    }
  } catch (e) {
    status = e.status;
  }
  return Response.json({ statusCode: status, data: response });
}
