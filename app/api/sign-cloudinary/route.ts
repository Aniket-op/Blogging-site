
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_name,
    api_key: process.env.CLOUDINARY_api_key,
    api_secret: process.env.CLOUDINARY_api_secret,
});

export async function POST() {
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
        }, process.env.CLOUDINARY_api_secret!);

        return NextResponse.json({ timestamp, signature });
    } catch (error) {
        console.error('Error generating Cloudinary signature:', error);
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}
