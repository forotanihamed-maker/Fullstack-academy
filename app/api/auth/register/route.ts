import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "اطلاعات واردشده معتبر نیست؛ رمز عبور باید حداقل ۸ کاراکتر باشد." }, { status: 400 });
    const { name, email, password } = parsed.data;
    const { prisma } = await import("../../../../lib/prisma");
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ message: "این ایمیل قبلاً ثبت‌نام کرده است." }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash }, select: { id: true, name: true, email: true, createdAt: true } });
    return NextResponse.json({ message: "ثبت‌نام با موفقیت انجام شد.", user }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "خطای سرور. لطفاً بعداً تلاش کنید." }, { status: 500 });
  }
}
