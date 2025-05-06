import { NextResponse } from 'next/server';
// pages/api/input.js
let a = 10;

export async function POST(req, res) {
    const data = await req.json();
    console.log(data);
    return NextResponse.json(a);
}