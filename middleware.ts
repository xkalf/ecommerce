import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	if (!request.cookies.get("sessionCartId")) {
		const sessionCartId = crypto.randomUUID();
		const newRequestHeaders = new Headers(request.headers);
		const response = NextResponse.next({
			request: {
				headers: newRequestHeaders,
			},
		});
		response.cookies.set("sessionCartId", sessionCartId);
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|_next/assets|favicon.ico).*)"],
};
