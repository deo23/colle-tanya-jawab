import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const userid = req.cookies.get('userid');
    if (!userid) {
        return NextResponse.json({ "status": "none" });
    }
    return NextResponse.json({ "status": "logged", "userid": userid });
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body);
    const cookieStore = cookies();
    cookieStore.delete("user_token");
    cookieStore.set('user_token',body["user_token"])
    return NextResponse.json({ "status": "logged", "token": body["user_token"]});
}