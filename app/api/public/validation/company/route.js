export async function GET(req, res) {
  const data = ["google", "facebook", "xxx"];
  const companyName = req.nextUrl.searchParams.get("companyname");

  return Response.json({ statusCode: 200, data: !data.includes(companyName.toLowerCase())});
}
